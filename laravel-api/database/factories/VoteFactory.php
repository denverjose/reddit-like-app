<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VoteFactory extends Factory
{
    public function definition(): array
    {
        // Choose votable type randomly
        $votableTypes = ['App\\Models\\Protocol', 'App\\Models\\Thread', 'App\\Models\\Comment'];

        return [
            'author' => rand(1, 20), // mock user IDs
            'votable_type' => $this->faker->randomElement($votableTypes),
            'votable_id' => rand(1, 20), // make sure votable_id exists in the type
            'vote' => $this->faker->randomElement([1, -1]),
        ];
    }
}