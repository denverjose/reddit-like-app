<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Protocol;

class ProtocolFactory extends Factory
{
    protected $model = Protocol::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(5),
            'content' => $this->faker->paragraph(3),
            'tags' => $this->faker->words(rand(1, 4)),
            'author' => $this->faker->name(),
            'rating' => $this->faker->randomFloat(2, 0, 5),
        ];
    }
}
