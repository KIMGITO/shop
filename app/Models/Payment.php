<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public $fillable = [
        'sale_id',
        'user_id',
        'method',
        'amount_paid',
        'balance',
        'date',
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function sale (){
        return $this->belongsTo(Sale::class);
    }

    public function user(){
        return $this->hasOne(Payment::class);
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
