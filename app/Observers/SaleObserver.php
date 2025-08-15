<?php

namespace App\Observers;

use App\Models\Sale;
use Barryvdh\DomPDF\PDF;
use App\Jobs\GenerateSaleInvoice;
use App\Http\Controllers\InvoiceController;

class SaleObserver
{
    /**
     * Handle the Sale "created" event.
     */
    public function created(Sale $sale): void
    {
        
        GenerateSaleInvoice::dispatch($sale->uuid)
            ->onQueue('invoices')
            ->delay(now()->addSeconds(59)); 
    }

    /**
     * Handle the Sale "updated" event.
     */
    public function updated(Sale $sale): void
    {
        //
    }

    /**
     * Handle the Sale "deleted" event.
     */
    public function deleted(Sale $sale): void
    {
        //
    }

    /**
     * Handle the Sale "restored" event.
     */
    public function restored(Sale $sale): void
    {
        //
    }

    /**
     * Handle the Sale "force deleted" event.
     */
    public function forceDeleted(Sale $sale): void
    {
        //
    }
}
