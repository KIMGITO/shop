import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { ArrowUpDown, CheckCircle, Clock, XCircle } from "lucide-react";
import { employees, recentOrders } from "./data";
import { Order } from "./types";


export default function DashboardBottom() {

     const PaymentBadge = ({ method }: { method: Order['paymentMethod'] }) => {
         const methodMap = {
             cash: { color: 'bg-gray-100 text-gray-800', label: 'Cash' },
             mpesa: { color: 'bg-green-100 text-green-800', label: 'M-Pesa' },
             credit: { color: 'bg-orange-100 text-orange-800', label: 'Credit' },
         };

         return (
             <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${methodMap[method].color}`}>
                 {methodMap[method].label}
             </span>
         );
     };
       const StatusBadge = ({ status }: { status: Order['status'] }) => {
           const statusMap = {
               completed: { color: 'bg-green-100 text-green-800', label: 'Completed', icon: <CheckCircle className="h-3 w-3" /> },
               preparing: { color: 'bg-yellow-100 text-yellow-800', label: 'Preparing', icon: <Clock className="h-3 w-3" /> },
               pending: { color: 'bg-red-100 text-red-800', label: 'Pending', icon: <XCircle className="h-3 w-3" /> },
           };

           return (
               <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMap[status].color}`}>
                   {statusMap[status].icon}
                   {statusMap[status].label}
               </span>
           );
       };
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Recent Orders with status indicators */}
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                    <div>
                        <CardTitle className="text-lg">Recent Orders</CardTitle>
                        <CardDescription>Today's transactions</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            Sort
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary">
                            View All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-8 pl-4">Order</TableHead>
                                <TableHead className="h-8">Customer</TableHead>
                                <TableHead className="h-8 text-right">Amount</TableHead>
                                <TableHead className="h-8 pr-4">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order) => (
                                <TableRow key={order.id} className="h-10 hover:bg-muted/50">
                                    <TableCell className="pl-4">
                                        <div className="text-sm font-medium">{order.id}</div>
                                        <div className="text-xs text-muted-foreground">{order.time}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{order.customer}</div>
                                        <PaymentBadge method={order.paymentMethod} />
                                    </TableCell>
                                    <TableCell className="text-right font-medium">Ksh {order.total}</TableCell>
                                    <TableCell className="pr-4">
                                        <StatusBadge status={order.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Staff Schedule */}
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                    <div>
                        <CardTitle className="text-lg">Staff Schedule</CardTitle>
                        <CardDescription>Today's shifts and hours</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                        View All
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-8 pl-4">Employee</TableHead>
                                <TableHead className="h-8">Role</TableHead>
                                <TableHead className="h-8">Shift</TableHead>
                                <TableHead className="h-8 pr-4 text-right">Hours</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id} className="h-10 hover:bg-muted/50">
                                    <TableCell className="pl-4">
                                        <div className="flex items-center">
                                            <Avatar className="mr-2 h-6 w-6">
                                                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                                                    {employee.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-sm font-medium">{employee.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{employee.role}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {employee.shift}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="pr-4 text-right">
                                        <div className="font-medium">{employee.hoursWorked}h</div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}