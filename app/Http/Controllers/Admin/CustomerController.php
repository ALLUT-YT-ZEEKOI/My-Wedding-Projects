<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = User::role('Customer')->withCount('bookings');

        if ($status === 'active') {
            $query->where('status', 'active');
        } elseif ($status === 'blocked') {
            $query->where('status', 'blocked');
        }

        $customers = $query->latest()->get();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'currentFilter' => $status,
        ]);
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $newStatus = ($user->status === 'blocked') ? 'active' : 'blocked';
        $user->update(['status' => $newStatus]);

        ActivityLog::log('Toggle Customer Status', 'Customers', "Changed user {$user->name} status to {$newStatus}");

        return redirect()->back()->with('success', "Customer is now {$newStatus}.");
    }
}
