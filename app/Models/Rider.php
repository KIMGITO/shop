<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rider extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'created_by',
        'active'
    ];


    public function creator(){
        return $this->belongsTo(User::class, 'created_by');
    }

    public function deliveries(){
        return $this->hasMany(Delivery::class);
    }
}
