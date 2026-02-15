<?php

namespace Database\Factories;

use App\Enums\ConsultationMode;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Thread>
 */
class ThreadFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'mode' => ConsultationMode::Quick,
            'providers' => ['anthropic', 'openai', 'gemini'],
            'provider_config' => null,
            'context_paths' => null,
        ];
    }

    public function codeMode(): static
    {
        return $this->state(fn () => [
            'mode' => ConsultationMode::Code,
            'providers' => ['claude', 'codex', 'gemini'],
            'context_paths' => ['app/', 'config/'],
        ]);
    }

    public function withProviders(array $providers): static
    {
        return $this->state(fn () => [
            'providers' => $providers,
        ]);
    }
}
