<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    use SoftDeletes;
    protected $fillable = ['name', 'unit', 'price_per_unit', 'category', 'is_updaterble',];

    public function getRouteKeyName(){
        
        return 'uuid';
    }


    protected function name()
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => lcfirst($value)
        );
    }
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }



    // check product activeness
    public function scopeActiveStatus($query, $id)
    {
        return $query->where('id', $id)->value('is_active');
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
