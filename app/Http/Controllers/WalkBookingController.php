<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WalkBooking;
use App\Models\Animal;
use Inertia\Inertia;

class WalkBookingController extends Controller
{
    /**
     * Get all bookings (Inertia View)
     */
    public function index()
    {
        $bookings = WalkBooking::with(['user', 'animal'])->latest()->get();

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Get volunteer history (Inertia View)
     */
    public function getVolunteerHistory(Request $request)
    {
        $userId = $request->user()->id;
        $history = WalkBooking::where('user_id', $userId)->with('animal')->get();

        return Inertia::render('Volunteer/History', [
            'history' => $history,
        ]);
    }

    /**
     * Show the schedule for an animal (Inertia View)
     */
    public function showAnimalSchedule($id)
    {
        $schedule = WalkBooking::where('animal_id', $id)->get();

        return Inertia::render('Animals/Schedule', [
            'schedule' => $schedule,
            'animalId' => $id,
        ]);
    }

    /**
     * Book a new termin for an animal.
     */
    public function bookTermin(Request $request, $id)
    {
        $request->validate([
            'start' => 'required|date',
            'end' => 'required|date|after:start',
        ]);

        WalkBooking::create([
            'user_id' => $request->user()->id,
            'animal_id' => $id,
            'start' => $request->start,
            'end' => $request->end,
            'booking_date' => now(),
        ]);

        return redirect()->back()->with('success', 'Booking created successfully.');
    }

    /**
     * Cancel a booked termin for an animal.
     */
    public function cancelTermin(Request $request, $id)
    {
        $booking = WalkBooking::where('user_id', $request->user()->id)
                              ->where('animal_id', $id)
                              ->where('id', $request->booking_id)
                              ->firstOrFail();

        $booking->delete();

        return redirect()->back()->with('success', 'Booking canceled successfully.');
    }

    public function getAnimalPlan($id)
    {
        $plan = WalkBooking::where('animal_id', $id)->get();



        return Inertia::render('Animals/PlanWalks', [
            'plan' => $plan,
            'animalId' => $id,
        ]);
    }

    public function animalIndex($id)
    {
        $bookings = WalkBooking::where('animal_id', $id)->get();

        return Inertia::render('Animals/Bookings', [
            'bookings' => $bookings,
            'animalId' => $id,
        ]);
    }

    public function detail($id)
    {
        $booking = WalkBooking::with(['user', 'animal'])->findOrFail($id);

        return Inertia::render('Bookings/Detail', [
            'booking' => $booking,
        ]);
    }

    public function approveBooking($id)
    {
        $booking = WalkBooking::findOrFail($id);
        $booking->update(['status' => 'accepted', 'approved' => true]);

        return redirect()->back()->with('success', 'Booking approved successfully.');
    }


    public function declineBooking($id)
    {
        $booking = WalkBooking::findOrFail($id);
        $booking->update(['status' => 'rejected']);

        return redirect()->back()->with('success', 'Booking declined.');
    }

    public function postAnimalPlan(Request $request, $id)
    {
        // Validate incoming data
        $request->validate([
            'start' => 'required|date|after:now',
            'end' => 'required|date|after:start', 
            'available' => 'required|boolean', 
        ]);


        // Create or update the walk plan for the animal
        $walkPlan = WalkBooking::create([
            'animal_id' => $id,          
            'start' => $request->start, 
            'end' => $request->end,      
            'available' => $request->available, 
            'status' => 'pending',      
            'booking_date' => now(),
            ]);
        return redirect()->route('animals.schedule', ['id' => $id])
                        ->with('success', 'Walk plan has been created successfully.');
    }

}
