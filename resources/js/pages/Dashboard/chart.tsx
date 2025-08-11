import { useEffect, useState } from "react";
import axios from 'axios';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { Skeleton } from '@/components/ui/skeleton';
import { Filter } from "lucide-react";



export default function DashboardChart() {
    const [chartData, setChartData] = useState([]);
    const [chartIsLoading, setChartIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<string>('week');
    const [keys, setKeys] = useState([]);
    const [showKeys, setShowKeys] = useState(false);
    


     const generateColor = (i: number) => {
         const hue = (i * 137.508) % 360; // Golden angle approximation to spread colors
         return `hsl(${hue}, 70%, 55%)`;
     };

    // async chart data
    useEffect(() => {
        axios
            .get(`/dashboard/dashboard-data/${timeRange}`)
            .then((res) => {
                setChartData(res.data.chartData);

                const newKeys = Object.keys(res.data.chartData[0] || {}).filter((k) => k !== 'day');
                setKeys(newKeys);

                newKeys.reduce((acc, key, i) => {
                    acc[key] = generateColor(i);
                    return acc;
                }, {});
            })
            .finally(() => {
                setChartIsLoading(false);
            });
    }, [timeRange]);

     useEffect(() => {
         if (showKeys) {
             setTimeout(() => {
                 setShowKeys(false);
             }, 5000);
         }
     }, [showKeys]);


     const handleCycleChange = (cycle: string) => {
         setTimeRange(cycle);
     };


    return (
        <div>
            <Card className="transition-shadow hover:shadow-md">
                {chartIsLoading ? (
                    <div className="flex items-center justify-center space-x-4">
                        <Skeleton className="flex h-[160px] w-8/12 items-center justify-center bg-gray-600/60">cahrt loading...</Skeleton>
                    </div>
                ) : (
                    <div>
                        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                            <div>
                                <CardTitle className="text-lg">Sales Trend</CardTitle>
                                <CardDescription>{timeRange}ly performance overview</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Select value={timeRange} onValueChange={(value) => handleCycleChange(value)}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Time Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="week">Weekly</SelectItem>
                                        <SelectItem value="month">Monthly</SelectItem>
                                        <SelectItem value="year">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="m-0 h-64 w-full p-0">
                            <ResponsiveContainer width="99%" height="100%">
                                <AreaChart className="ms-0" data={chartData}>
                                    <CartesianGrid strokeDasharray="2" vertical={false} stroke="#4a5565" />
                                    <XAxis dataKey="day" tickLine axisLine={false} tickMargin={5} tick={{ fontSize: 12 }} />
                                    <YAxis
                                        tickLine={false}
                                        tick={{ textAnchor: 'end', fontSize: 11 }}
                                        axisLine={true}
                                        // domain={[0, 'dataMax + 100']}
                                    />

                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (active && payload?.length) {
                                                const sortedPayload = payload
                                                    .slice()
                                                    .sort((a, b) => Number(b.value) - Number(a.value))
                                                    .filter((i) => i.value !== 0);

                                                return (
                                                    <div className="rounded-md border bg-secondary/90 p-1 text-xs shadow-2xl">
                                                        <p className="mb-1 text-[11px] font-medium">{label}</p>
                                                        {sortedPayload.map((entry, i) => {
                                                            const colorIndex = keys.indexOf(entry.name);
                                                            return (
                                                                <p
                                                                    key={i}
                                                                    className="flex items-center gap-1"
                                                                    style={{ color: generateColor(colorIndex) }}
                                                                >
                                                                    <span>{entry.name}:</span>
                                                                    <span className="text-white">Ksh{entry.value}</span>
                                                                </p>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />

                                    {keys.map((key, i) => (
                                        <Area
                                            key={key}
                                            type="monotone"
                                            dataKey={key}
                                            stroke={generateColor(i)}
                                            fill={generateColor(i)}
                                            fillOpacity={0.25}
                                            strokeWidth={1}
                                        />
                                    ))}
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <CardFooter className="grid items-center justify-between p-4 pt-0 text-sm">
                            <div onClick={() => setShowKeys(!showKeys)} className="flex items-center gap-3">
                                {!showKeys ? 'Show Keys' : 'Hide Keys'} <div className="h-3 w-3 bg-blue-500"> </div>{' '}
                            </div>

                            <div hidden={!showKeys} className={`flex flex-wrap items-center gap-4`}>
                                {keys.map((key, i) => (
                                    <div key={key} className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: generateColor(i) }}></div>
                                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardFooter>
                    </div>
                )}
            </Card>
        </div>
    );
}