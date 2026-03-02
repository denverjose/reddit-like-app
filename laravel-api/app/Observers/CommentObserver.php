<?php

namespace App\Observers;

use App\Models\Comment;
use App\Services\TypesenseService;

class CommentObserver
{
    protected TypesenseService $typesense;

    public function __construct(TypesenseService $typesense)
    {
        $this->typesense = $typesense;
    }

    public function created(Comment $comment)
    {
        $this->syncThread($comment->thread);
    }

    public function updated(Comment $comment)
    {
        $this->syncThread($comment->thread);
    }

    public function deleted(Comment $comment)
    {
        $this->syncThread($comment->thread);
    }

    private function syncThread($thread)
    {
        $thread->load('protocol');

        $this->typesense->upsertThread([
            'id' => (string) $thread->id,
            'title' => $thread->title,
            'body' => $thread->body,
            'author' => $thread->author,
            'protocol_id' => $thread->protocol_id,
            'protocol_title' => $thread->protocol?->title ?? 'Unknown',
            'tags' => is_array($thread->protocol?->tags) ? $thread->protocol->tags : [],
            'total_votes' => (int) $thread->votes()->sum('vote'),
            'comment_count' => $thread->comments()->count(),
            'created_at' => $thread->created_at->timestamp,
            'updated_at' => now()->timestamp,
        ]);
    }
}