import { useForm } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SaleItem,FormData } from '../types';
// import { FormData, SaleItem } 

export const initialSaleItems: SaleItem[] = [
    {
        product_id: '',
        product_name: '',
        product_price: 0,
        unit: '',
        stock_id: '',
        stock_code: '',
        sale_quantity: 0,
        stock_available: 0,
        total_price: 0,
    },
];

export function useSalesForm() {
    const [isDelivery, setIsDelivery] = useState(false);
    const [saleItems, setSaleItems] = useState<SaleItem[]>(initialSaleItems);

    const { data, setData, post, errors, processing } = useForm<FormData>({
        customer_id: null,
        customer_first_name: '',
        sale_items: saleItems,
        payment_method: 'mpesa',
        sale_date: new Date().toISOString().split('T')[0],
        payment_status: 'paid',
        amount_paid: 0,
        payment_balance: 0,
        grand_total: 0,
        delivery_tag: isDelivery,
        rider_id: null,
        delivery_address: '',
    });

    const grandTotal = useMemo(() => saleItems.reduce((sum, item) => sum + item.total_price, 0), [saleItems]);
    const allProductsValid = useMemo(
        () => saleItems.every((item) => item.product_id && item.stock_id && item.sale_quantity > 0 && item.sale_quantity <= item.stock_available),
        [saleItems],
    );

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            sale_items: saleItems,
            grand_total: grandTotal,
            ...(prev.payment_status === 'paid' && {
                amount_paid: grandTotal,
                payment_balance: 0,
            }),
        }));
    }, [saleItems, grandTotal, setData]);

    useEffect(() => {
        setData('delivery_tag', isDelivery);
    }, [isDelivery, setData]);

    const addNewProduct = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!allProductsValid) {
                toast.error('Please fill details for previous product first.');
                return;
            }
            setSaleItems((prev) => [...prev, ...initialSaleItems]);
        },
        [allProductsValid],
    );

    const removeProduct = useCallback((index: number) => {
        setSaleItems((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateProduct = useCallback((index: number, field: keyof SaleItem, value: any) => {
        setSaleItems((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            if (field === 'sale_quantity' || field === 'product_price') {
                updated[index].total_price = updated[index].sale_quantity * updated[index].product_price;
            }
            return updated;
        });
    }, []);

    const handlePartialPaymentChange = useCallback(
        (value: string) => {
            const amount = parseFloat(value) || 0;
            const balance = grandTotal - amount;
            setData((prev) => ({
                ...prev,
                amount_paid: amount > grandTotal ? grandTotal : amount,
                payment_balance: balance < 0 ? 0 : balance,
                payment_status: balance <= 0 ? 'paid' : 'partial',
            }));
        },
        [grandTotal, setData],
    );

    const submit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!allProductsValid) {
                toast.error('Please complete all product details');
                return;
            }
            post(route('sale.store'));
        },
        [isDelivery, post, allProductsValid, setData],
    );

    return {
        isDelivery,
        setIsDelivery,
        saleItems,
        setSaleItems,
        data,
        setData,
        errors,
        processing,
        grandTotal,
        allProductsValid,
        addNewProduct,
        removeProduct,
        updateProduct,
        handlePartialPaymentChange,
        submit,
    };
}
