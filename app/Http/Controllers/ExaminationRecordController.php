<?php

namespace App\Http\Controllers;

use App\Models\examination_record;
use App\Models\Animal;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ExaminationRecordController extends Controller
{
    /**
     * Show a list of records for a specific animal.
     *
     */
    public function IndexAnimalRecords($id)
    {
        $animal = Animal::findOrFail($id);
        $records = $animal->examinationRecords()->with('vet')->get();

        return Inertia::render('AnimalRecords/Index', [
            'animal' => $animal,
            'records' => $records,
        ]);
    }

    /**
     * Show the details of a specific examination record.
     *
     */
    public function DetailAnimalRecord($id)
    {
        $record = examination_record::with(['animal', 'vet'])->findOrFail($id);

        return Inertia::render('AnimalRecords/Detail', [
            'record' => $record,
        ]);
    }

    /**
     * Show the form to edit an examination record.
     *
     */
    public function getEditDetailAnimalRecord($id)
    {
        $record = examination_record::findOrFail($id);
        $vets = User::where('role', 'vet')->get(); // Assuming there's a 'role' field for vets

        return Inertia::render('AnimalRecords/Edit', [
            'record' => $record,
            'vets' => $vets,
        ]);
    }

    /**
     * Show the form to create a new examination record for an animal.
     *
     */
    public function getCreateAnimalRecord($id)
    {
        $animal = Animal::findOrFail($id);
        $vets = User::where('role', 'vet')->get();

        return Inertia::render('AnimalRecords/Create', [
            'animal' => $animal,
            'vets' => $vets,
        ]);
    }

    /**
     * Store a new examination record for an animal.
     *
     */
    public function createAnimalRecord(Request $request, $id)
    {
        $validated = $request->validate([
            'vet_id' => 'required|exists:users,id',
            'examination_date' => 'required|date',
            'examination_type' => 'required|in:ockovani,prohlidka,lecba',
            'description' => 'nullable|string',
        ]);

        $validated['animal_id'] = $id;

        examination_record::create($validated);

        return redirect()->route('animals.record', $id);
    }

    /**
     * Update an existing examination record.
     *
     */
    public function editDetailAnimalRecord(Request $request, $id)
    {
        $record = examination_record::findOrFail($id);

        $validated = $request->validate([
            'vet_id' => 'required|exists:users,id',
            'examination_date' => 'required|date',
            'examination_type' => 'required|in:ockovani,prohlidka,lecba',
            'description' => 'nullable|string',
        ]);

        $record->update($validated);

        return redirect()->route('animals.record', $record->animal_id);
    }

    /**
     * Delete a specific examination record.
     *
     */
    public function deleteDetailAnimalRecord($id)
    {
        $record = examination_record::findOrFail($id);
        $animalId = $record->animal_id;

        $record->delete();

        return redirect()->route('animals.record', $animalId);
    }
}
