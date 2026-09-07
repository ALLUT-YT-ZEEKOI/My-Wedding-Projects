<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Hall;
use App\Models\VendorSubscription;

class VendorDashboardController extends Controller
{
    public function index()
    {
        $vendorId = auth()->id();

        $halls = Hall::where('vendor_id', $vendorId)->get();

        $totalBookings = Booking::where('vendor_id', $vendorId)->count();
        $upcomingEvents = Booking::where('vendor_id', $vendorId)
            ->where('event_date', '>=', now()->toDateString())
            ->where('status', 'confirmed')
            ->count();

        $pendingBookings = Booking::where('vendor_id', $vendorId)
            ->where('status', 'pending')
            ->count();

        $completedBookings = Booking::where('vendor_id', $vendorId)
            ->where('status', 'completed')
            ->count();

        $monthlyRevenue = Booking::where('vendor_id', $vendorId)
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereMonth('event_date', now()->month)
            ->sum('booking_amount');

        $activeSubscription = VendorSubscription::where('vendor_id', $vendorId)
            ->where('status', 'active')
            ->with('subscriptionPlan')
            ->first();

        $recentBookings = Booking::where('vendor_id', $vendorId)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Vendor/Dashboard', [
            'metrics' => [
                'totalBookings' => $totalBookings,
                'upcomingEvents' => $upcomingEvents,
                'pendingBookings' => $pendingBookings,
                'completedBookings' => $completedBookings,
                'monthlyRevenue' => $monthlyRevenue,
                'hallsCount' => $halls->count(),
                'subscriptionStatus' => $activeSubscription ? 'Active (Founding Vendor Plan)' : 'Trial / Pending Subscription'
            ],
            'recentBookings' => $recentBookings,
            'halls' => $halls,
        ]);
    }
}
