<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Sale;
use Inertia\Inertia;
use App\Models\Summary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Date;

class SummaryController extends Controller
{
    public function index()
    {
        $summaries = Summary::with('stock.product')
            ->orderBy('summary_date', 'desc')
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->summary_date)->toDateString(); // group by date only
            });

      

        return Inertia::render('Summary/Index', [
            'summariesByDate' => $summaries
        ]);
    }


public function show()
{
    $date = Date::today();
    $summaries = Summary::with('stock.product')->where('summary_date', $date)->get();
    return Inertia::render('Summary/Daily', ['summaries' => $summaries]);
}
}
