import { Link } from '@inertiajs/react';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { CheckCircle } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface ClearPaymentInterface {
    credit: {
        id: number;
        is_paid: boolean;
        balance: number;
        sale: {
            id: number;
            price: number;
        };
    };
    children?: ReactNode; // Allow anything inside
}

export default function ClearPayment({ credit, children }: ClearPaymentInterface) {



    const [open, setOpen] = useState(false);

    return (
        <Popover open={open}>
            {!credit.is_paid && (
                <PopoverTrigger disabled={credit.is_paid} onClick={() => setOpen(!open)} className='flex gap-2 items-center'>
                    {children ?? <CheckCircle className="text-green-500" />}
                </PopoverTrigger>
            )}

            <PopoverContent className="mt-5 flex h-fit justify-between gap-1 rounded-2xl bg-primary-foreground p-3">
                <div>
                    <Link
                        onClick={() => setOpen(false)}
                        href={route('credit.clear', credit.id)}
                        method="put"
                        data={{
                            amount_paid: credit.balance,
                            payment_method: 'mpesa',
                            sale_id: credit.sale.id,
                        }}
                    >
                        <span className="rounded-3xl bg-green-900 p-2 text-xs text-green-100">Clear via Mpesa</span>
                    </Link>
                </div>
                <div>
                    <Link
                        onClick={() => setOpen(false)}
                        href={route('credit.clear', credit.id)}
                        method="put"
                        data={{
                            amount_paid: credit.balance,
                            payment_method: 'cash',
                            sale_id: credit.sale.id,
                        }}
                    >
                        <span className="rounded-3xl bg-amber-900 p-2 text-xs text-amber-100">Clear by Cash</span>
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
