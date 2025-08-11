import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface product {
    name: string;
    unit: string;
}

interface stock {
    id: number;
    product: product;
    quantity_available: number;
    date: string;
    source: string;
}

interface StockProp {
    stock: stock;
}

export default function ({ stock }: StockProp) {
    interface StockFormProp {
        quantity: number;
        total_quantity: number;
    }

    const { data, processing, put, setData, errors } = useForm({
        quantity: 0,
        source: '',
        total_quantity: stock.quantity_available,
    });



    const handleChange = (e: string) => {
        const v = parseFloat(e);
        const value = parseFloat(v.toFixed(1));
        if (!isNaN(value)) {
            const totalQty = Number(value) < 0 ? stock.quantity_available : Number(value) + Number(stock.quantity_available);

            setData('quantity', value < 0 ? 0 : value);
            setData('total_quantity', totalQty);
        } else {
            setData('quantity', 0);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log(data);
        put(route('stock.updateQty', stock.id));
    };

    return (
        <AppLayout>
            <Head title="Update Stock" />
            <AuthLayout title="Update Stock" description=" ">
                <Card className="px-4 pt-5">
                    <form onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="flex justify-between gap-4">
                                <div className="gap-4">
                                    <Label htmlFor="product">Product</Label>
                                    <Input disabled={true} className="mt-2" id="product" value={stock.product.name} placeholder="" />
                                </div>
                                <div className="gap-4">
                                    <Label htmlFor="date">Stock Date</Label>
                                    <Input disabled={true} value={stock.date} id="date" className="mt-2" placeholder="" />
                                </div>
                            </div>
                            <div className="flex justify-between gap-4">
                                <div className="gap-4">
                                    <Label htmlFor="source">Source</Label>
                                    <Input value={stock.source ?? 'KayKays'} id="source" disabled={true} className="mt-2" placeholder="" />
                                </div>
                                <div className="gap-4">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        value={stock.quantity_available + ' ' + stock.product.unit}
                                        id="quantity"
                                        disabled={true}
                                        className="mt-2"
                                        step="any"
                                    />
                                </div>
                            </div>
                            <div className="gap-4">
                                <Label htmlFor="quantity">Add More Stock</Label>
                                <Input
                                    value={data.quantity == 0 ? '' : data.quantity}
                                    onChange={(e) => handleChange(e.target.value)}
                                    id="quantity"
                                    type="number"
                                    disabled={false}
                                    className="mt-2"
                                    min={0}
                                    step="any"
                                />
                                <InputError message={errors.quantity} />
                                <div className="px-4 pt-2 text-end text-xs">
                                    New Stock Quantity: {data.total_quantity} {stock.product.unit}
                                </div>
                            </div>

                            <div className="gap-4">
                                <Label htmlFor="source">Source</Label>
                                <Input
                                    value={data.source}
                                    onChange={(e) => {
                                        setData('source', e.target.value);
                                    }}
                                    id="source"
                                    disabled={false}
                                    className="mt-2"
                                />
                                <InputError message={errors.source} />
                                
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="animate-spin" />} Update Stock
                            </Button>
                        </div>
                    </form>
                </Card>
            </AuthLayout>
        </AppLayout>
    );
}


