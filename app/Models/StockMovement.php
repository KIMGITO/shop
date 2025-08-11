<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'date',
        'opening_stock',
        'stock_in',
        'stock_out',
        'closing_stock',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}
