<?php

namespace App\Http\Controllers;

use App\Models\User;
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
        $users = User::all(); // Fetch all users
        return Inertia::render('Users/Index', [
            'users' => $users,
        ]); // Assuming you have a Vue component at 'Users/Index'
    }

    /**
     * Display the details of a specific user.
     */
    public function show_detail($id)
    {
        $user = User::findOrFail($id); // Find user or return 404
        return Inertia::render('Users/Show', [
            'user' => $user,
        ]); // Assuming you have a Vue component at 'Users/Show'
    }

    /**
     * Show the form for creating a new user.
     */
    public function show_create()
    {
        return Inertia::render('Users/Create'); // Assuming you have a Vue component at 'Users/Create'
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
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing a user.
     */
    public function show_edit($id)
    {
        $user = User::findOrFail($id); // Find user or return 404
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]); // Assuming you have a Vue component at 'Users/Edit'
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
        ]);

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
        $volunteers = User::role('Volunteer')->where('is_approved', false)->get();

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

        $volunteer->update(['is_approved' => true]);

        return redirect()->route('approvevolunteers')
            ->with('success', 'Volunteer approved successfully.');
    }
}
