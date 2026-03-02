<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::dropIfExists('reviews'); // remove old table if exists

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('protocol_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('rating'); // 1-5
            $table->string('author')->nullable(); // string author instead of author
            $table->text('feedback')->nullable(); // optional feedback
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};