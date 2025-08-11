import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/helper/formatCurrency';
import { formatDate } from '@/helper/formatDate';
import formatNumber from '@/helper/formatNumber';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link } from '@inertiajs/react';
import { strict } from 'assert';

interface Customer {
    name: string,
    phone: string
}

interface Payment{
    method: string,
    payment_date: string,
    amount_paid: string,
    balance: string,
}

interface Product{
    name: string, 
    price_per_unit: string,
    unit: string,
}

interface Stock{
    id: number,
    product: Product
}

interface Sale{
    code: string,
    quantity: string,
    payment_status: string, 
    price: number,
    date: string,
    payments: Payment[] ,
    stock:Stock,
    customer: Customer,
}


interface Credit{
    created_at: string
    amount_papid: string, 
    balance: string,
    due_date: string,
    is_paid: boolean,
    sale: Sale,
}

interface CreditProp {
    credit: Credit,
}

export default function Info({ credit }: CreditProp) {
    
    const {
        sale_date,
        due_date,
        sale_quntity,
        sale_code,
        product_name,
        sale_amount,
        product_cost,
        sale_payment_status,
        unit,
        is_paid,
        customer_name,
        customer_phone,
        paymentData,
    } = {
        sale_date: credit.sale?.date,
        sale_amount: credit.sale?.price,
        sale_code: credit.sale?.code,
        sale_quntity: credit.sale?.quantity,
        sale_payment_status: credit.sale?.payment_status,
        due_date: credit.due_date,
        product_name: credit.sale.stock?.product?.name,
        product_cost: credit.sale.stock?.product?.price_per_unit,
        unit: credit.sale.stock?.product?.unit,
        is_paid: credit.is_paid,
        customer_name: credit.sale?.customer?.name ?? 'Walk-In',
        customer_phone: credit.sale?.customer?.phone,
        paymentData: credit.sale?.payments,
    };
   

    return (
        <AppLayout>
            <Head title="Credit Information" />
            <div className="justify-center">
                <AuthLayout description="Sale" title="Sales Transaction Info">
                    <Card className={`px-3 py-9 ${is_paid ? 'bg-green-100/20 shadow-emerald-950' : 'bg-red-100/20 shadow-red-950/30'} shadow-2xl`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CardTitle>Date:</CardTitle>
                                <CardDescription className="px-2"> {formatDate(new Date().toString())} </CardDescription>
                            </div>
                            <div className="flex items-center rounded bg-primary-foreground px-0.5">
                                <CardDescription className="text-xs">{sale_code}</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center justify-around">
                            <div className="flex items-center">
                                <CardTitle className="ms-5">{customer_name}</CardTitle>
                            </div>
                            <div className="flex items-center">
                                <CardTitle className={`ms-5 ${is_paid ? 'text-green-500' : 'text-amber-500'}`}>
                                    {formatCurrency(sale_amount)}
                                </CardTitle>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs">
                            <div className="grid w-1/2">
                                <div className="flex gap-1 font-bold text-green-400">
                                    <span>{product_name}</span>
                                    <span>{sale_quntity}</span>
                                    <span> {`@ ${formatNumber(product_cost)}/${unit} `}</span>
                                </div>

                                <div className="h-full">
                                    <AppLogo />
                                </div>
                            </div>

                            <div className="grid w-1/2 ps-2  items-center">
                                {paymentData.length != 0 ? (
                                    paymentData?.map((payment, index) => (
                                        <div className="text-fold py-2">
                                            <div
                                                className={`${payment.method == 'cash' ? 'bg-amber-900 text-amber-100' : 'bg-green-900 text-green-100'} rounded-3xl text-center`}
                                            >
                                                {payment.method}
                                            </div>
                                            <div className="flex items-center justify-between text-primary-foreground px-2">
                                                <span className="text-sm font-bold text-primary">Paid</span>
                                                <span>{formatNumber(payment.amount_paid)}</span>
                                                <span className="text-sm text-primary-foreground">Ksh</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 text-primary-foreground px-2">
                                                <span className="text-sm font-bold text-primary">Bal</span>
                                                <span> {formatNumber(payment.balance)}</span>
                                                <span className="text-sm text-primary-foreground">Ksh</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center text-center text-red-500">
                                        <span className="text-sm font-bold">No Payments Made</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <CardFooter></CardFooter>
                    </Card>
                    <div className="min-w-full items-center">
                        <div className="flex w-full justify-between">
                            <Link href={route('sale.index')}>
                                <Button variant={'outline'}>
                                    {/* <ArrowBigLeft className="text-red-300" /> */}
                                    <span className="md:flex">Back</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </AuthLayout>
            </div>
        </AppLayout>
    );
}
