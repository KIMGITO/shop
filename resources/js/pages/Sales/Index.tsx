import { Head, Link } from '@inertiajs/react';
import { Euro, Receipt } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';

import CreateButton from '@/components/createButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/helper/formatCurrency';
import { formatDate } from '@/helper/formatDate';
import ucfirst from '@/helper/ucfirst';
import AppLayout from '@/layouts/app-layout';
import { Sale } from '../Dashboard/types';
import PaymentForm from './payment-form';
import axios from 'axios';

interface SalesProp {
    sales?: {
        data: Sale[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

const breadcrumb = [
    {
        title: 'Sales',
        href: '/sale',
    },
];

export default function SaleIndex({ sales }: SalesProp) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState<number>(-1);
    const [saleBalance, setSaleBalance] = useState<number>(0)
    const [newSalesData, setNewSalesData] = useState<SalesProp[]>(sales);

    const getPaymentStatusBadge = (status: string) => {
        const variants = {
            paid: { bg: 'bg-green-100', text: 'text-green-800' },
            partial: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            unpaid: { bg: 'bg-red-100', text: 'text-red-800' },
        };

        const variant = variants[status as keyof typeof variants] || variants.unpaid;

        return <Badge className={`${variant.bg} ${variant.text}`}>{ucfirst(status)}</Badge>;
    };

    const reLoadData = () => {
        axios.get('/sales/async').then(
            (res) => {
                setNewSalesData(res.data.sales)
            }
        ).finally(
            () => {
                setId(-1);
                setSaleBalance(0)
            }
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Sales Records" />
            <Toaster position="top-center" richColors />

            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Sales Records</h1>
                    <CreateButton action="New Sale" toRoute="sale.create" />
                </div>

                <div className="rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader className="">
                            <TableRow className="rounded-2xl hover:text-primary">
                                <TableHead>Date</TableHead>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {newSalesData?.data && newSalesData.data.length > 0 ? (
                                newSalesData.data.map((sale) => (
                                    <TableRow key={sale.id} className="hover:text-primary">
                                        <TableCell className="whitespace-nowrap">{formatDate(sale.date)}</TableCell>
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
                                        <TableCell className='capitalize'>{sale.customer?.name || 'Walk-in Customer'}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(sale.total)}</TableCell>
                                        <TableCell>{getPaymentStatusBadge(sale.payment_status)}</TableCell>
                                        <TableCell className="flex items-center space-x-2">
                                            <Drawer open={open} direction="right">
                                                <DrawerTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={sale.payment_status === 'paid' || sale.balance <= 0}
                                                        onClick={() => {
                                                            setId(sale.id);
                                                            setSaleBalance(sale.balance)
                                                            setOpen(true);
                                                        }}
                                                    >
                                                        <Euro className={`h-4 w-4`} />
                                                    </Button>
                                                </DrawerTrigger>
                                                <PaymentForm onChange={reLoadData} onClose={() => setOpen(false)} saleId={id} saleBalance={saleBalance} />
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
                                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                                        No newSalesData records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {sales && sales.last_page > 1 && (
                    <Pagination className="mt-4">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={sales.current_page > 1 ? route('sale.index', { page: sales.current_page - 1 }) : '#'}
                                    className={sales.current_page <= 1 ? 'cursor-not-allowed opacity-50' : ''}
                                />
                            </PaginationItem>

                            {sales.links.slice(1, -1).map((link, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        href={link.url || '#'}
                                        isActive={link.active}
                                        className={!link.url ? 'cursor-not-allowed opacity-50' : ''}
                                    >
                                        {link.label}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href={sales.current_page < sales.last_page ? route('sale.index', { page: sales.current_page + 1 }) : '#'}
                                    className={sales.current_page >= sales.last_page ? 'cursor-not-allowed opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </AppLayout>
    );
}
