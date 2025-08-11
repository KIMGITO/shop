<?php

namespace App\Models;


use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Customer extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'email',
        'home',
        'house_number',
        'note',
        'bill_cycle',
        
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }


    protected function billDuration (){
        
        return Attribute::make(
            get: fn ($value) => ucfirst($value),
            set: fn ($value) => Str::lower($value)

        );
        
    }

    protected function name()
    {
        return Attribute::make(
            get: fn(string $value) => ucfirst($value),
            set: fn($value) => Str::lower($value),
        );
    }
    

    public function invoices(){
        return $this->hasMany(Invoice::class);
    }
    


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid();
            }
        });
    }


}
