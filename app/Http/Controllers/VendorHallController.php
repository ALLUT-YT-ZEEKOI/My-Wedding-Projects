<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Amenity;
use App\Models\HallPolicy;
use App\Models\HallPricing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorHallController extends Controller
{
    public function index()
    {
        $halls = auth()->user()->halls()
            ->with(['pricing', 'policy', 'amenities', 'media'])
            ->get();

        $vendorProfile = auth()->user()->vendorProfile;
        $activeSubscription = $vendorProfile ? \App\Models\Subscription::where('vendor_profile_id', $vendorProfile->id)->where('status', 'active')->first() : null;
        
        $hallLimit = 1; // Default
        if ($activeSubscription) {
            $plan = \App\Models\Plan::where('name', $activeSubscription->plan_name)->first();
            if ($plan) {
                $hallLimit = $plan->hall_limit;
            }
        }
        
        $canAddHall = $halls->count() < $hallLimit;

        return Inertia::render('Vendor/Hall/Index', [
            'halls' => $halls,
            'canAddHall' => $canAddHall
        ]);
    }

    private function getHallLimit()
    {
        $vendorProfile = auth()->user()->vendorProfile;
        $activeSubscription = $vendorProfile ? \App\Models\Subscription::where('vendor_profile_id', $vendorProfile->id)->where('status', 'active')->first() : null;
        
        $hallLimit = 1;
        if ($activeSubscription) {
            $plan = \App\Models\Plan::where('name', $activeSubscription->plan_name)->first();
            if ($plan) {
                $hallLimit = $plan->hall_limit;
            }
        }
        return $hallLimit;
    }

    public function create()
    {
        if (auth()->user()->halls()->count() >= $this->getHallLimit()) {
            return redirect()->route('vendor.halls.index')->with('error', 'Subscription limit reached. Please upgrade to add more halls.');
        }

        $allAmenities = Amenity::all();

        return Inertia::render('Vendor/Hall/Create', [
            'allAmenities' => $allAmenities
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->halls()->count() >= $this->getHallLimit()) {
            return redirect()->route('vendor.halls.index')->with('error', 'Subscription limit reached. Please upgrade to add more halls.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'hall_type' => 'required|string',
            'description' => 'required|string',
            'contact_number' => 'required|string',
            'city' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'cover_photo' => 'nullable|image|max:2048',
        ]);

        $coverPhotoPath = null;
        if ($request->hasFile('cover_photo')) {
            $path = $request->file('cover_photo')->store('halls', 'public');
            $coverPhotoPath = '/storage/' . $path;
        }

        $hall = auth()->user()->halls()->create([
            'name' => $request->name,
            'hall_type' => $request->hall_type ?? 'Banquet Hall',
            'description' => $request->description,
            'contact_number' => $request->contact_number,
            'email' => $request->email ?? auth()->user()->email,
            'address' => $request->address,
            'city' => $request->city,
            'area' => $request->area,
            'pincode' => $request->pincode,
            'map_url' => $request->map_url,
            'landmark' => $request->landmark,
            'capacity' => $request->seating_capacity ?? $request->capacity ?? 500,
            'seating_capacity' => $request->seating_capacity,
            'dining_capacity' => $request->dining_capacity,
            'floating_capacity' => $request->floating_capacity,
            'min_guests' => $request->min_guests,
            'max_guests' => $request->max_guests,
            'location' => $request->city . ($request->area ? ', ' . $request->area : ''),
            'status' => 'live',
            'cover_photo' => $coverPhotoPath
        ]);

        $hall->pricing()->create([
            'base_price' => $request->base_price,
            'morning_price' => $request->morning_price ?? $request->base_price * 0.4,
            'evening_price' => $request->evening_price ?? $request->base_price * 0.6,
            'full_day_price' => $request->full_day_price ?? $request->base_price,
            'weekend_price' => $request->weekend_price ?? $request->base_price * 1.2,
            'security_deposit' => $request->security_deposit ?? 10000,
            'pricing_type' => 'per_day'
        ]);

        $hall->policy()->create([
            'event_timing' => $request->event_timing ?? '08:00 AM - 11:00 PM',
            'veg_allowed' => $request->veg_allowed ?? true,
            'non_veg_allowed' => $request->non_veg_allowed ?? true,
            'outside_catering_allowed' => $request->outside_catering_allowed ?? true,
            'outside_decorator_allowed' => $request->outside_decorator_allowed ?? true,
        ]);

        return redirect()->route('vendor.halls.index')->with('success', 'Hall profile created and published successfully.');
    }

    public function edit($id)
    {
        $hall = auth()->user()->halls()
            ->with(['pricing', 'policy', 'amenities', 'media'])
            ->findOrFail($id);

        $allAmenities = Amenity::all();

        return Inertia::render('Vendor/Hall/Edit', [
            'hall' => $hall,
            'allAmenities' => $allAmenities
        ]);
    }

    public function update(Request $request, $id)
    {
        $hall = auth()->user()->halls()->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'cover_photo' => 'nullable|image|max:2048',
        ]);

        $data = $request->only([
            'name', 'hall_type', 'description', 'contact_number', 'email',
            'address', 'city', 'area', 'pincode', 'map_url', 'landmark',
            'capacity', 'seating_capacity', 'dining_capacity', 'floating_capacity',
            'min_guests', 'max_guests', 'video_url'
        ]);

        if ($request->hasFile('cover_photo')) {
            if ($hall->cover_photo && str_starts_with($hall->cover_photo, '/storage/')) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $hall->cover_photo));
            }
            $path = $request->file('cover_photo')->store('halls', 'public');
            $data['cover_photo'] = '/storage/' . $path;
        }

        $hall->update($data);

        if ($request->has('pricing')) {
            $hall->pricing()->updateOrCreate([], $request->pricing);
        }

        if ($request->has('policy')) {
            $hall->policy()->updateOrCreate([], $request->policy);
        }

        if ($request->has('amenities')) {
            $hall->amenities()->sync($request->amenities);
        }

        return redirect()->back()->with('success', 'Hall details updated successfully.');
    }

    public function preview($id)
    {
        $hall = auth()->user()->halls()
            ->with(['pricing', 'policy', 'amenities', 'media', 'vendor'])
            ->findOrFail($id);

        return Inertia::render('Vendor/Hall/Preview', [
            'hall' => $hall
        ]);
    }

    public function storeCustomAmenity(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:amenities,name']);

        $amenity = Amenity::create([
            'name' => $request->name,
            'icon' => 'SparklesIcon'
        ]);

        return redirect()->back()->with('success', 'Custom amenity added successfully.');
    }

    public function destroy($id)
    {
        $hall = auth()->user()->halls()->findOrFail($id);

        if ($hall->cover_photo && str_starts_with($hall->cover_photo, '/storage/')) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete(str_replace('/storage/', '', $hall->cover_photo));
        }

        $hall->delete();

        return redirect()->route('vendor.halls.index')->with('success', 'Hall deleted successfully.');
    }
}
