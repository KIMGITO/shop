<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Sale;
use App\Models\Stock;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\SaleStock;
use App\Models\Summary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Traits\Date;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use App\Models\Delivery;
use App\Models\Rider;
use App\Http\Requests\StoreSaleRequest;
use Carbon\Carbon;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'saleStock.stock.product'])->latest()
            ->paginate(6);


        return Inertia::render('Sales/Index', ['sales' => $sales]);
    }

    public function asyncIndex(){
        $sales = Sale::with(['customer', 'saleStock.stock.product'])->latest()
            ->paginate(6);
        return response()->json([
            'sales'=> $sales,
        ]);
    }


    //* FORM TO CREATE SALE:
    public function create()
    {
        $stocks = Stock::with('product')
            ->where('quantity_available', '>', 0)
            ->get();

        $customers = Customer::select(['id', 'first_name', 'home','house_number'])
            ->orderBy('first_name')
            ->get();
        $riders = Rider::all();

        return Inertia::render('Sales/AddSale', [
            'stocksData' => $stocks,
            'customersData' => $customers,
            'ridersData' =>$riders,
        ]);
    }

    public function createAsync(){
        $stocks = Stock::with('product')
            ->where('quantity_available', '>', 0)
            ->get();

        $customers = Customer::select(['id', 'first_name'])
            ->orderBy('first_name')
            ->get();

        return response()->json( [
            'stocks' => $stocks,
            'customers' => $customers
        ]);
    }

    public function store( StoreSaleRequest $request)
    {

        $validated = $request->validated();

        // Credit sale requires a customer
        if ($validated['payment_status'] !== 'paid' && !$validated['customer_id']) {
            return back()->withErrors(['customer_id' => 'For credit sale, customer must be selected.']);
        }

        // Credit method cannot have amount paid > 0
        if ($validated['payment_method'] === 'credit' && $validated['amount_paid'] != 0) {
            return back()->withErrors([
                'payment_status' => 'Invalid payment method.',
                'payment_method' => 'Invalid payment method'
            ]);
        }

        $finalSaleItems = Sale::groupSaleItem($validated['sale_items']);


        $sale_attributes = [
            'customer_id' => $validated['customer_id'],
            'date' => $validated['sale_date'],
            'total' => $validated['grand_total'],
            'balance' => $validated['payment_balance'],
            'payment_status' => $validated['payment_status'],
            'user_id' => Auth::id(),
        ];

        $payment_attributes = [
            'user_id' => Auth::id(),
            'method' => $validated['payment_method'],
            'balance' => $validated['payment_balance'],
            'amount_paid' => $validated['amount_paid'],
            'date' => $validated['sale_date'],
        ];

        $transaction = DB::transaction(function () use ($sale_attributes, $request, $finalSaleItems, $payment_attributes, $validated) {
            $sale = Sale::create($sale_attributes);

            $sale->saleStock()->createMany(
                array_map(function ($item) {
                    return [
                        'subtotal' => (float) $item['total_price'],
                        'stock_id' => $item['stock_id'],
                        'quantity' => (float) $item['sale_quantity'],
                    ];
                }, $finalSaleItems)
            );
           

            if ($validated['payment_status'] !== 'unpaid') {
                $payment_attributes['sale_id'] = $sale->id;
                Payment::create($payment_attributes);
            }
            // check if it has delivery tag and record delivery.
            if ($request['delivery_tag'])
            {

                $delivery = Delivery::create([
                    'sale_id' => $sale->id,
                    'date' => Carbon::now(),
                    'status' => 'pending',
                    'note' => 'No note',
                    'address' => $validated['delivery_address'],
                    'rider_id' =>$validated['rider_id'],
                    'created_by' => Auth::id(),
                ]);
            }

            return true;
        }, 3);

        if(!$transaction){
            return back()->with('error', 'Failed to record sale.');
        }

        return redirect()
            ->route('dashboard')
            ->with('message', 'Sale recorded successfully');
    }

    public function show($uuid)
    {
        $id = Sale::where('uuid', $uuid)->value('id');
        
        $sale = Sale::with(['customer','payments', 'saleStock.stock.product'])
            ->find($id);
        return Inertia::render('Sales/Show', ['sale' => $sale]);
    }

    public function read($id){
        $sale = Sale::with(['customer', 'payments', 'saleStock.stock.product'])->find($id);
        return response()->json([
            'sale' => $sale,
        ]);

    }

    public function credits(){
        $credits =  Sale::with(['customer', 'saleStock.stock.product'])->wherein('payment_status', ['unpaid', 'partial'])->latest()
            ->get();

        return Inertia::render('Credits/Index', ['sales' => $credits]);
    }
}
