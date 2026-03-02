<?php

namespace App\Http\Controllers;

use App\Models\Thread;
use App\Models\Protocol;
use Illuminate\Http\Request;
use App\Http\Requests\ThreadRequest;
use App\Services\TypesenseSyncService;
use Illuminate\Routing\Controller;

class ThreadController extends Controller
{
    protected TypesenseSyncService $syncService;

    public function __construct(TypesenseSyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    /* ----------------------------- */
    /* GLOBAL THREAD LISTING (TYPESENSE SEARCH) */
    /* ----------------------------- */
    public function globalIndex(Request $request)
    {
        $currentUser = $request->header('X-User', 'test-author');

        // ✅ Clean sort mapping
        $sortMap = [
            'recent' => 'created_at:desc',
            'top_voted' => 'total_votes:desc',
        ];

        $sort = $sortMap[$request->query('sort')] ?? 'created_at:desc';

        $searchParams = [
            'q' => $request->query('search', '*'),
            'query_by' => 'title,body,tags',
            'sort_by' => $sort,
            'per_page' => (int) $request->query('per_page', 10),
            'page' => (int) $request->query('page', 1),
            'filter_by' => $request->query('tag')
                ? "tags:={$request->query('tag')}"
                : '',
        ];

        $results = $this->syncService->searchThreads($searchParams);

        $threadIds = collect($results['hits'])
            ->pluck('document.id')
            ->all();

        // Fetch current user's votes for these threads
        $userVotes = \App\Models\Vote::where('author', $currentUser)
            ->whereIn('votable_id', $threadIds)
            ->where('votable_type', Thread::class)
            ->pluck('vote', 'votable_id');

        // Attach user_vote to each hit
        $results['hits'] = collect($results['hits'])
            ->map(function ($hit) use ($userVotes) {
                $threadId = $hit['document']['id'];
                $hit['document']['user_vote'] = $userVotes[$threadId] ?? 0;
                return $hit;
            })
            ->toArray();

        return response()->json($results);
    }

    /* ----------------------------- */
    /* THREADS PER PROTOCOL (DB) */
    /* ----------------------------- */
    public function protocolIndex(Request $request, Protocol $protocol)
    {
        $currentUser = $request->header('X-User', 'test-author'); // or use auth()->user()->id

        $perPage = $request->integer('per_page', 10);

        // Fetch threads with total votes and comments count
        $threads = $protocol->threads()
            ->withCount('comments')
            ->withSum('votes as total_votes', 'vote')
            ->latest()
            ->paginate($perPage);

        // Get all thread IDs on this page
        $threadIds = $threads->pluck('id')->all();

        // Fetch current user's votes for these threads
        $userVotes = \App\Models\Vote::where('author', $currentUser)
            ->whereIn('votable_id', $threadIds)
            ->where('votable_type', Thread::class)
            ->pluck('vote', 'votable_id'); // votable_id => vote (-1, 1)

        // Attach `user_vote` to each thread
        $threads->getCollection()->transform(function ($thread) use ($userVotes) {
            $thread->user_vote = $userVotes[$thread->id] ?? 0; // default 0
            return $thread;
        });

        return response()->json($threads);
    }

    /* ----------------------------- */
    /* SHOW SINGLE THREAD */
    /* ----------------------------- */
    public function show(Thread $thread, Request $request)
    {
        $currentUser = $request->header('X-User', 'test-author');

        $thread->load('protocol', 'votes', 'comments');

        $thread->total_votes = $thread->votes->sum('vote');
        $thread->comments_count = $thread->comments->count();

        $thread->user_vote =
            $thread->votes->firstWhere('author', $currentUser)->vote ?? 0;

        // ✅ Add protocol title
        $thread->protocol_title = $thread->protocol?->title;

        return response()->json($thread);
    }

    /* ----------------------------- */
    /* CREATE THREAD */
    /* ----------------------------- */
    public function store(ThreadRequest $request, Protocol $protocol)
    {
        $thread = $protocol->threads()->create($request->validated());

        // Optional: sync to Typesense
        $this->syncService->syncThread($thread);

        return response()->json([
            'message' => 'Thread created successfully',
            'thread' => $thread,
        ], 201);
    }

    /* ----------------------------- */
    /* UPDATE THREAD */
    /* ----------------------------- */
    public function update(ThreadRequest $request, Thread $thread)
    {
        $thread->update($request->validated());

        $this->syncService->syncThread($thread);

        return response()->json([
            'message' => 'Thread updated successfully',
            'thread' => $thread,
        ]);
    }

    /* ----------------------------- */
    /* DELETE THREAD */
    /* ----------------------------- */
    public function destroy(Thread $thread)
    {
        $thread->delete();

        $this->syncService->deleteThread($thread->id);

        return response()->json([
            'message' => 'Thread deleted successfully',
        ]);
    }
}