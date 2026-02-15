<?php

namespace Database\Factories;

use App\Enums\MessageStatus;
use App\Enums\SynthesisFormat;
use App\Models\Thread;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'thread_id' => Thread::factory(),
            'role' => 'user',
            'content' => fake()->paragraph(2),
            'status' => MessageStatus::Completed,
            'synthesis' => null,
            'synthesis_structured' => null,
            'synthesis_format' => SynthesisFormat::Markdown,
            'created_at' => now(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => MessageStatus::Pending,
        ]);
    }

    public function withSynthesis(): static
    {
        return $this->state(fn () => [
            'synthesis' => "## Consensus\n\nAll advisors agree on the core approach.\n\n## Key Differences\n\nMinor disagreements on implementation details.\n\n## Recommendation\n\n"
                . fake()->paragraph(3)
                . "\n\n## Action Items\n\n1. " . fake()->sentence() . "\n2. " . fake()->sentence() . "\n3. " . fake()->sentence(),
        ]);
    }

    public function system(): static
    {
        return $this->state(fn () => [
            'role' => 'system',
        ]);
    }
}
