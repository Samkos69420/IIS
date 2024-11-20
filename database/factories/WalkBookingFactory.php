<?php

namespace Database\Factories;

use App\Models\Walk_Booking;
use App\Models\User;
use App\Models\Walk_Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

class WalkBookingFactory extends Factory
{
    protected $model = Walk_Booking::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'walk_id' => Walk_Plan::factory(),
            'approved' => $this->faker->boolean,
            'booking_date' => $this->faker->dateTimeBetween('now', '+1 week'),
        ];
    }
}
