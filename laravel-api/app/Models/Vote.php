<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = [
        'author',
        'votable_id',
        'votable_type',
        'vote', // +1 or -1
    ];

    public function votable()
    {
        return $this->morphTo();
    }
}