<?php

namespace Database\Factories;

use App\Models\walk_plan;
use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

class WalkPlanFactory extends Factory
{
    protected $model = walk_plan::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('now', '+1 week');
        $end = $this->faker->dateTimeBetween($start, '+2 hours');

        return [
            'animal_id' => Animal::factory(),
            'start' => $start,
            'end' => $end,
            'available' => $this->faker->boolean,
        ];
    }
}
