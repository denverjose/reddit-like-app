<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'thread_id',
        'author',
        'body',
        'parent_id',
    ];

    /* ----------------------------- */
    /* RELATIONSHIPS */
    /* ----------------------------- */
    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function repliesRecursive(): HasMany
    {
        return $this->replies()->with(['repliesRecursive', 'votes']);
    }

    public function votes()
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    /* ----------------------------- */
    /* ACCESSORS / COMPUTED FIELDS */
    /* ----------------------------- */
    public function getTotalVotesAttribute(): int
    {
        return $this->relationLoaded('votes') 
            ? $this->votes->sum('vote') 
            : (int) $this->votes()->sum('vote');
    }

    public function getRepliesCountAttribute(): int
    {
        return $this->relationLoaded('replies') 
            ? $this->replies->count() 
            : $this->replies()->count();
    }
}