<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\HallAvailability;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorAvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $vendorId = auth()->id();
        $halls = Hall::where('vendor_id', $vendorId)->get();

        $selectedHallId = $request->query('hall_id', $halls->first()?->id);
        $month = $request->query('month', now()->format('Y-m'));

        $availabilities = [];
        if ($selectedHallId) {
            $availabilities = HallAvailability::where('hall_id', $selectedHallId)
                ->where('date', 'like', "$month%")
                ->with('booking')
                ->get();
        }

        return Inertia::render('Vendor/Availability/Calendar', [
            'halls' => $halls,
            'selectedHallId' => (int)$selectedHallId,
            'month' => $month,
            'availabilities' => $availabilities
        ]);
    }

    public function block(Request $request)
    {
        $request->validate([
            'hall_id' => 'required|exists:halls,id',
            'date' => 'required|date',
            'slot' => 'required|in:morning,evening,full_day',
            'reason' => 'nullable|string'
        ]);

        HallAvailability::updateOrCreate(
            [
                'hall_id' => $request->hall_id,
                'date' => $request->date,
                'slot' => $request->slot,
            ],
            [
                'status' => 'blocked',
                'reason' => $request->reason ?? 'Blocked by Vendor'
            ]
        );

        return redirect()->back()->with('success', 'Date slot blocked successfully.');
    }

    public function unblock(Request $request)
    {
        $request->validate([
            'hall_id' => 'required|exists:halls,id',
            'date' => 'required|date',
            'slot' => 'required|in:morning,evening,full_day',
        ]);

        HallAvailability::where('hall_id', $request->hall_id)
            ->where('date', $request->date)
            ->where('slot', $request->slot)
            ->delete();

        return redirect()->back()->with('success', 'Date slot unblocked.');
    }
}
