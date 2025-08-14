import { Customer, RiderProps, Stock } from "../Dashboard/types";

export type PaymentMethod = 'mpesa' | 'cash' | 'credit';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface SaleItem {
    product_id: string;
    product_name: string;
    product_price: number;
    unit: string;
    stock_id: string;
    stock_code: string;
    sale_quantity: number;
    stock_available: number;
    total_price: number;
}

export interface FormData {
    customer_id: number | null;
    customer_first_name: string;
    sale_items: SaleItem[];
    payment_method: PaymentMethod;
    sale_date: string;
    payment_status: PaymentStatus;
    amount_paid: number;
    payment_balance: number;
    grand_total: number;
    delivery_tag: boolean;
    rider_id: number | null;
    delivery_address: string;
}

export interface AddSalesFormProps {
    stocksData: Stock[];
    customersData: Customer[];
    ridersData: RiderProps[];
}
