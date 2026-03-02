<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Protocol;
use App\Models\Thread;
use App\Models\Comment;
use App\Models\Review;
use App\Models\Vote;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $authorPool = [
            'John Doe',
            'Emily Carter',
            'Michael Smith',
            'Sarah Johnson',
            'David Brown',
            'Olivia Wilson',
            'James Taylor'
        ];

        $tagPool = ['security', 'compliance', 'finance', 'technology', 'innovation', 'management', 'strategy'];

        $sentencePool = [
            'This is a detailed explanation.',
            'We should consider all the options.',
            'The system requires improvement.',
            'Users reported an issue with login.',
            'The protocol ensures data safety.',
            'Performance metrics are above average.',
            'Please review this carefully.'
        ];

        $feedbackPool = [
            'Very helpful and clear.',
            'Could use more detail.',
            'Excellent explanation.',
            'Not very actionable.',
            'Useful but needs improvement.'
        ];

        // Helper for nested comments
        $createNestedComments = function ($thread, $parentId = null, $depth = 0) use (&$createNestedComments, $authorPool, $sentencePool) {

            // Define max replies per depth
            $repliesPerDepth = [
                0 => rand(1, 2), // parent comments
                1 => rand(1, 2), // first-level replies
                2 => rand(1, 2), // second-level replies
                3 => rand(1, 2), // third-level replies
            ];

            if (!isset($repliesPerDepth[$depth]))
                return; // stop recursion

            for ($i = 0; $i < $repliesPerDepth[$depth]; $i++) {
                $comment = Comment::create([
                    'thread_id' => $thread->id,
                    'author' => $authorPool[array_rand($authorPool)],
                    'parent_id' => $parentId,
                    'body' => $sentencePool[array_rand($sentencePool)],
                ]);

                // Recursively create next depth replies
                $createNestedComments($thread, $comment->id, $depth + 1);
            }
        };

        // Create 12 protocols
        for ($p = 0; $p < 12; $p++) {

            $protocol = Protocol::create([
                'title' => $sentencePool[array_rand($sentencePool)],
                'content' => implode(' ', collect($sentencePool)->shuffle()->take(rand(2, 4))->toArray()),
                'author' => $authorPool[array_rand($authorPool)],
                'tags' => collect($tagPool)->shuffle()->take(rand(2, 4))->values()->toArray(),
            ]);

            // Threads per protocol
            $numThreads = rand(1, 6);
            for ($t = 0; $t < $numThreads; $t++) {
                $thread = Thread::create([
                    'title' => $sentencePool[array_rand($sentencePool)],
                    'body' => implode(' ', collect($sentencePool)->shuffle()->take(rand(1, 3))->toArray()),
                    'protocol_id' => $protocol->id,
                    'author' => $authorPool[array_rand($authorPool)],
                ]);

                // Nested comments
                $createNestedComments($thread);
            }

            // Reviews per protocol
            $numReviews = rand(0, 6);
            for ($r = 0; $r < $numReviews; $r++) {
                $review = Review::create([
                    'protocol_id' => $protocol->id,
                    'author' => $authorPool[array_rand($authorPool)],
                    'rating' => rand(1, 5),
                    'feedback' => rand(0, 1) ? $feedbackPool[array_rand($feedbackPool)] : null,
                ]);
            }
        }

        // Votes for threads
        Thread::all()->each(function ($thread) use ($authorPool) {
            $authorsVoted = [];
            foreach ($authorPool as $author) {
                if (rand(0, 1)) {
                    if (!in_array($author, $authorsVoted)) {
                        $authorsVoted[] = $author;
                        Vote::create([
                            'author' => $author,
                            'votable_type' => Thread::class,
                            'votable_id' => $thread->id,
                            'vote' => rand(0, 1) ? 1 : -1
                        ]);
                    }
                }
            }
        });

        // Votes for comments
        Comment::all()->each(function ($comment) use ($authorPool) {
            $authorsVoted = [];
            foreach ($authorPool as $author) {
                if (rand(0, 1)) {
                    if (!in_array($author, $authorsVoted)) {
                        $authorsVoted[] = $author;
                        Vote::create([
                            'author' => $author,
                            'votable_type' => Comment::class,
                            'votable_id' => $comment->id,
                            'vote' => rand(0, 1) ? 1 : -1
                        ]);
                    }
                }
            }
        });
    }
}