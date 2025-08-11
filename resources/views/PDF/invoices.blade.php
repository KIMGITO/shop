<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Grouped Invoices</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            padding: 0;
            margin: 0;
        }
        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            border-bottom: 1px solid #e1e1e1;
            padding-bottom: 15px;
        }
        .header-left {
            flex: 1;
        }
        .header-right {
            text-align: right;
        }
        .logo {
            width: 120px;
            position: absolute;
            top: -2%;
            right: -2%;
        }
        .customer-header {
            font-size: 18px;
            font-weight: bold;
            margin: 15px 0 10px 0;
            color: #2c3e50;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0 25px 0;
        }
        th {
            background-color: #2c3e50;
            color: white;
            padding: 6px;
            text-align: left;
        }
        td {
            padding: 5px;
            border-bottom: 1px solid #e1e1e1;
            text-align: center
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .totals-row {
            background-color: #ddd;
            font-weight: bold;
        }
        .product-summary {
            margin: 10px 0;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
        }

        
        .signature {
            width: 300px;
            border-top: 1px solid #333;
            text-align: center;
            padding-top: 5px;
            margin-top: 60px;
            justify-content: space-between;
        }
        .generation-date {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .total-owed {
            position: absolute;
            bottom: 0%;
            right: 0%;
            font-size: 16px;
            font-weight: bold;
            color: #e74c3c;
            padding: 10px;
            background-color: #f9f9f9;

        }
    </style>
</head>
<body>
    <!-- Header with Logo and Date aligned -->
    <div class="header-container">
        <div class="header-left">
            <div style="font-size: 20px; font-weight: bold;">INVOICE STATEMENTS</div>

            <div class="generation-date">DATE: {{ date('d M, Y') }}</div>
        </div>
        <div class="header-right">
            <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/milky.svg'))) }}" class="logo">
        </div>
    </div>

    @php
        $totalOwed = 0;
    @endphp
    

    @foreach($invoices as $customer => $customer_invoices)
        @php
            $productQty = [];
            $total_price = 0;
            $total_paid = 0;
            $total_balance = 0;

            foreach ($customer_invoices as $invoice) {
                $product = $invoice['sale']['stock']['product']['name'];
                $product_unit = $invoice['sale']['stock']['product']['unit'];
                $qty = $invoice['sale']['quantity'];
                $productQty[$product] = [
                    'product' => $product,
                    'qty' => isset($productQty[$product]) ? $productQty[$product]['qty'] + $qty : $qty,
                    'unit' => $product_unit,
                ];
               
                $total_price += $invoice['sale']['price'];
                $total_paid += $invoice['amount_paid'];
                $total_balance += $invoice['balance'];
                $totalOwed += $total_balance;
            }
        @endphp

        <div class="customer-header">{{ strtoupper($customer_invoices[0]['sale']['customer']['name']) }}</div>
        
        <div class="product-summary">
            @foreach($productQty as $product)
                {{ \Str::ucfirst(\Str::lower($product['product'])) }}: {{ $product['qty'] }}{{ \Str::ucfirst(\Str::lower($product['unit'])) }}<br>
            @endforeach
        </div>

        <table>
            <thead>
                <tr>
                    <th>Sale Date</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>@</th>
                    <th>Total</th>
                    <th>Amt Paid</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                @foreach($customer_invoices as $invoice)
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($invoice['sale']['date'])->format('d M, Y') }}</td>
                        <td>{{ $invoice['sale']['stock']['product']['name'] }}</td>
                        <td>{{ number_format($invoice['sale']['quantity']) }}</td>
                        <td>{{ number_format($invoice['sale']['stock']['product']['price_per_unit']) }}</td>
                        <td>{{ number_format($invoice['sale']['price']) }}</td>
                        <td>{{ number_format($invoice['amount_paid']) }}</td>
                        <td>{{ number_format($invoice['balance']) }}</td>
                    </tr>
                @endforeach

                <tr class="totals-row">
                    <td colspan="4">TOTAL</td>
                    <td>{{ number_format($total_price) }} Ksh</td>
                    <td>{{ number_format($total_paid) }} Ksh</td>
                    <td>{{ number_format($total_balance) }} Ksh</td>
                </tr>
            </tbody>
        </table>
    @endforeach

    <div class="total-owed" style="margin-top: 20px">TOTAL AMOUNT OWED: {{ number_format($totalOwed) }} Ksh</div>

    <!-- Footer with Signatures -->
    {{-- <div class="footer">
        
        <div>
            <div class="signature"> <span>Name & Signature </span> </div>
        </div>
        <div>
            <div class="signature">Stamp</div>
        </div>
    </div> --}}
</body>
</html>