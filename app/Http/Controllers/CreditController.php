<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
// use App\Models\Credit;
use App\Models\Payment;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Date;

// class CreditController extends Controller
// {
    // public function index()
    // {
    //     $credits = Credit::with([
    //         'sale',
    //         'sale.stock.product',
    //         'sale.customer',

    //     ])->where('is_paid',false)->orderBy('updated_at', 'desc')->get();

    //     return Inertia::render('Credits/Index', ['credits' => $credits]);
    // }

    // public function show($id)
    // {
    //     $credit = Credit::with([
    //         'sale',
    //         'sale.stock.product',
    //         'sale.customer',
    //         'sale.payments',
    //     ])->findOrFail($id);

        

    //     return Inertia::render('Credits/Show',['credit' => $credit]);
    // }

    // public function Invoices(){
    //     $invoices = Credit::with([
    //         'sale',
    //         'sale.stock.product',
    //         'sale.customer',
    //         'sale.payments',])->where('is_paid', false)->get()->groupBy(function (Credit $credit) {
    //             return $credit->sale->customer_id;
    //         });

    //     return Inertia::render('Credits/Invoices', ['invoices' => $invoices]);
    // }



    // public function InvoicePdf()
    // {
        // $invoices = Credit::with([
        //     'sale',
        //     'sale.stock.product',
        //     'sale.customer',
        //     'sale.payments',
        // ])
        //     ->where('is_paid', false)
        //     ->get()
        //     ->groupBy(function (Credit $credit) {
        //         return $credit->sale->customer_id;
        //     });

        // Convert paper size from inches to points (9x20 inches = 648x1440 points)
        // $customPaperSize = [0, 0, 648, 1440]; // Width: 9in (648pt), Height: 20in (1440pt)

        // $pdf = Pdf::loadView('PDF.invoices', ['invoices' => $invoices])
        //     ->setPaper($customPaperSize, 'portrait')
        //     ->setOptions([
        //         'defaultFont' => 'sans-serif',
        //         'isHtml5ParserEnabled' => true,
        //         'isRemoteEnabled' => true,
        //         'isPhpEnabled' => true,
        //         'isFontSubsettingEnabled' => true,
        //         // 'dpi' => 300,
        //     ]);

        // // Generate PDF content
        // $pdfContent = $pdf->output();

        // return response($pdfContent, 200, [
        //     'Content-Type' => 'application/pdf',
        //     'Content-Disposition' => 'inline; filename="unpaid_invoices_report.pdf"',
        //     'Content-Length' => strlen($pdfContent),
        //     'X-Frame-Options' => 'DENY',
        //     'X-Content-Type-Options' => 'nosniff',
        //     'Referrer-Policy' => 'no-referrer-when-downgrade',
        //     'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        //     'Pragma' => 'no-cache',
        //     'Content-Security-Policy' => "frame-ancestors 'none'",
        // ]);
    // }



    // public function clear(Request $request, $id)
    // {
    

        // $validated = $request->validate([
        //     'payment_method' => 'required',
        // ]);

       
       
        /**
         * @var mixed
         * Clear Debt
         */
        // $clear_debt = Payment::create([
        //     'sale_id' => $request['sale_id'],
        //     'credit_id' => $id,
        //     'amount_paid' => $request['amount_paid'],
        //     'balance' => 0,
        //     'reference' => null,
        //     'method' => $validated['payment_method'],
        //     'payment_date' => Date::now(),

        // ]);

        // dd($clear_debt);

        
        

//         return back()->with(['success'=> 'Debt cleared.']);
//     }

   
// }
