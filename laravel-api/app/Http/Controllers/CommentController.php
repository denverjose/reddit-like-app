<?php

namespace App\Http\Controllers;

use App\Models\Thread;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Requests\CommentRequest;
use App\Services\TypesenseService;
use Illuminate\Routing\Controller;

class CommentController extends Controller
{
    protected TypesenseService $typesense;

    public function __construct(TypesenseService $typesense)
    {
        $this->typesense = $typesense;
    }

    /* ----------------------------- */
    /* TOP-LEVEL COMMENTS */
    /* ----------------------------- */
    public function index(Request $request, $threadId)
    {
        $currentUser = $request->header('X-User', 'test-author');
        $perPage = $request->query('per_page', 5);

        $comments = Comment::where('thread_id', $threadId)
            ->whereNull('parent_id')
            ->withSum('votes as total_votes', 'vote')
            ->with(['votes' => fn($q) => $q->where('author', $currentUser)])
            ->withCount('replies')
            ->latest()
            ->paginate($perPage);

        $comments->getCollection()->transform(fn($comment) => $this->appendUserVote($comment));

        return response()->json($comments);
    }

    /* ----------------------------- */
    /* REPLIES */
    /* ----------------------------- */
    public function replies(Request $request, $commentId)
    {
        $currentUser = $request->header('X-User', 'test-author');
        $perPage = $request->query('per_page', 5);

        $replies = Comment::where('parent_id', $commentId)
            ->withSum('votes as total_votes', 'vote')
            ->with(['votes' => fn($q) => $q->where('author', $currentUser)])
            ->withCount('replies')
            ->latest()
            ->paginate($perPage);

        $replies->getCollection()->transform(fn($reply) => $this->appendUserVote($reply));

        return response()->json($replies);
    }

    /* ----------------------------- */
    /* STORE COMMENT */
    /* ----------------------------- */
    public function store(CommentRequest $request, $threadId)
    {
        $thread = Thread::findOrFail($threadId);

        $comment = $thread->comments()->create([
            ...$request->validated(),
            'parent_id' => null,
        ]);

        return response()->json([
            'message' => 'Comment added',
            'comment' => $comment,
        ], 201);
    }

    /* ----------------------------- */
    /* STORE REPLY */
    /* ----------------------------- */
    public function storeReply(CommentRequest $request, Comment $comment)
    {
        $reply = $comment->replies()->create([
            ...$request->validated(),
            'thread_id' => $comment->thread_id,
        ]);

        return response()->json([
            'message' => 'Reply added',
            'reply' => $reply,
        ], 201);
    }

    /* ----------------------------- */
    /* UPDATE COMMENT/REPLY */
    /* ----------------------------- */
    public function update(CommentRequest $request, Comment $comment)
    {
        $comment->update($request->validated());

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment,
        ]);
    }

    /* ----------------------------- */
    /* DELETE COMMENT/REPLY */
    /* ----------------------------- */
    public function destroy(Comment $comment)
    {
        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }

    /* ----------------------------- */
    /* HELPERS */
    /* ----------------------------- */
    private function appendUserVote(Comment $comment)
    {
        $comment->user_vote = $comment->votes->first()?->vote ?? 0;
        unset($comment->votes);

        return $comment;
    }
}