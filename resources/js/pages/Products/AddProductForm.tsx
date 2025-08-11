import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AuthLayout from '@/layouts/auth-layout';

type ProductData = {
    name: string;
    unit: string;
    price_per_unit: number;
    is_active: boolean;
    is_updaterble: boolean,
};

export default function ProductForm({ initialData }: { initialData?: ProductData & { uuid?: string } }) {
    const isEditing = !!initialData?.uuid;

   

    const { data, setData, post, put, processing, errors, reset } = useForm<ProductData>({
        name: initialData?.name ?? '',
        unit: initialData?.unit ?? '',
        price_per_unit: initialData?.price_per_unit ?? 0,
        is_active: initialData?.is_active ?? true,
        is_updaterble: initialData?.is_updaterble ?? false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const url = isEditing ? route('product.update', initialData?.uuid) : route('product.store');

        const method = isEditing ? put : post;
        method(url, {
            onSuccess: () => {
                if (!isEditing) reset();
            },
        });
    };

    return (
        <AuthLayout
            title={isEditing ? 'Edit Product' : 'Add Product'}
            description={isEditing ? 'Update existing product record' : 'Record received product below.'}
        >
            <form onSubmit={submit} className="w-full max-w-xl space-y-6">
                <div>
                    <Input
                        id="name"
                        type="text"
                        placeholder="e.g. Milk"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                    />
                    <InputError message={errors.name} />
                </div>

                <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                        id="unit"
                        type="text"
                        placeholder="e.g. litre"
                        value={data.unit}
                        onChange={(e) => setData('unit', e.target.value)}
                        disabled={processing}
                    />
                    <InputError message={errors.unit} />
                </div>

                <div>
                    <Label htmlFor="price_per_unit">Price per Unit</Label>
                    <Input
                        id="price_per_unit"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 50"
                        value={data.price_per_unit}
                        onChange={(e) => setData('price_per_unit', parseFloat(e.target.value))}
                        disabled={processing}
                    />
                    <InputError message={errors.price_per_unit} />
                </div>

                <div className="flex justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked)}
                            disabled={processing}
                        />
                        <Label htmlFor="is_active">Available for Sale</Label>
                    </div>
                    <InputError message={errors.is_active} />

                    <div className="flex items-center gap-2">
                        <Switch
                            id="is_updaterble"
                            checked={data.is_updaterble}
                            onCheckedChange={(checked) => setData('is_updaterble', checked)}
                            disabled={processing}
                        />
                        <Label htmlFor="is_updaterble">Quantity updaterble?</Label>
                    </div>
                    <InputError message={errors.is_updaterble} />
                </div>

                <Button type="submit" disabled={processing} className="w-full">
                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Update Product' : 'Add Product'}
                </Button>
            </form>
        </AuthLayout>
    );
}
