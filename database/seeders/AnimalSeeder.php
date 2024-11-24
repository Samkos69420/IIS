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
                'name' => 'Alík',
                'breed' => 'labrador',
                'age' => 3,
                'weight'=> 25.4,
                'neutered' => false,
                'gender' => 'male',
                'description' => 'Friendly and playful.',
                'date_found' => '2024-01-15',
                'where_found' => 'Central Park',
                'photo_url' => 'photos/buddy.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Punťa',
                'breed' => 'jezevčík',
                'age' => 5,
                'weight'=> 5.4,
                'neutered' => false,
                'gender' => 'female',
                'description' => 'Shy but loves cuddles.',
                'date_found' => '2024-02-10',
                'where_found' => 'Downtown',
                'photo_url' => 'photos/whiskers.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Buddy',
                'breed' => 'dalmatín',
                'age' => 8,
                'weight'=> 15.4,
                'neutered' => true,
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
