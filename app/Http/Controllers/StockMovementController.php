<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Stock;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\StockMovement;

class StockMovementController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->date;
        $products = Product::all();

        foreach ($products as $product) {
            $productId = $product->id;

            // get last closing stock
            $prevMovement = StockMovement::where('product_id', $productId)
                ->where('date', '<', $date)
                ->orderBy('date', 'desc')
                ->first();

            $opening = $prevMovement?->closing_stock ?? 0;

            // stock added on this date
            $stockIn = Stock::where('product_id', $productId)
                ->where('date', $date)
                ->sum('quantity_received');

            // quantity sold on this date
            $stockOut = Sale::where('product_id', $productId)
                ->where('date', $date)
                ->sum('milk_quantity');

            // closing = opening + in - out
            $closing = $opening + $stockIn - $stockOut;

            // upsert
            StockMovement::updateOrCreate(
                ['product_id' => $productId, 'date' => $date],
                [
                    'opening_stock' => $opening,
                    'stock_in' => $stockIn,
                    'stock_out' => $stockOut,
                    'closing_stock' => $closing,
                ]
            );
        }

        return response()->json(['message' => 'Stock movement updated successfully.']);
    }

    public function index(Request $request)
    {
        $date = $request->date ?? now()->toDateString();

        $data = StockMovement::with('product')
            ->where('date', $date)
            ->get();

        return response()->json($data);
    }
}