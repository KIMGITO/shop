import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/helper/formatDate';
import AppLayout from '@/layouts/app-layout';

interface Product {
    name: string;
    unit: string;
}

interface Stock {
    id: number;
    uuid: string;
    product: Product;
    quantity_received: number;
    quantity_available: number;
    date: string;
    source: string;
}


const breadcrumb = [
    {
        title: 'Product Stock',
        href: '/stock',

    },
]
export default function StockIndex({ stocks }: { stocks: Stock[] }) {
    const handleDelete = (id: number) => {
        router.delete(route('stock.destroy', id));
    };

    const { props } = usePage<{ flash?: { success?: string | null; error?: string | null } }>();

    const success =props.flash?.success;
    const error = props.flash?.error;

    useEffect(() => {
        if (success) {
            toast.success('Success', {
                description: success,
                duration: 3000,
            });
        }
        if (error) {
            toast.error('Error', {
                description: error,
                duration: 3000,
            })
        };
        
    }, [success, error]); // Include undo_product in dependencies

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Stock List" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <Toaster position="top-center" richColors />
                    <h2 className="text-xl font-semibold">Stock Records</h2>
                    <Link href={route('stock.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Stock
                        </Button>
                    </Link>
                </div>

                <div className="overflow-auto rounded-xl border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2 text-left">Product</th>
                                <th className="px-4 py-2 text-left">Quantity</th>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Source</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks &&
                                stocks.map((stock) => (
                                    <tr key={stock.id} className="border-t transition hover:bg-accent">
                                        <td className="px-4 py-2">{stock.product?.name}</td>
                                        <td className="px-4 py-2">
                                            {stock.quantity_available} {stock.product?.unit}
                                        </td>
                                        <td className="px-4 py-2">{formatDate(stock.date)}</td>
                                        <td className="px-4 py-2">{stock.source}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <Link href={route('stock.editQty', stock.id)}>
                                                    <Button size="sm" variant="ghost" className="p-0">
                                                        <Upload className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('stock.edit', stock.uuid)}>
                                                    <Button size="sm" variant="ghost" className="p-0">
                                                        <Pencil className="h-4 w-4 text-yellow-500" />
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="ghost" className="p-0">
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-red-500">Confirm Delete</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this stock entry? This action is irreversible.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(stock.id)}
                                                                className="bg-red-500 text-white hover:bg-red-600"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            {stocks.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                        No stock entries found.
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
