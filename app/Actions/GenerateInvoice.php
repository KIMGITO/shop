<?php

namespace App\Actions;

use Barryvdh\DomPDF\Facade\Pdf;

class GenerateInvoice extends BasePdf {

    public $invoice;

    // public function __construct($invoice)
    // {
    //     $this->invoice = $invoice;
    // }

   
    public static function generate()
    {
        
        $logo = self::getCachedLogo();
        $config = self::getConfigSettings();

        // Prepare PDF data
        // $data = [
        //     'invoice' => $this->invoice,
        //     'logo' => $logo,
        //     'config' => $config,
        // ];

        $data = [
            'invoice' => (object)[
                'invoice_number' => 'INV-2024-001',
                'invoice_date' => '2024-01-15',
                'order_number' => 'ORD-2024-001',
                'due_date' => '2024-01-30',
                'sales_person' => 'John Doe',
                'payment_terms' => 'Net 15',

                'customer' => (object)[
                    'name' => 'ABC Company Ltd',
                    'address' => '123 Business Street, Nairobi',
                    'phone' => '0712 345 678',
                    'email' => 'purchasing@abccompany.com',
                    'vat_number' => 'P0512345678'
                ],

                'items' => [
                    (object)[
                        'description' => 'Product A - Premium Quality',
                        'unit_price' => 1500.00,
                        'quantity' => 2,
                        'amount' => 3000.00
                    ],
                    (object)[
                        'description' => 'Product B - Standard Package',
                        'unit_price' => 800.00,
                        'quantity' => 3,
                        'amount' => 2400.00
                    ]
                ],

                'subtotal' => 5400.00,
                'tax_rate' => 16,
                'tax_amount' => 864.00,
                'discount' => 200.00,
                'shipping' => 300.00,
                'total_amount' => 6364.00,
                'notes' => 'Thank you for your order. Please make payment within 15 days.'
            ],

            'logo' => $logo,
            'config' => [
                'phone' => '0700 123 456',
                'email' => 'sales@kaykaysladicha.com',
                'vat_number' => 'P0512345678',
                'bank_name' => 'Equity Bank Kenya',
                'account_name' => 'KAY KAYS LA DICHA',
                'account_number' => '0123456789',
                'bank_branch' => 'Four Ways Branch',
                'swift_code' => 'EQBLKENA'
            ]
        ];


        // Generate PDF
        $pdf = Pdf::loadView('invoices.invoice', $data)
        ->setPaper(['a5'])
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
    
         $state = $pdf->download('invoice.pdf');

        dd($state);

    }

}
