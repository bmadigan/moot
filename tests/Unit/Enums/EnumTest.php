<?php

use App\Enums\ConsultationMode;
use App\Enums\MessageStatus;
use App\Enums\SynthesisFormat;

test('consultation mode has expected values', function () {
    expect(ConsultationMode::Quick->value)->toBe('quick');
    expect(ConsultationMode::Code->value)->toBe('code');
    expect(ConsultationMode::cases())->toHaveCount(2);
});

test('message status has expected values', function () {
    expect(MessageStatus::Pending->value)->toBe('pending');
    expect(MessageStatus::Running->value)->toBe('running');
    expect(MessageStatus::Synthesizing->value)->toBe('synthesizing');
    expect(MessageStatus::Completed->value)->toBe('completed');
    expect(MessageStatus::Failed->value)->toBe('failed');
    expect(MessageStatus::cases())->toHaveCount(5);
});

test('synthesis format has expected values', function () {
    expect(SynthesisFormat::Markdown->value)->toBe('markdown');
    expect(SynthesisFormat::Structured->value)->toBe('structured');
    expect(SynthesisFormat::cases())->toHaveCount(2);
});
