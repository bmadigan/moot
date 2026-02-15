<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\DispatchAdvisors;
use App\Models\Thread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Thread $thread): JsonResponse
    {
        $this->authorize('view', $thread);

        $messages = $thread->messages()
            ->with('advisorResponses')
            ->oldest('created_at')
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request, Thread $thread): JsonResponse
    {
        $this->authorize('update', $thread);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:10000'],
            'synthesis_format' => ['sometimes', 'string', 'in:markdown,structured'],
        ]);

        $message = $thread->messages()->create([
            'content' => $validated['content'],
            'synthesis_format' => $validated['synthesis_format'] ?? config('moot.default_synthesis_format'),
            'created_at' => now(),
        ]);

        DispatchAdvisors::dispatch($message);

        $thread->touch();

        return response()->json($message, 201);
    }
}
