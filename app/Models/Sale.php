<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    //!IMPORTANT:

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'date',
        'total',
        'balance',
        'payment_status',
        'due_date',
        'user_id',
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }


    public function saleStock()
    {
        return $this->hasMany(SaleStock::class);
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function payment()
    {
        return $this->hasMany(Payment::class, 'sale_id');
    }

    //! GENERATE  INVOICE NUMBER
    public function scopeGenerateInvoice($query)
    {
        $last = $this->latest('id')->first();
        $number = $last ? $last->id + 1 : 1;
        return 'INV-' . str_pad($number, 5, '0', STR_PAD_LEFT);
    }

    //! GROUP SIMILAR PRODUCT TO ONE SALE
    public function scopeGroupSaleItem($query, $saleItems)
    {

        $grouped = [];

        foreach ($saleItems as $item) {
            $key = $item['product_id'] . '-' . $item['stock_id'];

            if (!isset($grouped[$key])) {
                $grouped[$key] = $item;
            } else {
                // Sum quantities and totals
                $grouped[$key]['sale_quantity'] += (float) $item['sale_quantity'];
                $grouped[$key]['total_price'] += (float) $item['total_price'];
            }
        }
        return  array_values($grouped);
    }



    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Only generate if it's not already set
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid();
            }
            if (empty($model->invoice_number)) {
                $model->invoice_number = self::generateInvoice();
            }
            $model->due_date = (empty($model->due_date) && $model->customer && ($model->payment_status != 'paid')) ?
                self::calculateDueDate($model->customer->bill_cycle)  : null;
        });
    }
    protected static function calculateDueDate($bill_cycle)
    {
        $now = Carbon::now();
        return match ($bill_cycle) {
            'daily' => $now->addHours(3),
            'weekly' => $now->endOfWeek(),
            'monthly' => $now->endOfMonth(),
        };
    }
}
