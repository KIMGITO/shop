import { IconButton } from '@/components/icon-button';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/helper/formatCurrency';
import { formatSmartDate } from '@/helper/formatSmartDate';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Euro, Filter, LucidePrinterCheck } from 'lucide-react';
import { useState } from 'react';
import DebtProps from '../Dashboard/types';
import PaymentForm from './payment-form';
import { formatDate } from '@/helper/formatDate';
import { uuid } from 'node_modules/zod/dist/types/v4/core/regexes';
import { faWindows } from '@fortawesome/free-brands-svg-icons';

export default function Index({ customerDebtsData, outstandingBalance }: { customerDebtsData: DebtProps[]; outstandingBalance:number }) {
    const [customerDebts, setCustomerDebts] = useState(customerDebtsData);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expandedRow, setExpandedRow] = useState({});
    const [selectedData, setSelectedData] = useState({
        balance: 0,
        id: 0,
        name: '',
    });


    const toggleExpanded = (date, k) => {
        setExpandedRow((prev) => ({
            ...prev,
            [`${date}.${k}`]: !prev[`${date}.${k}`], // Toggle the boolean value for this specific date
        }));

  
    };

    const addPayment = (id: number, balance: number, name: string) => {
        
        setSelectedData({
            balance: balance,
            id: id,
            name: name,
        });

        setOpen(true);
    };

    const generatePdf = (uuid) => {
        
        window.location.href = `invoice/show/${uuid}`;

    }

    const reset = () => {
        setSelectedData({
            balance: 0,
            id: 0,
            name: '',
        });
        setOpen(false);
    };

    const reload = () => {
        setLoading(true);
        axios
            .get(route('billings.index'))
            .then((res) => {
                const data = res.data.data;
                setCustomerDebts(data);
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <AppLayout>
            <Head title="Billed" />
            <div className="flex flex-col gap-4 p-4">
                <Toaster position="top-center" richColors />
                <Dialog open={open}>
                    <PaymentForm
                        onSuccess={() => {
                            reset();
                            reload();
                        }}
                        onCancel={() => {
                            reset();
                        }}
                        id={selectedData.id}
                        name={selectedData.name}
                        balance={selectedData.balance}
                    />
                </Dialog>
                <div className="flex justify-between">
                    <div>
                        <CardTitle className="p-2">Outstanding Balances</CardTitle>
                    </div>
                    <CardTitle className="p-2 text-2xl text-red-900">{formatCurrency(outstandingBalance)}</CardTitle>
                </div>
                <div className="flex flex-col gap-4 p-4">
                    <Table>
                        <TableHeader className="bg-gray-200/10">
                            <TableHead>#</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="text-center">Description</TableHead>
                            <TableHead>Make Payment</TableHead>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(customerDebts).map(([customerName, customerData], i) => {  
                                console.log(customerData);
                                const uuid = customerData.customer_uuid;
                                 {
                                    return (
                                    <TableRow key={i}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell className="font-medium capitalize">{customerName}</TableCell>
                                        <TableCell colSpan={5} className="flex w-full flex-col gap-5">
                                            {/* Map through the debts object which contains dates as keys */}
                                            {Object.entries(customerData.debts).map(([dueDate, debtsArray]) => {
                                                // Calculate total balance for this due date
                                                const totalBalance = debtsArray.reduce((sum, debt) => sum + debt.balance, 0);
                                                const size = debtsArray.length;
                                                const id = debtsArray.slice(0)[0]['customer_id'];

                                                
                                                

                                                return (
                                                    <div key={dueDate} className="flex w-full flex-col items-center justify-around">
                                                        <div className="flex flex-col items-center hover:bg-gray-400/20">
                                                            <div className="flex flex-col rounded border-t border-b p-2 hover:bg-gray-50/20">
                                                                <div className="flex flex-col">
                                                                    {debtsArray
                                                                        .slice(0, expandedRow[`${dueDate}.${i}`] ? debtsArray.length : 2)
                                                                        .map((debt, j) => {
                                                                            return (
                                                                                <div
                                                                                    key={`${dueDate}-${j}`}
                                                                                    className="flex items-center justify-around gap-3"
                                                                                >
                                                                                    <div className="py-2 text-end">
                                                                                        <span className="flex gap-5">
                                                                                            <span>{j + 1}</span>
                                                                                            <span className='hover:text-primary hover:underline'>
                                                                                                <a href={route('sale.show',debt.uuid)}>{debt.invoice_number}</a>{' '}
                                                                                            </span>
                                                                                            <span>-</span>
                                                                                            <span> {debt.balance} ksh</span>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                </div>
                                                                <div className="flex w-full items-center justify-center">
                                                                    {size > 2 ? (
                                                                        <p
                                                                            onClick={() => toggleExpanded(dueDate, i)}
                                                                            className="font-medium text-blue-600 hover:cursor-pointer hover:underline"
                                                                        >
                                                                            {expandedRow[`${dueDate}.${i}`] ? 'Show few' : ` Show All `}.
                                                                        </p>
                                                                    ) : (
                                                                        ''
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="mt-2 flex w-full flex-col items-center gap-2 rounded border-t p-2 text-sm font-semibold hover:bg-gray-600/50">
                                                                <div className="flex w-full justify-between gap-5 underline underline-offset-1">
                                                                    <p>Total: </p>
                                                                    <p className="text-end">{totalBalance} Ksh</p>
                                                                </div>
                                                                <div className="flex w-full justify-between gap-5">
                                                                    <p>Due On: </p>
                                                                    <p className="text-start">{formatDate(dueDate)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </TableCell>
                                        <TableCell className="hover:bg-gray-300/30">
                                            <div className="flex flex-col text-center  gap-2">
                                                <div className='flex justify-around '>
                                                    <span>Total</span>
                                                    <span className="font-extrabold text-red-700">{formatCurrency(customerData.total_balance)}</span>
                                                </div>
                                                <Button
                                                    // variant={'ghost'}
                                                    className="flex justify-around bg-transparent hover:bg-blue-400/60"
                                                    onClick={() => addPayment(customerData.customer_id, customerData.total_balance, customerName)}
                                                >
                                                    <Euro /> <span>Make Payment</span>
                                                </Button>
                                                <Button
                                                    className="flex justify-around bg-transparent hover:bg-amber-400/60"
                                                    onClick={() => generatePdf(uuid)}
                                                >
                                                    <LucidePrinterCheck /> <span>Generate Invoice</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                        )};
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
