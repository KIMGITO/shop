import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Toaster } from 'sonner';

interface Product {
    id: string;
    name: string;
    unit: string;
    price_per_unit: string;
}

interface Stock {
    id: string;
    receipt: string;
    quantity_received: string;
    quantity_available: number;
    product: Product;
}

interface Customer {
    name: string;
    id: string;
}

interface SaleProps {
    stocks: Stock[];
    customers: Customer[];
}

export default function AddSalesForm({ stocks, customers }: SaleProps) {
    interface FormProps {
        product_id: string;
        stock_id: string;
        stock_code: string;
        customer_id: string;
        sale_quantity: string;
        total_price: string;
        payment_method: 'mpesa | cash | credit';
        sale_date: string;
        payment_status: 'paid | paertial | unpaid';
        amount_paid?: string;
        payment_balance?: string;

        [key: string]: any;
    }

    const { data, setData, post, put, errors, processing, reset } = useForm({
        product_id: '',
        product_name: '',
        product_price: '',
        unit: '',
        quantity_available: '',
        stock_id: '',
        stock_code: '',
        customer_id: '',
        customer_name: '',
        sale_quantity: 0,
        total_price: 0,
        payment_method: 'mpesa',
        sale_date: new Date().toISOString().split('T')[0],
        payment_status: 'paid',
        amount_paid: 0,
        payment_balance: 0,
        stock_available: 0,
    });

    //submit logic
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const FormData = {
            product_id: data.product_id,
            stock_id: data.stock_id,
            stock_code: data.stock_code,
            customer_id: data.customer_id || null,
            sale_quantity: data.sale_quantity,
            total_price: data.total_price,
            payment_method: data.payment_method,
            sale_date: data.sale_date,
            payment_status: data.payment_status,
            amount_paid: data.amount_paid,
            payment_balance: data.payment_balance,
        };

        post(route('sale.store'));
    };

    const [paymentStatus, setPaymentStatus] = useState(false);

    const handlePaymentStatusChange = (status: string) => {
        const amountPaid = status === 'paid' ? data.total_price : 0;
        const paymentBalance = status === 'paid' ? 0 : data.total_price;

        // Single state update (cleaner)
        setData({
            ...data,
            payment_status: status,
            amount_paid: amountPaid,
            payment_balance: paymentBalance,
        });
    };

    useEffect(() => {
        console.log(data)
        if (data.payment_method === 'credit') {
            setPaymentStatus(true);
        }
    },[data])

    return (
        <AuthLayout title={'New Sale'} description={'Record a new sale below.'}>
            <Toaster position="top-center" richColors closeButton></Toaster>

            <form onSubmit={submit} className="w-full max-w-xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* Product Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="product_id">Product</Label>
                        <Select
                            value={data.stock_id}
                            onValueChange={(value) => {
                                const selectedStock = JSON.parse(value);
                                const updatedData = {
                                    stock_id: selectedStock.stock_id,
                                    stock_code: selectedStock.stock_code,
                                    product_id: selectedStock.product_id,
                                    product_name: selectedStock.product_name,
                                    product_price: selectedStock.product_price,
                                    unit: selectedStock.unit,
                                    stock_available: selectedStock.quantity_available,
                                };

                                setData((prev) => ({ ...prev, ...updatedData }));
                                setData('sale_quantity', 0);
                                setData('total_price', 0);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Product">{data.product_name}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {/* {
                                   stocks && stocproductsoer' > check </SelectItem>
                                    ))
                                } */}
                                {stocks &&
                                    stocks.map(
                                        (stock, index) =>
                                            stock.quantity_available > 0 && (
                                                <SelectItem
                                                    key={index}
                                                    value={JSON.stringify({
                                                        stock_id: stock.id,
                                                        stock_code: stock.receipt,
                                                        product_id: stock.product.id,
                                                        product_name: stock.product.name,
                                                        product_price: stock.product.price_per_unit,
                                                        unit: stock.product.unit,
                                                        quantity_available: stock.quantity_available,
                                                    })}
                                                >
                                                    {stock.product.name} {stock.product.price_per_unit}/{stock.product.unit}
                                                </SelectItem>
                                            ),
                                    )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.product_id} />
                    </div>

                    {/* Customer Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="customer_id">Customer</Label>
                        <Select
                            value={data.customer_id}
                            onValueChange={(value) => {
                                const selectedCustomer = JSON.parse(value);
                                setData('customer_id', selectedCustomer.id);
                                setData('customer_name', selectedCustomer.name);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Customer">{data.customer_id ? data.customer_name : 'walk in'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {/* <SelectItem value="">Walk-in Customer</SelectItem> */}
                                {customers?.map((customer, index) => (
                                    <SelectItem
                                        key={index}
                                        value={JSON.stringify({
                                            id: customer.id,
                                            name: customer.name,
                                        })}
                                    >
                                        {customer.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.customer_id} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            step={'any'}
                            min="0.1"
                            // max={data.stock_available}
                            value={data.sale_quantity > data.stock_available ? data.stock_available : data.sale_quantity}
                            onChange={(e) => {
                                const inputValue = parseFloat(e.target.value);
                                const maxQuantity = data.stock_available; // Already a number
                                const price = Number(data.product_price); // Ensure price is a number

                                const quantity = parseFloat(Math.min(Math.max(0, inputValue), maxQuantity).toFixed(1));

                                setData('total_price', price ? Math.round(quantity * price) : 0);
                                setData('sale_quantity', quantity);
                            }}
                            disabled={processing || !data.product_id}
                        />
                        <InputError message={errors.sale_quantity} />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label htmlFor="price">Total Price</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            value={data.total_price.toFixed(2)}
                            onChange={(e) => setData('total_price', parseFloat(e.target.value))}
                            disabled={processing}
                        />
                        <InputError message={errors.total_price} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Payment Method */}
                    <div className="space-y-2">
                        <Label htmlFor="method">Payment Method</Label>
                        <Select
                            value={data.payment_method || 'mpesa'}
                            onValueChange={(value: 'cash' | 'mpesa' | 'credit') => setData('payment_method', value)}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="mpesa">M-Pesa</SelectItem>
                                <SelectItem value="credit">Credit</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.payment_method} />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            min="2020-01-01"
                            max={new Date().toISOString().split('T')[0]} // Today's date
                            value={data.sale_date}
                            onChange={(e) => setData('sale_date', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.sale_date} />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Payment Status Selection */}
                    <div className="space-y-2">
                        <Label>Payment Status</Label>
                        <RadioGroup
                            value={data.payment_status}
                            onValueChange={(value) => {
                                handlePaymentStatusChange(value);
                            }}
                            className="flex gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="paid" id="paid" disabled={processing||paymentStatus} />
                                <Label htmlFor="paid">Fully Paid</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value="unpaid" id="unpaid" disabled={processing} />
                                <Label htmlFor="unpaid">Not Paid</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem  value="partial" id="partial" disabled={processing || paymentStatus} />
                                <Label htmlFor="partial">Partial Payment</Label>
                            </div>
                        </RadioGroup>
                        <InputError message={errors.payment_status} />
                    </div>

                    {/* Conditional Amount Paid Input */}
                    {data.payment_status === 'partial' && (
                        <div className="space-y-2">
                            <Label htmlFor="amount_paid">{'Partial Amount Paid'}</Label>
                            <Input
                                id="amount_paid"
                                type="number"
                                min="0"
                                value={data.amount_paid}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value > data.total_price) {
                                        setData('amount_paid', data.total_price);
                                        setData('payment_balance', data.total_price - value <= 0 ? 0 : data.total_price - value);
                                    } else {
                                        setData('amount_paid', value);
                                        setData('payment_balance', data.total_price - value <= 0 ? 0 : data.total_price - value);
                                    }

                                    if (data.payment_balance <= 0) {
                                        setData('payment_status', 'paid');
                                    }
                                }}
                                disabled={processing }
                            />
                            {data.payment_status === 'partial' && (
                                <div className="rounded-2xl bg-red-300 text-center text-sm text-red-700">
                                    Remaining: {isNaN(data.payment_balance) ? 0 : data.payment_balance} Ksh
                                </div>
                            )}
                            <InputError message={errors.amount_paid} />
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {'Record Sale'}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
