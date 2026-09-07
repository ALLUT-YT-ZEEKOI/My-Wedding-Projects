<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VendorProfile;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = VendorProfile::with(['user', 'halls', 'subscription']);

        if ($status !== 'all') {
            $query->where('verification_status', $status);
        }

        $vendors = $query->latest()->get();

        return Inertia::render('Admin/Vendors/Index', [
            'vendors' => $vendors,
            'currentFilter' => $status,
        ]);
    }

    public function show($id)
    {
        $vendor = VendorProfile::with(['user', 'halls', 'subscription', 'halls.bookings'])->findOrFail($id);

        return Inertia::render('Admin/Vendors/Show', [
            'vendor' => $vendor,
        ]);
    }

    public function approve($id)
    {
        $vendor = VendorProfile::findOrFail($id);
        $vendor->update(['verification_status' => 'approved', 'rejection_reason' => null]);

        ActivityLog::log('Approve Vendor', 'Vendors', "Approved vendor {$vendor->business_name}");

        return redirect()->back()->with('success', 'Vendor approved successfully.');
    }

    public function suspend(Request $request, $id)
    {
        $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        $vendor = VendorProfile::findOrFail($id);
        $vendor->update([
            'verification_status' => 'suspended',
            'rejection_reason' => $request->reason ?? 'Suspended by Administrator',
        ]);

        ActivityLog::log('Suspend Vendor', 'Vendors', "Suspended vendor {$vendor->business_name}");

        return redirect()->back()->with('success', 'Vendor suspended.');
    }

    public function activate($id)
    {
        $vendor = VendorProfile::findOrFail($id);
        $vendor->update(['verification_status' => 'approved']);

        ActivityLog::log('Activate Vendor', 'Vendors', "Reactivated vendor {$vendor->business_name}");

        return redirect()->back()->with('success', 'Vendor reactivated.');
    }
}
