<?php

namespace App\Jobs;

use App\Ai\Agents\AdvisorRegistry;
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
use Illuminate\Support\Facades\Concurrency;
use Throwable;

class DispatchAdvisors implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Message $message,
    ) {}

    public function handle(): void
    {
        $this->message->update(['status' => MessageStatus::Running]);

        $thread = $this->message->thread;
        $providers = $thread->providers;
        $providerConfig = $thread->provider_config ?? [];

        // Fan out to all providers concurrently
        $tasks = [];
        foreach ($providers as $provider) {
            if (! AdvisorRegistry::has($provider)) {
                continue;
            }

            $tasks[$provider] = fn () => $this->queryAdvisor($provider, $providerConfig[$provider] ?? []);
        }

        if (empty($tasks)) {
            $this->message->update(['status' => MessageStatus::Failed]);

            return;
        }

        try {
            Concurrency::run($tasks);
        } catch (Throwable) {
            // Individual failures are already handled inside queryAdvisor.
            // This catches catastrophic failures in the concurrency driver itself.
        }

        // Check if any advisor succeeded
        $hasResults = $this->message->advisorResponses()->whereNotNull('content')->exists();

        if (! $hasResults) {
            $this->message->update(['status' => MessageStatus::Failed]);
            MootCompleted::dispatch($this->message->fresh(), $thread->id);

            return;
        }

        // Run synthesis
        $this->message->update(['status' => MessageStatus::Synthesizing]);
        $this->runSynthesis();

        $this->message->update(['status' => MessageStatus::Completed]);
        MootCompleted::dispatch($this->message->fresh(), $thread->id);
    }

    protected function queryAdvisor(string $provider, array $config): void
    {
        $startTime = hrtime(true);

        try {
            $agent = AdvisorRegistry::getAgent($provider);

            $model = $config['model'] ?? null;
            $response = $agent->prompt(
                $this->message->content,
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

            AdvisorResponded::dispatch($advisorResponse, $this->message->thread_id);
        } catch (Throwable $e) {
            $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

            $advisorResponse = AdvisorResponse::create([
                'message_id' => $this->message->id,
                'provider' => $provider,
                'error' => $e->getMessage(),
                'duration_ms' => $durationMs,
                'created_at' => now(),
            ]);

            AdvisorResponded::dispatch($advisorResponse, $this->message->thread_id);
        }
    }

    protected function runSynthesis(): void
    {
        $format = $this->message->synthesis_format ?? SynthesisFormat::Markdown;

        try {
            $synthesizer = Synthesizer::make(
                message: $this->message,
                format: $format,
            );

            $response = $synthesizer->prompt($synthesizer->buildPrompt());

            $update = ['synthesis' => $response->text];

            if ($format === SynthesisFormat::Structured && $response instanceof \Laravel\Ai\Responses\StructuredAgentResponse) {
                $update['synthesis_structured'] = $response->toArray();
            }

            $this->message->update($update);
        } catch (Throwable $e) {
            $this->message->update([
                'synthesis' => "Synthesis failed: {$e->getMessage()}",
            ]);
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
