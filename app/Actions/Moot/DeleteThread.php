<?php

namespace App\Actions\Moot;

use App\Models\Thread;

class DeleteThread
{
    public function execute(Thread $thread): void
    {
        $thread->delete();
    }
}
