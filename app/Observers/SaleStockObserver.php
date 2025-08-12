<?php

namespace App\Observers;

use App\Models\SaleStock;
use App\Models\Summary;
use App\Models\Stock;

class SaleStockObserver
{
    /**
     * Handle the SaleStock "created" event.
     */
    public function created(SaleStock $saleStock)
    {
        // Update summary
        Summary::updateSummary([
            'stock_id'      => $saleStock->stock_id,
            'summary_date'  => $saleStock->sale->date, 
            'opening_stock' => $saleStock->sale->quantity_available ?? 0,
            'stock_out'     => $saleStock->quantity,
        ]);

        // Decrement stock
        Stock::where('id', $saleStock->stock_id)
            ->decrement('quantity_available', $saleStock->quantity);
    }

    /**
     * Handle the SaleStock "updated" event.
     */
    public function updated(SaleStock $saleStock): void
    {
        
    }

    /**
     * Handle the SaleStock "deleted" event.
     */
    public function deleted(SaleStock $saleStock): void
    {
        //
    }

    /**
     * Handle the SaleStock "restored" event.
     */
    public function restored(SaleStock $saleStock): void
    {
        //
    }

    /**
     * Handle the SaleStock "force deleted" event.
     */
    public function forceDeleted(SaleStock $saleStock): void
    {
        //
    }
}
