import InputError  from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethod, PaymentStatus } from '../types';

export function PaymentSection({
    paymentMethod,
    paymentStatus,
    grandTotal,
    amountPaid,
    paymentBalance,
    errors,
    processing,
    setData,
    handlePaymentStatusChange,
    handlePartialPaymentChange,
}: {
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    grandTotal: number;
    amountPaid: number;
    paymentBalance: number;
    errors: string;
    processing: boolean;
    setData: any;
    handlePaymentStatusChange: (status: PaymentStatus) => void;
    handlePartialPaymentChange: (value: string) => void;
}) {
    return (
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">Payment Summary</h3>
            <div className="flex justify-between">
                <span>Grand Total:</span>
                <span className="font-bold">{grandTotal.toFixed(2)} Ksh</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                        value={paymentMethod}
                        onValueChange={(value: PaymentMethod) => {
                            setData((prev: any) => ({
                                ...prev,
                                payment_method: value,
                                payment_status: value === 'credit' ? 'unpaid' : 'paid',
                                amount_paid: value === 'credit' ? 0 : grandTotal,
                                payment_balance: value === 'credit' ? grandTotal : 0,
                            }));
                        }}
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="credit">Credit</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.payment_method} />
                </div>

                <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <RadioGroup value={paymentStatus} onValueChange={handlePaymentStatusChange} className="flex gap-4">
                        {(['paid', 'partial', 'unpaid'] as PaymentStatus[]).map((status) => (
                            <div key={status} className="flex items-center gap-2">
                                <RadioGroupItem value={status} id={status} disabled={processing} />
                                <Label htmlFor={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <InputError message={errors.payment_status} />
                </div>
            </div>

            {paymentStatus === 'partial' && (
                <div className="space-y-2">
                    <Label>Amount Paid</Label>
                    <Input
                        type="number"
                        max={grandTotal}
                        value={amountPaid || ''}
                        onChange={(e) => handlePartialPaymentChange(e.target.value)}
                        disabled={processing}
                    />
                    <div className="text-sm font-medium">Balance: {paymentBalance.toFixed(2)}</div>
                    <InputError message={errors.amount_paid} />
                </div>
            )}
        </div>
    );
}
