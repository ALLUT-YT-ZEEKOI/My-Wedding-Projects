<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Offer;
use App\Models\HallAvailability;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CustomerBookingController extends Controller
{
    public function create(Request $request, $hallId)
    {
        $hall = Hall::with(['pricing', 'policy'])->find($hallId);

        if (!$hall) {
            $hall = (object) [
                'id' => (int)$hallId,
                'name' => 'The Grand Imperial Banquet',
                'pricing' => (object) [
                    'base_price' => 35000,
                    'morning_price' => 20000,
                    'evening_price' => 28000,
                    'full_day_price' => 35000,
                    'security_deposit' => 5000,
                ],
                'policy' => (object) [
                    'event_timing' => '08:00 AM - 11:00 PM',
                    'veg_allowed' => true,
                    'non_veg_allowed' => true,
                ],
            ];
        }

        return Inertia::render('Halls/Book', [
            'hall' => $hall,
            'selectedDate' => $request->query('date'),
            'selectedSlot' => $request->query('slot', 'full_day'),
        ]);
    }

    public function checkout(Request $request, $hallId)
    {
        $hall = Hall::with(['pricing', 'policy'])->findOrFail($hallId);

        $request->validate([
            'event_type' => 'required|string',
            'event_date' => 'required|date',
            'slot' => 'required|string',
            'guest_count' => 'required|integer|min:1',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_email' => 'required|email',
        ]);

        $slotPrices = [
            'morning' => $hall->pricing->morning_price ?? ($hall->pricing->base_price * 0.4),
            'evening' => $hall->pricing->evening_price ?? ($hall->pricing->base_price * 0.6),
            'full_day' => $hall->pricing->full_day_price ?? $hall->pricing->base_price,
        ];

        $baseRent = $slotPrices[$request->slot] ?? $hall->pricing->base_price;
        $securityDeposit = $hall->pricing->security_deposit ?? 5000;
        $totalAmount = $baseRent + $securityDeposit;
        $advancePayable = $totalAmount * 0.4; // 40% advance

        return Inertia::render('Halls/Checkout', [
            'hall' => $hall,
            'bookingData' => $request->all(),
            'costs' => [
                'baseRent' => $baseRent,
                'securityDeposit' => $securityDeposit,
                'totalAmount' => $totalAmount,
                'advancePayable' => $advancePayable,
            ]
        ]);
    }

    public function processPayment(Request $request, $hallId)
    {
        $hall = Hall::findOrFail($hallId);

        $validated = $request->validate([
            'event_type' => 'required|string',
            'event_date' => 'required|date',
            'slot' => 'required|string',
            'guest_count' => 'required|integer',
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_email' => 'required|email',
            'special_requirements' => 'nullable|string',
            'total_amount' => 'required|numeric',
            'advance_amount' => 'required|numeric',
            'promo_code' => 'nullable|string',
        ]);

        $bookingCode = 'BK-' . strtoupper(Str::random(6));

        // Create Booking
        $booking = Booking::create([
            'booking_code' => $bookingCode,
            'hall_id' => $hall->id,
            'vendor_id' => $hall->vendor_id,
            'customer_id' => auth()->id(),
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'],
            'event_type' => $validated['event_type'],
            'event_date' => $validated['event_date'],
            'slot' => $validated['slot'],
            'guest_count' => $validated['guest_count'],
            'booking_amount' => $validated['total_amount'],
            'advance_amount' => $validated['advance_amount'],
            'remaining_amount' => $validated['total_amount'] - $validated['advance_amount'],
            'payment_status' => 'partial',
            'status' => 'pending',
            'booking_type' => 'online',
            'notes' => $validated['special_requirements'],
        ]);

        // Create Payment Record
        Payment::create([
            'transaction_id' => 'TXN-' . strtoupper(Str::random(10)),
            'booking_id' => $booking->id,
            'user_id' => auth()->id(),
            'amount' => $validated['advance_amount'],
            'payment_method' => 'Razorpay Simulated',
            'status' => 'completed',
        ]);

        // Lock Date Slot on Hall Availability
        HallAvailability::create([
            'hall_id' => $hall->id,
            'date' => $validated['event_date'],
            'slot' => $validated['slot'],
            'status' => 'pending',
            'booking_id' => $booking->id,
            'reason' => 'Online Customer Reservation (Pending)',
        ]);

        ActivityLog::log('Customer Online Booking', 'Bookings', "Created pending booking #{$bookingCode} for hall {$hall->name}");

        return redirect()->route('customer.bookings.show', $booking->id)
            ->with('success', '🎉 Booking request sent successfully! Awaiting vendor approval.');
    }

    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = Booking::with(['hall.media', 'vendor'])
            ->where('customer_id', auth()->id());

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $bookings = $query->latest()->get();

        return Inertia::render('Customer/Bookings/Index', [
            'bookings' => $bookings,
            'currentFilter' => $status,
        ]);
    }

    public function show($id)
    {
        $booking = Booking::with(['hall.pricing', 'hall.policy', 'vendor', 'customer'])
            ->where('customer_id', auth()->id())
            ->findOrFail($id);

        return Inertia::render('Customer/Bookings/Show', [
            'booking' => $booking,
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $request->validate(['reason' => 'required|string']);

        $booking = Booking::where('customer_id', auth()->id())->findOrFail($id);
        $booking->update([
            'status' => 'cancelled',
            'notes' => "Cancelled by Customer: {$request->reason}",
        ]);

        // Unblock calendar slot
        HallAvailability::where('booking_id', $booking->id)->delete();

        ActivityLog::log('Cancel Booking', 'Bookings', "Customer cancelled booking #{$booking->booking_code}");

        return redirect()->back()->with('success', 'Booking cancelled successfully.');
    }

    public function invoice($id)
    {
        $booking = Booking::with(['hall.vendor', 'customer'])
            ->where('customer_id', auth()->id())
            ->findOrFail($id);

        return Inertia::render('Customer/Bookings/Invoice', [
            'booking' => $booking,
        ]);
    }
}
