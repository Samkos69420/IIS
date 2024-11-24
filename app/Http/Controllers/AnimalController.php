<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AnimalController extends Controller
{
    /**
     * Display a list of animals.
     */
    public function index()
    {
        $animals = Animal::paginate(10); // Paginate animals
        return Inertia::render('Animals/Index', [
            'initialAnimals' => $animals->items(),
        ]);
    }

    /**
     * Show the details of a specific animal.
     */
    public function show($id)
    {
        $animal = Animal::with(['examinationRecords', 'WalkBookings'])->findOrFail($id);
        return Inertia::render('Animals/Show', [
            'animal' => $animal,
        ]);
    }

  
    /**
     * Add a new animal (for caretakers).
     */
    public function create()
    {
        return Inertia::render('Animals/Index');
    }

    /**
     * Store a new animal in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'photo_url' => 'required|url', // Assuming photo_url is a URL in your schema
            'name' => 'required|string|max:255', 
            'breed' => 'nullable|string|max:255', 
            'age' => 'required|integer|min:0|max:30', 
            'weight' => 'required|numeric|min:0|max:200', // Adjust max weight as needed
            'neutered' => 'required|boolean', 
            'gender' => 'required|in:male,female', 
            'description' => 'nullable|string|max:1000', 
            'date_found' => 'required|date|before_or_equal:today', 
            'where_found' => 'required|string|max:255',
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
        return Inertia::render('Animals/Edit', [
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
            'photo_url' => 'required|url',
            'name' => 'required|string|max:255', 
            'breed' => 'nullable|string|max:255', 
            'age' => 'required|integer|min:0|max:30', 
            'weight' => 'required|numeric|min:0|max:200',
            'neutered' => 'required|boolean', 
            'gender' => 'required|in:male,female', 
            'description' => 'nullable|string|max:1000', 
            'date_found' => 'required|date|before_or_equal:today', 
            'where_found' => 'required|string|max:255',
        ]);

        $animal->update($validated);

        if ($request->hasFile('photo')) {
            $animal->photo_url = $request->file('photo')->store('animals', 'public');
            $animal->save();
        }

        return response()->json(['success' => true, 'message' => 'Animal updated successfully.']);
    }

    /**
     * Delete an animal.
     */
    public function destroy($id)
    {
        $animal = Animal::findOrFail($id);
        $animal->delete();

        return response()->json(['success' => true, 'message' => 'Animal deleted successfully.']);
    }
}
