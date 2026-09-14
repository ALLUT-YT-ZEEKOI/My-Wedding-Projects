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
            ->find($id);

        if (!$hall) {
            $curatedHalls = [
                101 => ['name' => 'The Grand Imperial Banquet', 'city' => 'Kochi', 'area' => 'MG Road', 'capacity' => 1200, 'cover_photo' => 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80', 'base_price' => 35000],
                102 => ['name' => 'Royal Heritage Palace Hall', 'city' => 'Ernakulam', 'area' => 'Palarivattom', 'capacity' => 850, 'cover_photo' => 'https://images.unsplash.com/photo-1545232979-fbf34f5ce948?auto=format&fit=crop&w=1000&q=80', 'base_price' => 48000],
                103 => ['name' => 'Verdant Garden Lawns', 'city' => 'Thrissur', 'area' => 'Round West', 'capacity' => 1500, 'cover_photo' => 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80', 'base_price' => 28500],
                104 => ['name' => 'Sunset Oceanfront Resort & Spa', 'city' => 'Trivandrum', 'area' => 'Kovalam Beach', 'capacity' => 700, 'cover_photo' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80', 'base_price' => 55000],
                105 => ['name' => 'Azure Poolside Pavilion', 'city' => 'Kochi', 'area' => 'Kakkanad', 'capacity' => 600, 'cover_photo' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'base_price' => 32000],
                106 => ['name' => 'Crystal Chandelier Luxury Suite', 'city' => 'Kozhikode', 'area' => 'Beach Road', 'capacity' => 1000, 'cover_photo' => 'https://images.unsplash.com/photo-1561501878-aabd62234533?auto=format&fit=crop&w=1000&q=80', 'base_price' => 42000],
                107 => ['name' => 'Colonial Heritage Estate', 'city' => 'Kottayam', 'area' => 'Kumarakom', 'capacity' => 900, 'cover_photo' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80', 'base_price' => 38000],
                108 => ['name' => 'Lakeside Botanical Lawn', 'city' => 'Alappuzha', 'area' => 'Punnamada', 'capacity' => 1100, 'cover_photo' => 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80', 'base_price' => 30000],
            ];

            $curated = $curatedHalls[$id] ?? $curatedHalls[101];

            $hall = (object) [
                'id' => (int)$id,
                'name' => $curated['name'],
                'city' => $curated['city'],
                'area' => $curated['area'],
                'capacity' => $curated['capacity'],
                'seating_capacity' => (int)($curated['capacity'] * 0.7),
                'dining_capacity' => (int)($curated['capacity'] * 0.35),
                'floating_capacity' => $curated['capacity'],
                'hall_type' => 'Marriage Hall & Convention Center',
                'cover_photo' => $curated['cover_photo'],
                'description' => 'A premier luxury wedding venue featuring central air-conditioned banquet halls, lush outdoor lawns, and state-of-the-art stage and lighting systems.',
                'address' => "Main Road, {$curated['area']}, {$curated['city']}",
                'contact_number' => '+91 1800-LUXE-HALL',
                'pricing' => (object) [
                    'base_price' => $curated['base_price'],
                    'morning_price' => (int)($curated['base_price'] * 0.6),
                    'evening_price' => (int)($curated['base_price'] * 0.8),
                    'full_day_price' => $curated['base_price'],
                    'security_deposit' => 5000,
                ],
                'policy' => (object) [
                    'event_timing' => '08:00 AM - 11:00 PM',
                    'veg_allowed' => true,
                    'non_veg_allowed' => true,
                    'outside_catering_allowed' => true,
                    'alcohol_policy' => 'Permitted with excise license',
                    'music_policy' => 'Allowed till 10:00 PM',
                ],
                'vendor' => (object) ['name' => 'LUXEHALLS Certified Partner'],
                'media' => [],
                'amenities' => [],
                'availabilities' => [],
                'reviews' => [],
                'latitude' => 9.9312,
                'longitude' => 76.2673,
            ];
        }

        $isFavourite = false;
        if (auth()->check() && is_numeric($id)) {
            $isFavourite = Favourite::where('user_id', auth()->id())
                ->where('hall_id', $id)
                ->exists();
        }

        return Inertia::render('Halls/Show', [
            'hall' => $hall,
            'isFavourite' => $isFavourite,
        ]);
    }
}
