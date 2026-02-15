<?php

namespace Database\Seeders;

use App\Models\AdvisorResponse;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Thread 1: Completed multi-turn conversation
        $thread1 = Thread::factory()->for($user)->create([
            'title' => 'Best auth approach for Laravel SPA',
            'providers' => ['anthropic', 'openai', 'gemini'],
        ]);

        $message1 = Message::factory()->for($thread1)->withSynthesis()->create([
            'content' => 'What is the best authentication approach for a Laravel + React SPA?',
        ]);

        foreach (['anthropic', 'openai', 'gemini'] as $provider) {
            AdvisorResponse::factory()->forProvider($provider)->for($message1)->create();
        }

        $message2 = Message::factory()->for($thread1)->withSynthesis()->create([
            'content' => 'Can you elaborate on the CORS configuration specifically?',
            'created_at' => now()->addMinutes(5),
        ]);

        foreach (['anthropic', 'openai', 'gemini'] as $provider) {
            AdvisorResponse::factory()->forProvider($provider)->for($message2)->create();
        }

        // Thread 2: Single message, completed
        $thread2 = Thread::factory()->for($user)->create([
            'title' => 'Database design for multi-tenant app',
            'providers' => ['anthropic', 'openai'],
        ]);

        $message3 = Message::factory()->for($thread2)->withSynthesis()->create([
            'content' => 'What is the best database design pattern for a multi-tenant SaaS application?',
        ]);

        foreach (['anthropic', 'openai'] as $provider) {
            AdvisorResponse::factory()->forProvider($provider)->for($message3)->create();
        }

        // Thread 3: One response failed
        $thread3 = Thread::factory()->for($user)->create([
            'title' => 'API rate limiting strategies',
            'providers' => ['anthropic', 'openai', 'gemini'],
        ]);

        $message4 = Message::factory()->for($thread3)->withSynthesis()->create([
            'content' => 'What are the best strategies for API rate limiting in a high-traffic Laravel application?',
        ]);

        AdvisorResponse::factory()->forProvider('anthropic')->for($message4)->create();
        AdvisorResponse::factory()->forProvider('openai')->for($message4)->create();
        AdvisorResponse::factory()->forProvider('gemini')->failed()->for($message4)->create();
    }
}
