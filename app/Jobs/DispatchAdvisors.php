<?php

namespace App\Jobs;

use App\Ai\Agents\AdvisorRegistry;
use App\Ai\Agents\StructuredSynthesizer;
use App\Ai\Agents\Synthesizer;
use App\Enums\MessageStatus;
use App\Enums\SynthesisFormat;
use App\Events\AdvisorResponded;
use App\Events\MootCompleted;
use App\Models\AdvisorResponse;
use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class DispatchAdvisors implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 300;

    public function __construct(
        public Message $message,
    ) {}

    public function failed(?Throwable $exception): void
    {
        $this->message->update(['status' => MessageStatus::Failed]);

        Log::error('DispatchAdvisors job failed', [
            'message_id' => $this->message->id,
            'exception' => $exception?->getMessage(),
        ]);
    }

    public function handle(): void
    {
        $this->message->update(['status' => MessageStatus::Running]);

        $thread = $this->message->thread;

        // Auto-generate title from first message if missing
        if (! $thread->title) {
            $thread->update([
                'title' => Str::limit($this->message->content, 80),
            ]);
        }

        $this->dispatchViaApi();
    }

    protected function dispatchViaApi(): void
    {
        $thread = $this->message->thread;
        $providers = $thread->providers;
        $providerConfig = $thread->provider_config ?? [];

        // Query each provider (individual failures are handled inside queryAdvisor)
        $queried = false;
        foreach ($providers as $provider) {
            if (! AdvisorRegistry::has($provider)) {
                continue;
            }

            $queried = true;
            $this->queryAdvisor($provider, $providerConfig[$provider] ?? []);
        }

        if (! $queried) {
            $this->message->update(['status' => MessageStatus::Failed]);

            return;
        }

        $this->finalize();
    }

    protected function finalize(): void
    {
        $thread = $this->message->thread;

        // Check if any advisor succeeded
        $hasResults = $this->message->advisorResponses()->whereNotNull('content')->exists();

        if (! $hasResults) {
            $this->message->update(['status' => MessageStatus::Failed]);
            $this->broadcastCompletion($thread->id);

            return;
        }

        // Run synthesis
        $this->message->update(['status' => MessageStatus::Synthesizing]);
        $this->runSynthesis();

        $this->message->update(['status' => MessageStatus::Completed]);
        $this->broadcastCompletion($thread->id);
    }

    protected function queryAdvisor(string $provider, array $config): void
    {
        $startTime = hrtime(true);

        try {
            $agent = AdvisorRegistry::getAgent($provider);

            $model = $config['model'] ?? null;

            // Build prompt with conversation history for multi-turn
            $prompt = $this->buildPromptWithHistory($provider);

            $response = $agent->prompt(
                $prompt,
                provider: $provider,
                model: $model,
            );

            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $advisorResponse = AdvisorResponse::create([
                'message_id' => $this->message->id,
                'provider' => $provider,
                'model' => $response->meta->model ?? $model,
                'content' => $response->text,
                'duration_ms' => $durationMs,
                'tokens_used' => $response->usage->promptTokens + $response->usage->completionTokens,
                'input_tokens' => $response->usage->promptTokens,
                'output_tokens' => $response->usage->completionTokens,
                'estimated_cost' => $this->estimateCost(
                    $response->meta->model ?? $model,
                    $response->usage->promptTokens,
                    $response->usage->completionTokens,
                ),
                'created_at' => now(),
            ]);

            $this->broadcastAdvisorResponse($advisorResponse);
        } catch (Throwable $e) {
            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $advisorResponse = AdvisorResponse::create([
                'message_id' => $this->message->id,
                'provider' => $provider,
                'error' => $e->getMessage(),
                'duration_ms' => $durationMs,
                'created_at' => now(),
            ]);

            $this->broadcastAdvisorResponse($advisorResponse);
        }
    }

    protected function buildPromptWithHistory(string $provider): string
    {
        $thread = $this->message->thread;

        // Get all previous messages in this thread (excluding the current one)
        $previousMessages = $thread->messages()
            ->where('id', '!=', $this->message->id)
            ->orderBy('created_at')
            ->get();

        // If this is the first message, just return the content directly
        if ($previousMessages->isEmpty()) {
            return $this->message->content;
        }

        // Build conversation context
        $parts = ["The following is a multi-turn conversation. Please consider the full context when responding.\n"];

        foreach ($previousMessages as $prevMessage) {
            $parts[] = "User: {$prevMessage->content}";

            // Include the provider's own previous response if available
            $prevResponse = $prevMessage->advisorResponses()
                ->where('provider', $provider)
                ->whereNotNull('content')
                ->first();

            if ($prevResponse) {
                $parts[] = "You previously responded: {$prevResponse->content}";
            }

            $parts[] = ''; // blank line separator
        }

        $parts[] = "User: {$this->message->content}";

        return implode("\n", $parts);
    }

    protected function runSynthesis(): void
    {
        $format = $this->message->synthesis_format ?? SynthesisFormat::Markdown;

        try {
            if ($format === SynthesisFormat::Structured) {
                $synthesizer = StructuredSynthesizer::make(message: $this->message);
            } else {
                $synthesizer = Synthesizer::make(message: $this->message);
            }

            $response = $synthesizer->prompt($synthesizer->buildPrompt());

            $update = ['synthesis' => $response->text];

            if ($response instanceof \Laravel\Ai\Responses\StructuredAgentResponse) {
                $update['synthesis_structured'] = $response->toArray();
            }

            $this->message->update($update);
        } catch (Throwable $e) {
            Log::error('Synthesis failed', [
                'message_id' => $this->message->id,
                'exception' => $e->getMessage(),
            ]);

            $this->message->update([
                'synthesis' => "Synthesis failed: {$e->getMessage()}",
            ]);
        }
    }

    protected function broadcastAdvisorResponse(AdvisorResponse $advisorResponse): void
    {
        try {
            AdvisorResponded::dispatch($advisorResponse, $this->message->thread_id);
        } catch (Throwable) {
            // Broadcasting is optional — don't fail the job if Reverb is unavailable.
        }
    }

    protected function broadcastCompletion(string $threadId): void
    {
        try {
            MootCompleted::dispatch($this->message->fresh(), $threadId);
        } catch (Throwable) {
            // Broadcasting is optional — don't fail the job if Reverb is unavailable.
        }
    }

    protected function estimateCost(?string $model, int $inputTokens, int $outputTokens): ?float
    {
        if (! $model) {
            return null;
        }

        $pricing = config("moot.pricing.{$model}");

        if (! $pricing) {
            return null;
        }

        return ($inputTokens / 1_000_000 * $pricing['input'])
            + ($outputTokens / 1_000_000 * $pricing['output']);
    }
}
