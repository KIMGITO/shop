import  InputError  from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { RiderProps } from '@/pages/Dashboard/types';
import { CheckIcon, ChevronsUpDownIcon, XSquare } from 'lucide-react';
import { useState } from 'react';

export function DeliverySection({
    isDelivery,
    setIsDelivery,
    ridersData,
    deliveryAddress,
    errors,
    processing,
    setData,
    handleRiderChange,
}: {
    isDelivery: boolean;
    setIsDelivery: (value: boolean) => void;
    ridersData: RiderProps[];
    deliveryAddress: string;
    errors: any;
    processing: boolean;
    setData: any;
    handleRiderChange: (selected: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');

    return (
        <div hidden={!isDelivery} className="flex flex-col justify-between space-y-4 rounded-2xl border p-4">
            <div className="flex justify-between">
                <CardTitle>Delivery Details</CardTitle>
                <Tooltip>
                    <TooltipTrigger type="button" onClick={() => setIsDelivery(false)}>
                        <XSquare className="hover:text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>Remove delivery tag</TooltipContent>
                </Tooltip>
            </div>
            <div className="flex w-full justify-between gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div>
                            <Button type="button" variant="outline" role="combobox" aria-expanded={open} className="justify-between">
                                {value ? ridersData.find((rider) => rider.name === value)?.name : 'Select rider...'}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            <InputError message={errors.rider_id} />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search rider..." />
                            <CommandList>
                                <CommandEmpty>No rider selected</CommandEmpty>
                                <CommandGroup>
                                    {ridersData?.map((rider) => (
                                        <CommandItem
                                            key={rider.id}
                                            value={rider.name}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? '' : currentValue);
                                                setOpen(false);
                                                handleRiderChange(JSON.stringify(rider));
                                            }}
                                        >
                                            <CheckIcon className={cn('mr-2 h-4 w-4', value === rider.name ? 'opacity-100' : 'opacity-0')} />
                                            {rider.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <div>
                    <Input
                        value={deliveryAddress || ''}
                        onChange={(e) => setData('delivery_address', e.target.value)}
                        placeholder="Delivery Address"
                    />
                    <InputError message={errors.delivery_address} />
                </div>
            </div>
        </div>
    );
}
