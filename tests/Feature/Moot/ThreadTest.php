<?php

use App\Models\Thread;
use App\Models\User;

beforeEach(function () {
    $this->withoutVite();
});

test('guests cannot access moot index', function () {
    $this->get('/moot')->assertRedirect(route('login'));
});

test('authenticated users can view moot index', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/moot')
        ->assertOk();
});

test('authenticated users can create a thread', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/moot', [
            'prompt' => 'What is the best PHP framework?',
            'mode' => 'quick',
            'providers' => ['anthropic', 'openai'],
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('threads', [
        'user_id' => $user->id,
        'mode' => 'quick',
    ]);

    $this->assertDatabaseHas('messages', [
        'content' => 'What is the best PHP framework?',
    ]);
});

test('authenticated users can view their own thread', function () {
    $user = User::factory()->create();
    $thread = Thread::factory()->for($user)->create();

    $this->actingAs($user)
        ->get("/moot/{$thread->id}")
        ->assertOk();
});

test('users cannot view another users thread', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $thread = Thread::factory()->for($other)->create();

    $this->actingAs($user)
        ->get("/moot/{$thread->id}")
        ->assertForbidden();
});

test('users can delete their own thread', function () {
    $user = User::factory()->create();
    $thread = Thread::factory()->for($user)->create();

    $this->actingAs($user)
        ->delete("/moot/{$thread->id}")
        ->assertRedirect('/moot');

    $this->assertDatabaseMissing('threads', ['id' => $thread->id]);
});

test('users cannot delete another users thread', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $thread = Thread::factory()->for($other)->create();

    $this->actingAs($user)
        ->delete("/moot/{$thread->id}")
        ->assertForbidden();
});

test('users can send a follow-up message', function () {
    $user = User::factory()->create();
    $thread = Thread::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/moot/{$thread->id}/messages", [
            'content' => 'Can you elaborate on that?',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('messages', [
        'thread_id' => $thread->id,
        'content' => 'Can you elaborate on that?',
    ]);
});

test('prompt is required to create a thread', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/moot', [
            'mode' => 'quick',
            'providers' => ['anthropic'],
        ])
        ->assertSessionHasErrors('prompt');
});

test('prompt max length is enforced', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/moot', [
            'prompt' => str_repeat('a', 10001),
            'mode' => 'quick',
            'providers' => ['anthropic'],
        ])
        ->assertSessionHasErrors('prompt');
});

test('thread export returns markdown download', function () {
    $user = User::factory()->create();
    $thread = Thread::factory()->for($user)->create(['title' => 'Test Export']);

    $this->actingAs($user)
        ->get("/moot/{$thread->id}/export")
        ->assertOk()
        ->assertDownload('test-export.md');
});
