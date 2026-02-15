<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\HasStructuredOutput;

class StructuredSynthesizer extends Synthesizer implements HasStructuredOutput
{
    public function instructions(): string
    {
        return 'You are a synthesis engine. You receive responses from multiple AI advisors '
            . 'and produce a unified analysis. Your job is to identify consensus, highlight '
            . 'disagreements, provide a clear recommendation, and list actionable next steps.';
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
}
