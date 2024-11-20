<?php

namespace Database\Factories;

use App\Models\Examination;
use App\Models\examination_request;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExaminationFactory extends Factory
{
    protected $model = Examination::class;

    public function definition(): array
    {
        return [
            'request_id' => examination_request::factory(),
            'examination' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
