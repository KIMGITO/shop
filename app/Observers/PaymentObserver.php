<?php

namespace App\Observers;

use App\Models\Payment;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;

class PaymentObserver
{
    /**
     * Handle the Payment "created" event.
     */
    public function created(Payment $payment): void
    {
        $this->updateSale($payment);
        
    }

    /**
     * Handle the Payment "updated" event.
     */
    public function updated(Payment $payment): void
    {
        // $this->updateSale($payment);
    }

    /**
     * Handle the Payment "deleted" event.
     */
    public function deleted(Payment $payment): void
    {
        //
    }

    /**
     * Handle the Payment "restored" event.
     */
    public function restored(Payment $payment): void
    {
        //
    }

    /**
     * Handle the Payment "force deleted" event.
     */
    public function forceDeleted(Payment $payment): void
    {
        //
    }

    public function updateSale(Payment $payment)
    {
        DB::transaction(function () use ($payment) {
            $sale = $payment->sale()->lockForUpdate()->first(); // Lock the sale for update
            $totalPaid = $payment->amount_paid;
            $newBalance = max($sale->balance - $totalPaid, 0); // Prevent negative balance

            $sale->update([
                'balance' => $newBalance,
                'payment_status' => match (true) {
                    $newBalance == 0 => 'paid',
                    $totalPaid > 0 => 'partial',
                    default => 'unpaid',
                }
            ]);
        });
    }
}
