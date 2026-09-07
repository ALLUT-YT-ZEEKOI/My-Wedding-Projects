<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['user', 'hall.vendor'])->latest()->get();

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:approved,hidden']);

        $review = Review::findOrFail($id);
        $review->update(['status' => $request->status]);

        ActivityLog::log('Moderated Review', 'Reviews', "Review #{$review->id} status updated to {$request->status}");

        return redirect()->back()->with('success', "Review marked as {$request->status}.");
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        ActivityLog::log('Delete Review', 'Reviews', "Deleted review #{$id}");

        return redirect()->back()->with('success', 'Review deleted.');
    }
}
