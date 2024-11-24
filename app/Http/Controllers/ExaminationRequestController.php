<?php

namespace App\Http\Controllers;

use App\Models\examination_request;
use App\Models\Animal;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ExaminationRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get paginated list of examination requests with relationships
        $examination_requests = examination_request::with(['animal', 'vet'])
            ->latest()
            ->paginate(10);

        // Pass data to Inertia::render view
        return Inertia::render('ExaminationRequest/Index', [
            'examination_requests' => $examination_requests,
        ]);
    }

    public function create($id)
    {
        $animal = Animal::findOrFail($id);
        $vets = User::role('vet')->get();

        return Inertia::render('ExaminationRequest/Create', [
            'animals' => $animal,
            'vets' => $vets,
            'animal_id' => $id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate input data
        $validated = $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'vet_id' => 'required|exists:users,id',
            'creation_date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        // Create a new examination request
        examination_request::create($validated);

        // Redirect with a success message
        return response()->json(['success' => true, 'message' => 'Examination request created successfully.']);
    }

    public function show(examination_request $examination_request)
    {
        // Load related data
        $examination_request->load(['animal', 'vet']);

        // Pass data to the view
        return Inertia::render('ExaminationRequest/Show', [
            'examination_request' => $examination_request,
        ]);
    }

    public function RequestDetail($id)
    {
        // Fetch the examination request with relationships
        $examination_request = examination_request::with(['animal', 'vet'])->findOrFail($id);

        // Return as JSON or to a detail view
        return Inertia::render('ExaminationRequest/Detail', [
            'examination_request' => $examination_request,
        ]);
    }


    /**
     * Show the form for editing a specific examination request.
     */
    public function geteditRequest($id)
    {
        // Fetch the examination request with related data
        $examination_request = examination_request::findOrFail($id);
        $animals = Animal::all(['id', 'name']);
        $vets = User::where('role', 'vet')->get(['id', 'name']);

        // Pass data to the edit form
        return Inertia::render('ExaminationRequest/Edit', [
            'examination_request' => $examination_request,
            'animals' => $animals,
            'vets' => $vets,
        ]);
    }


        /**
     * Handle the request to edit a specific examination request.
     */
    public function editRequest(Request $request, $id)
    {
        // Validate input data
        $validated = $request->validate([
            'animal_id' => 'required|exists:animals,id',
            'vet_id' => 'required|exists:users,id',
            'creation_date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        // Fetch and update the examination request
        $examination_request = examination_request::findOrFail($id);
        $examination_request->update($validated);

        // Redirect with a success message
        return redirect('/request')
            ->with('success', 'Examination request updated successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, examination_request $examination_request)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(examination_request $examination_request)
    {
        //
    }
}
