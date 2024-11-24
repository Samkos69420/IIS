<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;


class UserController extends Controller
{
    /**
     * Display a list of users.
     */
    public function show_users()
    {
        $users = User::all();
        return Inertia::render('Users/Index', [
            'users' => $users,
        ]); 
    }

    /**
     * Display the details of a specific user.
     */
    public function show_detail($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function show_create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Create a new user in the database.
     */
    public function create_user(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:CareTaker,Vet,Volunteer,None',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);


        if ($validated['role'] == 'None') {
            $user->syncRoles([]);
        }else {
            $user->assignRole($validated['role']);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing a user.
     */
    public function show_edit($id)
    {
        $user = User::findOrFail($id); 
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Edit an existing user in the database.
     */
    public function edit_user(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:CareTaker,Vet,Volunteer,None'
        ]);

        if ($validated['role'] == 'None') {
            $user->syncRoles([]);
        }else {
            $user->assignRole($validated['role']);
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
        ]);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove a user from the database.
     */
    public function remove_user($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    /**
     * Display a list of volunteers pending approval.
     */
    public function getApproveVolunteers()
    {
        $volunteers = User::doesntHave('roles')->get();

        return Inertia::render('Volunteers/Approve', [
            'volunteers' => $volunteers,
        ]);
    }

    /**
     * Display details of a specific volunteer pending approval.
     */
    public function getApproveVolunteersDetail($id)
    {
        $volunteer = User::findOrFail($id);

        return Inertia::render('Volunteers/Detail', [
            'volunteer' => $volunteer,
        ]);
    }

    /**
     * Approve a specific volunteer.
     */
    public function ApproveVolunteer(Request $request, $id)
    {
        $volunteer = User::findOrFail($id);

        $volunteer->assignRole('Volunteer');

        return redirect()->route('approvevolunteers')
            ->with('success', 'Volunteer approved successfully.');
    }
}
