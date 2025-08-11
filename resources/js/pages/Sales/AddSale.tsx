import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { Link, router, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Customer, Stock } from '../Dashboard/types';
import axios from 'axios';
type PaymentMethod = 'mpesa' | 'cash' | 'credit';
type PaymentStatus = 'paid' | 'partial' | 'unpaid';

interface SaleItem {
    product_id: string;
    product_name: string;
    product_price: number;
    unit: string;
    stock_id: string;
    stock_code: string;
    sale_quantity: number;
    stock_available: number;
    total_price: number;
}

interface FormData {
    customer_id: number | null;
    customer_first_name: string;
    sale_items: SaleItem[];
    payment_method: PaymentMethod;
    sale_date: string;
    payment_status: PaymentStatus;
    amount_paid: number;
    payment_balance: number;
    grand_total: number;
}

export default function AddSalesForm({ stocksData, customersData }: { stocksData: Stock[]; customersData: Customer[] }) {
    const [stocks, setStocks] = useState<Stock[]>(stocksData);
    const [customers, setCustomers] = useState<Customer[]>(customersData);

    const [saleItems, setSaleItems] = useState<SaleItem[]>([
        {
            product_id: '',
            product_name: '',
            product_price: 0,
            unit: '',
            stock_id: '',
            stock_code: '',
            sale_quantity: 0,
            stock_available: 0,
            total_price: 0,
        },
    ]);

    const { data, setData, post, errors, processing, reset } = useForm<FormData>({
        customer_id: null,
        customer_first_name: '',
        sale_items: saleItems,
        payment_method: 'mpesa',
        sale_date: new Date().toISOString().split('T')[0],
        payment_status: 'paid',
        amount_paid: 0,
        payment_balance: 0,
        grand_total: 0,
    });

    
    // Memoize available stocks to prevent unnecessary recalculations
    const availableStocks = useMemo(() => stocks.filter((stock) => Number(stock.quantity_available) > 0), [stocks]);

    // Check if all products are valid
    const allProductsValid = useMemo(
        () => saleItems.every((item) => item.product_id && item.stock_id && item.sale_quantity > 0 && item.sale_quantity <= item.stock_available),
        [saleItems],
    );

    // Calculate grand total
    const grandTotal = useMemo(() => saleItems.reduce((sum, item) => sum + item.total_price, 0), [saleItems]);

    // Update form data when sale items or grand total changes
    useEffect(() => {
        setData((prev) => ({
            ...prev,
            sale_items: saleItems,
            grand_total: grandTotal,
            ...(prev.payment_status === 'paid' && {
                amount_paid: grandTotal,
                payment_balance: 0,
            }),
        }));
    }, [saleItems, grandTotal, setData]);

    const addNewProduct = useCallback(() => {
        if (!allProductsValid) {
            toast.error('Please fill details for previous product first.');
            return;
        }

        setSaleItems((prev) => [
            ...prev,
            {
                product_id: '',
                product_name: '',
                product_price: 0,
                unit: '',
                stock_id: '',
                stock_code: '',
                sale_quantity: 0,
                stock_available: 0,
                total_price: 0,
            },
        ]);
    }, [allProductsValid]);

    const removeProduct = useCallback((index: number) => {
        setSaleItems((prev) => {
            const updated = [...prev];
            updated.splice(index, 1);
            return updated;
        });
    }, []);

    const updateProduct = useCallback((index: number, field: keyof SaleItem, value: any) => {
        setSaleItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };

            if (field === 'sale_quantity' || field === 'product_price') {
                updated[index].total_price = updated[index].sale_quantity * updated[index].product_price;
            }

            return updated;
        });
    }, []);

    const handleStockSelection = useCallback(
        (index: number, value: string) => {
            const selectedStock = stocks.find((stock) => stock.id.toString() === value);
            if (!selectedStock) return;

            setSaleItems((prev) => {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    stock_id: selectedStock.id.toString(),
                    stock_code: selectedStock.receipt,
                    product_id: selectedStock.product.id.toString(),
                    product_name: selectedStock.product.name,
                    product_price: Number(selectedStock.product.price_per_unit),
                    unit: selectedStock.product.unit,
                    stock_available: Number(selectedStock.quantity_available),
                    sale_quantity: 0,
                    total_price: 0,
                };
                return updated;
            });
        },
        [stocks],
    );

    const handleCustomerChange = useCallback(
        (value: string) => {
            const customer = value ? JSON.parse(value) : null;
            setData((prev) => ({
                ...prev,
                customer_id: customer?.id || null,
                customer_first_name: customer?.first_name || '',
            }));
        },
        [setData],
    );

    const handlePaymentStatusChange = useCallback(
        (status: PaymentStatus) => {
            setData((prev) => {
                const updates: Partial<FormData> = {
                    payment_status: status,
                    amount_paid: status === 'paid' ? prev.grand_total : 0,
                    payment_balance: status === 'paid' ? 0 : prev.grand_total,
                };

                if (status === 'partial' && prev.amount_paid > prev.grand_total) {
                    updates.amount_paid = prev.grand_total;
                    updates.payment_balance = 0;
                }

                return { ...prev, ...updates };
            });
        },
        [setData],
    );

   const confirmAction = (message: string, onConfirm: () => void) => {
       toast.warning(message, {
           action: {
               label: (
                   <div className="flex gap-2">
                       <button className="rounded px-2 py-1 text-sm hover:bg-gray-500" onClick={(e: React.FormEvent) => { e.preventDefault(); toast.dismiss()}}>
                           No
                       </button>
                       <button
                           className="rounded  px-2 py-1 text-sm text-red-700 hover:bg-red-600"
                           onClick={(e: React.FormEvent) => {
                               e.preventDefault()
                               onConfirm();
                               toast.dismiss();
                           }}
                       >
                           Yes
                       </button>
                   </div>
               ),
           },
           duration: 3000,
           position: 'top-center',
       });
   };

    const cancelSale = (e: React.FormEvent)  => {
        e.preventDefault();
        confirmAction('Cancel this sale?', () => {
            toast.success('Sale cancelled', {
                duration: 1500,
                action: setTimeout(() => {
                    window.location.reload();
                },1600)
                
            });
            
           
        });
    };

    const handlePartialPaymentChange = useCallback(
        (value: string) => {
            const amount = parseFloat(value) || 0;
            const balance = grandTotal - amount;

            setData((prev) => ({
                ...prev,
                amount_paid: amount > grandTotal ? grandTotal : amount,
                payment_balance: balance < 0 ? 0 : balance,
                payment_status: balance <= 0 ? 'paid' : 'partial',
            }));
        },
        [grandTotal, setData],
    );

    const submit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!allProductsValid) {
                toast.error('Please complete all product details');
                return;
            }

            post(route('sale.store'), {
                data: {
                    ...data,
                    sale_items: saleItems,
                },
            });
        },
        [allProductsValid, data, post, saleItems],
    );

    return (
        <AuthLayout title="New Sale" description="Record a new sale below.">
            <form onSubmit={submit} className="w-full max-w-4xl space-y-4">
                <Toaster position="top-center" richColors />

                {/* Customer and Date Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="customer_id">Customer</Label>
                        <Select
                            value={data.customer_id ? JSON.stringify({ id: data.customer_id, first_name: data.customer_first_name }) : ''}
                            onValueChange={handleCustomerChange}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={data.customer_first_name || 'Select customer'} />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem key={customer.id} value={JSON.stringify(customer)}>
                                        {customer.first_name}
                                    </SelectItem>
                                ))}
                                <SelectItem value={null}>Walk in</SelectItem>
                                <div className="mt-4 rounded p-2">
                                    No Customer.
                                    <Link href={route('customers.create')} className="ml-1 underline">
                                        Add a customer?
                                    </Link>
                                </div>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.customer_id} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={data.sale_date}
                            onChange={(e) => setData('sale_date', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.sale_date} />
                    </div>
                </div>

                {/* Products Section */}
                <div className="space-y-6">
                    {saleItems.map((item, index) => (
                        <div key={`${item.stock_id}-${index}`} className="rounded-lg border p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="font-medium">Product {index + 1}</h3>
                                {index > 0 && (
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(index)} disabled={processing}>
                                        Remove
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Product</Label>
                                    <Select value={item.stock_id} onValueChange={(value) => handleStockSelection(index, value)} disabled={processing}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableStocks.map((stock) => (
                                                <SelectItem key={stock.id} value={stock.id.toString()}>
                                                    {stock.product.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Display selected product's price */}
                                    {item.product_id && (
                                        <div className="text-sm text-muted-foreground">
                                            Price: {item.product_price} per {item.unit}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        step="any"
                                        min="0"
                                        max={item.stock_available}
                                        value={item.sale_quantity || ''}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            const max = item.stock_available;
                                            updateProduct(index, 'sale_quantity', Math.min(value, max));
                                        }}
                                        disabled={processing || !item.product_id}
                                    />
                                    {item.product_id && (
                                        <div className="text-sm text-muted-foreground">
                                            Available: {item.stock_available} {item.unit}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Total</Label>
                                    <Input type="number" value={item.total_price.toFixed(2)} readOnly />
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addNewProduct} className="w-full" disabled={processing}>
                        + Add Another Product
                    </Button>
                </div>

                {/* Payment Section */}
                <div className="space-y-4 rounded-lg border p-4">
                    <h3 className="font-medium">Payment Summary</h3>
                    <div className="flex justify-between">
                        <span>Grand Total:</span>
                        <span className="font-bold">{grandTotal.toFixed(2)} Ksh</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <Select
                                value={data.payment_method}
                                onValueChange={(value: PaymentMethod) => {
                                    setData((prev) => ({
                                        ...prev,
                                        payment_method: value,
                                        payment_status: value === 'credit' ? 'unpaid' : 'paid',
                                        amount_paid: value === 'credit' ? 0 : grandTotal,
                                        payment_balance: value === 'credit' ? grandTotal : 0,
                                    }));
                                }}
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

                        <div className="space-y-2">
                            <Label>Payment Status</Label>
                            <RadioGroup value={data.payment_status} onValueChange={handlePaymentStatusChange} className="flex gap-4">
                                {(['paid', 'partial', 'unpaid'] as PaymentStatus[]).map((status) => (
                                    <div key={status} className="flex items-center gap-2">
                                        <RadioGroupItem value={status} id={status} disabled={processing} />
                                        <Label htmlFor={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            <InputError message={errors.payment_status} />
                        </div>
                    </div>

                    {data.payment_status === 'partial' && (
                        <div className="space-y-2">
                            <Label>Amount Paid</Label>
                            <Input
                                type="number"
                                max={grandTotal}
                                value={data.amount_paid || ''}
                                onChange={(e) => handlePartialPaymentChange(e.target.value)}
                                disabled={processing}
                            />
                            <div className="text-sm font-medium">Balance: {data.payment_balance.toFixed(2)}</div>
                            <InputError message={errors.amount_paid} />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={cancelSale}>
                        Cancel Sale
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Complete Sale
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
