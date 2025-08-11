import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomProgress } from '@/components/ui/customProgress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import formatNumber from '@/helper/formatNumber';
import { formatSmartDate } from '@/helper/formatSmartDate';
import { StockItem } from './types';
import { useEffect, useState } from 'react';
import axios from 'axios';
export default function InventoryAlert() {
    const [stockData, setStockData] = useState<StockItem[]>([]);
    // const [emptyStockData, setEmptyStockData] = useState(true);
    const [stockIsLoading, setStockIsLoading] = useState(true);
    const [quote, setQuote] = useState<{ body: string, author: string }>({
        body: 'This will be the quotes body. To show the quote text.',
        author: '-Quote Author'
    });

    useEffect(() => {
        axios
            .get(`dashboard/dashboard-data`)
            .then((res) => {
                setStockData(res.data.stockData);
                
            })
            .finally(() => {
                setStockIsLoading(false);
            });
    }, []);
    
    
    // axios.get('/quotes').then(
    //     (res) => {
    //         setQuote({
    //             body: res.data.quote.body,
    //             author: res.data.quote.author
    //         })
    //     }
    // )
    
    // useEffect(() => {
    //     setTimeout(() => {
    //                 axios.get('/quotes').then(
    //                     (res) => {
    //                         setQuote({
    //                             body: res.data.quote.body,
    //                             author: res.data.quote.author
    //                         })

    //                   }
    //               )
    //           },1000*60)
    //     })

        // if (stockData.length > 0) {
        //     setEmptyStockData(false);
        // }

        useEffect(() => {
            const fetchQuote = () => {
                axios.get('/quotes').then((res) => {
                    setQuote({
                        body: res.data.quote.body,
                        author: res.data.quote.author,
                        
                    });
                });
            };

            // fetch immediately
            fetchQuote();

            // fetch every 60s
            const intervalId = setInterval(fetchQuote, 60 * 2000);

            // cleanup when component unmounts
            return () => clearInterval(intervalId);
        }, []);

    
  
        {
            return stockData.filter((i) => i.status !== 'good').length < 1 ? (
                <Skeleton>
                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle>Random Quotes</CardTitle>
                            <CardDescription>for inspiring you.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center font-extralight text-green-400">
                            <i> {quote.body}</i>
                        </CardContent>
                        <CardFooter className="items-baseline justify-end text-end font-medium text-ellipsis text-blue-400/70">
                            <p>{quote.author}</p>
                        </CardFooter>
                    </Card>
                </Skeleton>
            ) : (
                <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">Inventory Alerts</CardTitle>
                        <CardDescription>Items needing attention</CardDescription>
                    </CardHeader>
                    <ScrollArea className="min-w-full">
                        {stockIsLoading ? (
                            <div className="flex items-center justify-center space-x-4">
                                <Skeleton className="flex h-[250px] w-11/12 items-center justify-center bg-gray-600/60">Stock Loading...</Skeleton>
                            </div>
                        ) : (
                            <CardContent className="flex space-x-3 overflow-visible p-4">
                                {stockData
                                    .filter((i) => i.status !== 'good')
                                    .map((item) => {
                                        const statusColor = {
                                            good: 'text-green-500',
                                            warning: 'text-yellow-500',
                                            critical: 'text-red-500',
                                            unknown: 'text-gray-300',
                                        }[item.status];

                                        return (
                                            <div key={item.id} className="min-w-3/12 flex-col items-center justify-center text-center">
                                                <div className="grid items-center text-sm">
                                                    <span className="font-medium">{item.item}</span>
                                                    <span className={`font-semibold ${statusColor}`}>
                                                        {formatNumber(item.stock)}/{formatNumber(item.received)} <br /> {item.unit}
                                                    </span>
                                                </div>
                                                {/* <Progress value={item.stock} className="h-4" color={statusColor} /> */}
                                                <div className="flex justify-center">
                                                    <CustomProgress value={item.value} direction="vertical" className="rounded-0 w-15" />
                                                </div>
                                                <div className="grid text-xs text-muted-foreground">
                                                    <span>Last restock: {formatSmartDate(item.lastRestock)}</span>
                                                    <span>Source: {item.supplier}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </CardContent>
                        )}

                        <ScrollBar orientation="horizontal" hidden={false} />
                    </ScrollArea>
                </Card>
            );
        }
    }
