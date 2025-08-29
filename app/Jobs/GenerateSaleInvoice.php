<?php

namespace App\Jobs;

use App\Http\Controllers\InvoiceController;
use App\Models\Sale;
use Barryvdh\DomPDF\PDF as DomPDF;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class GenerateSaleInvoice implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $maxExceptions = 2;
    public $backoff = [5, 10, 15];
    public $timeout = 120;

    public function __construct(
        protected string $saleUuid
    ) {
        $this->onQueue('invoices');
    }

    public function handle()
    {

    }

    public function failed(\Throwable $exception)
    {
        Log::critical("Invoice generation failed for sale {$this->saleUuid}", [
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);

        Sale::where('uuid', $this->saleUuid)->update([
            'invoice_job_status' => 'failed',
            'invoice_job_error' => $exception->getMessage()
        ]);
    }
}
