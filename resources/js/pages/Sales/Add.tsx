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



export default function AddSale({ customers, stocks }: SaleProps) {
    
    return (
        
                <AddSalesForm stocksData={stocks} customersData={customers} />
            
    );
}
