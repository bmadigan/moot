<?php

namespace App\Ai\Agents;

use App\Models\Message;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;

#[Provider('anthropic')]
#[Model('claude-sonnet-4-5-20250929')]
#[Timeout(60)]
class Synthesizer implements Agent
{
    use Promptable;

    public function __construct(
        protected Message $message,
    ) {}

    public function instructions(): string
    {
        return 'You are a synthesis engine. You receive responses from multiple AI advisors '
            . 'and produce a unified analysis. Your job is to identify consensus, highlight '
            . 'disagreements, provide a clear recommendation, and list actionable next steps.'
            . "\n\nFormat your response as markdown with these sections:\n"
            . "## Consensus\nWhere all advisors agree.\n\n"
            . "## Key Differences\nWhere they disagree and the trade-offs.\n\n"
            . "## Recommendation\nYour unified recommendation with reasoning.\n\n"
            . "## Action Items\nNumbered next steps.";
    }

    public function buildPrompt(): string
    {
        $responses = $this->message->advisorResponses()
            ->whereNotNull('content')
            ->get();

        $parts = ["Original question: {$this->message->content}\n"];

        foreach ($responses as $response) {
            $label = strtoupper($response->provider);
            $parts[] = "--- {$label} ({$response->model}) ---\n{$response->content}\n";
        }

        $parts[] = '--- END OF ADVISOR RESPONSES ---';
        $parts[] = 'Now synthesize these responses.';

        return implode("\n", $parts);
    }
}
