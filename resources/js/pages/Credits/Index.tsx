import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Euro, Receipt } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

import CreateButton from '@/components/createButton';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/helper/formatCurrency';
import { formatDate } from '@/helper/formatDate';
import ucfirst from '@/helper/ucfirst';
import AppLayout from '@/layouts/app-layout';

interface Product {
    id: number;
    name: string;
    unit: string;
    price_per_unit: string;
}

interface Stock {
    id: number;
    code: string;
    date: string;
    product_id: number;
    quantity_available: string;
    quantity_received: string;
    product: Product;
}

interface SaleStock {
    id: number;
    stock_id: number;
    product_id: number;
    quantity: number;
    subtotal: number;
    created_at: string;
    stock: Stock;
}

interface Customer {
    first_name: string;
    phone?: string;
}

interface Sale {
    uuid: number;
    id: number;
    invoice_number: string;
    sale_stock: SaleStock[];
    customer: Customer | null;
    quantity: number;
    total: number;
    balance: number;
    due_date: string;
    method: 'cash' | 'mpesa' | 'credit';
    payment_status: string;
    date: string;
}

interface SalesProp {
    sales: Sale[];
}

const breadcrumb = [
    {
        title: 'Credits',
        href: '/credits',
    },
];

export default function SaleIndex({ sales }: SalesProp) {
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const { data, setData, processing, post, errors, reset } = useForm({
        sale_id: -1,
        amount_paid: 0,
        balance: 0,
        method: 'mpesa',
        new_balance: 0,
        date: formatDate(new Date().toISOString()),
    });

    const handleSaleSelection = (sale: Sale) => {
        setSelectedSale(sale);
        setData({
            sale_id: sale.id,
            amount_paid: 0,
            balance: sale.balance,
            method: 'mpesa',
            new_balance: sale.balance,
            date: formatDate(new Date().toISOString()),
        });
    };

    const handlePaymentChange = (value: number) => {
        if (!selectedSale) return;

        const amount = Math.min(Math.max(0, value), selectedSale.balance);
        setData({
            ...data,
            amount_paid: amount,
            balance: selectedSale.balance,
            new_balance: selectedSale.balance - amount,
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!selectedSale) return;

        post(route('payments.store'), {
            onSuccess: () => {
                toast.success('Payment recorded successfully');
                reset();
                setSelectedSale(null);
            },
            onError: () => {
                toast.error('Failed to record payment');
            },
        });
    };

    // const handleDelete = (id: number) => {
    //     if (confirm('Are you sure you want to delete this sale?')) {
    //         router.delete(route('sales.destroy', id), {
    //             onSuccess: () => toast.success('Sale deleted successfully'),
    //             onError: () => console.error,
    //         });
    //     }
    // };

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const getPaymentStatusBadge = (status: string) => {
        const variants = {
            paid: { bg: 'bg-green-100', text: 'text-green-800' },
            partial: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            unpaid: { bg: 'bg-red-100', text: 'text-red-800' },
        };

        const variant = variants[status as keyof typeof variants] || variants.unpaid;

        return <Badge className={`${variant.bg} ${variant.text}`}>{ucfirst(status)}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Sales Records" />
            <Toaster position="top-center" richColors />

            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Credits Records</h1>
                    <CreateButton action="New Sale" toRoute="sale.create" />
                </div>

                <div className="rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader className="">
                            <TableRow className="rounded-2xl hover:text-primary">
                                <TableHead>Sale date</TableHead>
                                <TableHead>Due date</TableHead>
                                <TableHead>Invoice No</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Customer Name</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.length > 0 ? (
                                sales.map((sale) => (
                                    <TableRow key={sale.id} className="hover:text-primary">
                                        <TableCell className="whitespace-nowrap">{formatDate(sale.date)}</TableCell>
                                        <TableCell className="whitespace-nowrap">{formatDate(sale.due_date) || '--'}</TableCell>
                                        <TableCell>{sale.invoice_number}</TableCell>
                                        <TableCell>
                                            <ul className="">
                                                {sale.sale_stock?.map((item) => (
                                                    <li key={item.id} className="text-sm text-gray-600">
                                                        {ucfirst(item.stock.product.name)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>{sale.customer?.first_name || 'Walk-in Customer'}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(sale.total)}</TableCell>
                                        <TableCell>{getPaymentStatusBadge(sale.payment_status)}</TableCell>
                                        <TableCell className="flex items-center space-x-2">
                                            <Drawer direction="right">
                                                <DrawerTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={sale.balance <= 0}
                                                        onClick={() => handleSaleSelection(sale)}
                                                    >
                                                        <Euro className={`h-4 w-4 ${sale.balance <= 0 ? 'text-gray-400' : 'text-green-500'}`} />
                                                    </Button>
                                                </DrawerTrigger>

                                                {selectedSale && (
                                                    <DrawerContent className="sm:max-w-md">
                                                        <DrawerHeader>
                                                            <DrawerTitle>Record Payment</DrawerTitle>
                                                            <DrawerDescription>Invoice: {selectedSale.invoice_number}</DrawerDescription>
                                                        </DrawerHeader>

                                                        <div className="space-y-4 p-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label className="mb-2">Customer</Label>
                                                                    <p className="font-medium text-green-500">
                                                                        {selectedSale.customer?.first_name || 'Walk-in Customer'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <Label className="mb-2">Current Balance</Label>
                                                                    <p className="font-medium text-green-500">
                                                                        {formatCurrency(selectedSale.balance)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <form onSubmit={submit} className="space-y-4">
                                                                <div>
                                                                    <Label htmlFor="amount">Amount</Label>
                                                                    <Input
                                                                        id="amount"
                                                                        type="number"
                                                                        min="0"
                                                                        max={selectedSale.balance}
                                                                        step="0.01"
                                                                        value={data.amount_paid || ''}
                                                                        onChange={(e) => handlePaymentChange(parseFloat(e.target.value))}
                                                                        disabled={processing}
                                                                    />
                                                                    <InputError message={errors.amount_paid} />
                                                                </div>

                                                                <div>
                                                                    <Label className="mb-2">Payment Method</Label>
                                                                    <Select
                                                                        value={data.method}
                                                                        onValueChange={(value) => setData('method', value as any)}
                                                                        disabled={processing}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select method" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="mpesa">MPESA</SelectItem>
                                                                            <SelectItem value="cash">Cash</SelectItem>
                                                                            <SelectItem value="credit">Credit</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <InputError message={errors.method} />
                                                                </div>

                                                                <div>
                                                                    <Label className="mb-2">New Balance</Label>
                                                                    <Input value={formatCurrency(data.new_balance)} disabled />
                                                                </div>

                                                                <Button type="submit" className="w-full" disabled={processing}>
                                                                    {processing ? 'Processing...' : 'Submit Payment'}
                                                                </Button>
                                                            </form>
                                                        </div>

                                                        <DrawerFooter>
                                                            <DrawerClose asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DrawerClose>
                                                        </DrawerFooter>
                                                    </DrawerContent>
                                                )}
                                            </Drawer>

                                            <Link href={route('sale.show', sale.uuid)}>
                                                <Button variant="ghost" size="icon">
                                                    <Receipt className="h-4 w-4 text-blue-500" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                                        No credit records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
