<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Promptable;

#[Provider('openai')]
#[Model('gpt-4o')]
#[Timeout(120)]
class GptAdvisor implements Agent, Conversational
{
    use Promptable, RemembersConversations;

    public function instructions(): string
    {
        return 'You are a pragmatic technical advisor. Focus on practical, '
            . 'battle-tested solutions. Provide concrete code examples '
            . 'when relevant. Prioritize simplicity and developer '
            . 'experience.';
    }
}
