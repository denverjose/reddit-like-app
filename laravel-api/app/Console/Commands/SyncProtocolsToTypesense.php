<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Protocol;
use App\Services\TypesenseService;

class SyncProtocolsToTypesense extends Command
{
    protected $signature = 'typesense:sync-protocols';
    protected $description = 'Sync all protocols from DB to Typesense';

    public function handle(TypesenseService $typesense)
    {

        $typesense->createCollectionFromJson(database_path('typesense_schema/protocols_schema.json'));

        $protocols = Protocol::with('reviews')->get();

        foreach ($protocols as $protocol) {
            $typesense->upsertProtocol([
                'id' => (string) $protocol->id,
                'title' => $protocol->title,
                'content' => $protocol->content ?? '',
                'tags' => $protocol->tags ?? [],
                'author' => $protocol->author ?? 'Unknown',
                'average_rating' => $protocol->average_rating,
                'review_count' => $protocol->review_count,
                'created_at' => $protocol->created_at->timestamp,
                'updated_at' => $protocol->updated_at->timestamp,
            ]);
        }

        $this->info('All protocols synced to Typesense!');
    }
}