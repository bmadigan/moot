<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('thread.{threadId}', function (User $user, string $threadId) {
    return $user->threads()->where('id', $threadId)->exists();
});
