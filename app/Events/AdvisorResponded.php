<?php

namespace App\Events;

use App\Models\AdvisorResponse;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AdvisorResponded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public AdvisorResponse $advisorResponse,
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
            'advisor_response' => [
                'id' => $this->advisorResponse->id,
                'message_id' => $this->advisorResponse->message_id,
                'provider' => $this->advisorResponse->provider,
                'model' => $this->advisorResponse->model,
                'content' => $this->advisorResponse->content,
                'error' => $this->advisorResponse->error,
                'duration_ms' => $this->advisorResponse->duration_ms,
                'tokens_used' => $this->advisorResponse->tokens_used,
                'input_tokens' => $this->advisorResponse->input_tokens,
                'output_tokens' => $this->advisorResponse->output_tokens,
                'estimated_cost' => $this->advisorResponse->estimated_cost,
            ],
        ];
    }
}
