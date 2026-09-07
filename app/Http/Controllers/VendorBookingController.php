<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hall;
use App\Models\HallAvailability;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class VendorBookingController extends Controller
{
    public function index(Request $request)
    {
        $vendorId = auth()->id();
        $status = $request->query('status', 'all');

        $query = Booking::where('vendor_id', $vendorId)->with('hall')->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $bookings = $query->get();
        $halls = Hall::where('vendor_id', $vendorId)->get();

        return Inertia::render('Vendor/Bookings/Index', [
            'bookings' => $bookings,
            'halls' => $halls,
            'activeStatusFilter' => $status
        ]);
    }

    public function storeOffline(Request $request)
    {
        $request->validate([
            'hall_id' => 'required|exists:halls,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:50',
            'event_type' => 'required|string',
            'event_date' => 'required|date',
            'slot' => 'required|in:morning,evening,full_day',
            'guest_count' => 'required|integer|min:1',
            'booking_amount' => 'required|numeric|min:0',
            'advance_amount' => 'required|numeric|min:0',
        ]);

        $bookingCode = 'BK-OFF-' . strtoupper(Str::random(6));
        $remaining = max(0, $request->booking_amount - $request->advance_amount);
        $paymentStatus = $remaining == 0 ? 'paid' : ($request->advance_amount > 0 ? 'partial' : 'pending');

        $booking = Booking::create([
            'booking_code' => $bookingCode,
            'hall_id' => $request->hall_id,
            'vendor_id' => auth()->id(),
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'event_type' => $request->event_type,
            'event_date' => $request->event_date,
            'slot' => $request->slot,
            'guest_count' => $request->guest_count,
            'booking_amount' => $request->booking_amount,
            'advance_amount' => $request->advance_amount,
            'remaining_amount' => $remaining,
            'payment_status' => $paymentStatus,
            'status' => 'confirmed',
            'booking_type' => 'offline',
            'notes' => $request->notes
        ]);

        // Automatically sync calendar date as booked
        HallAvailability::updateOrCreate(
            [
                'hall_id' => $request->hall_id,
                'date' => $request->event_date,
                'slot' => $request->slot,
            ],
            [
                'status' => 'booked',
                'reason' => 'Offline Booking (' . $bookingCode . ')',
                'booking_id' => $booking->id
            ]
        );

        return redirect()->back()->with('success', 'Offline booking saved and calendar updated successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:confirmed,rejected,cancelled,completed'
        ]);

        $booking = Booking::where('vendor_id', auth()->id())->findOrFail($id);
        $booking->update(['status' => $request->status]);

        // Sync calendar availability
        if (in_array($request->status, ['confirmed', 'completed'])) {
            HallAvailability::updateOrCreate(
                [
                    'hall_id' => $booking->hall_id,
                    'date' => $booking->event_date,
                    'slot' => $booking->slot,
                ],
                [
                    'status' => 'booked',
                    'reason' => 'Booking ' . $booking->booking_code,
                    'booking_id' => $booking->id
                ]
            );
        } elseif (in_array($request->status, ['rejected', 'cancelled'])) {
            HallAvailability::where('booking_id', $booking->id)->delete();
        }

        return redirect()->back()->with('success', 'Booking status updated to ' . ucfirst($request->status));
    }
}
