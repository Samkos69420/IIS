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
        $bookings = WalkBooking::with(['user', 'animal'])
            ->where('status', 'pending')
            ->latest()
            ->get();
    
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
        $schedule = WalkBooking::where('animal_id', $id)->with('user')->get();
    
        // Return JSON if the request expects JSON
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'schedule' => $schedule,
                'animalId' => $id,
            ]);
        }
    
        // Otherwise, render the Inertia view
        return Inertia::render('Animals/Schedule', [
            'schedule' => $schedule,
            'animalId' => $id,
        ]);
    }
    
    

    /**
     * Book a new termin for an animal.
     */
    public function bookTermin($id)
    {
        try {

            $booking = WalkBooking::findOrFail($id);

            if ($booking->user_id == NULL) {
                $booking->update(['user_id' => auth()->id(),
                'status' => 'pending',
                'booking_date' => now(),
                'approved' => false,
                'available' => false
                ]);
            
            }else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed booking alredy booked.',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully.',
                'booking' => $booking,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel a booked termin for an animal.
     */
    public function cancelTermin($id)
    {
        try {
            $booking = WalkBooking::findOrFail($id);

            $booking->update([
                'user_id' => null,
                'status' => 'pending',
                'booking_date' => now(),
                'approved' => false,
                'available' => true,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking canceled successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel booking.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
        $bookings = WalkBooking::where('animal_id', $id)->with('user')->get();
    
        // If the request is expecting JSON, return data
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'bookings' => $bookings,
            ]);
        }
    
        // Otherwise, return the Inertia view
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
        try {
            $booking = WalkBooking::findOrFail($id);
            $booking->update(['status' => 'accepted', 'approved' => true]);
    
            return response()->json([
                'success' => true,
                'message' => 'Rezervace byla úspěšně schválena.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Nepodařilo se schválit rezervaci.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function declineBooking($id)
    {
        try {
            $booking = WalkBooking::findOrFail($id);
            $booking->update(['status' => 'rejected']);
    
            return response()->json([
                'success' => true,
                'message' => 'Rezervace byla úspěšně odmítnuta.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Nepodařilo se odmítnout rezervaci.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function postAnimalPlan(Request $request, $id)
    {
        try {
            // Validate incoming data
            $validated = $request->validate([
                'start' => 'required|date|after:now',
                'end' => 'required|date|after:start',
                'available' => 'required|boolean',
            ]);
    
            // Create or update the walk plan for the animal
            $walkPlan = WalkBooking::create([
                'animal_id' => $id,
                'user_id' => null,
                'start' => $validated['start'],
                'end' => $validated['end'],
                'available' => $validated['available'],
                'status' => 'pending',
                'booking_date' => now(),
            ]);
    
            return response()->json([
                'success' => true,
                'message' => 'Walk plan created successfully.',
                'walkPlan' => $walkPlan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the walk plan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function deleteBooking($id){
        try {
            $booking = WalkBooking::findOrFail($id);
            $booking->delete();
            return response()->json([
                'success' => true,
                'message' => 'Booking deleted.',
                ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the walk plan.',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

}
