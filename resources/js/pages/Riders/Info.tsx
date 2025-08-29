import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatSmartDate } from '@/helper/formatSmartDate';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { DeliveryProp, RiderProps } from '../Dashboard/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function RiderInfo({ riderData }: { riderData: RiderProps }) {
    // console.log(riderData);
    const breadcrumb = [
        {
            title: 'HOME',
            href: '/dashboard',
        },
        {
            title: 'Riders',
            href: '/riders',
        },
        {
            title: riderData.name,
            href: `/riders/${riderData.id}`,
        },
    ];
    const grouped = Object.entries(
        riderData.deliveries.reduce((acc: Record<string, DeliveryProp[]>, delivery) => {
            const date = new Date(delivery.date);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(delivery);
            return acc;
        }, {}),
    ).map(([date, deliveries]) => ({
        date,
        deliveries,
    }));

    // console.log(dates);

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title={`Rider ${riderData.name}`} />
            <div className="container mx-auto w-full justify-center p-4">
                <div className="mb-6 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <h1 className="text-2xl font-bold uppercase">{riderData.name}</h1>
                        <img className="h-20 w-20 rounded-full border-2" src="/images/worker.png" />
                        <CardDescription>{riderData.phone}</CardDescription>
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <Card className="w-full p-4 md:w-9/12">
                        <CardTitle>
                            <div className="flex justify-between">
                                <span>Name: {riderData.name}</span>
                                <span>Phone:{riderData.phone}</span>
                                <span>Deliveries made: {riderData.deliveries.length}</span>
                            </div>
                        </CardTitle>
                        <CardContent className="flex flex-col gap-5">
                            {grouped &&
                                grouped.map((deliveries, i) => (
                                    <Card className="w-full rounded-2xl border bg-secondary/90 p-6 shadow-2xl shadow-gray-100/40" key={i}>
                                        <CardTitle className="p-3 text-foreground/60">
                                            Day: <span className="text-foreground">{formatSmartDate(deliveries.date)}</span>{' '}
                                        </CardTitle>
                                        <CardContent className="w-full min-w-[300px]">
                                            <ScrollArea>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>No</TableHead>
                                                            <TableHead></TableHead>
                                                            <TableHead className="text-center"></TableHead>
                                                            <TableHead>Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {deliveries.deliveries.map((delivery, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell className="hover:text-primary hover:underline">
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <a href={route('sale.show',delivery.sale.uuid)}>{delivery.sale.invoice_number}</a>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            see sale
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>{delivery.address}</TableCell>
                                                                <TableCell>{delivery.status}</TableCell>
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
