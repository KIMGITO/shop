<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/api/chart-data', [DashboardController::class, 'chartData'])
    ->name('dashboard.chart')
    ->where('cycle', 'year|month|week');