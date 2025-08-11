import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, User, AlertCircle, Coffee } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// interface Data {
//     totalCustomers: number;
// }

export default function DashboardStatusCards({
    data,
}: {
    data: {
        totalCustomers: number;
        todaySales: number;
        dailyTarget: number;
        monthlyTarget: number;
        monthlySales: number;
        newCustomers: number;
        pendingOrders: number;
        recentOrders: number;
        totalDebts: number;
        debtors: number;
        targetAchievement: number;
        targetCustomers: number;
    };
}) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-xl font-bold">Ksh {data.todaySales.toLocaleString()}</div>
                    <Progress value={(data.todaySales / data.dailyTarget) * 100} className="mt-2 h-2" />
                    <p className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{Math.round((data.todaySales / data.dailyTarget) * 100)}% of target</span>
                        <span>Target: Ksh {data.dailyTarget.toLocaleString()}</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-xl font-bold">Ksh {data.monthlySales.toLocaleString()}</div>
                    <Progress value={data.targetAchievement} className="mt-2 h-2" />
                    <p className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{data.targetAchievement}% of target</span>
                        <span>Target: Ksh {data.monthlyTarget.toLocaleString()}</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Customers</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-xl font-bold">{data.totalCustomers.toLocaleString()}</div>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">+{data.newCustomers} <br/>today</span>
                        <span className="text-xs text-green-500">{Number(data.totalCustomers) / Number(data.targetCustomers) * 100}% <br/>of target</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Total Debts</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-xl font-bold">Ksh {data.totalDebts.toLocaleString()}</div>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{data.debtors}<br/> debtors</span>
                        <span className="text-xs text-red-500">-{Math.round(data.totalDebts/data.monthlySales)*100 } % of <br/> Monthly Sales</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    <Coffee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-xl font-bold">{data.pendingOrders}</div>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{data.recentOrders} active</span>
                        <span className="text-xs text-yellow-500">+2 today</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}