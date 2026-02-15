<?php

namespace App\Http\Controllers;

use App\Jobs\DispatchAdvisors;
use App\Models\Thread;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MootController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('moot/index', [
            'threads' => $request->user()
                ->threads()
                ->with('latestMessage')
                ->latest('updated_at')
                ->get(),
            'mootConfig' => $this->getMootConfig(),
        ]);
    }

    public function show(Request $request, Thread $thread): Response
    {
        $this->authorize('view', $thread);

        return Inertia::render('moot/show', [
            'thread' => $thread->load('messages.advisorResponses'),
            'threads' => $request->user()
                ->threads()
                ->with('latestMessage')
                ->latest('updated_at')
                ->get(),
            'mootConfig' => $this->getMootConfig(),
        ]);
    }

    public function store(Request $request)
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

        return redirect()->route('moot.show', $thread);
    }

    public function message(Request $request, Thread $thread)
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

        return redirect()->back();
    }

    public function destroy(Request $request, Thread $thread)
    {
        $this->authorize('delete', $thread);

        $thread->delete();

        return redirect()->route('moot.index');
    }

    protected function getMootConfig(): array
    {
        return [
            'providers' => config('moot.providers'),
            'default_providers' => config('moot.default_providers'),
            'default_synthesis_format' => config('moot.default_synthesis_format'),
        ];
    }
}
