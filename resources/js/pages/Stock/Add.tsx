 // <- this is the form from earlier
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import StockForm from './AddStockForm';

interface Product  {
    id: number;
    name: string;
    unit: string;
};

interface StockData {
    product_id: string;
    quantity_received: number;
    date: string;
    source?: string;
}

interface Props  {
    products: Product[];
   
};


const breadcrumb = [
    {
        title: 'Products Stock ',
        href: '/stock',
    },
    {
        title: 'Stock a product',
        href: '/stock/create',
    },
];

export default function Add({ products }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Add Stock" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <StockForm products={products} />
            </div>
        </AppLayout>
    );
}
