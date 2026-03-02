<?php

namespace App\Observers;

use App\Models\Vote;
use App\Models\Thread;
use App\Services\TypesenseService;

class VoteObserver
{
    protected TypesenseService $typesense;

    public function __construct(TypesenseService $typesense)
    {
        $this->typesense = $typesense;
    }

    public function created(Vote $vote)
    {
        $this->syncIfThread($vote);
    }

    public function updated(Vote $vote)
    {
        $this->syncIfThread($vote);
    }

    public function deleted(Vote $vote)
    {
        $this->syncIfThread($vote);
    }

    private function syncIfThread(Vote $vote): void
    {
        $votable = $vote->votable;

        if ($votable instanceof Thread) {
            $this->syncThread($votable);
        }

        // If comment vote → sync its thread
        if ($votable instanceof \App\Models\Comment) {
            $this->syncThread($votable->thread);
        }
    }

    private function syncThread(Thread $thread): void
    {
        $thread->load('protocol');

        $this->typesense->upsertThread([
            'id' => (string) $thread->id,
            'title' => $thread->title,
            'body' => $thread->body,
            'author' => $thread->author,
            'protocol_id' => $thread->protocol_id,
            'protocol_title' => $thread->protocol?->title ?? 'Unknown',
            'tags' => is_array($thread->protocol?->tags)
                ? $thread->protocol->tags
                : [],
            'total_votes' => (int) $thread->votes()->sum('vote'),
            'comment_count' => $thread->comments()->count(),
            'created_at' => $thread->created_at->timestamp,
            'updated_at' => now()->timestamp,
        ]);
    }
}