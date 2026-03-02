<?php

namespace App\Http\Controllers;

use App\Models\Thread;
use App\Models\Comment;
use App\Http\Requests\VoteRequest;
use Illuminate\Routing\Controller;

class VoteController extends Controller
{
    public function store(VoteRequest $request)
    {
        $validated = $request->validated();

        $model = match ($validated['votable_type']) {
            'thread'  => Thread::findOrFail($validated['votable_id']),
            'comment' => Comment::findOrFail($validated['votable_id']),
        };

        $existingVote = $model->votes()
            ->where('author', $validated['author'])
            ->first();


        if ($existingVote && $existingVote->vote == $validated['vote']) {

            $existingVote->delete();
            $userVote = 0;

        } else {

            $model->votes()->updateOrCreate(
                ['author' => $validated['author']],
                ['vote' => $validated['vote']]
            );

            $userVote = (int) $validated['vote'];
        }

        $totalVotes = (int) $model->votes()->sum('vote');

        return response()->json([
            'total_votes' => $totalVotes,
            'user_vote'   => $userVote,
        ]);
    }
}