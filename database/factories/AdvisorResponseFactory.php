<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdvisorResponse>
 */
class AdvisorResponseFactory extends Factory
{
    public function definition(): array
    {
        $provider = fake()->randomElement(['anthropic', 'openai', 'gemini']);
        $models = [
            'anthropic' => 'claude-sonnet-4-5-20250929',
            'openai' => 'gpt-4o',
            'gemini' => 'gemini-2.5-pro',
        ];
        $inputTokens = fake()->numberBetween(200, 2000);
        $outputTokens = fake()->numberBetween(500, 4000);

        return [
            'message_id' => Message::factory(),
            'provider' => $provider,
            'model' => $models[$provider],
            'content' => fake()->paragraphs(3, true),
            'error' => null,
            'duration_ms' => fake()->numberBetween(800, 8000),
            'tokens_used' => $inputTokens + $outputTokens,
            'input_tokens' => $inputTokens,
            'output_tokens' => $outputTokens,
            'estimated_cost' => fake()->randomFloat(6, 0.001, 0.05),
            'created_at' => now(),
        ];
    }

    public function forProvider(string $provider, ?string $model = null): static
    {
        $defaultModels = [
            'anthropic' => 'claude-sonnet-4-5-20250929',
            'openai' => 'gpt-4o',
            'gemini' => 'gemini-2.5-pro',
        ];

        return $this->state(fn () => [
            'provider' => $provider,
            'model' => $model ?? ($defaultModels[$provider] ?? null),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'content' => null,
            'error' => 'Provider timed out after 120s',
            'duration_ms' => 120000,
            'tokens_used' => null,
            'input_tokens' => null,
            'output_tokens' => null,
            'estimated_cost' => null,
        ]);
    }
}
