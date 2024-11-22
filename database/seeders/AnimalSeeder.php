<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnimalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('animals')->insert([
            [
                'name' => 'Buddy',
                'kind' => 'pes',
                'age' => 3,
                'gender' => 'male',
                'description' => 'Friendly and playful.',
                'date_found' => '2024-01-15',
                'where_found' => 'Central Park',
                'photo_url' => 'photos/buddy.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Whiskers',
                'kind' => 'kočka',
                'age' => 2,
                'gender' => 'female',
                'description' => 'Shy but loves cuddles.',
                'date_found' => '2024-02-10',
                'where_found' => 'Downtown',
                'photo_url' => 'photos/whiskers.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Thumper',
                'kind' => 'králík',
                'age' => 1,
                'gender' => 'male',
                'description' => 'Energetic and loves carrots.',
                'date_found' => '2024-03-05',
                'where_found' => 'Garden District',
                'photo_url' => 'photos/thumper.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
