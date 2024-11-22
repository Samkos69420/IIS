<?php

namespace App\Http\Controllers;

use App\Models\examination;
use App\Models\examination_request;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExaminationController extends Controller
{
    // Show list of all examinations
    public function IndexExamination()
    {
        $examinations = examination::with('examinationRequest')->get();
        return Inertia::render('Examinations/Index', [
            'examinations' => $examinations,
        ]);
    }

    // Show the details of a specific examination
    public function DetailExamination($id)
    {
        $examination = examination::with('examinationRequest')->findOrFail($id);
        return Inertia::render('Examinations/Detail', [
            'examination' => $examination,
        ]);
    }

    // Show the form to edit an existing examination
    public function EditDetailExamination($id)
    {
        $examination = examination::findOrFail($id);
        $examinationRequests = examination_request::all();
        return Inertia::render('Examinations/Edit', [
            'examination' => $examination,
            'examinationRequests' => $examinationRequests,
        ]);
    }

    // Show the form to create a new examination
    public function CreateFormExamination()
    {
        $examinationRequests = examination_request::all();
        return Inertia::render('Examinations/Create', [
            'examinationRequests' => $examinationRequests,
        ]);
    }

    // Store a new examination
    public function createExamination(Request $request)
    {
        $request->validate([
            'request_id' => 'required|exists:examination_requests,id',
            'examination' => 'required|date',
        ]);

        examination::create([
            'request_id' => $request->request_id,
            'examination' => $request->examination,
        ]);

        return redirect()->route('examination.index');
    }

    // Delete an examination
    public function deleteExamination($id)
    {
        $examination = examination::findOrFail($id);
        $examination->delete();

        return redirect()->route('examination.index');
    }

    // Update an examination
    public function editExamination(Request $request, $id)
    {
        $request->validate([
            'request_id' => 'required|exists:examination_requests,id',
            'examination' => 'required|date',
        ]);

        $examination = examination::findOrFail($id);
        $examination->update([
            'request_id' => $request->request_id,
            'examination' => $request->examination,
        ]);

        return redirect()->route('examination.index');
    }
}
