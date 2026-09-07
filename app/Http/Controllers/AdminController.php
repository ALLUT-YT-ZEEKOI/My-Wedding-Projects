<?php

namespace App\Http\Controllers;

use App\Models\VendorProfile;
use App\Models\Hall;
use App\Models\User;
use App\Models\Booking;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_vendors' => VendorProfile::count(),
            'pending_vendors' => VendorProfile::where('verification_status', 'pending')->count(),
            'total_halls' => Hall::count(),
            'pending_halls' => Hall::where('status', 'pending_review')->count(),
            'live_halls' => Hall::where('status', 'live')->count(),
            'total_bookings' => Booking::count(),
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'total_customers' => User::role('Customer')->count(),
        ];

        $pendingVendors = VendorProfile::with('user')->where('verification_status', 'pending')->latest()->take(5)->get();
        $pendingHalls = Hall::with('vendor')->where('status', 'pending_review')->latest()->take(5)->get();
        $recentActivities = ActivityLog::with('user')->latest()->take(8)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'pendingVendors' => $pendingVendors,
            'pendingHalls' => $pendingHalls,
            'recentActivities' => $recentActivities,
        ]);
    }

    public function approveVendor(Request $request, $id)
    {
        $vendorProfile = VendorProfile::findOrFail($id);
        $vendorProfile->update(['verification_status' => 'approved']);

        ActivityLog::log('Approve Vendor', 'Vendor Management', "Approved vendor: {$vendorProfile->business_name}");

        return redirect()->back()->with('success', 'Vendor approved successfully.');
    }

    public function approveHall(Request $request, $id)
    {
        $hall = Hall::findOrFail($id);
        $hall->update(['status' => 'live']);

        ActivityLog::log('Approve Hall', 'Hall Management', "Approved hall: {$hall->name}");

        return redirect()->back()->with('success', 'Hall is now live on platform.');
    }
}
