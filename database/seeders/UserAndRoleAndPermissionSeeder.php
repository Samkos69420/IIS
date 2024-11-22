<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class UserAndRoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'Admin']);
        $careTakerRole = Role::create(['name' => 'CareTaker']);
        $vetRole = Role::create(['name' => 'Vet']);
        $volunteerRole = Role::create(['name' => 'Volunteer']);

        // Create Permission
        //admin
        Permission::create(['name' => 'create-users']);
        Permission::create(['name' => 'edit-users']);
        Permission::create(['name' => 'delete-users']);
        //caretaker
        Permission::create(['name' => 'create-animals']);
        Permission::create(['name' => 'edit-animals']);
        Permission::create(['name' => 'delete-animals']);

        Permission::create(['name' => 'create-plans']);
        Permission::create(['name' => 'edit-plans']);
        Permission::create(['name' => 'delete-plans']);

        Permission::create(['name' => 'verify-volunteers']);

        Permission::create(['name' => 'verify-walkBookings']);

        Permission::create(['name' => 'create-examinationRequests']);
        Permission::create(['name' => 'edit-examinationRequests']);
        Permission::create(['name' => 'delete-examinationRequests']);

        //Vet
        Permission::create(['name' => 'create-examination']);
        Permission::create(['name' => 'edit-examination']);
        Permission::create(['name' => 'delete-examination']);

        Permission::create(['name' => 'create-examinationRecord']);
        Permission::create(['name' => 'edit-examinationRecord']);
        Permission::create(['name' => 'delete-examinationRecord']);

        //volunteer-verified
        Permission::create(['name' => 'create-walkBookings']);
        Permission::create(['name' => 'edit-walkBookings']);
        Permission::create(['name' => 'delete-walkBookings']);

        $adminRole->givePermissionTo(Permission::all());
        $careTakerRole->givePermissionTo([
            'create-animals',
            'edit-animals',
            'delete-animals',
            'create-plans',
            'edit-plans',
            'delete-plans',
            'verify-volunteers',
            'verify-walkBookings',
            'create-examinationRequests',
            'edit-examinationRequests',
            'delete-examinationRequests',
        ]);
        $vetRole->givePermissionTo([
            'create-examination',
            'edit-examination',
            'delete-examination',
            'create-examinationRecord',
            'edit-examinationRecord',
            'delete-examinationRecord',
        ]);
        $volunteerRole->givePermissionTo([
            'create-walkBookings',
            'edit-walkBookings',
            'delete-walkBookings',
        ]);


        // Create users and assign roles
        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        $adminUser->assignRole($adminRole);

        $careTakerUser = User::factory()->create([
            'name' => 'CareTaker User',
            'email' => 'caretaker@example.com',
            'password' => bcrypt('password'),
        ]);
        $careTakerUser->assignRole($careTakerRole);

        $vetUser = User::factory()->create([
            'name' => 'Vet User',
            'email' => 'vet@example.com',
            'password' => bcrypt('password'),
        ]);
        $vetUser->assignRole($vetRole);

        $volunteerUser = User::factory()->create([
            'name' => 'Volunteer User',
            'email' => 'volunteer@example.com',
            'password' => bcrypt('password'),
        ]);

        $volunteerVerifiedUser = User::factory()->create([
            'name' => 'Volunteer Verified User',
            'email' => 'volunteer.verified@example.com',
            'password' => bcrypt('password'),
        ]);
        $volunteerVerifiedUser->assignRole($volunteerRole);
    }
}
