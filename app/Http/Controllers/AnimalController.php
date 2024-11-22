<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use Illuminate\Http\Request;

class AnimalController extends Controller
{
    /**
     * Display a list of animals.
     */
    public function index()
    {
        $animals = Animal::latest()->paginate(10); // Paginate animals
        return inertia('Animals/Index', [
            'animals' => $animals,
        ]);
    }

    /**
     * Show the details of a specific animal.
     */
    public function show($id)
    {
        $animal = Animal::with(['examinationRecords', 'walkPlans'])->findOrFail($id);
        return inertia('Animals/Show', [
            'animal' => $animal,
        ]);
    }

    /**
     * Add a new animal (for caretakers).
     */
    public function create()
    {
        return inertia('Animals/Create');
    }

    /**
     * Store a new animal in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255', 
            'kind' => 'required|string|in:dog,cat,rabbit', 
            'age' => 'required|integer|min:0|max:30', 
            'gender' => 'required|in:male,female', 
            'description' => 'nullable|string|max:1000', 
            'date_found' => 'required|date|before_or_equal:today', 
            'where_found' => 'required|string|max:255', 
            'photo' => 'nullable|image|max:2048', 
        ]);

        $animal = Animal::create($validated);

        if ($request->hasFile('photo')) {
            $animal->photo = $request->file('photo')->store('animals', 'public');
            $animal->save();
        }

        return redirect()->route('animals.index')->with('success', 'Animal created successfully.');
    }

    /**
     * Show the form for editing an existing animal.
     */
    public function edit($id)
    {
        $animal = Animal::findOrFail($id);
        return inertia('Animals/Edit', [
            'animal' => $animal,
        ]);
    }

    /**
     * Update the animal in the database.
     */
    public function update(Request $request, $id)
    {
        $animal = Animal::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255', 
            'kind' => 'required|string|in:dog,cat,rabbit', 
            'age' => 'required|integer|min:0|max:30', 
            'gender' => 'required|in:male,female', 
            'description' => 'nullable|string|max:1000', 
            'date_found' => 'required|date|before_or_equal:today', 
            'where_found' => 'required|string|max:255', 
            'photo' => 'nullable|image|max:2048', 
        ]);

        $animal->update($validated);

        if ($request->hasFile('photo')) {
            $animal->photo = $request->file('photo')->store('animals', 'public');
            $animal->save();
        }

        return redirect()->route('caretaker.animals.index')->with('success', 'Animal updated successfully.');
    }

    /**
     * Delete an animal.
     */
    public function destroy($id)
    {
        $animal = Animal::findOrFail($id);
        $animal->delete();

        return redirect()->route('caretaker.animals.index')->with('success', 'Animal deleted successfully.');
    }

    /**
     * Show the schedule of an animal.
     */
    public function schedule($id)
    {
        $animal = Animal::with('walkPlans')->findOrFail($id);

        return inertia('Animals/Schedule', [
            'animal' => $animal,
            'schedules' => $animal->walkPlans,
        ]);
    }

    /**
     * Show animal examinations.
     */
    public function animalExaminations($id)
    {
        $animal = Animal::with('examinationRequests')->findOrFail($id);

        return inertia('Animals/examinationRequests', [
            'animal' => $animal,
            'examinations' => $animal->examinationRequests,
        ]);
    }
}
