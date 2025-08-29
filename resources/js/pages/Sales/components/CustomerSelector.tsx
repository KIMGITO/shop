import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Customer } from '@/types copy/sale';
import { ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

export function CustomerSection({
    customers,
    customerFirstName,
    saleDate,
    errors,
    processing,
    setData,
    handleCustomerChange,
}: {
    customers: Customer[];
    customerFirstName: string;
    saleDate: string;
    errors: any;
    processing: boolean;
    setData: any;
    handleCustomerChange: (value: string) => void;
    }) {
    
    const [popoverOpen, setPopoverOpen] = useState(false);
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="customer_id">Customer</Label>
                <Popover open={popoverOpen}>
                    <PopoverTrigger onClick={()=>setPopoverOpen(!popoverOpen)} id="customer_id">
                        <Button type="button" className="w-full border" variant={'ghost'}>
                            {customerFirstName || 'Select Customer'} <ChevronsUpDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <InputError message={errors.customer_id} />
                    <PopoverContent>
                        <Command>
                            <CommandInput placeholder="search customer..." />
                            <CommandList>
                                <CommandEmpty className="p-0">not available</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        key={-1}
                                        value="NULL"
                                        onSelect={() => {
                                            setData((prev: any) => ({ ...prev, customer_first_name: '' }));
                                            handleCustomerChange(JSON.stringify(null));
                                            setPopoverOpen(false);
                                        }}
                                    >
                                        not available
                                    </CommandItem>
                                    {customers.map((customer, i) => (
                                        <CommandItem
                                            key={i}
                                            value={customer.first_name}
                                            onSelect={() => {
                                                setData((prev: any) => ({ ...prev, customer_first_name: customer.first_name }));
                                                handleCustomerChange(JSON.stringify(customer));
                                                setPopoverOpen(false);
                                            }}
                                        >
                                            {customer.first_name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={saleDate} onChange={(e) => setData('sale_date', e.target.value)} disabled={processing} />
                <InputError message={errors.sale_date} />
            </div>
        </div>
    );
}
