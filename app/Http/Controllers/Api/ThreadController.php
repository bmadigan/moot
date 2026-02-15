<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\DispatchAdvisors;
use App\Models\Thread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $threads = $request->user()
            ->threads()
            ->with('latestMessage')
            ->latest('updated_at')
            ->paginate(20);

        return response()->json($threads);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'max:10000'],
            'mode' => ['sometimes', 'string', 'in:quick,code'],
            'providers' => ['sometimes', 'array', 'min:1'],
            'providers.*' => ['string'],
            'provider_config' => ['sometimes', 'array'],
            'synthesis_format' => ['sometimes', 'string', 'in:markdown,structured'],
        ]);

        $thread = $request->user()->threads()->create([
            'mode' => $validated['mode'] ?? 'quick',
            'providers' => $validated['providers'] ?? config('moot.default_providers'),
            'provider_config' => $validated['provider_config'] ?? null,
        ]);

        $message = $thread->messages()->create([
            'content' => $validated['prompt'],
            'synthesis_format' => $validated['synthesis_format'] ?? config('moot.default_synthesis_format'),
            'created_at' => now(),
        ]);

        DispatchAdvisors::dispatch($message);

        return response()->json(
            $thread->load('messages'),
            201,
        );
    }

    public function show(Request $request, Thread $thread): JsonResponse
    {
        $this->authorize('view', $thread);

        $thread->load('messages.advisorResponses');

        return response()->json($thread);
    }

    public function update(Request $request, Thread $thread): JsonResponse
    {
        $this->authorize('update', $thread);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'providers' => ['sometimes', 'array', 'min:1'],
            'providers.*' => ['string'],
            'provider_config' => ['sometimes', 'nullable', 'array'],
        ]);

        $thread->update($validated);

        return response()->json($thread);
    }

    public function destroy(Request $request, Thread $thread): JsonResponse
    {
        $this->authorize('delete', $thread);

        $thread->delete();

        return response()->json(null, 204);
    }
}
