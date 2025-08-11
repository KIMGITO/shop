import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/helper/formatDate';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DebtorProps } from './types';

export default function Debtors() {
    const [debtorsData, setDebtorsData] = useState<DebtorProps[]>([]);
    const [debtorsIsLoading, setDebtorsIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/dashboard/dashboard-data')
            .then((res) => {
                const debtors = res.data.debtorsData;
                setDebtorsData(debtors);
            })
            .catch((error) => {
                const message = error.response.data.message;
                toast.error(message, {
                    duration: 3000,
                });
            })
            .finally(() => {
                setDebtorsIsLoading(false);
            });
    }, []);

    return (
        <Card className="mt-4 py-5 transition-shadow hover:shadow-md">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Top Debtors</CardTitle>
                        <CardDescription>Customers with outstanding balances</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {debtorsIsLoading ? (
                    <div>
                        <div className="flex w-full items-center gap-2 p-2">
                            <Skeleton className="h-[40px] min-w-[40px] rounded-full bg-gray-200/60" />
                            <div className="grid w-full gap-1">
                                <Skeleton className="flex h-[15px] w-full items-center justify-center rounded-full bg-gray-200/60"></Skeleton>
                                <Skeleton className="flex h-[15px] w-8/12 items-center justify-center rounded-full bg-gray-200/60"></Skeleton>
                            </div>
                            <Skeleton className="h-[10px] min-w-[25px] bg-gray-200/50" />
                        </div>
                        <div className="flex w-full items-center gap-2 p-2">
                            <Skeleton className="h-[40px] min-w-[40px] rounded-full bg-gray-200/60" />
                            <div className="grid w-full gap-1">
                                <Skeleton className="flex h-[15px] w-full items-center justify-center rounded-full bg-gray-200/60"></Skeleton>
                                <Skeleton className="flex h-[15px] w-8/12 items-center justify-center rounded-full bg-gray-200/60"></Skeleton>
                            </div>
                            <Skeleton className="h-[10px] min-w-[25px] bg-gray-200/50" />
                        </div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-8 pl-4">Customer</TableHead>
                                <TableHead className="h-8 text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {debtorsData &&
                                debtorsData.slice(0,3).map((debtor) => (
                                    <TableRow key={debtor.id} className="h-10 hover:bg-muted/50">
                                        <TableCell className="pl-4">
                                            <div className="flex items-center">
                                                <Avatar className="mr-2 h-6 w-6">
                                                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                                        {debtor.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium">{debtor.name}</div>
                                                    <div className="text-xs text-muted-foreground">Phone:{debtor.phone}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-medium">Ksh {debtor.balance.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">Since: {formatDate(debtor.since)}</div>
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
