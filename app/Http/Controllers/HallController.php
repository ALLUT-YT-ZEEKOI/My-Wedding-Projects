<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class HallController extends Controller
{
    public function index()
    {
        $halls = auth()->user()->halls()->with('pricing')->get();
        return Inertia::render('Halls/Index', [
            'halls' => $halls
        ]);
    }

    public function create()
    {
        return Inertia::render('Halls/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:0',
            // 'photos.*' => 'image|max:2048'
        ]);

        $hall = auth()->user()->halls()->create([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'location' => $request->location,
            'status' => 'pending_review'
        ]);

        $hall->pricing()->create([
            'base_price' => $request->base_price,
            'pricing_type' => 'per_day'
        ]);

        // Upload logic can go here for Phase 2, stubbed for now
        
        return redirect()->route('vendor.halls.index')->with('success', 'Hall submitted for review successfully.');
    }
}
