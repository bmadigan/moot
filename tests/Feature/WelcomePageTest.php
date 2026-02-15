<?php

use App\Models\User;

test('welcome page loads for guests', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('canRegister')
    );
});

test('welcome page shows login and register links for guests', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

test('welcome page shows app link for authenticated users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
    );
});
