<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class VendorCustomerController extends Controller
{
    public function index()
    {
        $vendorId = auth()->id();

        $customers = Booking::where('vendor_id', $vendorId)
            ->select(
                'customer_phone',
                'customer_name',
                'customer_email',
                DB::raw('COUNT(id) as total_bookings'),
                DB::raw('SUM(booking_amount) as total_spent'),
                DB::raw('MAX(event_date) as last_event_date')
            )
            ->groupBy('customer_phone', 'customer_name', 'customer_email')
            ->get();

        $history = Booking::where('vendor_id', $vendorId)
            ->with('hall')
            ->latest()
            ->get();

        return Inertia::render('Vendor/Customers/Index', [
            'customers' => $customers,
            'history' => $history
        ]);
    }
}
