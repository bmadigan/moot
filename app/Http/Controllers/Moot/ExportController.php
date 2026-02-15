<?php

namespace App\Http\Controllers\Moot;

use App\Actions\Moot\ExportThreadAsMarkdown;
use App\Http\Controllers\Controller;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportController extends Controller
{
    public function __invoke(Request $request, Thread $thread, ExportThreadAsMarkdown $action): StreamedResponse
    {
        $this->authorize('view', $thread);

        $filename = Str::slug($thread->title ?? 'moot-export').'.md';

        return response()->streamDownload(function () use ($thread, $action) {
            echo $action->execute($thread);
        }, $filename, [
            'Content-Type' => 'text/markdown',
        ]);
    }
}
