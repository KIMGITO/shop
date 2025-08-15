import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/helper/formatCurrency';
import { formatDate } from '@/helper/formatDate';
import formatNumber from '@/helper/formatNumber';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link } from '@inertiajs/react';
import { LoaderCircle, Printer } from 'lucide-react';
import { Sale } from '../types/sale';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
// import { Sale, Customer, Payment } from '@/types/sales';

interface SalesProp {
    sale: Sale;
}

export default function Info({ sale }: SalesProp) {

    const [processing, setProcessing] = useState(false);
 
    const breadcrumb = [
        { title: 'Sales', href: '/sale' },
        { title: sale.invoice_number, href: '' },
    ];

    const handlePrint = () => {
        setProcessing(true);
        window.location.href = `/invoice/${sale.uuid}`;
        // window.location.href = `/storage/invoices-pdf/${sale.invoice_number}.pdf`;

    };

    const statusColors = {
        paid: { text: 'text-green-600', bg: 'bg-green-50' },
        partial: { text: 'text-amber-600', bg: 'bg-amber-50' },
        unpaid: { text: 'text-red-600', bg: 'bg-red-50' },
    };

    const currentStatus = statusColors[sale.payment_status];

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Sale Information" />
            <div className="flex justify-center p-4">
                <AuthLayout description="Sale" title="Sales Transaction Info">
                    <Card className={`w-full max-w-4xl ${currentStatus.bg} border-0 text-secondary shadow-none`}>
                        <CardHeader className="pb-4">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-lg font-semibold">Invoice {sale.invoice_number}</CardTitle>
                                    <Badge variant="outline" className={`${currentStatus.text} border-current`}>
                                        {sale.payment_status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="text-sm text-gray-500">{formatDate(sale.date)}</div>
                            </div>
                        </CardHeader>

                        <Dialog open={processing}>
                            <DialogOverlay className="bg-primary/70">
                                <DialogClose hidden={true} disabled />

                                <DialogContent showCloseButton={false} className=" bg-transparent border-none text-white shadow-none">
         

                                    <div className="flex flex-col items-center justify-center">
                                        <LoaderCircle className=" h-[100px] w-[100px] animate-spin" />
                                        <CardDescription>Processing ...</CardDescription>
                                    </div>
                                </DialogContent>
                            </DialogOverlay>
                        </Dialog>

                        <CardContent className="space-y-6">
                            {/* Customer Info */}
                            <div className="space-y-1">
                                <h3 className="font-medium text-gray-500">Customer</h3>
                                <p className="text-lg">
                                    {sale.customer ? `${sale.customer.first_name} ${sale.customer.last_name}`.toUpperCase() : 'WALK-IN CUSTOMER'}
                                </p>
                            </div>

                            {/* Products List */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-500">Products</h3>
                                <div className="divide-y">
                                    {sale.sale_stock.map((prod, index) => (
                                        <div key={prod.id} className="grid grid-cols-12 py-2 text-sm">
                                            <span className="col-span-1 text-gray-500">{index + 1}.</span>
                                            <span className="col-span-6 font-medium">{prod.stock.product.name}</span>
                                            <span className="col-span-2 text-right text-gray-600">
                                                {formatNumber(prod.quantity)} {prod.stock.product.unit}
                                            </span>
                                            <span className="col-span-3 text-right font-medium">{formatCurrency(prod.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">{formatCurrency(sale.total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount Paid:</span>
                                    <span className="font-medium text-green-600">{formatCurrency(sale.total - sale.balance)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="font-medium text-gray-600">Balance:</span>
                                    <span className={`font-bold ${sale.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(sale.balance)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment History */}
                            <div className="space-y-2">
                                <h3 className="font-medium text-gray-500">Payment History</h3>
                                {sale.payment?.length ? (
                                    <ScrollArea className="h-48">
                                        <div className="space-y-2 pr-4">
                                            {sale.payment.map((payment, index) => (
                                                <div key={index} className="flex justify-between border-b pb-2">
                                                    <div>
                                                        <span
                                                            className={`font-medium capitalize ${payment.method === 'cash' ? 'text-amber-600' : 'text-green-600'}`}
                                                        >
                                                            {payment.method}
                                                        </span>
                                                        <span className="block text-xs text-gray-500">{formatDate(payment.date)}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-medium">{formatCurrency(payment.amount_paid)}</span>
                                                        <span className="block text-xs text-gray-500">Bal: {formatCurrency(payment.balance)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <ScrollBar orientation="vertical" />
                                    </ScrollArea>
                                ) : (
                                    <p className="text-gray-400">No payments recorded</p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t pt-6">
                            <Link href={route('sale.index')}>
                                <Button disabled={processing} variant="ghost">
                                    Back to Sales
                                </Button>
                            </Link>
                            <Button disabled={processing} onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Invoice
                            </Button>
                        </CardFooter>
                    </Card>
                </AuthLayout>
            </div>
        </AppLayout>
    );
}
