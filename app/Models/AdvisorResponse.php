<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvisorResponse extends Model
{
    use HasFactory, HasUlids;

    public $timestamps = false;

    protected $fillable = [
        'message_id',
        'provider',
        'model',
        'content',
        'error',
        'duration_ms',
        'tokens_used',
        'input_tokens',
        'output_tokens',
        'estimated_cost',
    ];

    protected function casts(): array
    {
        return [
            'estimated_cost' => 'float',
            'created_at' => 'datetime',
        ];
    }

    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }
}
