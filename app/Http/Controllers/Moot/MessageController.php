<?php

namespace App\Http\Controllers\Moot;

use App\Actions\Moot\CreateMessage;
use App\Http\Controllers\Controller;
use App\Models\Thread;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __invoke(Request $request, Thread $thread, CreateMessage $action): RedirectResponse
    {
        $this->authorize('update', $thread);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:10000'],
            'synthesis_format' => ['sometimes', 'string', 'in:markdown,structured'],
        ]);

        $action->execute($thread, $validated);

        return redirect()->back();
    }
}
