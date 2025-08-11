<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class InvoiceController extends Controller
{
    public function show($uuid){

        $sale = Sale::with(['payment',  'saleStock.stock.product', 'customer', 'user'])

        ->where('uuid', $uuid)->first();
        // dd($sale->customer);
        $items = $sale->saleStock;
        $payment = $sale->payment;
        $height = 510 + $items->count() * 18.4 + $payment->count()*12;
        $height = $height > 800 ? 800 : $height;

        // dd($sale);
        $pdf = PDF::loadView('Invoices.sale_invoice', ['sale'=> $sale])->setPaper([0, 0, 226.77, $height])
            ->setOption('margin-top', 0)
            ->setOptions([
                'defaultFont' => 'Helvetica',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'margin-top' => 0,
                'margin-right' => 0,
                'margin-bottom' => 0,
                'margin-left' => 0,
            ]);

        // dd($sale->invoice_number);
        return $pdf->stream("{$sale->invoice_number}.pdf");

        // Invoice::generateSaleInvoice(10);
    }
}
