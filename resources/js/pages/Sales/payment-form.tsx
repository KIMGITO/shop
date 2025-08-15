import { Euro, Loader, X } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/helper/formatCurrency';
import { formatDate } from '@/helper/formatDate';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PaymentProp, Sale } from '../Dashboard/types';
import { Toaster } from '@/components/ui/sonner';

export default function PaymentForm({ saleId, saleBalance, onClose, onChange }: { saleId: number; balance: number; onClose :any, onChange:any}) {
    const [sale, setSale] = useState<Sale>();
    const [id, setId] = useState(saleId);
    const [saleLoading, setSaleLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [balance, setBalance] = useState(saleBalance);
    const [paymentData, setPaymentData] = useState<PaymentProp>({
        sale_id: saleId,
        amount_paid: 0,
        balance: 0,
        method: 'mpesa',
        new_balance: 0,
        date: formatDate(new Date().toISOString()),
    });

   

  

    useEffect(() => {
        axios
            .get(`/sale/${saleId}/read`)
            .then((res) => {
                setSale(res.data.sale);
                setBalance(saleBalance);
            })
            .catch((error) => {
                const message = error.response.paymentData.message;
                toast.error(message, { duration: 2000 });
            })
            .finally(() => {
                setTimeout(() => {
                    setSaleLoading(false);
                },3000)
                setPaymentData((pre) => ({
                    ...pre,
                    sale_id: sale?.id || -1,
                }));
            });
    }, [saleId, sale?.id,saleBalance]);

    useEffect(() => {
        const newBalance = balance - paymentData.amount_paid;
        setPaymentData((pre) => ({
            ...pre,
            new_balance: isNaN(newBalance) ? balance : newBalance < 0 ? 0 : Number(newBalance),
        }));
    }, [paymentData.balance, paymentData.amount_paid, balance, ]);

    const submit = () => {
        setProcessing(true);
         
        axios
            .post('/payments', paymentData)
            .then((res) => {

                
                toast.success(res.data.message, { duration: 3000 });
                axios.get(`/sale/${saleId}`).then((res) => {
                    setSale(res.data);
                });
                setPaymentData({
                    sale_id: saleId,
                    amount_paid: 0,
                    balance: 0,
                    method: 'mpesa',
                    new_balance: 0,
                    date: formatDate(new Date().toISOString()),
                });
                onClose();
                onChange();
            })
            .catch((error) => {
                const message = error.response.data.message;
                
                toast.error(message, { duration: 3000 });
            })
            .finally(() => {
                setProcessing(false);
                
            });
    };

    return saleLoading ? (
        <DrawerContent className="sm:max-w-md cursor-progress">
            <div className="flex w-full flex-col space-y-2 py-12">
                <div className="flex w-full items-center justify-center space-y-4">
                    <Skeleton className="w-10/12 justify-center bg-gray-500/50">
                        <div className="flex w-full justify-between p-2">
                            <Skeleton className="h-[20px] w-4/12 bg-gray-200/50" />
                            <div className="h-[40px] min-w-[40px] cursor-pointer rounded-full bg-black flex items-center justify-center" onClick={()=>onClose()} >
                                <X className='text-white'/>
                                </div>
                        </div>
                        <div className="flex w-full justify-between p-2">
                            <Skeleton className="h-[20px] w-1/12 bg-gray-200/50" />
                            <Skeleton className="h-[20px] w-6/12 bg-gray-200/50" />
                        </div>
                        <div className="ms-5 mt-15 flex w-11/12 justify-between">
                            <Skeleton className="grid h-full w-12/12 grid-cols-2 gap-4 bg-gray-200/50 p-3">
                                <Input className="h-[20px] bg-amber-900/30" disabled />
                                <Input className="h-[20px] bg-amber-900/30" disabled />
                                <Input className="h-[20px] bg-amber-900/30" disabled />
                                <Input className="h-[20px] bg-amber-900/30" disabled />
                            </Skeleton>
                        </div>
                        <div className="ms-5 mt-15 flex w-11/12 justify-between">
                            <Skeleton className="grid h-full w-12/12 grid-cols-2 gap-4 bg-gray-200/50 p-3">
                                <Input className="h-[20px] bg-amber-900/30" disabled />
                                <Input className="h-[20px] bg-amber-900/30" disabled />
                                <Input className="h-[20px] bg-amber-900/30" disabled />
                                <Input className="h-[20px] bg-amber-900/30" disabled />
                            </Skeleton>
                        </div>
                        <div className="mt-20 flex w-full justify-center py-8">
                            <Skeleton className="h-[28px] w-8/12 rounded bg-gray-200 flex justify-center" >
                                <Loader className='animate-spin text-red-900/40 items-center '/>
                            </Skeleton>

                        </div>
                    </Skeleton>
                </div>
            </div>
        </DrawerContent>
    ) : (
        <DrawerContent className="sm:max-w-md">
            <DrawerHeader className="border-b border-gray-200 dark:border-gray-800">
                <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">Record Payment</DrawerTitle>
                <DrawerDescription className="text-gray-500 dark:text-gray-400">
                    Invoice: <span className="font-medium text-gray-700 dark:text-gray-300">{sale?.invoice_number}</span>
                </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-6 p-6">
                <div className="8.00gap-6 grid grid-cols-2">
                    <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer</Label>
                        <p className="text-base font-semibold text-green-600 dark:text-green-400">
                            {sale?.customer?.first_name || 'Walk-in Customer'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</Label>
                        <p className="text-base font-semibold text-green-600 dark:text-green-400">{formatCurrency(sale?.balance || 0)}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Amount
                    </Label>
                    <Input
                        id="amount"
                        type="number"
                        min="0"
                        max={sale?.balance}
                        step="any"
                        value={paymentData.amount_paid > balance ? balance : paymentData.amount_paid || ''}
                            onChange={(e) =>
                            
                            {
                                if (parseFloat(e.target.value) > balance) {
                                    setPaymentData((pre) => ({
                                ...pre,
                                amount_paid: balance,
                            }))
                                } else {
                                 setPaymentData((pre) => ({
                                ...pre,
                                amount_paid: parseFloat(e.target.value),
                            }))   
                                }
                                }
                        }
                        disabled={processing}
                        className="focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    />
                    {/* <InputError message={errors.amount_paid} className="text-sm text-red-600 dark:text-red-400" /> */}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method</Label>
                    <Select
                        value={paymentData.method}
                        onValueChange={(value) => setPaymentData((pre) => ({ ...pre, method: value }))}
                        disabled={processing}
                    >
                        <SelectTrigger className="focus:border-green-500 focus:ring-2 focus:ring-green-500">
                            <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                            <SelectItem value="mpesa" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                MPESA
                            </SelectItem>
                            <SelectItem value="cash" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                Cash
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {/* <InputError message={errors.method} className="text-sm text-red-600 dark:text-red-400" /> */}
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">New Balance</Label>
                    <Input value={paymentData.new_balance} disabled className="bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white" />
                </div>

                <Button
                    onClick={submit}
                    className="w-full bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    disabled={processing}
                >
                    {processing ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        'Submit Payment'
                    )}
                </Button>
            </div>

            <DrawerFooter className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                <DrawerClose asChild>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onClose();
                        }}
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    );
}

   

