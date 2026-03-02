<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Thread extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'protocol_id',
        'author',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /* ----------------------------- */
    /* RELATIONSHIPS */
    /* ----------------------------- */
    public function protocol()
    {
        return $this->belongsTo(Protocol::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function votes()
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    /* ----------------------------- */
    /* COMPUTED ATTRIBUTES */
    /* ----------------------------- */
    public function getTotalVotesAttribute(): int
    {
        // Use collection if already loaded, otherwise sum query
        return $this->relationLoaded('votes')
            ? $this->votes->sum('vote')
            : (int) $this->votes()->sum('vote');
    }

    public function getCommentsCountAttribute(): int
    {
        return $this->relationLoaded('comments')
            ? $this->comments->count()
            : $this->comments()->count();
    }
}