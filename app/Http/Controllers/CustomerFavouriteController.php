<?php

namespace App\Http\Controllers;

use App\Models\Favourite;
use App\Models\Hall;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerFavouriteController extends Controller
{
    public function toggle(Request $request, $hallId)
    {
        $userId = auth()->id();
        $fav = Favourite::where('user_id', $userId)->where('hall_id', $hallId)->first();

        if ($fav) {
            $fav->delete();
            $status = 'removed';
        } else {
            Favourite::create(['user_id' => $userId, 'hall_id' => $hallId]);
            $status = 'added';
        }

        return redirect()->back()->with('success', "Hall {$status} from your wishlist!");
    }

    public function index()
    {
        $favourites = Favourite::with(['hall.pricing', 'hall.media', 'hall.reviews'])
            ->where('user_id', auth()->id())
            ->get();

        return Inertia::render('Customer/Favourites/Index', [
            'favourites' => $favourites,
        ]);
    }
}
