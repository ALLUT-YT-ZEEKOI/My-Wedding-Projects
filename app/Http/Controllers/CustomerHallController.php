<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Amenity;
use App\Models\Favourite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerHallController extends Controller
{
    public function index(Request $request)
    {
        $query = Hall::with(['pricing', 'media', 'amenities', 'vendor', 'reviews'])
            ->where('status', 'live');

        // Text Location / City Filter
        if ($request->filled('location') && !$request->filled('lat')) {
            $loc = $request->location;
            $query->where(function ($q) use ($loc) {
                $q->where('city', 'like', "%{$loc}%")
                  ->orWhere('location', 'like', "%{$loc}%")
                  ->orWhere('address', 'like', "%{$loc}%");
            });
        }

        // Event Date Filter
        if ($request->filled('date')) {
            $date = $request->date;
            // Exclude halls that are completely booked for the day (e.g. full_day confirmed)
            $query->whereDoesntHave('bookings', function($q) use ($date) {
                $q->where('event_date', $date)
                  ->where('slot', 'full_day')
                  ->where('status', 'confirmed');
            });
        }

        // Guests Capacity Filter
        if ($request->filled('guests')) {
            $guests = (int) $request->guests;
            $query->where('capacity', '>=', $guests);
        }

        // Event Type
        if ($request->filled('event_type')) {
            $type = $request->event_type;
            $query->where(function ($q) use ($type) {
                $q->where('hall_type', 'like', "%{$type}%")
                  ->orWhere('description', 'like', "%{$type}%");
            });
        }

        $halls = $query->get();

        // Distance Filtering (using PHP since SQLite lacks trig functions)
        if ($request->filled('lat') && $request->filled('lng')) {
            $latFrom = (float) $request->lat;
            $lngFrom = (float) $request->lng;
            $radius = $request->filled('radius') ? (float) $request->radius : 25; // default 25km

            $halls = $halls->filter(function ($hall) use ($latFrom, $lngFrom, $radius) {
                if (!$hall->latitude || !$hall->longitude) return false;
                
                // Haversine formula
                $earthRadius = 6371; // km
                $latTo = (float) $hall->latitude;
                $lngTo = (float) $hall->longitude;

                $latDelta = deg2rad($latTo - $latFrom);
                $lngDelta = deg2rad($lngTo - $lngFrom);

                $a = sin($latDelta / 2) * sin($latDelta / 2) +
                     cos(deg2rad($latFrom)) * cos(deg2rad($latTo)) *
                     sin($lngDelta / 2) * sin($lngDelta / 2);
                $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
                $distance = $earthRadius * $c;

                $hall->distance = round($distance, 1);
                return $distance <= $radius;
            });
            
            // Sort by distance
            $halls = $halls->sortBy('distance')->values();
        } else {
            // Sorting if no distance sort is active
            $sort = $request->query('sort', 'recommended');
            if ($sort === 'price_asc') {
                $halls = $halls->sortBy('pricing.price_per_plate_veg')->values();
            } elseif ($sort === 'price_desc') {
                $halls = $halls->sortByDesc('pricing.price_per_plate_veg')->values();
            }
        }

        $allAmenities = Amenity::all();

        // Customer favourites if logged in
        $favouriteHallIds = [];
        if (auth()->check()) {
            $favouriteHallIds = Favourite::where('user_id', auth()->id())->pluck('hall_id')->toArray();
        }

        return Inertia::render('Halls/Index', [
            'halls' => $halls,
            'allAmenities' => $allAmenities,
            'filters' => $request->only(['location', 'lat', 'lng', 'radius', 'date', 'guests', 'event_type', 'sort']),
            'favouriteHallIds' => $favouriteHallIds,
        ]);
    }

    public function show($id)
    {
        $hall = Hall::with(['vendor', 'media', 'amenities', 'pricing', 'policy', 'availabilities', 'reviews.user'])
            ->where('status', 'live')
            ->findOrFail($id);

        $isFavourite = false;
        if (auth()->check()) {
            $isFavourite = Favourite::where('user_id', auth()->id())
                ->where('hall_id', $hall->id)
                ->exists();
        }

        return Inertia::render('Halls/Show', [
            'hall' => $hall,
            'isFavourite' => $isFavourite,
        ]);
    }
}
