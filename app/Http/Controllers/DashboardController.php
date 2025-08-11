<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Inertia\Inertia;
use App\Models\Stock;
use App\Models\Payment;
use App\Models\Summary;
use App\Models\Customer;
use App\Models\SaleStock;
use App\Models\DailySummary;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function index($cycle = 'week')
    {
        $today = Carbon::now();

        $salesData = $this->generateChartData($cycle);


        // Inventory status data
        $stock_levels = Stock::with(['product'])->get(['id', 'quantity_received', 'quantity_available', 'source', 'date']);

        $totalCustomers = Customer::count();
        $todaySales = Sale::where('date', $today->toDateString())->sum('total');
        $dailyTarget = 5000;
        $monthlyTarget = 100000;
        $monthlySales = Sale::whereMonth('date', $today->month)->sum('total');
        $newCustomers = Customer::whereDate('created_at', $today)->count();
        $pendingOrders = 3;
        $recentOrders = 4;
        $totalDebts = Sale::sum('balance');
        $debtors = 9;
        $targetAchievement = Sale::whereMonth('date', $today->month)->sum('total') / $monthlyTarget * 100;
        $targetAchievement = number_format($targetAchievement, 2);
        $targetCustomers = 1000;

        return Inertia::render('Dashboard/Index', [
            'totalCustomers' => $totalCustomers,
            'todaySales' => $todaySales,
            'dailyTarget' => $dailyTarget,
            'monthlyTarget' => $monthlyTarget,
            'monthlySales' => $monthlySales,
            'newCustomers' => $newCustomers,
            'pendingOrders' => $pendingOrders,
            'recentOrders' => $recentOrders,
            'totalDebts' => $totalDebts,
            'debtors' => $debtors,
            'targetAchievement' => $targetAchievement,
            'targetCustomers' => $targetCustomers,
            'salesData' => $salesData,
            'currentCycle' => $cycle,
            'flash'=>session('message'),
        ]);
    }

    public function asyncDashboardChartData($cycle = 'week')
    {
        return response()->json([
            'chartData' => $this->generateChartData($cycle),
        ]);
    }

    public function asyncDashboardData()
    {

        $results = $this->generateProductPerformance();
        return response()->json([

            'stockData' => $this->generateStockData(),
            'topProductsData' => $results[0],
            'performanceDuration' => $results[1],
            'debtorsData' => $this->generateDebtorsData(),

        ]);
    }


    private static function generateStockData()
    {
        $stocks = Stock::with('product')->get();
        $stockData = [];

        foreach ($stocks as $stock) {
            $received = $stock->quantity_received ?? 0;
            $available = $stock->quantity_available ?? 0;

            $percentage = ($available * 100) / $received;

            if ($percentage > 55) {
                $status = 'good';
            } elseif ($percentage > 30) {
                $status = 'warning';
            } elseif ($percentage >= 0) {
                $status = 'critical';
            } else {
                $status = 'unknown'; // optional default
            }


            $stockData[] = [
                'id' => $stock->id,
                'item' => $stock->product->name ?? '',
                'received' => $received,
                'stock' => $available,
                'value' => $percentage,
                'unit' => $stock->product->unit ?? 'Units',
                'status' => $status,
                'supplier' => $stock->source ?? 'Two and Eight',
                'lastRestock' => $stock->date ?? '',
            ];
        }

        // usort($stockData, fn($a, $b) => $a['value'] <=> $b['value']);
        return $stockData;
    }
    private static function generateProductPerformance($start = null, $stop = null)
    {
        $start ??=  Carbon::now()->startOfMonth();
        $stop ??= Carbon::now();

        $sales = SaleStock::with(['stock.product'])
            ->whereBetween('created_at', [$start, $stop])
            ->get();

        $grouped = $sales->groupBy('stock_id');

        $product = $grouped->map(
            fn($items) =>
            [
                'id' => $items->first()->stock->id,
                'name' => $items->first()->stock->product->name ?? '',
                'sales' => $items->sum('quantity'),
                'revenue' => $items->sum('subtotal'),
            ]
        )->sortByDesc('revenue')->values();


        $product;

        $results[] = $product;
        $results[] = ['from' => $start, 'to' => $stop];

        return $results;
    }


    private static function generateDebtorsData()
    {
        $debtors = Sale::with(['customer'])
        ->where('balance', '>',0)
        ->orderBy('date','asc' )
        ->get();

        $groupedData = $debtors
            ->groupBy('customer_id')
            ->map(
                function ($debtorsGroup, $customer_id)
                {
                    $name = "{$debtorsGroup->first()->customer->first_name} {$debtorsGroup->first()->customer->last_name}";
                    $since = $debtorsGroup->first()->date;
                    $phone = $debtorsGroup->first()->customer->phone;
                    return [
                        'id' => $customer_id,
                        'since' => $since,
                        'phone' => $phone,
                        'name' => $name,
                        'balance' => $debtorsGroup->sum('balance')
                    ];}
            );
        $debtorsData = [];
            foreach($groupedData as $data){
            $debtorsData[] = [
                'id' => $data['id'],
                'name' => $data['name'],
                'phone' => $data['phone'],
                'since' => $data['since'],
                'balance' => $data['balance']
            ];
            }

        return $debtorsData;
    }



    private static function generateChartData($cycle)
    {
        $today = Carbon::now();

        // Get dashboard chart data from database
        $to = Carbon::now()->endOfDay();
        $from = match ($cycle) {
            'year' => Carbon::now()->subYear()->startOfDay(),
            'month' => Carbon::now()->subMonth()->startOfDay(),
            'week' => Carbon::now()->subWeek()->startOfDay(),
        };

        // Get summarized data grouped by date
        $summary = Summary::with(['stock.product'])
            ->whereBetween('summary_date', [$from, $to])
            ->orderBy('summary_date')
            ->get();

        // Group the summary data based on the cycle
        $groupedSummary = match ($cycle) {
            'year' => $summary->groupBy(function ($item) {
                return Carbon::parse($item->summary_date)->format('Y-m'); // Group by year-month
            }),
            'month' => $summary->groupBy(function ($item) {
                return Carbon::parse($item->summary_date)->format('Y-m-d'); // Group by date
            }),
            'week' => $summary->groupBy(function ($item) {
                return Carbon::parse($item->summary_date)->format('Y-m-d'); // Group by date
            }),
        };

        $chartDays = collect();
        $currentDay = $from->copy();

        while ($currentDay <= $to) {
            $chartDays->push($currentDay->toDateString());

            $currentDay = match ($cycle) {
                'year' => $currentDay->addMonth(),
                'month' => $currentDay->addDay(),
                'week' => $currentDay->addDay(),
            };
        }

        $salesData = [];
        $stocks = Stock::with(['product'])->get();

        foreach ($chartDays as $day) {
            $dayEntry = [];

            // Format the day label based on the cycle
            $dayEntry['day'] = match ($cycle) {
                'year' => Carbon::parse($day)->format('M Y'),
                'month' => Carbon::parse($day)->format('j M'),
                'week' => Carbon::parse($day)->format('D j'),
            };

            // Initialize all products with 0 sales
            foreach ($stocks as $stock) {
                $dayEntry[$stock->product->getAttribute('name')] = 0;
            }

            // Find the matching summary data for this day
            $dayKey = match ($cycle) {
                'year' => Carbon::parse($day)->format('Y-m'),
                'month', 'week' => Carbon::parse($day)->format('Y-m-d'),
            };

            if (isset($groupedSummary[$dayKey])) {
                foreach ($groupedSummary[$dayKey] as $product) {
                    foreach ($stocks as $stock) {
                        if ($product->stock_id == $stock->getKey()) {
                            $amount = $product->stock_out * $stock->product->getAttribute('price_per_unit');
                            $dayEntry[$stock->product->getAttribute('name')] = $amount;
                        }
                    }
                }
            }
            $salesData[] = $dayEntry;
        }

        return $salesData;
    }

    public function quotes(){
        $quotes = Http::get('https://favqs.com/api/qotd');
        return  $quotes->json();
    }
}
