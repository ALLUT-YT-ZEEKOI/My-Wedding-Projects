<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hall;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HallController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = Hall::with('vendor');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $halls = $query->latest()->get();

        return Inertia::render('Admin/Halls/Index', [
            'halls' => $halls,
            'currentFilter' => $status,
        ]);
    }

    public function review($id)
    {
        $hall = Hall::with(['vendor', 'media', 'amenities', 'pricing', 'policy', 'availabilities', 'reviews'])->findOrFail($id);

        return Inertia::render('Admin/Halls/Review', [
            'hall' => $hall,
        ]);
    }

    public function approve($id)
    {
        $hall = Hall::findOrFail($id);
        $hall->update([
            'status' => 'live',
            'rejection_reason' => null
        ]);

        ActivityLog::log('Approve Hall', 'Halls', "Approved hall {$hall->name} and made it Live");

        return redirect()->route('admin.halls.index')->with('success', "Hall '{$hall->name}' is now Live on platform!");
    }

    public function requestChanges(Request $request, $id)
    {
        $request->validate(['reason' => 'required|string|max:500']);

        $hall = Hall::findOrFail($id);
        $hall->update([
            'status' => 'changes_requested',
            'rejection_reason' => $request->reason,
        ]);

        ActivityLog::log('Request Changes for Hall', 'Halls', "Requested changes for hall {$hall->name}");

        return redirect()->route('admin.halls.index')->with('success', 'Changes requested from vendor.');
    }

    public function reject(Request $request, $id)
    {
        $request->validate(['reason' => 'required|string|max:500']);

        $hall = Hall::findOrFail($id);
        $hall->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        ActivityLog::log('Reject Hall', 'Halls', "Rejected hall {$hall->name}");

        return redirect()->route('admin.halls.index')->with('success', 'Hall rejected.');
    }
}
