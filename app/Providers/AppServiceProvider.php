<?php

namespace App\Providers;

use App\Models\SaleStock;
use App\Observers\SaleStockObserver;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

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
        Inertia::share(
            ['appName' => config('app.name')]
        );
        SaleStock::observe(SaleStockObserver::class);
    }
}
