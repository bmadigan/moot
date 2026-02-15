<?php

namespace App\Ai\Tools;

use Illuminate\Support\Facades\Process;

class RunCounselorsCli
{
    public function description(): string
    {
        return 'Execute the Counselors CLI tool to gather project-aware context '
            . 'from multiple AI coding agents.';
    }

    public function handle(string $prompt, ?string $projectPath = null): ?string
    {
        $binary = config('moot.counselors_binary');
        $outputDir = config('moot.counselors_output_dir');

        if (! $this->isAvailable()) {
            return null;
        }

        $command = [
            $binary,
            'ask',
            '--prompt', $prompt,
            '--output-dir', $outputDir,
        ];

        if ($projectPath) {
            $command[] = '--project';
            $command[] = $projectPath;
        }

        $result = Process::timeout(300)->run($command);

        if ($result->successful()) {
            return $result->output();
        }

        return null;
    }

    public function isAvailable(): bool
    {
        $binary = config('moot.counselors_binary');

        $result = Process::timeout(5)->run(['which', $binary]);

        return $result->successful();
    }
}
