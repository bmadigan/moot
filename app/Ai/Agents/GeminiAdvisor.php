<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Promptable;

#[Provider('gemini')]
#[Model('gemini-2.5-pro')]
#[Timeout(120)]
class GeminiAdvisor implements Agent, Conversational
{
    use Promptable, RemembersConversations;

    public function instructions(): string
    {
        return 'You are a broad-spectrum technical advisor. Consider '
            . 'multiple approaches and cross-ecosystem patterns. '
            . 'Compare trade-offs explicitly. When possible, reference '
            . 'real-world precedents and emerging best practices.';
    }
}
