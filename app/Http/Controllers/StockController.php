<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Stock;
use App\Models\Product;
use App\Models\Summary;
use App\Models\StockLog;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

class StockController extends Controller
{
    public function index()
    {
        $stock = Stock::with('product')->get();
        return Inertia::render('Stock/Index', ['stocks' => $stock]);
    }

    public function create()
    {
        $products = Product::where('is_active', true)->latest()->get();

        return Inertia::render('Stock/Add', ['products' => $products]);
    }
    public function store(Request $request)
    {


        $validated =  $request->validate([

            'product_id' => 'required|exists:products,id',
            'quantity_received' => 'required|numeric|min:0.1',
            'date' => 'required|date',
            'source' => 'required|string|min:3',
        ]);

        $validated['quantity_available'] = $validated['quantity_received'];



        $initials = 'KAY';
        if ($validated['source'] != '') {
            $initials = Str::upper(substr($validated['source'], 0, 3));
        }



        // logic for a receipt number
        $validated['code'] = $initials . date('Y.m.d') . Str::random(4);

        // check if product is active 
        if (Product::ActiveStatus($validated['product_id'])) {
            Stock::create($validated);
        } else {
            return redirect()->route('stock.create')->withErrors(['product_id' => $request['product_name'] . ' not active.']);
        }


        $stock_log = StockLog::create(
            [
                'stock_id' => Stock::latest()->first()->id,
                'available' => $validated['quantity_available'],
                'quantity' => $validated['quantity_received'],
                'source' => $validated['source'],
                'created_by' => Auth::id(),
                'date'=> $validated['date'],
            ]

        );

        if(!$stock_log){
            Stock::lates()->first()->delete();
            return redirect()->route('stock.create')->withErrors(['error' => 'Adding stock failed']);
        }

        return redirect()->route('dashboard')->with('message', 'Stock Created Successfully.');
    }

    public function edit(Stock $stock)
    {
        $products = Product::all(['id', 'name']);

        return Inertia::render('Stock/Add', [
            'initialData' => $stock,
            'products' => $products,
        ]);
    }



    public function update(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);

        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity_received' => 'required|numeric|min:0',
            'date' => 'required|date',
            'source' => 'required|string|max:255',
        ]);

        $log_stock = StockLog::create([
            'stock_id' => $stock->id,
            'available' => $stock->quantity_available,
            'quantity' => $data['quantity_received'],
            'source' => $data['source'],
            'created_by' => Auth::id(),
            'date' => $data['date'],
        ]);

      

        $stock->update($data);
        if (! $stock) {
            StockLog::latest()->first()->delete();
            return back()->with('error', 'Failed to update the stock');
        }

        return to_route('dashboard')->with('message', 'Stock updated successfully.');
    }




    public function editQty($id)
    {

        $stock = Stock::with('product')->find($id);


        if (!$stock->product->is_updaterble) {
            return back()->with('error', 'Product quantity is not updatable. Consider adding new stock.');
        }

        return Inertia::render('Stock/Update', [
            'stock' => $stock,
        ]);
    }




    public function updateQty(Request $request,  $id)
    {
        $stock = Stock::find($id)->firstOrFail();

        $validated = $request->validate([
            'quantity' => 'required|numeric|min:0',
            'source' => 'required|string|max:50',
        ]);

        $transaction = DB::transaction(function () use ($stock, $id, $validated) {
            // 1. Create log
            $stock_log = StockLog::create([
                'stock_id'   => $stock->id,
                'available'  => $stock->quantity_available,
                'quantity'   => $validated['quantity'],
                'source'     => $validated['source'],
                'created_by' => Auth::id(),
                'date'       => Carbon::now(),
            ]);

            // 2. Update stock info
            $stock->where('id', $id)->update([
                'date'   => Carbon::now(),
                'source' => $validated['source']
            ]);
            $stock->incrementEach([
                'quantity_available' => $validated['quantity'],
                'quantity_received'  => $validated['quantity']
            ]);

            $summaryData = [
                'stock_id'     => $id,
                'new_stock'    => $validated['quantity'],
                'summary_date' => Date::today(),
            ];

            Summary::changeStock($summaryData);
        }, 3);

        if(!$transaction){
            back()->with('error', 'Failed to update stock. Try again');
        }
        return to_route('dashboard')->with('success', 'Stock quantity updated successfully.');

    }

    public function undo($id)
    {
        $stock = Stock::withTrashed()->findOrFail($id);
        $stock->restore();

        return redirect()->route('stock.index')->with('success', 'Stock restored Successfully.');
    }

    public function destroy($id)
    {
        $stock = Stock::findOrFail($id);
        $stock->delete();

        return redirect()->route('stock.index')->with('success', 'Stock Deleted Successfully.')->with('undo_id', $id);
    }
}
