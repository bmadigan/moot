<?php

namespace App\Http\Controllers;

use App\Jobs\DispatchAdvisors;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    public function export(Request $request, Thread $thread): StreamedResponse
    {
        $this->authorize('view', $thread);

        $thread->load('messages.advisorResponses');

        $filename = Str::slug($thread->title ?? 'moot-export').'.md';

        return response()->streamDownload(function () use ($thread) {
            echo $this->buildExportMarkdown($thread);
        }, $filename, [
            'Content-Type' => 'text/markdown',
        ]);
    }

    protected function buildExportMarkdown(Thread $thread): string
    {
        $lines = [];

        $lines[] = '# '.($thread->title ?? 'Moot Thread');
        $lines[] = '';
        $lines[] = '**Mode:** '.ucfirst($thread->mode->value);
        $lines[] = '**Providers:** '.implode(', ', $thread->providers);
        $lines[] = '**Created:** '.$thread->created_at->toDateTimeString();
        $lines[] = '';
        $lines[] = '---';
        $lines[] = '';

        foreach ($thread->messages as $message) {
            $lines[] = '## Prompt';
            $lines[] = '';
            $lines[] = $message->content;
            $lines[] = '';
            $lines[] = '*'.($message->created_at?->toDateTimeString() ?? 'Unknown time').'*';
            $lines[] = '';

            if ($message->advisorResponses->isNotEmpty()) {
                $lines[] = '### Advisor Responses';
                $lines[] = '';

                foreach ($message->advisorResponses as $response) {
                    $provider = strtoupper($response->provider);
                    $model = $response->model ? " ({$response->model})" : '';
                    $duration = $response->duration_ms ? ' — '.round($response->duration_ms / 1000, 1).'s' : '';
                    $cost = $response->estimated_cost ? ' — $'.number_format($response->estimated_cost, 4) : '';

                    $lines[] = "#### {$provider}{$model}{$duration}{$cost}";
                    $lines[] = '';

                    if ($response->error) {
                        $lines[] = '> **Error:** '.$response->error;
                    } else {
                        $lines[] = $response->content ?? '*No content*';
                    }

                    $lines[] = '';
                }
            }

            if ($message->synthesis) {
                $lines[] = '### Synthesis';
                $lines[] = '';
                $lines[] = $message->synthesis;
                $lines[] = '';
            }

            $lines[] = '---';
            $lines[] = '';
        }

        return implode("\n", $lines);
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
