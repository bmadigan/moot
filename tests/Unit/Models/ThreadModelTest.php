<?php

use App\Enums\ConsultationMode;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;

test('thread belongs to user', function () {
    $thread = Thread::factory()->create();

    expect($thread->user)->toBeInstanceOf(User::class);
});

test('thread has many messages', function () {
    $thread = Thread::factory()->create();
    Message::factory()->count(3)->for($thread)->create();

    expect($thread->messages)->toHaveCount(3);
});

test('thread has latest message', function () {
    $thread = Thread::factory()->create();
    Message::factory()->for($thread)->create(['created_at' => now()->subHour()]);
    $latest = Message::factory()->for($thread)->create(['created_at' => now()]);

    expect($thread->latestMessage->id)->toBe($latest->id);
});

test('thread casts mode to enum', function () {
    $thread = Thread::factory()->create(['mode' => 'quick']);

    expect($thread->mode)->toBe(ConsultationMode::Quick);
});

test('thread casts providers to array', function () {
    $thread = Thread::factory()->create(['providers' => ['anthropic', 'openai']]);

    expect($thread->providers)->toBe(['anthropic', 'openai']);
});
