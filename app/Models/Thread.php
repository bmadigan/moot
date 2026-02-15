<?php

namespace App\Models;

use App\Enums\ConsultationMode;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Thread extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'user_id',
        'title',
        'mode',
        'providers',
        'provider_config',
        'conversation_ids',
        'context_paths',
    ];

    protected function casts(): array
    {
        return [
            'mode' => ConsultationMode::class,
            'providers' => 'array',
            'provider_config' => 'array',
            'conversation_ids' => 'array',
            'context_paths' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }
}
