<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::latest()->get();

        return Inertia::render('Admin/Offers/Index', [
            'offers' => $offers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:offers,code|max:50',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:1',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after_or_equal:valid_from',
            'max_uses' => 'nullable|integer|min:1',
        ]);

        $offer = Offer::create($validated);

        ActivityLog::log('Create Offer Code', 'Offers', "Created promo code {$offer->code}");

        return redirect()->back()->with('success', "Offer code '{$offer->code}' created successfully!");
    }

    public function toggleStatus($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->update(['is_active' => !$offer->is_active]);

        ActivityLog::log('Toggle Offer Status', 'Offers', "Toggled offer status for {$offer->code}");

        return redirect()->back()->with('success', 'Offer status updated.');
    }

    public function destroy($id)
    {
        $offer = Offer::findOrFail($id);
        $offer->delete();

        ActivityLog::log('Delete Offer', 'Offers', "Deleted promo code #{$id}");

        return redirect()->back()->with('success', 'Offer code deleted.');
    }
}
