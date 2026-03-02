<?php

namespace App\Observers;

use App\Models\Review;
use App\Services\TypesenseSyncService;

class ReviewObserver
{
    protected TypesenseSyncService $syncService;

    public function __construct(TypesenseSyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    public function created(Review $review): void
    {
        $this->syncProtocol($review);
    }

    public function updated(Review $review): void
    {
        $this->syncProtocol($review);
    }

    public function deleted(Review $review): void
    {
        $this->syncProtocol($review);
    }

    private function syncProtocol(Review $review): void
    {
        $protocol = $review->protocol;

        // SQL aggregation, avoid loading all reviews
        $protocol->average_rating = round($protocol->reviews()->avg('rating') ?? 0, 1);
        $protocol->review_count = $protocol->reviews()->count();

        $this->syncService->syncProtocol($protocol);
    }
}