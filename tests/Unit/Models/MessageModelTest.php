<?php

use App\Enums\MessageStatus;
use App\Enums\SynthesisFormat;
use App\Models\AdvisorResponse;
use App\Models\Message;
use App\Models\Thread;

test('message belongs to thread', function () {
    $message = Message::factory()->create();

    expect($message->thread)->toBeInstanceOf(Thread::class);
});

test('message has many advisor responses', function () {
    $message = Message::factory()->create();
    AdvisorResponse::factory()->count(3)->for($message)->create();

    expect($message->advisorResponses)->toHaveCount(3);
});

test('message casts status to enum', function () {
    $message = Message::factory()->create(['status' => 'completed']);

    expect($message->status)->toBe(MessageStatus::Completed);
});

test('message casts synthesis format to enum', function () {
    $message = Message::factory()->create(['synthesis_format' => 'markdown']);

    expect($message->synthesis_format)->toBe(SynthesisFormat::Markdown);
});

test('message pending state', function () {
    $message = Message::factory()->pending()->create();

    expect($message->status)->toBe(MessageStatus::Pending);
});
