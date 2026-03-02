<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Thread;
use App\Services\TypesenseService;

class SyncThreadsToTypesense extends Command
{
    protected $signature = 'typesense:sync-threads';
    protected $description = 'Sync all threads from DB to Typesense';

    public function handle(TypesenseService $typesense)
    {
        $typesense->createCollectionFromJson(database_path('typesense_schema/threads_schema.json'));


        $threads = Thread::with('protocol')
            ->withCount('comments')
            ->withSum('votes as total_votes', 'vote')
            ->get();

        foreach ($threads as $thread) {
            $typesense->upsertThread([
                'id' => (string) $thread->id,
                'title' => $thread->title,
                'body' => $thread->body,
                'author' => $thread->author,
                'protocol_id' => $thread->protocol_id,
                'protocol_title' => $thread->protocol?->title ?? 'Unknown',
                'tags' => is_array($thread->protocol?->tags)
                    ? $thread->protocol->tags
                    : [],
                'total_votes' => (int) $thread->total_votes,
                'comment_count' => $thread->comments_count,
                'created_at' => $thread->created_at->timestamp,
                'updated_at' => now()->timestamp,
            ]);
        }

        $this->info('All threads synced to Typesense!');
    }
}