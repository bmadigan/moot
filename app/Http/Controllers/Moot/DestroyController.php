<?php

namespace App\Http\Controllers\Moot;

use App\Actions\Moot\DeleteThread;
use App\Http\Controllers\Controller;
use App\Models\Thread;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DestroyController extends Controller
{
    public function __invoke(Request $request, Thread $thread, DeleteThread $action): RedirectResponse
    {
        $this->authorize('delete', $thread);

        $action->execute($thread);

        return redirect()->route('moot.index');
    }
}
