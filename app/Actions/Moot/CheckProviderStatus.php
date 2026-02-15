<?php

namespace App\Actions\Moot;

class CheckProviderStatus
{
    public function execute(): array
    {
        return [
            'anthropic' => [
                'configured' => filled(config('ai.providers.anthropic.key')),
            ],
            'openai' => [
                'configured' => filled(config('ai.providers.openai.key')),
            ],
            'gemini' => [
                'configured' => filled(config('ai.providers.gemini.key')),
            ],
        ];
    }
}
