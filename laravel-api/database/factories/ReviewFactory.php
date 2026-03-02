<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Review;
use App\Models\Protocol;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'protocol_id' => Protocol::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'author' => $this->faker->optional()->sentence(),
            'feedback' => $this->faker->optional()->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}