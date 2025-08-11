import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
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
    closing_stock: number;
}

interface SummaryProps {
    summaries: Summary[];
}

export default function ({ summaries }: SummaryProps) {
    return (
        <AppLayout>
            <Head title="Daily Summary" />

            <AuthLayout title="Daily Summary" description="">
                <Card className="">
                    <CardHeader>
                        <div className="flex justify-between">Date: {formatDate(new Date().toISOString())}</div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex w-full">
                            <div className="bg- flex min-w-3/12 flex-col items-end gap-4 px-2 py-3">
                                <CardDescription className="text-primary">Product</CardDescription>
                                <CardDescription className="text-green-500">Opening </CardDescription>
                                <CardDescription className="text-green-500">S out</CardDescription>
                                <CardDescription className="text-green-500">Delivery</CardDescription>
                                <CardDescription className="text-green-500">Closing</CardDescription>
                            </div>
                            <div className="flex min-w-9/12 justify-between truncate gap-3 overflow-x-scroll rounded-ss bg-secondary/25 px-2 py-3">
                                {summaries &&
                                    summaries.map((summary, index) => (
                                        <div className={`flex flex-col min-w-[60px] max-w-[60px]  truncate items-center gap-4 px-2 ${index % 2 == 0 ? 'rounded bg-primary/5' : ''}`}>
                                            <CardDescription className="font-bold text-green-500 truncate">{summary.stock.product.name}</CardDescription>
                                            <CardDescription className="">{summary.opening_stock}</CardDescription>
                                            <CardDescription className="">{ summary.stock_out}</CardDescription>
                                            <CardDescription className="text-center">{'--'}</CardDescription>
                                            <CardDescription className="">{summary.closing_stock}</CardDescription>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AuthLayout>
        </AppLayout>
    );
}
