<?php

use App\Http\Controllers\MootController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/moot', [MootController::class, 'index'])->name('moot.index');
    Route::post('/moot', [MootController::class, 'store'])->name('moot.store');
    Route::get('/moot/{thread}', [MootController::class, 'show'])->name('moot.show');
    Route::post('/moot/{thread}/messages', [MootController::class, 'message'])->name('moot.message');
    Route::delete('/moot/{thread}', [MootController::class, 'destroy'])->name('moot.destroy');
});
