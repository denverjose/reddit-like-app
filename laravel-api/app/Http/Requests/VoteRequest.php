<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'votable_type' => 'required|in:thread,comment',
            'votable_id'   => 'required|integer',
            'vote'         => 'required|in:1,-1',
            'author'       => 'required|string|max:255',
        ];
    }
}