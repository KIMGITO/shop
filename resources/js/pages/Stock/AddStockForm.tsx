import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { toast, Toaster } from 'sonner';

type StockFormData = {
    product_id: string;
    product_name: string;
    quantity_received: number;
    date: string;
    source?: string;
};

export default function StockForm({
    products,
    initialData,
}: {
    products: { id: number; name: string , unit: string}[];
    initialData?: StockFormData & { id?: number };
}) {
    const isEditing = Boolean(initialData?.id);
    // const { toast } = useToast();

    const { data, setData, post, put, processing, errors, reset } = useForm<StockFormData>({
        product_id: initialData?.product_id ?? '',
        quantity_received: initialData?.quantity_received ?? 0,
        date: initialData?.date ?? new Date().toISOString().split('T')[0],
        source: initialData?.source ?? '',
        product_name: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const action = isEditing
            ? put(route('stock.update', initialData?.id))
            : post(route('stock.store'), {
                  onSuccess: () => {
                      reset();
                    //   toast({
                    //       title: 'Success',
                    //       description: isEditing ? 'Stock updated successfully' : 'Stock created successfully',
                    //   });
                  },
                  onError: () => {
                    //   toast({
                    //       title: 'Error',
                    //       description: 'There was an error processing your request',
                    //       variant: 'destructive',
                    //   });
                  },
              });
    };

    return (
        <AuthLayout
            title={isEditing ? 'Edit Stock' : 'Add Stock'}
            description={isEditing ? 'Update existing stock record' : 'Record received stock below.'}
        >
            <Head title={isEditing ? 'Edit Stock' : 'Add Stock'} />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="product_id">Product</Label>
                        <Select
                            value={data.product_id}
                            onValueChange={(value) => {
                                
                                const product = JSON.parse(value);
                                setData('product_id', product.id);
                                setData('product_name', product.name);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" >{data.product_name} </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={
                                        JSON.stringify({
                                            id: product.id,
                                            name: product.name
                                        })
                                    }>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.product_id && <p className="text-sm font-medium text-destructive">{errors.product_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="quantity_received">
                            Quantity in {products.find((p) => p.id.toString() === data.product_id)?.unit || 'Unit'}{' '}
                        </Label>
                        <Input
                            id="quantity_received"
                            type="number"
                            value={data.quantity_received}
                            onChange={(e) => setData('quantity_received', parseFloat(e.target.value))}
                            disabled={processing}
                            placeholder="e.g. 50"
                        />
                        {errors.quantity_received && <p className="text-sm font-medium text-destructive">{errors.quantity_received}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} disabled={processing} />
                        {errors.date && <p className="text-sm font-medium text-destructive">{errors.date}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="source">Source (Optional)</Label>
                        <Input
                            id="source"
                            type="text"
                            value={data.source}
                            onChange={(e) => setData('source', e.target.value)}
                            disabled={processing}
                            placeholder="e.g. Farm A"
                        />
                        {errors.source && <p className="text-sm font-medium text-destructive">{errors.source}</p>}
                    </div>

                    <Button type="submit" className="mt-2 w-full" disabled={processing}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Update Stock' : 'Save Stock'}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
