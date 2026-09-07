<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = Booking::with(['hall', 'customer', 'vendor']);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $bookings = $query->latest()->get();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'currentFilter' => $status,
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $request->validate(['reason' => 'nullable|string|max:255']);

        $booking = Booking::findOrFail($id);
        $booking->update([
            'status' => 'cancelled',
            'notes' => $request->reason ? "Cancelled by Admin: {$request->reason}" : "Cancelled by Admin",
        ]);

        ActivityLog::log('Cancel Booking', 'Bookings', "Admin cancelled booking #{$booking->id} for {$booking->event_name}");

        return redirect()->back()->with('success', 'Booking cancelled successfully.');
    }
}
