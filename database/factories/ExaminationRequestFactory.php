<?php

namespace Database\Factories;

use App\Models\examination_request;
use App\Models\Animal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExaminationRequestFactory extends Factory
{
    protected $model = examination_request::class;

    public function definition(): array
    {
        return [
            'animal_id' => Animal::factory(),
            'vet_id' => User::factory(),
            'creation_date' => $this->faker->date(),
            'description' => $this->faker->sentence,
        ];
    }
}
