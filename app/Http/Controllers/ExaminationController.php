<?php

namespace App\Http\Controllers;

use App\Models\examination;
use Illuminate\Http\Request;

class ExaminationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $examination = Examination::orderBy("created_at","desc")->paginate(10);
        return inertia('Examination/Index',[
            'exsaminations'=> $examination
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Examination/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
    }

    /**
     * Display the specified resource.
     */
    public function show(examination $examination)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(examination $examination)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, examination $examination)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(examination $examination)
    {
        //
    }
}
