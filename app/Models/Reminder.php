<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'updated_by',
        'repeat',
        'show_on',
        'complete',
    ];

    
}
