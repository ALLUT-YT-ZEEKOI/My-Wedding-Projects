<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Favourite;
use App\Models\Notification;
use App\Models\Review;
use App\Models\Hall;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $stats = [
            'total_bookings' => Booking::where('customer_id', $userId)->count(),
            'upcoming_bookings' => Booking::where('customer_id', $userId)->where('status', 'confirmed')->count(),
            'completed_bookings' => Booking::where('customer_id', $userId)->where('status', 'completed')->count(),
            'favourites_count' => Favourite::where('user_id', $userId)->count(),
        ];

        $upcomingBooking = Booking::with(['hall.media', 'vendor'])
            ->where('customer_id', $userId)
            ->where('status', 'confirmed')
            ->latest('event_date')
            ->first();

        $notifications = Notification::where('target_group', 'all')
            ->orWhere('target_group', 'customers')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'stats' => $stats,
            'upcomingBooking' => $upcomingBooking,
            'notifications' => $notifications,
        ]);
    }

    public function storeReview(Request $request, $hallId)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'review_text' => 'required|string|min:5|max:1000',
        ]);

        $hall = Hall::findOrFail($hallId);

        Review::create([
            'hall_id' => $hall->id,
            'vendor_id' => $hall->vendor_id,
            'customer_id' => auth()->id(),
            'customer_name' => auth()->user()->name,
            'rating' => $request->rating,
            'review_text' => $request->review_text,
            'status' => 'approved',
        ]);

        return redirect()->back()->with('success', 'Thank you! Your review has been published.');
    }
}
