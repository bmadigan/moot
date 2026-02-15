<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Promptable;

#[Provider('anthropic')]
#[Model('claude-sonnet-4-5-20250929')]
#[Timeout(120)]
class ClaudeAdvisor implements Agent, Conversational
{
    use Promptable, RemembersConversations;

    public function instructions(): string
    {
        return 'You are a senior technical advisor. Provide thoughtful, '
            . 'nuanced analysis. When you disagree with conventional '
            . 'wisdom, explain why. Always consider edge cases and '
            . 'long-term maintainability.';
    }
}
