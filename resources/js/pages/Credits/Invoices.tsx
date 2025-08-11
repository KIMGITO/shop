import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollBar } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/helper/formatCurrency';
import { formatDate } from '@/helper/formatDate';
import formatNumber from '@/helper/formatNumber';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link } from '@inertiajs/react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Download } from 'lucide-react';

interface Customer {
    name: string;
    phone: string;
    location: string;
}

interface Product {
    product_id: number;
    name: string;
    unit: string;
    price_per_unit: number;
}

interface Stock {
    product: Product;
}

interface Sale {
    id: number;
    quantity: number;
    price: number;
    date: string;
    stock: Stock;
    customer: Customer;
}

interface Invoice {
    id: number;
    created_at: string;
    balance: number;
    amount_paid: string;
    due_date: string;
    is_paid: boolean;
    sale: Sale;
}

interface AllinvoiceProps {
    invoices: {
        [customer_id: string]: Invoice;
    };
}

export default function PendingInvoices({ invoices }: AllinvoiceProps) {

    const handleInvoice = () => {
        window.location.href = `/invoice-pdf`
    }

    return (
        <AppLayout>
            <Head title="Pending Invoices" />
            <AuthLayout title="Pending Invoices" description="">
                {Object.entries(invoices).map(([index, customer_invoices]) => (
                    <Collapsible key={index} className="">
                        <CollapsibleTrigger className="font-bold">{customer_invoices[0].sale.customer.name.toUpperCase()}</CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                            <div className="overflow-auto rounded-xl border">
                                <ScrollArea>
                                    <table className="min-w-full text-xs">
                                        <thead className="bg-muted text-muted-foreground">
                                            <tr>
                                                <th className="px-2 py-1 text-left">Sale Date</th>
                                                <th className="px-2 py-1 text-left">Product</th>
                                                <th className="px-2 py-1 text-left">Qty</th>
                                                <th className="px-2 py-1 text-left">@</th>
                                                <th className="px-2 py-1 text-left">Total</th>
                                                <th className="px-2 py-1 text-left">Amt Paid</th>
                                                <th className="px-2 py-1 text-left">Balance</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {customer_invoices.map((invoice) => (
                                                <tr key={invoice.id} className="hover:bg-accent">
                                                    <td className="mx-w-2/12 truncate px-2 py-0.5 whitespace-pre-wrap">
                                                        {formatDate(invoice.sale.date)}
                                                    </td>
                                                    <td className="mx-w-2/12 truncate px-2 py-0.5 whitespace-nowrap">
                                                        {invoice.sale.stock.product.name}
                                                    </td>
                                                    <td className="mx-w-2/12 truncate px-2 py-0.5 whitespace-nowrap">
                                                        {formatNumber(invoice.sale.quantity)}
                                                    </td>
                                                    <td className="mx-w-2/12 truncate px-2 py-0.5 whitespace-nowrap">
                                                        {formatNumber(invoice.sale.stock.product.price_per_unit)}
                                                    </td>
                                                    <td className="mx-w-2/12 truncate px-2 py-0.5 whitespace-nowrap">
                                                        {formatNumber(invoice.sale.price)}
                                                    </td>
                                                    <td className="mx-w-2/12 truncate px-2 py-0.5 whitespace-nowrap">
                                                        {formatNumber(invoice.amount_paid)}
                                                    </td>
                                                    <td className="mx-w-2/12 truncate px-2 py-0.5 whitespace-nowrap">
                                                        {formatNumber(invoice.balance)}
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr className="bg-accent">
                                                <td className="px-2 py-1" colSpan={4}>
                                                    TOTAL
                                                </td>
                                                <td className="px-2 py-1">
                                                    {formatCurrency(customer_invoices.reduce((total, i) => total + Number(i.sale.price), 0))}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {formatCurrency(customer_invoices.reduce((total, i) => total + Number(i.amount_paid), 0))}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {formatCurrency(customer_invoices.reduce((total, i) => total + Number(i.balance), 0))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}

                <Button onClick={()=>handleInvoice()} className="bg-blue-500 hover:bg-blue-300 right-0 w-4/12 bottom-0 fixed ">
                    PDF <Download className="text-green" />{' '}
                </Button>
            </AuthLayout>
        </AppLayout>
    );
}
