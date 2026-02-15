<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MootInstall extends Command
{
    protected $signature = 'moot:install';

    protected $description = 'Set up Moot with provider API keys, queue driver, and database migrations';

    public function handle(): int
    {
        $this->info('');
        $this->info('  Welcome to Moot Setup');
        $this->info('  =====================');
        $this->info('');

        // Step 1: Provider API keys
        $this->setupProviderKeys();

        // Step 2: Queue driver
        $this->setupQueueDriver();

        // Step 3: Broadcasting
        $this->setupBroadcasting();

        // Step 4: Run migrations
        if ($this->confirm('Run database migrations?', true)) {
            $this->call('migrate');
        }

        // Step 5: Seed demo data
        if ($this->confirm('Seed demo data?', false)) {
            $this->call('db:seed');
        }

        $this->info('');
        $this->info('  Moot is ready! Run `composer dev` to start the app.');
        $this->info('');

        return self::SUCCESS;
    }

    protected function setupProviderKeys(): void
    {
        $this->info('Step 1: AI Provider API Keys');
        $this->line('  Configure at least one provider to get started.');
        $this->info('');

        $providers = [
            'ANTHROPIC_API_KEY' => 'Anthropic (Claude)',
            'OPENAI_API_KEY' => 'OpenAI (GPT)',
            'GEMINI_API_KEY' => 'Google (Gemini)',
        ];

        foreach ($providers as $envKey => $label) {
            $current = env($envKey);
            $masked = $current ? substr($current, 0, 8).'...' : 'not set';

            $key = $this->ask("  {$label} API key [{$masked}]");

            if ($key) {
                $this->setEnvValue($envKey, $key);
                $this->info("  ✓ {$label} configured");
            }
        }

        $this->info('');
    }

    protected function setupQueueDriver(): void
    {
        $this->info('Step 2: Queue Driver');

        $driver = $this->choice(
            '  Select queue driver',
            ['database', 'redis', 'sync'],
            'database',
        );

        $this->setEnvValue('QUEUE_CONNECTION', $driver);
        $this->info("  ✓ Queue driver set to {$driver}");
        $this->info('');
    }

    protected function setupBroadcasting(): void
    {
        $this->info('Step 3: Broadcasting (Real-time Updates)');

        $driver = $this->choice(
            '  Select broadcast driver',
            ['reverb', 'log', 'null'],
            'reverb',
        );

        $this->setEnvValue('BROADCAST_CONNECTION', $driver);

        if ($driver === 'reverb') {
            $this->info('  Reverb requires REVERB_APP_KEY and REVERB_APP_SECRET in .env');
            $this->info('  Run `php artisan reverb:install` if not already configured.');
        }

        $this->info("  ✓ Broadcasting set to {$driver}");
        $this->info('');
    }

    protected function setEnvValue(string $key, string $value): void
    {
        $envPath = base_path('.env');

        if (! File::exists($envPath)) {
            return;
        }

        $content = File::get($envPath);

        if (preg_match("/^{$key}=.*/m", $content)) {
            $content = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $content);
        } else {
            $content .= "\n{$key}={$value}";
        }

        File::put($envPath, $content);
    }
}
