<?php

namespace App\Observers;

use App\Models\Protocol;
use App\Services\TypesenseSyncService;

class ProtocolObserver
{
    protected TypesenseSyncService $syncService;

    public function __construct(TypesenseSyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    public function saved(Protocol $protocol)
    {
        $this->syncService->syncProtocol($protocol);
    }

    public function deleted(Protocol $protocol)
    {
        $this->syncService->deleteProtocol($protocol->id);
    }
}