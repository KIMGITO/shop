import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import CustomerForm from './AddCustomerForm';

interface Props {
    // Add any initial props you might need, like initial customer data for editing
    initialData?: {
        id: number;
        uuid: string;
        first_name: string;
        last_name: string;
        home: string;
        house_number: string;
        email: string;
        note?: string;
        bill_cycle: string;
        phone?: string;
    };
}

const breadcrumbs = [
    {
        title: 'HOME',
        href: '/dashboard',
    },
    {
        title: 'Customers',
        href: '/customers',
    },
    {
        title: 'Add Customer',
        href: '/customers/create',
    },
];

export default function AddCustomer({ initialData }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={initialData?.id ? 'Edit Customer' : 'Add New Customer'} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* <CustomerForm initialData={initialData} /> */}
                <CustomerForm initialData={initialData} />
            </div>
        </AppLayout>
    );
}
