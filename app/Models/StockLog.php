<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockLog extends Model
{

    protected $table = 'stock_update_logs';
    protected $fillable = [
        'stock_id',
        'available',
        'quantity',
        'source',
        'created_by',
        'date'
    ];

    public function stock (){
        return $this->belongsTo(Stock::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
