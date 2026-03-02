<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Thread;
use App\Models\Protocol;

class ThreadFactory extends Factory
{
    protected $model = Thread::class;

    public function definition(): array
    {
        return [
            'protocol_id' => Protocol::factory(),
            'title' => $this->faker->sentence(6),
            'body' => $this->faker->paragraph(4),
            'author' => $this->faker->name(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}