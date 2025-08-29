<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleRequest extends FormRequest
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
            'customer_id' => 'nullable|integer|exists:customers,id',
            'sale_date' => 'required|date',
            'grand_total' => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid,unpaid,partial',
            'payment_balance' => 'required|numeric|min:0',
            'payment_method' => 'required|in:mpesa,cash,credit',
            'amount_paid' => 'required|numeric|min:0',
            'sale_items' => 'required|array|min:1',
            'sale_items.*.product_id' => 'required|exists:products,id',
            'sale_items.*.stock_id' => 'required|exists:stocks,id',
            'sale_items.*.sale_quantity' => 'required|numeric|min:0.1',
            'sale_items.*.product_price' => 'required|numeric|min:1',
            'sale_items.*.total_price' => 'required|numeric|min:1',
            'delivery_tag' => 'required',
            'rider_id' => [
                Rule::requiredIf(fn() => $this->boolean('delivery_tag')),

            ],
            'delivery_address' => [
                Rule::requiredIf(fn() => $this->boolean('delivery_tag')),

            ],

        ];
    }

    public function prepareForValidation(){
    }

    public function messages()
    {
        return [
            'customer_id.exists' => 'The selected customer does not exist.',
            'sale_date.required' => 'Please provide the sale date.',
            'sale_items.required' => 'At least one sale item is required.',
            'sale_items.*.product_id.required' => 'Each sale item must have a product.',
            'delivery_tag.required' => 'Please specify if delivery will be done.',
            'rider_id.required_if' => 'A Rider is required when is a delivery.',
            'delivery_address.required_if' => 'Delivery address is required.',
        ];
    }
}
