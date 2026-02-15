<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ThreadController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('threads', ThreadController::class);
    Route::apiResource('threads.messages', MessageController::class)->only(['index', 'store']);
});
