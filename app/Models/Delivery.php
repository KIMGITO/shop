<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Rider;

class Delivery extends Model
{

    protected $table = 'deliveries';
    protected $fillable= [
        'sale_id',
        'date',
        'status',
        'note',
        'address',
        'rider_id',
        'created_by',
    ];  

    
    public function sale (){
        return $this->belongsTo(Sale::class);
    }

    public function user(){
        return $this->belongsTo(User::class,'created_by');
    }

    public function rider (){
        return $this->belongsTo(Rider::class);
    }


}
