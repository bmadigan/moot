<?php

namespace App\Ai\Agents;

use InvalidArgumentException;
use Laravel\Ai\Contracts\Agent;

class AdvisorRegistry
{
    protected static array $agents = [
        'anthropic' => ClaudeAdvisor::class,
        'openai' => GptAdvisor::class,
        'gemini' => GeminiAdvisor::class,
    ];

    public static function getAgent(string $provider): Agent
    {
        $class = static::$agents[$provider] ?? null;

        if (! $class) {
            throw new InvalidArgumentException("No advisor registered for provider: {$provider}");
        }

        return $class::make();
    }

    public static function getAgents(array $providers): array
    {
        return array_map(fn (string $provider) => static::getAgent($provider), $providers);
    }

    public static function has(string $provider): bool
    {
        return isset(static::$agents[$provider]);
    }

    public static function availableProviders(): array
    {
        return array_keys(static::$agents);
    }
}
