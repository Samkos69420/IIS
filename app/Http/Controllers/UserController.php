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
    public function show_users(Request $request)
    {
        $role = $request->query('role'); // Get the role from the query string
    
        $users = User::with('roles')
            ->when($role, function ($query, $role) {
                $query->whereHas('roles', function ($query) use ($role) {
                    $query->where('name', $role);
                });
            })
            ->get();
    
        return Inertia::render('Users/Index', [
            'users' => $users,
            'roleFilter' => $role,
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
        try {
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
    
            if ($validated['role'] === 'None') {
                $user->syncRoles([]);
            } else {
                $user->syncRoles([$validated['role']]);
            }
    
            return response()->json(['success' => true, 'message' => 'User created successfully.']);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the user.',
                'error' => $e->getMessage(), 
            ], 500);
        }
    }
    
    
    

    /**
     * Show the form for editing a user.
     */
    public function show_edit($id)
    {
        $user = User::with('roles')->findOrFail($id);
        $roles = ['CareTaker', 'Vet', 'Volunteer', 'None'];
    
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles, // Always provide this
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
    
        if ($validated['role'] === 'None') {
            $user->syncRoles([]);
        } else {
            $user->syncRoles([$validated['role']]);
        }
    
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
        ]);
    
        return response()->json(['success' => true, 'message' => 'User updated successfully.']);
    }

    /**
     * Remove a user from the database.
     */
    public function remove_user($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
    
        return response()->json(['success' => true, 'message' => 'User deleted successfully.']);
    }    

    /**
     * Display a list of volunteers pending approval.
     */
    public function getApproveVolunteers()
    {
        $volunteers = User::role('pendingVolunteer')->get();

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
        try {
            $volunteer = User::findOrFail($id);

            if (!$volunteer->hasRole('pendingVolunteer')) {
                return response()->json([
                    'success' => false,
                    'message' => 'User does not have the pendingVolunteer role and cannot be approved.',
                ], 400);
            }

            $volunteer->syncRoles(['Volunteer']);

            return response()->json([
                'success' => true,
                'message' => 'Volunteer approved successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while approving the volunteer.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Deny a specific volunteer.
     */
    public function DenyVolunteer(Request $request, $id)
    {
        try {
            $volunteer = User::findOrFail($id);

            if (!$volunteer->hasRole('pendingVolunteer')) {
                return response()->json([
                    'success' => false,
                    'message' => 'User does not have the pendingVolunteer role and cannot be denied.',
                ], 400);
            }

            $volunteer->syncRoles(['']);

            return response()->json([
                'success' => true,
                'message' => 'Volunteer denied successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while denying the volunteer.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function applyForApproval(Request $request)
    {
        try {
            // Check if the user has any roles
            if ($request->user()->hasRole('pendingVolunteer')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already pending approval.',
                ], 400);
            }
    
            if (!$request->user()->hasAnyRole()) {
                // Assign the role 'pendingVolunteer' to the user
                $request->user()->assignRole('pendingVolunteer');
    
                return response()->json([
                    'success' => true,
                    'message' => 'You applied successfully!',
                ]);
            }
    
            return response()->json([
                'success' => false,
                'message' => 'You cannot apply!',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
}
