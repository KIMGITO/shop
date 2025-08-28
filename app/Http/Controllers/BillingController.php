<?php

namespace App\Http\Controllers;

use App\Actions\BasePdf;
use App\Actions\GenerateInvoice;
use App\Http\Requests\AddPaymentRequest;
use App\Models\Customer;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class BillingController extends Controller
{
    public function index(Request $request)
    {

        $debts = Sale::with('customer')
            ->where('balance', '>', 0)
            ->select(['id', 'uuid', 'invoice_number', 'total', 'balance', 'due_date', 'customer_id'])
            ->get();
        $allBalances = Sale::where('balance', '>', 0)->sum('balance');

        $debts =   $debts->groupBy(function ($debt) {
            return $debt->customer->first_name;
        })
            ->map(function ($items, $customer) {
                $totalBalance = $items->sum('balance');

                return [
                    'total_balance' => $totalBalance,
                    'customer_uuid' => $items->first()->customer->uuid,
                    'customer_id' => $items->first()->customer->id, //get customer id to pass
                    'debts' => $items->groupBy(function ($debt) {
                        return $debt->due_date;
                    }),
                ];
            });


        if ($request->expectsJson()) {
            return response()->json(
                [
                    'data' => $debts,
                    'outstandingBalance' => $allBalances,
                ]
            );
        }

        return Inertia::render('Billed/Index', [
            'customerDebtsData' => $debts,
            'outstandingBalance' => $allBalances,
        ]);
    }


    public function pay(AddPaymentRequest $request)
    {
        $validated = $request->validated();
        $customerId = $validated['id'];
        $amount = $validated['amount'];
        $method = $validated['method'];

        $unpaidInvoices = Sale::where('customer_id', $customerId)
            ->where('balance', '>', 0)
            ->orderBy('date', 'asc')
            ->get();
        try {
            $remainingAmount = $amount;
            $paidInvoices = [];
            foreach ($unpaidInvoices as $invoice) {
                if ($remainingAmount <= 0)
                    break;

                $paymentAmount = min($invoice->balance, $remainingAmount);
                $balance = $invoice->balance - $paymentAmount;
                Payment::create([
                    'sale_id' => $invoice->id,
                    'amountPaid' => $paymentAmount,
                    'user_id' => Auth::user()->id,
                    'method' => $method,
                    'balance' => $balance,
                    'date' => Carbon::today()->toDateString(),

                ]);
                // $invoice->balance = $balance;
                // $invoice->save();
                $remainingAmount -= $paymentAmount;
                $paidInvoices[] = [
                    $invoice->invoice_number => $paymentAmount
                ];
            }

            $message = [];
            if (!empty($paidInvoices)) {
                $counter = 1;
                foreach ($paidInvoices as $invoice) {
                    foreach ($invoice as $number => $amount) {
                        $message[] = "$counter. $number - $amount Ksh";
                        $counter++;
                    }
                }

                $message = "invoices paid<br/>" . implode("<br/>", $message);
            }




            return response([
                'success' => $message
            ]);
        } catch (\Exception $e) {
            $message = $e->getMessage();
            return response()->json([
                $message,
            ], 500);
        }
    }




    public function getCustomerDebts($uuid)
    {




        // Get customer details
        $customer = Customer::where('uuid', $uuid)->firstOrFail();
        $customerId = $customer->id;

        // Get all debts for this specific customer
        $debts = Sale::with(['customer', 'saleStock.stock.product','payments'])
            ->where('customer_id', $customerId)
            ->where('balance', '>', 0)
            ->select(['id', 'uuid', 'invoice_number', 'balance','total', 'date', 'due_date', 'customer_id'])
            ->get();

        
        // Calculate total balance for this customer
        $customerTotalBalance = $debts->sum('balance');

        // Group debts by due date for this customer
        $groupedDebts = $debts->groupBy(function ($debt) {
            return $debt->due_date;
        });

        $description = 'Supply of ';
        $dateDescription = ' ';
        $uniqueProducts = [];
        $uniqueUnit = [];
        $productQuantities = [];
        $amountPaid = 0;
        $cost = [];
        $totalCost = 0;
        $dates = [];
        $info = [];

        foreach ($debts as $debt) {
            $totalCost += $debt->total;
            if (!in_array($debt->date, $dates)) {
                $dates[] = $debt->date;
            }
            
            foreach ($debt->payments as $payment) {
                $amountPaid += $payment->amount_paid;
            }


            foreach ($debt->saleStock as $item) {
                $productId = $item->stock->id;
                $productName = $item->stock->product->name;
                $productUnit = $item->stock->product->unit;
                $price = $item->stock->product->price_per_unit;

                // Track unique products
                $uniqueProducts[$productId] = $productName;
                $uniqueUnit[$productId] = $productUnit;
                $cost[$productId] = $price;

                // Accumulate quantities for each product
                if (!isset($productQuantities[$productId])) {
                    $productQuantities[$productId] = 0;
                }
                $productQuantities[$productId] += $item->quantity;
            }
        }

        

        foreach ($uniqueProducts as $productId => $productName) {

            if (!isset($info[$productId])) {
                $info[$productId] = [
                    'name' => $productName,
                    'quantity' => $productQuantities[$productId],
                    'unit' => $uniqueUnit[$productId],
                    'price' => $cost[$productId],
                    'subTotal' => $productQuantities[$productId] * $cost[$productId],
                    'description' => "Supply of $productQuantities[$productId] $uniqueUnit[$productId] of $productName "

                ];
            }
        }
        
        // Build description with unique products and total quantities
        foreach ($uniqueProducts as $productId => $productName) {

            if (count($uniqueProducts) > 1) {
                if (end($uniqueProducts) === $productName) {
                    $description .= "<p>and </p>";
                }
            }
            $description .= "<p>{$productQuantities[$productId]}{$uniqueUnit[$productId]} of {$productName}</p>";
        }
        if (count($dates) > 2) {
            $min = min($dates);
            $max = max($dates);
            $dateDescription .= "  From date $min to $max";
        } else if (count($dates) == 2) {
            $start = Carbon::parse($dates[0])->shortDate();
            $end = Carbon::parse($dates[1])->shortDate();
            $dateDescription .= "  On date $start and $end.";
        } else {
            $dateDescription .= " On date $dates[0]";
        }

        $description = rtrim($description, ', ');



        // Prepare the response data

        $responseData = [

            'customer' => [
                'id' => $customer->id,
                'uuid' => $customer->uuid,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'total_balance' => $customerTotalBalance,
            ],
            'products' =>$info,
            'description' => $description,
            'dateDescription' => $dateDescription,
            'debts' => $groupedDebts,
            'amountPaid' =>$amountPaid,
            'totalCost' => $totalCost,
            'outstandingBalance' => $customerTotalBalance,
            'logo' => BasePdf::getCachedLogo(),
            'config' => BasePdf::getConfigSettings(),
            'today' => Carbon::today(),
            'now' => Carbon::now(),
        ];

        return $this->generate($responseData);

        // if ($request->expectsJson()) {
        //     return response()->json([
        //         'data' => $responseData,
        //         'success' => true
        //     ]);
        // }

        // return Inertia::render('Billed/CustomerDebts', [
        //     'customerDebtsData' => $responseData,
        // ]);
    }

    public static function generate($data)
    {





        // Generate PDF
        $pdf = PDF::loadView('invoices.invoice', $data)
            ->setPaper('a5', 'portrait') // or 'landscape'

            ->setOptions([
                'defaultFont' => 'courier',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'isPhpEnabled' => false,
                'dpi' => 96,
                'fontHeightRatio' => 1.1,
                'margin-top' => 0,
                'margin-right' => 0,
                'margin-bottom' => 0,
                'margin-left' => 0,
            ]);
        // dd($pdf);

        return $pdf->stream();
    }
}
