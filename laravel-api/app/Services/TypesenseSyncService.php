<?php

namespace App\Services;

use App\Models\Protocol;
use App\Models\Thread;

class TypesenseSyncService
{
    protected TypesenseService $typesense;

    public function __construct(TypesenseService $typesense)
    {
        $this->typesense = $typesense;
    }

    /* ----------------------------- */
    /* PROTOCOLS */
    /* ----------------------------- */
    public function syncProtocol(Protocol $protocol): void
    {
        $payload = [
            'id' => (string) $protocol->id,
            'title' => $protocol->title,
            'content' => $protocol->content,
            'tags' => $protocol->tags ?? [],
            'author' => $protocol->author ?? 'Unknown',
            'average_rating' => $protocol->average_rating,
            'review_count' => $protocol->review_count,
            'created_at' => $protocol->created_at->timestamp,
            'updated_at' => $protocol->updated_at->timestamp,
        ];

        $this->typesense->upsertProtocol($payload);
    }

    public function deleteProtocol(int $id): void
    {
        $this->typesense->deleteProtocol($id);
    }

    public function searchProtocols(array $params)
    {
        return $this->typesense->searchProtocols($params);
    }
    // TypesenseSyncService.php

    /* ----------------------------- */
    /* THREADS */
    /* ----------------------------- */
    public function syncThread(Thread $thread): void
    {
        $thread->load('protocol');

        $payload = [
            'id' => (string) $thread->id,
            'title' => $thread->title,
            'body' => $thread->body,
            'author' => $thread->author,
            'protocol_id' => $thread->protocol_id,
            'protocol_title' => $thread->protocol->title ?? 'Unknown',
            'tags' => is_array($thread->protocol->tags) ? $thread->protocol->tags : [],
            'total_votes' => (int) $thread->votes()->sum('vote'),
            'comment_count' => $thread->comments()->count(),
            'created_at' => $thread->created_at?->timestamp ?? now()->timestamp,
            'updated_at' => $thread->updated_at?->timestamp ?? now()->timestamp,
        ];

        $this->typesense->upsertThread($payload);
    }

    public function deleteThread(int|string $id): void
    {
        try {
            $this->typesense->deleteThread($id);
        } catch (\Typesense\Exceptions\ObjectNotFound $e) {
            // Safe to ignore if document doesn't exist
        } catch (\Throwable $e) {
            report($e);
        }
    }
    
    public function searchThreads(array $params)
    {
        return $this->typesense->searchThreads($params);
    }
}


