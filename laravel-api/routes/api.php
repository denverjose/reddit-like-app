<?php

use App\Http\Controllers\ProtocolController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;

// Protocols
Route::get('/protocols/search', [ProtocolController::class, 'search']); // search first to avoid conflict
Route::get('/protocols', [ProtocolController::class, 'index']);
Route::post('/protocols', [ProtocolController::class, 'store']);
Route::get('/protocols/{protocol}', [ProtocolController::class, 'show']);
Route::put('/protocols/{protocol}', [ProtocolController::class, 'update']);
Route::delete('/protocols/{protocol}', [ProtocolController::class, 'destroy']);

// Threads
Route::get('/threads', [ThreadController::class, 'globalIndex']); // global listing / search
Route::get('/protocols/{protocol}/threads', [ThreadController::class, 'protocolIndex']); // threads per protocol
Route::post('/protocols/{protocol}/threads', [ThreadController::class, 'store']); // create thread under protocol
Route::get('/threads/{thread}', [ThreadController::class, 'show']); // single thread
Route::put('/threads/{thread}', [ThreadController::class, 'update']); // update thread
Route::delete('/threads/{thread}', [ThreadController::class, 'destroy']); // delete thread

// Comments
Route::get('/threads/{thread}/comments', [CommentController::class, 'index']);
Route::get('/comments/{commentId}/replies', [CommentController::class, 'replies']);
// Route::get('/comments', [CommentController::class, 'index']);
// Route::get('/comments/{id}', [CommentController::class, 'show']);
Route::post('/threads/{threadId}/comments', [CommentController::class, 'store']);
Route::post('/comments/{comment}/replies', [CommentController::class, 'storeReply']);
Route::put('/comments/{comment}', [CommentController::class, 'update']);

Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

// Reviews
// Reviews CRUD
Route::post('/protocols/{protocol}/reviews', [ReviewController::class, 'store']);
Route::put('/reviews/{review}', [ReviewController::class, 'update']);
Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
Route::get('/protocols/{protocol}/reviews', [ReviewController::class, 'index']);

Route::post('/vote', [VoteController::class, 'store']);

use Illuminate\Http\Request;

Route::post('/test-vote', function (Request $request) {
    return response()->json([
        'message' => 'Vote received!',
        'payload' => $request->all()
    ]);
});
// Votes (polymorphic)

