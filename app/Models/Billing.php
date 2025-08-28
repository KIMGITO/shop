<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    
    public function sale(){
        return $this->belongsTo(Sale::class);
    }


    public function payment(){
        return $this->belongsTo(Payment::class);
    }
}
