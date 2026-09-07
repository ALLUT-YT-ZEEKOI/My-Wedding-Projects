<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Booking;
use App\Models\Hall;
use App\Models\VendorProfile;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $revenueTotal = Payment::where('status', 'completed')->sum('amount');
        $bookingsCount = Booking::count();
        $hallsCount = Hall::count();
        $vendorsCount = VendorProfile::count();

        $recentLogs = ActivityLog::with('user')->latest()->take(30)->get();

        // Basic analytics aggregations
        $monthlyRevenue = Payment::where('status', 'completed')
            ->selectRaw("strftime('%Y-%m', created_at) as month, sum(amount) as total")
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->take(12)
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'summary' => [
                'revenue' => $revenueTotal,
                'bookings' => $bookingsCount,
                'halls' => $hallsCount,
                'vendors' => $vendorsCount,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'recentLogs' => $recentLogs,
        ]);
    }
}
