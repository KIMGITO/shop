<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Models\Sale;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{

    public function store(StorePaymentRequest $request)
    {
        $validated = $request->validated();
        $sale = Sale::findOrFail($validated['sale_id']);
        $balance = max($validated['amount_paid'] - $sale['balance'],0);

      
        $validated['user_id'] = Auth::user()->id;
        $validated['date'] = Date::now();
        $validated['balance'] = $balance;
       
        $record = DB::transaction(function () use($validated) {
            return Payment::create(
                $validated
            );
        },3);

        if ($record) {
            return response()->json([
                'message' => 'Payment successful.',
            ]);
        }
        return response()->json([
            'message' => 'Payment failed, try again.',
        ], 500);
    }
}
