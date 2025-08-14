import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Customer, RiderProps, Stock } from '../Dashboard/types';
import { SaleItem } from './types';
import { initialSaleItems } from './hooks/useSalesForm';
import { CustomerSection } from './components/CustomerSelector';
import { PaymentSection } from './components/PaymentSection';
import { DeliverySection } from './components/DeliverySection';
import { ProductsSection } from './components/ProductSection';

const breadcrumb = [
    { title: 'HOME', href: '/dashboard' },
    { title: 'Sales', href: '/sale' },
    { title: 'Add new sale', href: '/sale/create' },
];

export default function AddSalesForm({
    stocksData,
    customersData,
    ridersData,
}: {
    stocksData: Stock[];
    customersData: Customer[];
    ridersData: RiderProps[];
}) {
    const stocks = stocksData;
    const customers = customersData;
    const [isDelivery, setIsDelivery] = useState(false);
    const [saleItems, setSaleItems] = useState<SaleItem[]>(initialSaleItems);

    const { data, setData, post, errors, processing } = useForm<FormData>({
        customer_id: null,
        customer_first_name: '',
        sale_items: saleItems,
        payment_method: 'mpesa',
        sale_date: new Date().toISOString().split('T')[0],
        payment_status: 'paid',
        amount_paid: 0,
        payment_balance: 0,
        grand_total: 0,
        delivery_tag: isDelivery,
        rider_id: null,
        delivery_address: '',
    });

    const availableStocks = useMemo(() => stocks.filter((stock) => Number(stock.quantity_available) > 0), [stocks]);
    const allProductsValid = useMemo(
        () => saleItems.every((item) => item.product_id && item.stock_id && item.sale_quantity > 0 && item.sale_quantity <= item.stock_available),
        [saleItems],
    );
    const grandTotal = useMemo(() => saleItems.reduce((sum, item) => sum + item.total_price, 0), [saleItems]);

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

    useEffect(() => {
        setData('delivery_tag', isDelivery);
    }, [isDelivery, setData]);

    const addNewProduct = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!allProductsValid) {
                toast.error('Please fill details for previous product first.');
                return;
            }
            setSaleItems((prev) => [...prev, ...initialSaleItems]);
        },
        [allProductsValid],
    );

    const removeProduct = useCallback((index: number) => {
        setSaleItems((prev) => prev.filter((_, i) => i !== index));
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

    const handleRiderChange = (selected: string) => {
        const rider = JSON.parse(selected);
        setData('rider_id', rider?.id);
    };

    const handleCustomerChange = useCallback(
        (value: string) => {
            const customer = value ? JSON.parse(value) : null;
            setData((prev) => ({
                ...prev,
                customer_id: customer?.id || null,
                customer_first_name: customer?.first_name || 'walk In',
            }));

            if (customer?.id != null) {
                setData('delivery_address', `${customer.home}  house Number: ${customer.house_number}`);
            }
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

    const confirmAction = (message: string, onConfirm: () => void) => {
        toast.warning(message, {
            action: {
                label: (
                    <div className="flex gap-2">
                        <button
                            className="rounded px-2 py-1 text-sm hover:bg-gray-500"
                            onClick={(e: React.FormEvent) => {
                                e.preventDefault();
                                toast.dismiss();
                            }}
                        >
                            No
                        </button>
                        <button
                            className="rounded px-2 py-1 text-sm text-red-700 hover:bg-red-600"
                            onClick={(e: React.FormEvent) => {
                                e.preventDefault();
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

    const cancelSale = (e: React.FormEvent) => {
        e.preventDefault();
        confirmAction('Cancel this sale?', () => {
            toast.success('Sale cancelled', {
                duration: 1500,
                action: setTimeout(() => {
                    window.location.reload();
                }, 1600),
            });
        });
    };

    const submit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!allProductsValid) {
                toast.error('Please complete all product details');
                return;
            }
            post(route('sale.store'));
        },
        [ post, allProductsValid],
    );

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Record New Sale" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <AuthLayout title="New Sale" description="Record a new sale below.">
                    <form onSubmit={submit} className="w-full max-w-4xl space-y-4">
                        <Toaster position="top-center" richColors />

                        <CustomerSection
                            customers={customers}
                            customerFirstName={data.customer_first_name}
                            saleDate={data.sale_date}
                            errors={errors}
                            processing={processing}
                            setData={setData}
                            handleCustomerChange={handleCustomerChange}
                        />

                        <ProductsSection
                            saleItems={saleItems}
                            availableStocks={availableStocks}
                            processing={processing}
                            removeProduct={removeProduct}
                            updateProduct={updateProduct}
                            handleStockSelection={(index, value) => {
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
                            }}
                            addNewProduct={addNewProduct}
                        />

                        <PaymentSection
                            paymentMethod={data.payment_method}
                            paymentStatus={data.payment_status}
                            grandTotal={grandTotal}
                            amountPaid={data.amount_paid}
                            paymentBalance={data.payment_balance}
                            errors={errors}
                            processing={processing}
                            setData={setData}
                            handlePaymentStatusChange={handlePaymentStatusChange}
                            handlePartialPaymentChange={handlePartialPaymentChange}
                        />

                        <div className="w-full justify-end">
                            <Button hidden={isDelivery} type="button" size={'sm'} variant={'outline'} onClick={() => setIsDelivery(true)}>
                                Set As Delivery
                            </Button>
                        </div>

                        <DeliverySection
                            isDelivery={isDelivery}
                            setIsDelivery={setIsDelivery}
                            ridersData={ridersData}
                            deliveryAddress={data.delivery_address}
                            errors={errors}
                            processing={processing}
                            setData={setData}
                            handleRiderChange={handleRiderChange}
                        />

                        <div className="mt-6 flex justify-between gap-2">
                            <Button type="button" variant="outline" onClick={cancelSale}>
                                Cancel Sale
                            </Button>
                            <Button type="submit" disabled={processing || !allProductsValid}>
                                {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Complete Sale
                            </Button>
                        </div>
                    </form>
                </AuthLayout>
            </div>
        </AppLayout>
    );
}
