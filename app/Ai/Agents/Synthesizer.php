<?php

namespace App\Ai\Agents;

use App\Enums\SynthesisFormat;
use App\Models\Message;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;

#[Provider('anthropic')]
#[Model('claude-sonnet-4-5-20250929')]
#[Timeout(60)]
class Synthesizer implements Agent, HasStructuredOutput
{
    use Promptable;

    public function __construct(
        protected Message $message,
        protected SynthesisFormat $format,
    ) {}

    public function instructions(): string
    {
        $base = 'You are a synthesis engine. You receive responses from multiple AI advisors '
            . 'and produce a unified analysis. Your job is to identify consensus, highlight '
            . 'disagreements, provide a clear recommendation, and list actionable next steps.';

        if ($this->format === SynthesisFormat::Markdown) {
            $base .= "\n\nFormat your response as markdown with these sections:\n"
                . "## Consensus\nWhere all advisors agree.\n\n"
                . "## Key Differences\nWhere they disagree and the trade-offs.\n\n"
                . "## Recommendation\nYour unified recommendation with reasoning.\n\n"
                . "## Action Items\nNumbered next steps.";
        }

        return $base;
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'consensus' => $schema->array()->items($schema->string())->required(),
            'differences' => $schema->array()->items($schema->object([
                'topic' => $schema->string()->required(),
                'positions' => $schema->object()->required(),
                'trade_off' => $schema->string()->required(),
            ]))->required(),
            'recommendation' => $schema->string()->required(),
            'confidence' => $schema->number()->min(0)->max(1)->required(),
            'action_items' => $schema->array()->items($schema->string())->required(),
        ];
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
