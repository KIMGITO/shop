import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { formatDate } from '@/helper/formatDate';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';

interface Product {
    name: string;
}
interface Stock {
    product: Product;
}

interface Summary {
    stock: Stock;
    opening_stock: number;
    stock_out: number;
    summary_date: string;
    closing_stock: number;
}

interface AllSummariesProp {
    summariesByDate: {
        [date: string]: Summary[];
    };
}

const breadcrumb = [
    {
        title: 'HOME',
        href: '/dashboard'
    },
    {
        title: 'Daily Summaries',
        href: '/summaries'
    }
]

export default function ({ summariesByDate }: AllSummariesProp) {
    // console.log(Object.values(summariesByDate).flat.length);
    
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Daily Summary" />

            <AuthLayout title="Daily Summary" description="">
                {Object.entries(summariesByDate).map(([date, summaries]) => (
                    <Card key={date}>
                        <CardHeader className="flex">
                            <div className="flex justify-between">Date: {formatDate(date)}</div>{' '}
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="flex w-full px-2">
                                {/* Left column: labels */}
                                <div className="bg- flex min-w-3/12 flex-col items-end gap-4 px-2 py-3">
                                    <CardDescription className="text-primary">Product</CardDescription>
                                    <CardDescription className="text-green-500">Opening</CardDescription>
                                    <CardDescription className="text-green-500">S out</CardDescription>
                                    <CardDescription className="text-green-500">Delivery</CardDescription>
                                    <CardDescription className="text-green-500">Closing</CardDescription>
                                </div>

                                {/* Right column: summary values */}

                                <ScrollArea className="min-w-9/12 rounded-md border whitespace-nowrap">
                                    <div className="flex w-max justify-start gap-3 space-x-4 rounded-ss bg-secondary/25 p-4 px-2 py-3">
                                        {summaries.map((summary, index) => (
                                            <div
                                                key={summary.stock.product.name + index}
                                                className={`flex max-w-[60px] min-w-[60px] flex-col items-center gap-4 px-2 ${index % 2 == 0 ? 'rounded bg-primary/5' : ''}`}
                                            >
                                                <CardDescription className="truncate font-bold text-green-500">
                                                    {summary.stock.product.name}
                                                </CardDescription>
                                                <CardDescription>{summary.opening_stock}</CardDescription>
                                                <CardDescription>{summary.stock_out}</CardDescription>
                                                <CardDescription>{'--'}</CardDescription>
                                                <CardDescription>{summary.closing_stock}</CardDescription>
                                            </div>
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>
                ))
                }
            </AuthLayout>
        </AppLayout>
    );
}
