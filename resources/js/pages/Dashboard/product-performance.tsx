import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/helper/formatDate';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PerformanceDuration, TopProducts } from './types';

export default function ProductPerformance() {
    const [topProductsIsLoading, setTopProductsIsLoading] = useState(true);
    const [performanceDuration, setPerformanceDuration] = useState<PerformanceDuration>([]);
    const [topProducts, setTopProducts] = useState<TopProducts[]>([]);

    useEffect(() => {
        axios
            .get('dashboard/dashboard-data')
            .then((res) => {
                setTopProducts(res.data.topProductsData);
                setPerformanceDuration(res.data.performanceDuration);
            })
            .finally(() => {
                setTopProductsIsLoading(false);
            });
    }, []);
    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="p-4 pb-2">
                <div>
                    <CardTitle className="text-lg">Top products</CardTitle>
                    <CardDescription>By revenue this month</CardDescription>
                    <CardDescription>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {topProductsIsLoading ? (
                    <div className="flex items-center justify-center space-x-4">
                        <Skeleton className="flex h-[250px] w-11/12 items-center justify-center bg-gray-600/60">
                            Products Performance loading...
                        </Skeleton>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-8 pl-4">Product</TableHead>
                                <TableHead className="h-8 text-right">Revenue</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {topProducts.slice(0,5).map((item) => (
                                <TableRow key={item.id} className="h-10 hover:bg-muted/50">
                                    <TableCell className="pl-4">
                                        <div className="text-sm font-medium">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">{item.sales} sold</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="font-medium">Ksh {item.revenue.toLocaleString()}</div>
                                        {/* <div className="text-xs text-muted-foreground">{item.profitMargin}% margin</div> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
