<?php

namespace App\Observers;

use App\Models\Thread;
use App\Services\TypesenseSyncService;

class ThreadObserver
{
    protected TypesenseSyncService $syncService;

    public function __construct(TypesenseSyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    // Auto-sync on create or update
    public function saved(Thread $thread): void
    {
        $this->syncService->syncThread($thread);
    }

    // Auto-remove from Typesense on delete
    public function deleted(Thread $thread): void
    {
        $this->syncService->deleteThread($thread->id);
    }
}