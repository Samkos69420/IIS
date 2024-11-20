<?php

namespace Database\Factories;

use App\Models\examination_record;
use App\Models\Animal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExaminationRecordFactory extends Factory
{
    protected $model = Examination_Record::class;

    public function definition(): array
    {
        return [
            'animal_id' => Animal::factory(),
            'vet_id' => User::factory(),
            'examination_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'examination_type' => $this->faker->randomElement(['ockovani', 'prohlidka', 'lecba']),
            'description' => $this->faker->paragraph,
        ];
    }
}
