export const formatCurrency = (price: number): React.ReactNode => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'Ksh',
    }).format(price);
};
