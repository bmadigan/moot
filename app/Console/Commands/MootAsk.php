<?php

namespace App\Console\Commands;

use App\Ai\Agents\AdvisorRegistry;
use App\Ai\Agents\Synthesizer;
use App\Enums\SynthesisFormat;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Concurrency;
use Throwable;

class MootAsk extends Command
{
    protected $signature = 'moot:ask
        {prompt? : The question to ask}
        {--providers= : Comma-separated provider list (default: all available)}
        {--format=markdown : Synthesis format (markdown or structured)}';

    protected $description = 'Ask a question to multiple AI advisors from the command line';

    public function handle(): int
    {
        $prompt = $this->argument('prompt') ?? $this->ask('What would you like to ask?');

        if (empty($prompt)) {
            $this->error('A prompt is required.');

            return self::FAILURE;
        }

        // Resolve providers
        $providersOption = $this->option('providers');
        $providers = $providersOption
            ? explode(',', $providersOption)
            : AdvisorRegistry::availableProviders();

        $providers = array_filter($providers, fn ($p) => AdvisorRegistry::has($p));

        if (empty($providers)) {
            $this->error('No valid providers specified.');

            return self::FAILURE;
        }

        $format = $this->option('format') === 'structured'
            ? SynthesisFormat::Structured
            : SynthesisFormat::Markdown;

        $this->info('');
        $this->info("Consulting: ".implode(', ', $providers));
        $this->info('');

        // Create a temporary user/thread/message for the consultation
        $user = User::firstOrCreate(
            ['email' => 'cli@moot.local'],
            ['name' => 'CLI User', 'password' => bcrypt(str()->random(32))],
        );

        $thread = $user->threads()->create([
            'title' => \Illuminate\Support\Str::limit($prompt, 80),
            'mode' => 'quick',
            'providers' => $providers,
        ]);

        $message = $thread->messages()->create([
            'content' => $prompt,
            'synthesis_format' => $format,
            'created_at' => now(),
        ]);

        // Fan out to providers
        $results = [];
        $tasks = [];

        foreach ($providers as $provider) {
            $tasks[$provider] = function () use ($provider, $prompt, $message, &$results) {
                $startTime = hrtime(true);

                try {
                    $agent = AdvisorRegistry::getAgent($provider);
                    $response = $agent->prompt($prompt);
                    $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

                    $message->advisorResponses()->create([
                        'provider' => $provider,
                        'model' => $response->meta->model ?? null,
                        'content' => $response->text,
                        'duration_ms' => $durationMs,
                        'input_tokens' => $response->usage->promptTokens,
                        'output_tokens' => $response->usage->completionTokens,
                        'tokens_used' => $response->usage->promptTokens + $response->usage->completionTokens,
                        'created_at' => now(),
                    ]);

                    return [
                        'provider' => $provider,
                        'model' => $response->meta->model ?? 'unknown',
                        'content' => $response->text,
                        'duration' => round($durationMs / 1000, 1),
                    ];
                } catch (Throwable $e) {
                    $durationMs = (int) ((hrtime(true) - $startTime) / 1_000_000);

                    $message->advisorResponses()->create([
                        'provider' => $provider,
                        'error' => $e->getMessage(),
                        'duration_ms' => $durationMs,
                        'created_at' => now(),
                    ]);

                    return [
                        'provider' => $provider,
                        'error' => $e->getMessage(),
                        'duration' => round($durationMs / 1000, 1),
                    ];
                }
            };
        }

        $this->withProgressBar($providers, function () {
            // Just visual feedback
        });
        $this->info('');

        try {
            $results = Concurrency::run($tasks);
        } catch (Throwable $e) {
            $this->error("Concurrency error: {$e->getMessage()}");

            return self::FAILURE;
        }

        // Display results
        foreach ($results as $result) {
            $this->info('');
            $provider = strtoupper($result['provider']);

            if (isset($result['error'])) {
                $this->error("  [{$provider}] Error: {$result['error']}");

                continue;
            }

            $this->info("  [{$provider}] ({$result['model']}, {$result['duration']}s)");
            $this->line("  ".str_repeat('-', 60));
            $this->line($result['content']);
        }

        // Run synthesis
        $this->info('');
        $this->info('  Synthesizing...');

        try {
            $synthesizer = Synthesizer::make(
                message: $message->fresh(),
                format: $format,
            );

            $response = $synthesizer->prompt($synthesizer->buildPrompt());

            $this->info('');
            $this->info('  SYNTHESIS');
            $this->line('  '.str_repeat('=', 60));
            $this->line($response->text);
        } catch (Throwable $e) {
            $this->error("  Synthesis failed: {$e->getMessage()}");
        }

        $this->info('');

        return self::SUCCESS;
    }
}
