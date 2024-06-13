<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'idUserExp' => 'required|sometimes|integer',
            'idUserDest' => 'required|sometimes|integer',
            'amount' => 'required|sometimes|integer', 
            'date' => 'required|sometimes|date',
            'type' => 'required|string| sometimes',
            
        ];
    }
}
