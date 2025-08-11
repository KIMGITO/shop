<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Show all products
    public function index()
    {
        $products = Product::latest()->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    // Show create form
    public function create()
    {
        return Inertia::render('Products/Add');
    }

    // Store new product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'unit' => ['required', 'string'],
            'price_per_unit' => ['required', 'numeric', 'min:1'],
            'is_active' => ['boolean'],
            'is_updaterble' => ['boolean'],
        ]);

        Product::create($validated);

        return to_route('dashboard')->with('success', 'Product added.');
    }

    // Show edit form
    public function edit(Product $product)
    {
        

        return Inertia::render('Products/Add', [
            'initialData' => $product,
        ]);
    }

    // Update product
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'unit' => ['required', 'string'],
            'price_per_unit' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $product->update($validated);

        return to_route('dashboard')->with('message', 'Product updated.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('product.index')->with(['product' => 'Product deleted', 'undo_id' => $product->id]);
    }

    public function undo($id)
    {

        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();


    return redirect()->route('product.index')->with('success', 'Product restored.');
    }

    // Optional: Toggle is_active or soft delete
    public function toggle(Product $product)
    {
        $product->is_active = !$product->is_active;
        $product->save();

        return to_route('dashboard')->with('message', 'Product status updated.');
    }
}
