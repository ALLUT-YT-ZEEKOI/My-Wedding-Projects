<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Plan;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = Subscription::with('vendorProfile.user')->latest()->get();
        $plans = Plan::all();

        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'plans' => $plans,
        ]);
    }

    public function storePlan(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string|in:monthly,yearly',
            'hall_limit' => 'required|integer|min:1',
            'features' => 'nullable|array',
        ]);

        $plan = Plan::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'billing_cycle' => $validated['billing_cycle'],
            'hall_limit' => $validated['hall_limit'],
            'features' => $validated['features'] ?? [],
        ]);

        ActivityLog::log('Create Subscription Plan', 'Subscriptions', "Created plan {$plan->name}");

        return redirect()->back()->with('success', 'Plan created successfully.');
    }

    public function updatePlan(Request $request, $id)
    {
        $plan = Plan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'billing_cycle' => 'required|string|in:monthly,yearly',
            'hall_limit' => 'required|integer|min:1',
        ]);

        $plan->update($validated);

        ActivityLog::log('Update Plan', 'Subscriptions', "Updated plan {$plan->name}");

        return redirect()->back()->with('success', 'Plan updated successfully.');
    }
}
