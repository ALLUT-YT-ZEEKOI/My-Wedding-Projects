<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::where('is_active', true)
            ->orWhere('status', 'active')
            ->latest()
            ->get();

        return Inertia::render('Offers/Index', [
            'offers' => $offers,
        ]);
    }
}
