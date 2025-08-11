import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import AddSalesForm from './AddSale';
import { Customer, Stock } from '../Dashboard/types';

// interface Product {
//     id: number;
//     name: string;
//     price_per_unit: number;
//     unit: string;
// }


// interface Stock{
//     stock_id: number
//     quantity_received: string,
//     quantity_available: string,
//     receipt: string,
//     date: string,
//     source: string,
//     product: Product,
// }

// interface Customer {
//     id: number;
//     name: string;
    
// }

// interface Props {
//     products: Product[];
//     stocks: Stock[],
//     customers: Customer[];
// }




interface SaleProps {
    stocks: Stock[];
    customers: Customer[];
}

const breadcrumb = [
    {
        title: 'HOME',
        href: '/dashboard',
    },
    {
        title: 'Sales',
        href: '/sale',
    },
    {
        title: 'Add new sale',
        href: '/sale/create',
    }
];

export default function AddSale({ customers, stocks }: SaleProps) {
    
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Record New Sale" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <AddSalesForm stocksData={stocks} customersData={customers} />
            </div>
        </AppLayout>
    );
}
