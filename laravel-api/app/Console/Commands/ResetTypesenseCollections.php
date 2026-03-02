<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TypesenseService;

class ResetTypesenseCollections extends Command
{
    protected $signature = 'typesense:reset';
    
    protected $description = 'Delete all Typesense collections (threads + protocols)';

    public function handle(TypesenseService $typesense)
    {
        $typesense->deleteCollection('threads');
        $typesense->deleteCollection('protocols');

        $this->info('All Typesense collections deleted!');
    }
}