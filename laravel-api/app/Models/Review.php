<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'protocol_id',
        'author',
        'rating',
        'feedback',
    ];

    public function protocol()
    {
        return $this->belongsTo(Protocol::class);
    }
}