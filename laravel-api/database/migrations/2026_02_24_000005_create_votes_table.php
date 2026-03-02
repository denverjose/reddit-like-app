<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->string('author'); // store username or identifier
            $table->morphs('votable'); // votable_id + votable_type
            $table->tinyInteger('vote'); // 1 = upvote, -1 = downvote
            $table->timestamps();
            $table->unique(['author', 'votable_id', 'votable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};


// <?php

// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;


// return new class extends Migration {
//     public function up(): void
//     {
//         Schema::create('votes', function (Blueprint $table) {
//             $table->id();
//             $table->string('author'); // mock user name or id
//             $table->morphs('votable'); // votable_id + votable_type
//             $table->tinyInteger('vote'); // 1 = upvote, -1 = downvote
//             $table->timestamps();

//             $table->unique(['author', 'votable_id', 'votable_type'], 'unique_user_vote');
//         });
//     }

//     public function down(): void
//     {
//         Schema::dropIfExists('votes');
//     }
// };



