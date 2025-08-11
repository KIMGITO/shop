import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { toast } from 'sonner';

type CustomerFormData = {
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

export default function CustomerForm({ initialData }: { initialData?: CustomerFormData & { id?: number } }) {
    const isEditing = Boolean(initialData?.id);

    const { data, setData, post, put, processing, errors, reset } = useForm<CustomerFormData>({
        id: initialData?.id ?? -1,
        uuid: initialData?.uuid ?? '',
        first_name: initialData?.first_name ?? '',
        last_name: initialData?.last_name ?? '',
        email: initialData?.email ?? '',
        home: initialData?.home ?? '',
        house_number: initialData?.house_number ?? '',
        phone: initialData?.phone ?? '',
        bill_cycle: initialData?.bill_cycle ?? 'Daily',
        note: initialData?.note ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('customers.update', initialData?.uuid));
        } else {
            post(route('customers.store'), {
                onSuccess: () => {
                    reset();
                    toast.success(isEditing ? 'Customer updated successfully' : 'Customer created successfully');
                },
                onError: () => {
                    toast.error('There was an error processing your request');
                },
            });
        }
    };

    return (
        <AuthLayout
            title={isEditing ? 'Edit Customer' : 'Add Customer'}
            description={isEditing ? 'Update existing customer record' : 'Create a new customer below.'}
        >
            <Head title={isEditing ? 'Edit Customer' : 'Add Customer'} />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                type="text"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. Denson"
                            />
                            {errors.first_name && <p className="text-sm font-medium text-destructive">{errors.first_name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Customer last_name</Label>
                            <Input
                                id="last_name"
                                type="text"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. Kim"
                            />
                            {errors.last_name && <p className="text-sm font-medium text-destructive">{errors.last_name}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone ?? ''}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. +1234567890"
                            />
                            {errors.phone && <p className="text-sm font-medium text-destructive">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email </Label>
                            <Input
                                id="email"
                                value={data.email ?? ''}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. denson@email.com"
                            />
                            {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label htmlFor="home">Address </Label>
                            <Input
                                id="home"
                                type="text"
                                value={data.home ?? ''}
                                onChange={(e) => setData('home', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. Five Star Meadows"
                            />
                            {errors.home && <p className="text-sm font-medium text-destructive">{errors.home}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="house_number">House Number </Label>
                            <Input
                                id="house_number"
                                type="text"
                                value={data.house_number ?? ''}
                                onChange={(e) => setData('house_number', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. 203 "
                            />
                            {errors.house_number && <p className="text-sm font-medium text-destructive">{errors.house_number}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        <div>
                            <Label className="mb-2" htmlFor="bill_cycle">
                                Bill Duration.
                            </Label>
                            <Select onValueChange={(value) => setData('bill_cycle', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={data.bill_cycle}>{data.bill_cycle || 'Bill Duration.'}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">{' Daily'}</SelectItem>
                                    <SelectItem value="weekly"> {'Weekly'}</SelectItem>
                                    <SelectItem value="monthly"> {'Monthly'}</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.bill_cycle && <p className="text-sm font-medium text-destructive">{errors.bill_cycle}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Notes</Label>
                            <textarea
                                id="note"
                                value={data.note ?? ''}
                                onChange={(e) => setData('note', e.target.value)}
                                disabled={processing}
                                placeholder="Additional notes about the customer"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.note && <p className="text-sm font-medium text-destructive">{errors.note}</p>}
                        </div>
                    </div>

                    <Button type="submit" className="mt-2 w-full" disabled={processing}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Update Customer' : 'Create Customer'}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
