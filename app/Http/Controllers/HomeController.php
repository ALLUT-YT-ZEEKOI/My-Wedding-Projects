<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Offer;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $popularHalls = Hall::with(['pricing', 'media', 'amenities', 'reviews'])
            ->where('status', 'live')
            ->latest()
            ->take(6)
            ->get();

        $featuredHalls = Hall::with(['pricing', 'media'])
            ->where('status', 'live')
            ->orderBy('capacity', 'desc')
            ->take(4)
            ->get();

        $offers = Offer::where('is_active', true)
            ->orWhere('status', 'active')
            ->take(3)
            ->get();

        $reviews = Review::with(['user', 'hall'])
            ->where('status', 'approved')
            ->latest()
            ->take(4)
            ->get();

        $cities = Hall::where('status', 'live')
            ->whereNotNull('city')
            ->distinct()
            ->pluck('city');

        return Inertia::render('Welcome', [
            'popularHalls' => $popularHalls,
            'featuredHalls' => $featuredHalls,
            'offers' => $offers,
            'reviews' => $reviews,
            'cities' => $cities,
        ]);
    }
}
