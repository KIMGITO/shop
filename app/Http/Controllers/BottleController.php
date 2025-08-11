<?php

namespace App\Http\Controllers;

use App\Models\Bottle;
use Illuminate\Http\Request;

class BottleController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'size' => 'required|string',
            'price' => 'required|numeric|min:0',
        ]);

        $bottle = Bottle::create($request->only('size', 'price'));

        return response()->json(['message' => 'Bottle added', 'bottle' => $bottle]);
    }
}
