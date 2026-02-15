<?php

namespace App\Actions\Moot;

use App\Jobs\DispatchAdvisors;
use App\Models\Thread;
use App\Models\User;

class CreateThread
{
    public function execute(User $user, array $validated): Thread
    {
        $thread = $user->threads()->create([
            'mode' => $validated['mode'] ?? 'quick',
            'providers' => $validated['providers'] ?? config('moot.default_providers'),
            'provider_config' => $validated['provider_config'] ?? null,
        ]);

        $message = $thread->messages()->create([
            'content' => $validated['prompt'],
            'synthesis_format' => $validated['synthesis_format'] ?? config('moot.default_synthesis_format'),
            'created_at' => now(),
        ]);

        DispatchAdvisors::dispatch($message);

        return $thread;
    }
}
