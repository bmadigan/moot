<?php

namespace App\Actions\Moot;

use App\Models\Thread;

class ExportThreadAsMarkdown
{
    public function execute(Thread $thread): string
    {
        $thread->load('messages.advisorResponses');

        $lines = [];

        $lines[] = '# '.($thread->title ?? 'Moot Thread');
        $lines[] = '';
        $lines[] = '**Mode:** '.ucfirst($thread->mode->value);
        $lines[] = '**Providers:** '.implode(', ', $thread->providers);
        $lines[] = '**Created:** '.$thread->created_at->toDateTimeString();
        $lines[] = '';
        $lines[] = '---';
        $lines[] = '';

        foreach ($thread->messages as $message) {
            $lines[] = '## Prompt';
            $lines[] = '';
            $lines[] = $message->content;
            $lines[] = '';
            $lines[] = '*'.($message->created_at?->toDateTimeString() ?? 'Unknown time').'*';
            $lines[] = '';

            if ($message->advisorResponses->isNotEmpty()) {
                $lines[] = '### Advisor Responses';
                $lines[] = '';

                foreach ($message->advisorResponses as $response) {
                    $provider = strtoupper($response->provider);
                    $model = $response->model ? " ({$response->model})" : '';
                    $duration = $response->duration_ms ? ' — '.round($response->duration_ms / 1000, 1).'s' : '';
                    $cost = $response->estimated_cost ? ' — $'.number_format($response->estimated_cost, 4) : '';

                    $lines[] = "#### {$provider}{$model}{$duration}{$cost}";
                    $lines[] = '';

                    if ($response->error) {
                        $lines[] = '> **Error:** '.$response->error;
                    } else {
                        $lines[] = $response->content ?? '*No content*';
                    }

                    $lines[] = '';
                }
            }

            if ($message->synthesis) {
                $lines[] = '### Synthesis';
                $lines[] = '';
                $lines[] = $message->synthesis;
                $lines[] = '';
            }

            $lines[] = '---';
            $lines[] = '';
        }

        return implode("\n", $lines);
    }
}
