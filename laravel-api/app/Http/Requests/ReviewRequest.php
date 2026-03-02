<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'author' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string',
        ];
    }
}