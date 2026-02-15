<?php

namespace App\Http\Controllers\Moot;

use App\Actions\Moot\CheckProviderStatus;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexController extends Controller
{
    public function __invoke(Request $request): Response
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

    private function getMootConfig(): array
    {
        return [
            'providers' => config('moot.providers'),
            'default_providers' => config('moot.default_providers'),
            'default_synthesis_format' => config('moot.default_synthesis_format'),
            'provider_status' => app(CheckProviderStatus::class)->execute(),
        ];
    }
}
