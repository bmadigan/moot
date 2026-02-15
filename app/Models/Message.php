<?php

namespace App\Models;

use App\Enums\MessageStatus;
use App\Enums\SynthesisFormat;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends Model
{
    use HasFactory, HasUlids;

    public $timestamps = false;

    protected $fillable = [
        'thread_id',
        'role',
        'content',
        'status',
        'synthesis',
        'synthesis_structured',
        'synthesis_format',
    ];

    protected function casts(): array
    {
        return [
            'status' => MessageStatus::class,
            'synthesis_format' => SynthesisFormat::class,
            'synthesis_structured' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function thread(): BelongsTo
    {
        return $this->belongsTo(Thread::class);
    }

    public function advisorResponses(): HasMany
    {
        return $this->hasMany(AdvisorResponse::class);
    }
}
