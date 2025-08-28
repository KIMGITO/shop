<?php

namespace App\Providers;

use App\Models\Payment;
use App\Models\Sale;
use App\Models\SaleStock;
use App\Observers\PaymentObserver;
use App\Observers\SaleObserver;
use App\Observers\SaleStockObserver;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Carbon\Carbon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Carbon::macro('shortDate', function () {
            return Carbon::format('j M,Y');
        });
        Inertia::share(
            ['appName' => config('app.name')]
        );
        SaleStock::observe(SaleStockObserver::class);
        Sale::observe(SaleObserver::class);
        Payment::observe(PaymentObserver::class);
    }
}
