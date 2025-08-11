<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Summary extends Model
{

    protected $table = 'summaries';

    protected $fillable = [
        'stock_id',
        'opening_stock',
        'stock_out',
        'closing_stock',
        'summary_date',
    ];



    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }


    public function scopeUpdateSummary($query, array $data)
    {
        $data['opening_stock'] = Stock::where('id', $data['stock_id'])->value('quantity_available');
        $recorded = $this->where([
            ['stock_id', '=', $data['stock_id']],
            ['summary_date', '=', $data['summary_date']],
        ])->exists();

        

        if ($recorded) {
            $this->where([
                ['stock_id', '=', $data['stock_id']],
                ['summary_date', '=', $data['summary_date']],
            ])->update([
                'closing_stock' => DB::raw('closing_stock - ' . $data['stock_out']),
                'stock_out' => DB::raw('stock_out + ' . $data['stock_out'])
            ]);
        } else {
            $data['closing_stock'] = $data['opening_stock'] - $data['stock_out'];

            $this->create($data);
        }
    }

    public function scopeChangeStock($query, $data) {
        $recorded = $this->where([
            ['stock_id', '=', $data['stock_id']],
            ['summary_date', '=', $data['summary_date']],
        ])->exists();

        if ($recorded) {
            $this->where([
                ['stock_id', '=', $data['stock_id']],
                ['summary_date', '=', $data['summary_date']],
            ])->increment('closing_stock', $data['new_stock']);
        }
        return;

    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // if (empty($model->uuid)) {
            //     $model->uuid = Str::uuid();

            // }
        });
    }
}
