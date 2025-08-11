<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleStock extends Model
{
    // !IMPORTANT: 

    protected $table = 'sales_stocks';

    protected $fillable = [
        'sale_id',
        'stock_id',
        'subtotal',
        'quantity',
    ];
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}
