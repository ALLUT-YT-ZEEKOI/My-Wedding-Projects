<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorFinanceController extends Controller
{
    public function index()
    {
        $vendorId = auth()->id();

        $todayRevenue = Booking::where('vendor_id', $vendorId)
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereDate('created_at', now()->toDateString())
            ->sum('advance_amount');

        $thisMonthRevenue = Booking::where('vendor_id', $vendorId)
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereMonth('event_date', now()->month)
            ->sum('booking_amount');

        $thisYearRevenue = Booking::where('vendor_id', $vendorId)
            ->whereIn('status', ['confirmed', 'completed'])
            ->whereYear('event_date', now()->year)
            ->sum('booking_amount');

        $totalRevenue = Booking::where('vendor_id', $vendorId)
            ->whereIn('status', ['confirmed', 'completed'])
            ->sum('booking_amount');

        $pendingAmount = Booking::where('vendor_id', $vendorId)
            ->whereIn('status', ['confirmed', 'pending'])
            ->sum('remaining_amount');

        $transactions = Booking::where('vendor_id', $vendorId)
            ->with('hall')
            ->latest()
            ->get();

        return Inertia::render('Vendor/Finance/Index', [
            'revenueStats' => [
                'todayRevenue' => $todayRevenue,
                'thisMonthRevenue' => $thisMonthRevenue,
                'thisYearRevenue' => $thisYearRevenue,
                'totalRevenue' => $totalRevenue,
                'pendingAmount' => $pendingAmount,
            ],
            'transactions' => $transactions
        ]);
    }
}
