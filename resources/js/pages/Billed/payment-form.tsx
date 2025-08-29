import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/helper/formatCurrency';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type PaymentMethod = 'cash' | 'mpesa';

interface Payment {
    id: number | null;
    amount: number;
    method: PaymentMethod | null;
}

interface formProps {
    balance: number;
    id: number;
    name: string;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function PaymentForm({ balance,name, id, onSuccess, onCancel }: formProps) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({
        amount: '',
        method: '',
    });

    const { data, setData } = useForm({
        id: id,
        amount: 0,
        method: '',
    });

    useEffect(() => {
        if (data.amount != 0) {
            setErrors((prev) => ({ ...prev, amount: '' }));
        }
        if (data.method != '') {
            setErrors((prev) => ({ ...prev, method: '' }));
        }
    }, [data.amount, data.method]);

    useEffect(() => {
        setData('id', id);
    }, [id, setData]);

    const handleAmountChange = (amount: number) => {
        if (amount > balance) {
            setData('amount', balance);
            console.log(data.amount);
        } else {
            setData('amount', Number(amount));
        }
        setData('id', id);
    };

    const submit = () => {
        setProcessing(true);
        axios
            .post(route('billings.pay'), data)
            .then((res) => {
                console.log(res.data);
                const message = res.data.success;
                toast.success('Success', {
                    description: <div dangerouslySetInnerHTML={{ __html: message }} />,
                    duration: 3500,
                });
                setData({
                    id: 0,
                    amount: 0,
                    method: '',
                });
                
                onSuccess();
            })
            .catch((err) => {
                console.log(err.response.data)
                const errors = err.response.data.errors;
                setErrors(errors);
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <DialogOverlay  className="bg-black/90" >
            <DialogContent className="flex flex-col gap-6 ">
                <DialogTitle className='flex justify-between p-4'>
                    <span>{'Customer:'}</span>
                    <span className="capitalize">
                        <span className="text-green-500">{name}</span>
                    </span>
                </DialogTitle>
                <DialogTitle className="flex justify-between px-2">
                    <span>{'Total Billed:'}</span>
                    <span className="">
                        <span className="text-red-500">{formatCurrency(balance)}</span>
                    </span>
                </DialogTitle>

                <div>
                    <span className="font-medium"> </span>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="Amount">Amount</Label>
                        <Input
                            className=""
                            id="amount"
                            value={isNaN(Number(data.amount)) || Number(data.amount) === 0 ? '' : Number(data.amount)}
                            onChange={(e) => {
                                handleAmountChange(parseFloat(e.target.value));
                            }}
                        />
                        <InputError message={errors?.amount} />
                    </div>
                    <div>
                        <Select
                            onValueChange={(value) => {
                                setData('method', value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mpesa">MPESA</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors?.method} />
                    </div>
                    <div className="flex w-full items-center justify-around">
                        <Button
                            onClick={() => {
                                onCancel();
                                setData({ amount: 0, id: 0, method: '' });
                            }}
                            variant={'ghost'}
                        >
                            Cancel
                        </Button>
                        <Button onClick={submit} variant={'outline'} className={`${processing ? 'cursor-not-allowed' : ''}`}>
                            {processing ? <Loader2 className="animate:spin" /> : 'Pay'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </DialogOverlay>
    );
}
