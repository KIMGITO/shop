<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sale Invoice</title>
    <style>
        @page {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin: 0;
            padding: 10px 15px;
            line-height: 1.3;
            position: relative; /* Needed for watermark positioning */
        }
        .invoice-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 13px 0;
        }
        /* WATERMARK STYLING */
        .watermark {
            position: absolute;
            /* top: 10%; Center vertically */
            left: 0;
            width: 100%;
            text-align: center;
            z-index: -1; /* Behind all content */
            opacity: 0.1; /* Semi-transparent */
            transform: rotate(-30deg); /* Diagonal orientation */
            font-size: 80px;
            font-weight: bold;
            color: #cccccc;
            pointer-events: none; /* Allows clicking through watermark */
        }
        
        .watermark-logo {
            
            transform: translate(-50%, -50%) rotate(-30deg);
            z-index: -1;
            opacity: 0.06;
            color: green;
            width: 300px;
            height: auto;
            filter: grayscale(100%);
        }

        .watermark-1{
            position: absolute;
            top: 30%;
            left: 50%;
        }

        .watermark-2{
            position: absolute;
            top: 90%;
            left: 50%;
        }
        
        .header {
            text-align: center;
            margin-bottom: 10px;
            position: relative; /* Ensures watermark stays behind */
        }
        
        .logo {
            height: 80px;
            margin-bottom: 5px;
        }
        
        .divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
        }
        
        .double-divider {
            border-top: 3px double #000;
            margin: 8px 0;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .items-table th {
            /* text-align: center; */
            padding-bottom: 3px;
            border-bottom: 1px solid #000;
        }
        
      items-table td {
            padding: 2px 0;
            vertical-align: top;
        }
        
        .col-desc {
            width: 40%;
        }
        
        .col-price {
            width: 15%;
            text-align: right;
            padding-right: 5px;
        }
        
        .col-qty {
            width: 15%;
            text-align: center;
        }
        
        .col-total {
            width: 25%;
            text-align: left;
        }
        
        .totals {
            width: 100%;
            margin-left: auto;
        }
        
        .totals tr td {
            padding: 2px 0;
        }
        
        .totals tr td:first-child {
            text-align: left;
        }
        
        .totals tr td:last-child {
            text-align: right;
            width: 40%;
        }
        
        .bold {
            font-weight: bold;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        .text-left {
            text-align: left;
        }

        .uppercase {
            text-transform: capitalize;

        }
        
        .footer {
            margin-top: 15px;
            font-size: 10px;
            text-align: center;
            position: relative; /* Ensures watermark stays behind */
            position : absolute;
            bottom: 10px;
            left: 20%;
        }
        .space{
            margin-top: 30px;
        }
        .space-sm {
             margin-top: 15px;
        }
        .large{
            font-size: 16px;
            font-weight: bold;
        }
        .green{
           
            color: green;
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>

    <img class="watermark-logo watermark-1" src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/milky.svg'))) }}" alt="Watermark Logo">
    <img class="watermark-logo watermark-2" src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/milky.svg'))) }}" alt="Watermark Logo">
<div class="watermark-logo watermark-1">Hello</div>

    <div class="header">
        <img class="logo" src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/milky.svg'))) }}">
        <div class="bold">KAY KAY'S LA DICHA</div>
        <div>Four Ways Village, Off Kiambu Road</div>
        <div > <span style="font-family: 'DejaVu Sans', sans-serif;">☎</span>  {{ config('custom.phone') }}</div>
        <div class="invoice-title"> Sale Recipt</div>
    </div>

    

    
    <div class="divider"></div>

@php
        $fmt = numfmt_create('en_KE', NumberFormatter::CURRENCY);
      

    @endphp
    
    <!-- Invoice Info -->
    <table width="100%">
        <tr>
            <td>Invoice: <span class="bold">{{ $sale->invoice_number }}</span></td>
            <td class="text-right">{{ date('d/m/Y H:i') }}</td>
        </tr>
        <tr>
            <td>Cashier: <span class="bold">{{ $sale->user->name }}</span></td>
            <td class="text-right">POS: <span class="bold">1</span></td>
        </tr>
    </table>
    
    <div class="divider"></div>
    
    <!-- Customer Info -->
   @if($sale->customer != null)
    <div class="bold uppercase">Customer: {{ $sale->customer->first_name }} {{ $sale->customer->last_name }}</div>
    <div class="bold">Customer No: {{ $sale->customer->id }}</div>
    <div>Tel: {{ $sale->customer->phone }}</div>
   @else
   <div class="bold uppercase">Customer: Walk In</div>
    {{-- <div class="bold">Customer No: {{ $sale->customer->id }}</div> --}}
    {{-- <div>Tel: {{ $sale->customer->phone }}</div> --}}
   @endif
    
     
    <div class="divider"></div>
    <div>Products Soled: <span class="bold"> {{ $sale->saleStock->count() }}</span></div>
    <!-- Items Table -->
    
    <table class="items-table space-sm">
        <thead>
            <tr>
                <th class="col-desc text-left">Description</th>
                <th class="col-price">Price</th>
                <th class="col-qty">Qty</th>
                <th class="col-total text-right">Amt. Ksh</th>
            </tr>
        </thead>
        <tbody>

            @foreach ($sale->saleStock as $item)
                <tr>
                <td class="col-desc">{{ Str::upper($item->stock->product->name) }}</td>
                <td class="col-price">{{ $item->stock->product->price_per_unit }}</td>
                <td class="col-qty">{{ $item->quantity }}</td>
                <td class="col-total text-right">{{ numfmt_format_currency($fmt,$item->subtotal,'ksh') }}</td>
            </tr>
            @endforeach

            
           
        </tbody>
    </table>
    
    <div class="double-divider"></div>
    
    <!-- Totals Section -->
    <table class="totals">
        <tr>
            <td>Subtotal:</td>
            <td>{{ $sale->total }} Ksh</td>
        </tr>
        <tr>
            <td>Delivery Fee:</td>
            <td>0 Ksh</td>
        </tr>
        <tr>
            <td>Discount (5%):</td>
            <td>-0 Ksh</td>
        </tr>
        <tr>
            <td>VAT (0%):</td>
            <td>0 Ksh</td>
        </tr>
        <tr>
            <td class="bold">TOTAL:</td>
            <td class="bold">{{ $sale->total }} Ksh</td>
        </tr>
        
    </table>

    <div class="divider"></div>

    
    
    <table class="totals">
        @php
            $index = 0;
        @endphp

        <tr>
            <td class="bold">METHOD:</td>
            <td class="bold">REF: NO</td>
            <td class="bold">AMOUNT</td>
        </tr>

        @foreach ($sale->payment as $payment)
            <tr>
                <td>{{ Str::upper($payment->method) }}</td>
                <td>{{ Str::upper('QT9HDI23') }}</td>
                <td>{{ $payment->amount_paid }}</td>
            </tr>
        @endforeach
        
        <tr>
            <td colspan="2">Balance:</td>
        
            <td class="bold">{{ $sale->balance }} Ksh</td>
        </tr>
        <tr>
            <td colspan="2">Status</td>
            <td>{{ $sale->payment_status  }}</td>
        </tr>
        
    </table>
   
    <!-- Footer -->
    <div class="footer ">
         <div class="center space-sm bold"> TILL: {{ config('custom.till_number') }}<br>**********</div>
        <div class="bold green space-sm">Thank you for shopping with us!</div>
        <div class="green space-sm large">KARIBU TENA !</div>
        <div class="space"></div>
        <div>Software by KayKay's</div>
    </div>

</body>
</html>