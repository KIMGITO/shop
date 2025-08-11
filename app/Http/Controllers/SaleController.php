<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Inertia\Inertia;
use App\Models\Stock;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\SaleStock;
use App\Models\Summary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Traits\Date;
use App\Models\Invoice;

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

        $customers = Customer::select(['id', 'first_name'])
            ->orderBy('first_name')
            ->get();

        return Inertia::render('Sales/Add', [
            'stocks' => $stocks,
            'customers' => $customers
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

    public function store(Request $request)
    {

        $validated = $request->validate([
            'customer_id' => 'nullable|integer|exists:customers,id',
            'sale_date' => 'required|date',
            'grand_total' => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid,unpaid,partial',
            'payment_balance' => 'required|min:0',
            'payment_method' => 'required|in:mpesa,cash,credit',
            'amount_paid' => 'required|min:0',
            'sale_items' => 'required|array|min:1',
            'sale_items.*.product_id' => 'required|exists:products,id',
            'sale_items.*.stock_id' => 'required|exists:stocks,id',
            'sale_items.*.sale_quantity' => 'required|numeric|min:0.1',
            'sale_items.*.product_price' => 'required|numeric|min:1',
            'sale_items.*.total_price' => 'required|numeric|min:1',
        ]);
        // ! check  if sale is credit, customer id is a must.

        if ($validated['payment_status'] !== 'paid' && $validated['customer_id'] == null) {
            return back()->withErrors(['customer_id' => 'For credit sale, customer  must be selected.']);
        }
        // check if payment method is  credit but there are some money paid
        
        if($validated['payment_method'] == 'credit' && $validated['amount_paid'] != 0){
            return back()->withErrors(['payment_status' => 'Invalid payment method.', 'payment_method' => 'Invalid payment method']);
        }

       



        $finalSaleItems = Sale::groupSaleItem($validated['sale_items']);

      

        $sale = Sale::create([
            'customer_id' => $validated['customer_id'],
            'date' => $validated['sale_date'],
            'total' => $validated['grand_total'],
            'balance' => $validated['payment_balance'],
            'payment_status' => $validated['payment_status'],
            'user_id' => Auth::user()->id,
        ]);

        if ($sale) {

            foreach ($finalSaleItems as $item) {
                SaleStock::create([
                    'subtotal' => (float) $item['total_price'],
                    'stock_id' => $item['stock_id'],
                    'sale_id' => $sale->id,
                    'quantity' => (float) $item['sale_quantity']
                ]);
                Summary::updateSummary([
                    'stock_id' => $item['stock_id'],
                    'summary_date' => $validated['sale_date'],
                    'opening_stock' => $request['quantity_available'],
                    'stock_out' => $item['sale_quantity'],
                ]);
                Stock::where('id', $item['stock_id'])->decrement('quantity_available', $item['sale_quantity']);
            }

            // payment recording
            if ($validated['payment_status'] !== 'unpaid') {
                $payment = Payment::create(
                    [
                        'sale_id' => $sale->id,
                        'user_id' => Auth::user()->id,
                        'method' => $validated['payment_method'],
                        'balance' => $validated['payment_balance'],
                        'amount_paid' => $validated['amount_paid'],
                        'date' => $validated['sale_date'],
                    ]
                );
                
            }
           
            // Invoice::generateSaleInvoice( $sale->id);
        }
        return redirect()->route('dashboard')->with('message' ,'Sale recorded successfully');
    }

    public function show($uuid)
    {
        $id = Sale::where('uuid', $uuid)->value('id');
        
        $sale = Sale::with(['customer','payment', 'saleStock.stock.product'])
            ->find($id);
        return Inertia::render('Sales/Show', ['sale' => $sale]);
    }

    public function read($id){
        $sale = Sale::with(['customer', 'payment', 'saleStock.stock.product'])->find($id);
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
