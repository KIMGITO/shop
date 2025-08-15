import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatSmartDate } from '@/helper/formatSmartDate';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { CustomerProp, Sale } from '../Dashboard/types';
import { formatCurrency } from '@/helper/formatCurrency';
import { Home, Mail, NotebookPen, Phone } from 'lucide-react';

export default function RiderInfo({ customerData }: { customerData: CustomerProp }) {
    // console.log(customerData);
    const breadcrumb = [
        {
            title: 'HOME',
            href: '/dashboard',
        },
        {
            title: 'Customers',
            href: '/customers',
        },
        {
            title: customerData.first_name,
            href: `/riders/${customerData.id}`,
        },
    ];
    const grouped = Object.entries(
        customerData.sales.reduce((acc: Record<string, Sale[]>, sale) => {
            const date = new Date(sale.date);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(sale);
            return acc;
        }, {}),
    ).map(([date, sales]) => ({
        date,
        sales,
    }));

    // console.log(dates);

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title={`Rider ${customerData.first_name}`} />
            <div className="container mx-auto w-full justify-center p-4">
                <div className="mb-6 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <h1 className="text-2xl font-bold uppercase">{customerData.first_name}</h1>
                        <img className="h-20 w-20 rounded-full border-2" src="/images/worker.png" />
                        <CardDescription className="flex items-center gap-4">
                            <Phone className="h-4" /> {customerData.phone}
                        </CardDescription>
                        {customerData.email && (
                            <CardDescription className="flex items-center gap-4">
                                <Mail className="h-4" />
                                {customerData.email}
                            </CardDescription>
                        )}

                        <CardDescription className="flex items-center gap-4">
                            <Home className="h-4" />
                            {customerData.address}
                        </CardDescription>
                        {customerData.note && (
                            <CardDescription className="flex items-center gap-4">
                                <NotebookPen className="h-4" />
                                {customerData.note}
                            </CardDescription>
                        )}
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <Card className="w-full p-4 md:w-9/12">
                        <CardTitle>
                            <div className="flex justify-between">
                                <span>Name: {customerData.name}</span>
                                <span>Phone:{customerData.phone}</span>
                                <span className="text-green-500">Total Bil: {formatCurrency(customerData.bill)}</span>
                            </div>
                        </CardTitle>
                        <CardContent className="flex flex-col gap-5">
                            {grouped &&
                                grouped.map((sales, i) => (
                                    <Card className="w-full rounded-2xl border bg-secondary/90 p-6 shadow-2xl shadow-gray-100/40" key={i}>
                                        <CardTitle className="p-3 text-foreground/60">
                                            Day: <span className="text-foreground">{formatSmartDate(sales.date)}</span>{' '}
                                        </CardTitle>
                                        <CardContent className="w-full min-w-[300px]">
                                            <ScrollArea>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-0 text-center">
                                                            <TableHead>No</TableHead>
                                                            <TableHead></TableHead>
                                                            <TableHead className="text-center">Total </TableHead>
                                                            <TableHead className="text-center">Total Paid</TableHead>
                                                            <TableHead className="text-center">Balance Ksh</TableHead>
                                                            <TableHead>Status </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {sales.sales.map((sale, index) => (
                                                            <TableRow key={index} className="border-0 hover:bg-gray-400/10">
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell className="hover:text-primary hover:underline">
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <a href={route('sale.show', sale.uuid)}>{sale.invoice_number}</a>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>see sale</TooltipContent>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell className="text-center">{sale.total} </TableCell>
                                                                <TableCell className="text-center">{sale.total - sale.balance} </TableCell>
                                                                <TableCell className="text-center text-red-500">{sale.balance} </TableCell>
                                                                <TableCell>{sale.payment_status}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
