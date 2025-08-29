<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Summary - Customer Name</title>
    <style>
        @page { 
            margin: 0; 
            padding: 0; 
        }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            height: 100%;
            color: #222;
            line-height: 1.4;
            font-size: 12px;
        }
        
        .invoice-container {
            margin: 0;
            padding: 15px;
            position: relative;
            overflow: hidden;
        }
        
        .header {
    display: flex;
    width: 100%;
    padding:0px;
    justify-content: space-between; 
    border-bottom: 1px solid #ddd;
}

.company-info {
    width: 50%;
    display: inline-block;
    text-align: left;
}

.invoice-info {
    min-width: 49%;
    display: inline-flex;
    text-align: right;
}

        
        .logo {
            height: 40px;
            margin-bottom: 5px;
            opacity: 0.9;
        }
        
        .company-name {
            font-size: 16px;
            font-weight: bold;
            margin: 3px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .company-details {
            font: 12px/1.3;
            color: #555;
            line-height: 1.3;
        }
        
        
        
        .invoice-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
            text-transform: uppercase;

        }
        
        .invoice-details {
            font-size: 10px;
            color: #555;
        }
        
        .customer-info {
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 3px;
    margin-bottom: 15px;
    display: flex;
    background: #fafafa;
}

.customer-details {
    text-align: left; /* Explicitly set left alignment */
}

.balance-info {
    text-align: right; /* Explicitly set right alignment */
    padding: 8px 10px;
    border-radius: 3px;
}
        
        .section-title {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        
        .divider {
            height: 1px;
            background: #ddd;
            margin: 10px 0;
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 11px;
        }
        
        .table th {
            background-color: #f5f5f5;
            padding: 8px 5px;
            text-align: left;
            font-weight: 600;
            border-bottom: 1px solid #ddd;
        }
        
        .table td {
            padding: 6px 5px;
            border-bottom: 1px solid #eee;
        }
        
        .table tr:last-child td {
            border-bottom: none;
        }
        
        .totals {
            margin-top: 15px;
            text-align: right;
            padding: 10px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            max-width: 250px;
            margin-left: auto;
        }
        
        .total-label {
            font-weight: 600;
            color: #444;
        }
        
        .total-amount {
            font-weight: bold;
        }
        
        .footer {
            position: absolute;
            bottom: 5%;
            left:35%;
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px dashed #ccc;
            font-size: 10px;
            color: #666;
        }
        
        .watermark {
            position: absolute;
            opacity: 0.2;
            z-index: -1;
            font-size: 80px;
            font-weight: bold;
            transform: rotate(-45deg);
            top: 40%;
            left: 5%;
            white-space: nowrap;
            pointer-events: none;
        }
        
        .watermark-logo {
            position: absolute;
            opacity: 0.07;
            z-index: 10;
            width: 300px;
            height: auto;
            transform: rotate(-30deg);
            top: 55%;
            left: 40%;
            margin-left: -100px;
            pointer-events: none;
        }
        
        .thank-you {
            text-align: center;
            margin-top: 5px;
            font-weight: 600;
            font-size: 11px;
            color: green;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .bold {
            font-weight: bold;
        }
        .uppercase{
            text-transform: uppercase;
        }
        .capitalize{
            text-transform: capitalize;
        }
        .summary-divider {
            border-top: 1px solid #ccc;
            margin: 8px 0;
        }
        
        .double-divider {
            border-top: 3px double #ccc;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <img class="watermark-logo" src="data:image/png;base64,{{ $logo }}" alt="Watermark Logo">

    <div class="invoice-container">
        <!-- Watermarks -->
        {{-- <div class="watermark">KAYKAY'S LA DICHA</div> --}}
        
        <!-- Header Section -->
        <div class="header">
            <div class="company-info">
                <div class="company-name">KAYKAY'S LA DICHA</div>
                <div class="company-details">
                   Four Ways Village, Off Kiambu Road<br>
                    <span style="font-family: 'DejaVu Sans', sans-serif;">☎</span>{{ $config['phone'] }} <br/>
                    <span style="font-family: 'DejaVu Sans', sans-serif;height: 50px;">✉</span> info@kaykays.com

                </div>
            </div>
            
            <div class="invoice-info">

    <img height="70px" src="data:image/png;base64,{{ $logo }}" alt="Watermark Logo">

                <div class="invoice-details">
                    Date: {{ $now}} <br>
                </div>
            </div>
        </div>
                <div class="invoice-title text-center">Invoice</div>
        
        <div class="summary-divider"></div>
        
        <!-- Customer Information -->
        <div class="customer-info">
            <div class="customer-details">
                <div class="section-title">Customer Information</div>
                <div class="bold uppercase">{{ $customer['name'] }}</div>
                <div>Phone: {{ $customer['phone'] }}</div>
            </div>
            
            <div class="balance-info">
                <div class="section-title">Balance Summary</div>
                <div>Outstanding: <span class="bold">{{ $outstandingBalance }} Ksh</span></div>
            </div>
        </div>
        
        <div class="summary-divider"></div>
        
        <!-- Products Table -->
        <sapn> <span class="bold">Note:</span> For products supplied {{ $dateDescription }}</span>
        <table class="table">
            <thead>
                
                <tr>
                    <th></th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th >Amount</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $count = 1;
                @endphp
                @foreach($products as $key => $value)
                    <tr>
                        <td class="bold">{{ $count }}</td>
                    <td class="capitalize">{{ $value['name'] }}</td>
                    <td>{{ $value['quantity'] }}</td>
                    <td>{{ $value['description'] }}</td>
                    <td>{{ $value['price'] }}</td>
                    <td >{{ number_format($value['subTotal'],2) }}</td>
                </tr>
                @php
                    $count ++;
                @endphp
                @endforeach
            </tbody>
        </table>
        
        <div class="double-divider"></div>
        
        <!-- Totals -->
        <div class="totals">
            <div class="total-row">
                <span class="total-label">TOTAL:</span>
                <span class="total-amount">{{ number_format($totalCost,2) }} Ksh</span>
            </div>
            <div class="total-row">
                <span class="total-label">PAID:</span>
                <span class="total-amount">{{number_format( $amountPaid ,2)}} Ksh</span>
            </div>
            <div class="total-row">
                <span class="total-label">BALANCE DUE:</span>
                <span class="total-amount">{{ number_format($outstandingBalance ,2)}} Ksh</span>
            </div>
        </div>
        
        <!-- Footer -->
        
    </div>
    <div class="footer">
            
            <div class="thank-you">Thank you for your business!</div>
            <div>Acccounts are due as per agreement.</div>
        </div>
</body>
</html>