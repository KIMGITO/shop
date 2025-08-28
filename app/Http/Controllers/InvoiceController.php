<?php

namespace App\Http\Controllers;

use App\Actions\BasePdf;
use App\Models\Sale;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use NumberFormatter;

class InvoiceController extends Controller
{

    // Add to your InvoiceController
    private static function getCachedLogo()
    {
        static $logo = null;
        if ($logo === null) {
            $logoPath = public_path('images/milky.svg');
            if (file_exists($logoPath)) {
                $logo = base64_encode(file_get_contents($logoPath));
            } else {
                $logo = ''; // Fallback if file missing
            }
        }
        return $logo;
    }

    // In your controller
protected static function getConfigSettings()
{
    static $config = null;
    if ($config === null) {
        $config = [
            'phone' => config('custom.phone'),
            'till_number' => config('custom.till_number')
        ];
    }
    return $config;
}

    // Usage in your method

    // Usage in your method
    public  function show($uuid)
    {
        $sale = Sale::with([
            'payments:id,sale_id,method,amount_paid',
            'saleStock:stock_id,sale_id,quantity,subtotal',
            'saleStock.stock:id,product_id',
            'saleStock.stock.product:id,name,price_per_unit',
            'customer:id,first_name,last_name,phone',
            'user:id,name'
        ])
            ->select(['id', 'uuid', 'invoice_number', 'total', 'balance', 'payment_status', 'user_id', 'customer_id'])
            ->where('uuid', $uuid)
            ->firstOrFail();
        $config = BasePdf::getConfigSettings();
        // Prepare PDF data
        $data = [
            'sale' => $sale,
            'logo' => BasePdf::getCachedLogo(),
            'fmt' => new NumberFormatter('en_KE', NumberFormatter::CURRENCY),
            'count' => $sale->saleStock->count(),
            'date' => now()->format('d/m/Y H:i'),
            'phone' => $config['phone'],
            'till_number' => $config['till_number']
        ];
        $height = min(510 + ($sale->saleStock->count() * 18.4) + ($sale->payments->count() * 12), 800);

        $pdf = PDF::loadView('invoices.sale', $data)
            ->setPaper([0, 0, 226.77, $height])
            ->setOptions([
                'defaultFont' => 'courier',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'isPhpEnabled' => false,
                'dpi' => 96,
                'fontHeightRatio' => 1.1,
                'margin-top' => 0,
                'margin-right' => 0,
                'margin-bottom' => 0,
                'margin-left' => 0,
            ]);

        // Handle paid vs unpaid sales differently
        if ($sale->payment_status === 'paid') {
            // For paid sales: store and return file
            $directory = storage_path('app/public/invoices-pdf');
            File::ensureDirectoryExists($directory);
            $filePath = "{$directory}/{$sale->invoice_number}.pdf";
            $pdf->save($filePath);

            return response()->file($filePath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $sale->invoice_number . '.pdf"'
            ]);
        } else {
            return $pdf->stream("{$sale->invoice_number}.pdf");
        }
    }


   

}
