<?php

namespace App\Http\Controllers\Moot;

use App\Actions\Moot\CreateThread;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function __invoke(Request $request, CreateThread $action): RedirectResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'max:10000'],
            'mode' => ['sometimes', 'string', 'in:quick'],
            'providers' => ['sometimes', 'array', 'min:1'],
            'providers.*' => ['string'],
            'provider_config' => ['sometimes', 'array'],
            'synthesis_format' => ['sometimes', 'string', 'in:markdown,structured'],
        ]);

        $thread = $action->execute($request->user(), $validated);

        return redirect()->route('moot.show', $thread);
    }
}
