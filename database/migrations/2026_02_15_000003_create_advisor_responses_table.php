<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advisor_responses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('message_id')->constrained()->cascadeOnDelete();
            $table->string('provider');
            $table->string('model')->nullable();
            $table->text('content')->nullable();
            $table->text('error')->nullable();
            $table->unsignedInteger('duration_ms')->nullable();
            $table->unsignedInteger('tokens_used')->nullable();
            $table->unsignedInteger('input_tokens')->nullable();
            $table->unsignedInteger('output_tokens')->nullable();
            $table->decimal('estimated_cost', 8, 6)->nullable();
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advisor_responses');
    }
};
