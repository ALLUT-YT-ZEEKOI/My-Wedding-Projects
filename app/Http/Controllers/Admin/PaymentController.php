<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['user', 'booking.hall'])->latest()->get();
        $refunds = Refund::with(['user', 'booking.hall'])->latest()->get();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'refunds' => $refunds,
        ]);
    }

    public function processRefund(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'reason' => 'nullable|string|max:255',
        ]);

        $refund = Refund::findOrFail($id);
        $refund->update([
            'status' => $request->status,
            'reason' => $request->reason,
            'processed_at' => now(),
        ]);

        ActivityLog::log('Process Refund', 'Payments', "Refund #{$refund->id} marked as {$request->status}");

        return redirect()->back()->with('success', "Refund has been {$request->status}.");
    }
}
