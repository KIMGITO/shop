import { router } from '@inertiajs/react';
import { Bell, CreditCard, Package, ShoppingCart, User } from 'lucide-react';
import { Debtor, Employee, InventoryItem, Order, QuickAction } from './types';

export const inventoryStatus: InventoryItem[] = [
    { id: '1', item: 'Fresh Milk', stock: 85, status: 'good', unit: 'liters', lastRestock: '2 days ago', supplier: 'MilkCo' },
    { id: '2', item: 'Mala', stock: 45, status: 'warning', unit: 'liters', lastRestock: '5 days ago', supplier: 'DairyDelight' },
    { id: '3', item: 'Cakes', stock: 22, status: 'critical', unit: 'pieces', lastRestock: '1 week ago', supplier: 'BakeryPlus' },
    { id: '4', item: 'Kienyeji Eggs', stock: 65, status: 'good', unit: 'trays', lastRestock: '3 days ago', supplier: 'FarmFresh' },
    { id: '5', item: 'Regular Eggs', stock: 30, status: 'warning', unit: 'trays', lastRestock: '4 days ago', supplier: 'PoultryDirect' },
];

export const employees: Employee[] = [
    { id: '1', name: 'Susan Njeri', role: 'Cashier', shift: 'morning', hoursWorked: 40 },
    { id: '2', name: 'David Mwangi', role: 'Server', shift: 'afternoon', hoursWorked: 35 },
    { id: '3', name: 'Grace Wambui', role: 'Manager', shift: 'morning', hoursWorked: 45 },
    { id: '4', name: 'Peter Kamau', role: 'Cleaner', shift: 'evening', hoursWorked: 30 },
];

export const popularItems = [
    { id: '1', name: 'Fresh Milk', sales: 342, revenue: 68400, profitMargin: 35 },
    { id: '2', name: 'Mala', sales: 278, revenue: 55600, profitMargin: 40 },
    { id: '3', name: 'Cakes', sales: 189, revenue: 94500, profitMargin: 50 },
    { id: '4', name: 'Kienyeji Eggs', sales: 156, revenue: 46800, profitMargin: 30 },
    { id: '5', name: 'Regular Eggs', sales: 132, revenue: 26400, profitMargin: 25 },
];

export const debtors: Debtor[] = [
    { id: '1', name: 'John Kamau', amount: 45000, since: '2 weeks', lastPayment: '1 week ago', phone: '0712345678' },
    { id: '2', name: 'Mary Wambui', amount: 32000, since: '1 week', lastPayment: '3 days ago', phone: '0723456789' },
    { id: '3', name: 'James Mwangi', amount: 18600, since: '3 days', lastPayment: '1 day ago', phone: '0734567890' },
    { id: '4', name: 'Grace Atieno', amount: 15000, since: '5 days', lastPayment: '2 days ago', phone: '0745678901' },
    { id: '5', name: 'Peter Otieno', amount: 15000, since: '1 day', lastPayment: 'Never', phone: '0756789012' },
];

export const recentOrders: Order[] = [
    {
        id: 'ORD-001',
        customer: 'John Kamau',
        items: [
            { name: 'Milk', quantity: 2, price: 500 },
            { name: 'Eggs', quantity: 1, price: 200 },
        ],
        total: 1200,
        time: '10:30 AM',
        status: 'completed',
        paymentMethod: 'mpesa',
    },
    {
        id: 'ORD-002',
        customer: 'Mary Wambui',
        items: [
            { name: 'Mala', quantity: 1, price: 500 },
            { name: 'Cake', quantity: 1, price: 300 },
        ],
        total: 800,
        time: '11:15 AM',
        status: 'completed',
        paymentMethod: 'cash',
    },
    {
        id: 'ORD-003',
        customer: 'James Mwangi',
        items: [{ name: 'Kienyeji Eggs', quantity: 1, price: 450 }],
        total: 450,
        time: '12:45 PM',
        status: 'preparing',
        paymentMethod: 'credit',
    },
    {
        id: 'ORD-004',
        customer: 'Grace Atieno',
        items: [
            { name: 'Milk', quantity: 1, price: 500 },
            { name: 'Mala', quantity: 1, price: 200 },
        ],
        total: 700,
        time: '1:30 PM',
        status: 'pending',
        paymentMethod: 'mpesa',
    },
    {
        id: 'ORD-005',
        customer: 'Peter Otieno',
        items: [
            { name: 'Cake', quantity: 1, price: 600 },
            { name: 'Eggs', quantity: 1, price: 350 },
        ],
        total: 950,
        time: '2:15 PM',
        status: 'completed',
        paymentMethod: 'cash',
    },
];

export const weeklySalesData = [
    { day: 'Mon', milk: 12000, mala: 8000, cakes: 15000, eggs: 6000, total: 41000 },
    { day: 'Tue', milk: 9000, mala: 12000, cakes: 8000, eggs: 7000, total: 36000 },
    { day: 'Wed', milk: 15000, mala: 6000, cakes: 12000, eggs: 9000, total: 42000 },
    { day: 'Thu', milk: 8000, mala: 15000, cakes: 9000, eggs: 12000, total: 44000 },
    { day: 'Fri', milk: 12000, mala: 9000, cakes: 15000, eggs: 8000, total: 44000 },
    { day: 'Sat', milk: 18000, mala: 12000, cakes: 20000, eggs: 10000, total: 60000 },
    { day: 'Sun', milk: 10000, mala: 8000, cakes: 18000, eggs: 6000, total: 42000 },
];

export const monthlyTrendData = [
    { days: 'Jan', sales: 180000, expenses: 120000, profit: 60000 },
    { days: 'Feb', sales: 195000, expenses: 130000, profit: 65000 },
    { days: 'Mar', sales: 210000, expenses: 140000, profit: 70000 },
    { days: 'Apr', sales: 185000, expenses: 125000, profit: 60000 },
    { days: 'May', sales: 220000, expenses: 150000, profit: 70000 },
    { days: 'Jun', sales: 215678, expenses: 145000, profit: 70678 },
];

export const todaySales = 4;
export const monthlySales = 215678.5;
export const totalCustomers = 2350;
export const newCustomers = 124;
export const totalDebts = 125600;
export const pendingOrders = 8;
export const dailyTarget = 30;
export const monthlyTarget = 250000;
export const targetAchievement = Math.round((monthlySales / monthlyTarget) * 100);

export const quickActions: QuickAction[] = [
    {
        icon: <ShoppingCart className="h-5 w-5" />,
        label: 'New Sale',
        action: () => {
            router.visit(route('sale.create'));
        },
        color: 'bg-blue-100 text-blue-600',
    },
    {
        icon: <Package className="h-5 w-5" />,
        label: 'Add Stock',
        action: () => {
            router.visit(route('stock.create'));
        },
        color: 'bg-green-100 text-green-600',
    },
    {
        icon: <CreditCard className="h-5 w-5" />,
        label: 'Record Payment',
        action: () => console.log('Record Payment'),
        color: 'bg-purple-100 text-purple-600',
    },
    {
        icon: <User className="h-5 w-5" />,
        label: 'Add Customer',
        action: () => {
            router.visit(route('customers.create'));
        },
        color: 'bg-orange-100 text-orange-600',
    },
    {
        icon: <Bell className="h-5 w-5" />,
        label: 'Create Reminder',
        action: () => console.log('Create Reminder'),
        color: 'bg-red-100 text-red-600',
    },
];
