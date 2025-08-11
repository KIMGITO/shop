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

export interface Product {
    id: number;
    name: string;
    price: number;
    unit: string;
    description?: string;
    is_active: boolean;
}

export interface Stock {
    id: number;
    product_id: number;
    quantity: number;
    batch_number?: string;
    expiry_date?: string;
}

export interface SaleStock {
    id: number;
    sale_id: number;
    stock_id: number;
    quantity: number;
    price_per_unit: number;
    subtotal: number;
    stock: Stock & {
        product: Product;
    };
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

export interface SalesResponse {
    data: Sale[];
    meta?: {
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
    };
}

export interface CreateSaleRequest {
    customer_id: number;
    items: Array<{
        stock_id: number;
        quantity: number;
        price_per_unit?: number;
    }>;
    payment?: {
        amount: number;
        method: 'cash' | 'mpesa' | 'credit' | 'bank';
    };
}

export interface UpdateSaleRequest {
    customer_id?: number;
    payment_status?: 'paid' | 'partial' | 'unpaid';
    payments?: Array<{
        amount: number;
        method: 'cash' | 'mpesa' | 'credit' | 'bank';
    }>;
}
