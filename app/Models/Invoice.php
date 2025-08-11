<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class Invoice extends Model
{
    // generate sale receipt 
    // monthly receipts,

    public function Customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function Sale()
    {
        return $this->belongsTo(Sale::class);
    }

    // In Sale.php
    public static function generateSaleInvoice( $id)
    {
        return view('PDF.sales_pdf');
    }

}
