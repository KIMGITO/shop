<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PaymentController extends Controller
{


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sale_id' => 'required|exists:sales,id',
            'amount_paid' => 'required|numeric|min:1',
            'method' => 'required',
            'date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $validated = $validator->validate();

        $validated['user_id'] = Auth::user()->id;
        $validated['date'] = Date::now();
        $validated['balance'] = $request['new_balance'];

       
        Payment::create(
            $validated
        );
        // update sale attributes
        $payment_status = $request['new_balance'] == 0 ? 'paid' : 'partial';
        $paid = Sale::where('id', $validated['sale_id'])->update(['balance' => $request['new_balance'], 'payment_status' => $payment_status]);
        if ($paid) {
            return response()->json([
                'message' => 'Payment successful.',
            ]);
        }
        return response()->json([
            'message' => 'Payment failed, please try again.',
        ], 500);
    }
}
