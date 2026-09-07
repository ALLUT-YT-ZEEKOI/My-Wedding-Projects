<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SubscriptionPlan;
use App\Models\VendorSubscription;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    public function choose()
    {
        $plans = SubscriptionPlan::all();
        $vendorId = auth()->id();

        $currentSubscription = VendorSubscription::where('vendor_id', $vendorId)
            ->where('status', 'active')
            ->latest()
            ->first();

        return Inertia::render('Subscription/Choose', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription
        ]);
    }

    public function processDummyPayment(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
        ]);

        $plan = SubscriptionPlan::find($request->plan_id);
        $user = $request->user();

        // Create dummy subscription
        $user->vendorSubscriptions()->create([
            'plan_id' => $plan->id,
            'start_date' => Carbon::now()->toDateString(),
            'end_date' => Carbon::now()->addYear()->toDateString(),
            'status' => 'active',
            'payment_id' => 'PAY-SUB-' . strtoupper(Str::random(8))
        ]);

        return redirect()->route('vendor.dashboard')->with('success', 'Founding Vendor Subscription activated successfully!');
    }
}
