<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('thread_id')->constrained()->cascadeOnDelete();
            $table->string('role')->default('user');
            $table->text('content');
            $table->string('status')->default('pending');
            $table->text('synthesis')->nullable();
            $table->json('synthesis_structured')->nullable();
            $table->string('synthesis_format')->default('markdown');
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
