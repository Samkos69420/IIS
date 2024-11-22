<?php

namespace App\Http\Controllers;

use App\Models\walk_plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WalkPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $walkPlans = walk_plan::all();
        return Inertia::render('WalkPlans/Index', [
            'walkPlans' => $walkPlans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('WalkPlans/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'distance' => 'required|numeric',
            'duration' => 'required|numeric',
        ]);

        walk_plan::create($validated);

        return redirect()->route('walk-plans.index')->with('success', 'Walk Plan created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(walk_plan $walk_plan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(walk_plan $walk_plan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, walk_plan $walk_plan)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'distance' => 'sometimes|numeric',
            'duration' => 'sometimes|numeric',
        ]);
    
        $walk_plan->update($validated);
    
        return redirect()->route('walk-plans.index')->with('success', 'Walk Plan updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(walk_plan $walk_plan)
    {
        $walk_plan->delete();
    
        return redirect()->route('walk-plans.index')->with('success', 'Walk Plan deleted successfully!');
    }
    
}
