<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stock extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'product_id',
        'quantity_received',
        'quantity_available',
        'code',
        'date',
        'source',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity_received' => 'decimal:2',
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }


    public function saleStock()
    {
        return $this->hasMany(SaleStock::class);
            
    }

    public function scopeCheckQuantityAvailable($query, $id, $qty){
        return ($qty <= $query->where('id', $id)->value('quantity_available'));
    }

    public function scopeUpdateStock($query, $qty, $stock_id ){
        return $query->where('id', $stock_id)->decrement('quantity_available',$qty);

    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Only generate if it's not already set
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid();
            }
        });
    }

}
