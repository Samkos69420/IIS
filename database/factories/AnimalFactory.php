<?php

namespace Database\Factories;

use App\Models\Animal;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    protected $model = Animal::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName,
            'kind' => $this->faker->randomElement(['pes', 'kočka', 'králík']),
            'age' => $this->faker->numberBetween(1, 15),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'description' => $this->faker->sentence,
            'date_found' => $this->faker->date(),
            'where_found' => $this->faker->city,
            'photo_url' => $this->faker->imageUrl(),
        ];
    }
}