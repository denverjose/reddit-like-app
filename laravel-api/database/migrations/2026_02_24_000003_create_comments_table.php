<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();

            // Thread relation
            $table->foreignId('thread_id')
                  ->constrained()
                  ->onDelete('cascade');

            // Author (you may want to constrain this to users table)
            $table->unsignedBigInteger('author');

            $table->text('body');

            // Self-referencing parent (for nested replies)
            $table->foreignId('parent_id')
                  ->nullable()
                  ->constrained('comments')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};