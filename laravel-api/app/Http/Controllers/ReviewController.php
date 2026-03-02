<?php

namespace App\Http\Controllers;

use App\Models\Protocol;
use App\Models\Review;
use Illuminate\Routing\Controller;
use App\Http\Requests\ReviewRequest;
use Illuminate\Http\Request;


class ReviewController extends Controller
{
    /* ----------------------------- */
    /* LIST REVIEWS FOR A PROTOCOL */
    /* ----------------------------- */
    public function index(Request $request, Protocol $protocol)
    {
        // Get per_page from query string, default to 2
        $perPage = (int) $request->input('per_page', 2);

        // Paginate reviews, latest first
        $reviews = $protocol->reviews()
            ->latest()
            ->paginate($perPage);

        return response()->json($reviews);
    }

    /* ----------------------------- */
    /* STORE REVIEW */
    /* ----------------------------- */
    public function store(ReviewRequest $request, Protocol $protocol)
    {
        $review = $protocol->reviews()->create($request->validated());

        return response()->json([
            'message' => 'Review created successfully',
            'review' => $review,
        ], 201);
    }

    /* ----------------------------- */
    /* UPDATE REVIEW */
    /* ----------------------------- */
    public function update(ReviewRequest $request, Review $review)
    {
        $review->update($request->validated());

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review,
        ]);
    }

    /* ----------------------------- */
    /* DELETE REVIEW */
    /* ----------------------------- */
    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully',
        ]);
    }
}