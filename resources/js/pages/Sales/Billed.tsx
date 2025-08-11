import { Head, Link, router, usePage } from '@inertiajs/react';
import { Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

import { Button } from '@/components/ui/button';
// import { formatCurrency } from '@/helpers/formatCurrency'; // Corrected path
// import { formatDate } from '@/helpers/formatDate'; // Ensure this path is also correct
import ClearPaymnet from '@/components/clearPayment';
import CreateButton from '@/components/createButton';
import { formatCurrency } from '@/helper/formatCurrency';
import { formatDate } from '@/helper/formatDate';
import AppLayout from '@/layouts/app-layout';

interface Product {
    name: string;
    unit: string;
}

interface Stock {
    id: number;
    product: Product;
    quantity: number;
    price: number;
}

interface Credit {
    id: number;
    is_paid: boolean;
    balance: number;
}

interface Customer {
    name: string;
}

interface Sale {
    id: number;
    stock: Stock;
    credit: Credit | null;
    customer: Customer | null;
    quantity: number;
    price: number;
    method: 'cash' | 'mpesa' | 'credit';
    payment_status: string;
    date: string;
}

interface SalesProp {
    billed: Sale[];
}

export default function SaleIndex({ billed }: SalesProp) {
    const handleDelete = (id: number) => {
        router.delete(route('sales.destroy', id));
    };

    const { props } = usePage<{ flash?: { success?: string } }>();
    const [message] = useState(props.flash?.success || '');

    useEffect(() => {
        if (message && typeof message === 'string' && message.trim() !== '') {
            toast.success('Success', {
                description: message,
                duration: 3000,
            });
        }
    }, [message]);

    return (
        <AppLayout>
            <Head title="Sales Records" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <Toaster position="top-center" richColors />
                    <h2 className="text-xl font-semibold"> Billed</h2>
                    <CreateButton action="New Sale" toRoute="sale.create" />
                </div>

                <div className="overflow-auto rounded-xl border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Product</th>
                                <th className="px-4 py-2 text-left">Customer</th>
                                <th className="px-4 py-2 text-right">Qty</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                                <th className="px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billed?.map((sale) => (
                                <tr key={sale.id} className="border-t transition hover:bg-accent">
                                    <td className="px-4 py-2">{formatDate(sale.date)}</td>
                                    <td className="px-4 py-2">{sale.stock?.product?.name}</td>
                                    <td className="px-4 py-2">{sale.customer?.name || 'Walk-in-Customer'}</td>
                                    <td className="px-4 py-2 text-right">
                                        {sale.quantity} {sale.stock?.product?.unit}
                                    </td>
                                    <td className="px-4 py-2 text-right">{formatCurrency(sale.price)}</td>

                                    <td className="px-4 py-2">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sale.payment_status == 'paid' ? 'bg-green-400 text-green-800' : sale.payment_status == 'partial' ? 'bg-yellow-300 text-yellow-800' : 'bg-red-300 text-red-700'}`}
                                        >
                                            {sale.payment_status}
                                        </span>
                                    </td>

                                    
                                    
                                </tr>
                            ))}
                            {billed.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center text-muted-foreground">
                                        No billed transaction available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
