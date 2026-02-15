<?php

use App\Http\Controllers\Moot\DestroyController;
use App\Http\Controllers\Moot\ExportController;
use App\Http\Controllers\Moot\IndexController;
use App\Http\Controllers\Moot\MessageController;
use App\Http\Controllers\Moot\ShowController;
use App\Http\Controllers\Moot\StoreController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/moot', IndexController::class)->name('moot.index');
    Route::post('/moot', StoreController::class)->name('moot.store');
    Route::get('/moot/{thread}', ShowController::class)->name('moot.show');
    Route::post('/moot/{thread}/messages', MessageController::class)->name('moot.message');
    Route::delete('/moot/{thread}', DestroyController::class)->name('moot.destroy');
    Route::get('/moot/{thread}/export', ExportController::class)->name('moot.export');
});
