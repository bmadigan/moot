<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MootCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Message $message,
        public string $threadId,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("thread.{$this->threadId}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'status' => $this->message->status->value,
                'synthesis' => $this->message->synthesis,
                'synthesis_structured' => $this->message->synthesis_structured,
                'synthesis_format' => $this->message->synthesis_format->value,
            ],
        ];
    }
}
