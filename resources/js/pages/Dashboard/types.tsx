export type Employee = {
    id: string;
    name: string;
    role: string;
    shift: 'morning' | 'afternoon' | 'evening';
    hoursWorked: number;
};

export type Debtor = {
    id: string;
    name: string;
    amount: number;
    since: string;
    lastPayment: string;
    phone: string;
};

export type Order = {
    id: string;
    customer: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    time: string;
    status: 'completed' | 'preparing' | 'pending';
    paymentMethod: 'cash' | 'mpesa' | 'credit';
};

export type StockItem = {
    id: string;
    item: string;
    stock: number;
    received: number;
    status: 'good' | 'warning' | 'critical' | 'unknown';
    unit: string;
    value: number;
    lastRestock: string;
    supplier: string;
};


export type TopProducts = {
    from: string;
    to: string;
    id: string;
    name: string;
    sales: number;
    revenue: number;
}


export type PerformanceDuration = {
    from: string;
    to: string;

}
export type QuickAction = {
    icon: React.ReactNode;
    label: React.ReactNode;
    action: () => void;
    color: string;
};

export interface DashboardProps {
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
    currentCycle: string;
    salesData: any[]; 
};

export interface ReminderProps {
    id:number,
    name: string,
    description: string,
    show_on: string,
    repeat: string
}

export interface DebtorProps{
    id: number,
    name: string,
    balance: number,
    phone: string,
    since:string,

}


export interface Product {
    id: number;
    name: string;
    unit: string;
    price_per_unit: string;
}


export interface Stock {
    id: number;
    code: string;
    date: string;
    receipt: string;
    product_id: number;
    quantity_available: string;
    quantity_received: string;
    product: Product;
}

export interface SaleStock {
    id: number;
    stock_id: number;
    product_id: number;
    quantity: number;
    subtotal: number;
    created_at: string;
    stock: Stock;
}

export interface Customer {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    home: string;
    house_number: string;
    bill_cycle: 'daily' | 'weekly' | 'monthly';
    note: string;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: number;
    uuid: string;
    sale_id: number;
    amount_paid: number;
    balance: number;
    method: 'cash' | 'mpesa' | 'credit' | 'bank';
    date: string;
    created_at: string;
    updated_at: string;
}
export interface Sale {
    id: number;
    uuid: string;
    customer_id: number;
    user_id: number;
    invoice_number: string;
    date: string;
    due_date: string;
    total: number;
    balance: number;
    payment_status: 'paid' | 'partial' | 'unpaid';
    created_at: string;
    updated_at: string;
    customer: Customer;
    payments: Payment[];
    sale_stocks: SaleStock[];
}


export interface PaymentProp {
    sale_id: number;
    amount_paid: number;
    balance: number;
    method: string;
    new_balance: number;
    date: string;
}

export interface RiderProps{
    id: number;
    name: string;
    phone: string;
    active: boolean
}