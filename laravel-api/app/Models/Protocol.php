<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Protocol extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'tags',
        'author',
        'rating', // optional, computed via reviews
    ];

    protected $casts = [
        'tags' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Automatically include these in JSON responses
    protected $appends = [
        'average_rating',
        'review_count',
    ];

    /* ----------------------------- */
    /* RELATIONSHIPS */
    /* ----------------------------- */
    public function threads()
    {
        return $this->hasMany(Thread::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /* ----------------------------- */
    /* ACCESSORS / COMPUTED FIELDS */
    /* ----------------------------- */
    public function getAverageRatingAttribute(): float
    {
        if ($this->relationLoaded('reviews')) {
            return round((float) $this->reviews->avg('rating') ?? 0, 1);
        }
        return round((float) $this->reviews()->avg('rating') ?? 0, 1);
    }

    public function getReviewCountAttribute(): int
    {
        if ($this->relationLoaded('reviews')) {
            return $this->reviews->count();
        }
        return (int) $this->reviews()->count();
    }
}