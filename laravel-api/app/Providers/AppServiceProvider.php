<?php


namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Models\Protocol;
use App\Models\Thread;
use App\Models\Review;
use App\Models\Comment;
use App\Models\Vote;


use App\Observers\ProtocolObserver;
use App\Observers\ThreadObserver;
use App\Observers\ReviewObserver;
use App\Observers\CommentObserver;
use App\Observers\VoteObserver;




class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Protocol::observe(ProtocolObserver::class);
        Thread::observe(ThreadObserver::class);
        Review::observe(ReviewObserver::class);
        Comment::observe(CommentObserver::class);
        Vote::observe(VoteObserver::class);



    }
}
