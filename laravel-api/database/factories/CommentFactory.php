<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Comment;
use App\Models\Thread;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'thread_id' => 1, // overridden in seeder
            'author' => rand(1, 20), // just mock users, no unique()
            'body' => $this->faker->paragraph(),
            'parent_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}