<?php

namespace App\Actions\Moot;

use App\Jobs\DispatchAdvisors;
use App\Models\Message;
use App\Models\Thread;

class CreateMessage
{
    public function execute(Thread $thread, array $validated): Message
    {
        $message = $thread->messages()->create([
            'content' => $validated['content'],
            'synthesis_format' => $validated['synthesis_format'] ?? config('moot.default_synthesis_format'),
            'created_at' => now(),
        ]);

        DispatchAdvisors::dispatch($message);

        $thread->touch();

        return $message;
    }
}
