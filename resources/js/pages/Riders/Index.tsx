import CreateButton from '@/components/createButton';
import { IconButton } from '@/components/icon-button';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Dialog } from '@radix-ui/react-dialog';
import axios from 'axios';
import { Edit2Icon, InfoIcon, Loader2, Trash2Icon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RiderProps } from '../Dashboard/types';
import ConfirmToast from '@/components/ui/confirm-toast';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const breadcrumb = [
    {
        title: 'HOME',
        url: '/dashboard',
    },
    {
        title: 'Riders',
        url: '/riders',
    },
];
export default function Index({ ridersData }: { ridersData: RiderProps[] }) {
    const [open, setOpen] = useState(false);
    const [valid, setValid] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [riders, setRiders] = useState<RiderProps[]>(ridersData);
    const [isEdit, setIsEdit] = useState(false);
    const [riderId, setRiderId] = useState<number| null>(null);
    const { data, setData } = useForm({
        name: '',
        phone: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
    });

    const getData = () => {
       axios .get(route('riders.index'), {
                        headers: {
                            Accept: 'application/json',
                        },
                    })
                    .then((res) => {
                        setRiders(res.data.ridersData);
                    })
                    .catch((err) => {
                        const message = err.response.data.message;
                        toast.error('Error', {
                            description: message,
                            duration: 2500,
                        });
                    })
                    .finally(() => setProcessing(false));
    }

    const openChange = useCallback(() => {
        if (open) {
            setOpen(false);
            setData({
                name: '',
                phone: '',
            });
            setErrors({
                name: '',
                phone: '',
            });
        }
        console.log(open);
    }, [open, setData]);

    useEffect(() => {
        if (data.name == '' || data.phone == '') {
            setValid(false);
        } else {
            setValid(true);
        }
    }, [setValid, data]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!valid) {
            toast.warning('Warning', {
                description: 'Please fill all fields',
                duration: 2500,
            });
        }
        setErrors({
            name: '',
            phone: '',
        });
        setProcessing(true);

        (isEdit ? axios.put(route('riders.update', riderId), data) : axios.post(route('riders.store'), data))
            .then((res) => {
                const message = res.data.message;
                toast.success('Success', {
                    description: message,
                    duration: 2500,
                });
                setOpen(false);
                setData({
                    name: '',
                    phone: '',
                });
                setProcessing(false);
                setIsEdit(false);
            })
            .catch((err) => {
                const error = err.response.data.errors;
                setErrors({
                    name: error.name,
                    phone: error.phone,
                });
                setProcessing(false);
            })
            .finally(() => {
                getData();
            });
    };

    const editRider = (rider: RiderProps) => {
        setIsEdit(true);
        setRiderId(rider.id);
        setData({
            name: rider.name,
            phone: rider.phone,
        });
        setOpen(true);
    };



    const onDelete = (id:number) => {
        axios.delete(route('riders.destroy', id)).then((res) => {
           
                const message = res.data.message;
                toast.success('Success', {
                    description: message,
                    duration: 2500,
                });
            
        }).catch((err) => {

            const message = err.response.data.error;
            toast.error('Error', {
                description: message,
                duration: 2500,
            });
            
        }).finally(() => {
            getData()
        });
    }

    const riderInfo = (id: number) => {
        router.get(route('riders.show', id));
   }

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Sales Records" />
            <Toaster position="top-center" richColors />

            <div className="container mx-auto justify-center p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Riders Records</h1>
                    <Dialog onOpenChange={openChange} open={open}>
                        <DialogTrigger asChild>
                            <span onClick={() => setOpen(true)}>
                                <CreateButton action="Add Rider" />
                            </span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>Add New Rider</DialogHeader>
                            <Card>
                                <CardContent>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            undefined <Label>Rider Name:</Label>
                                            <Input
                                                placeholder="e.g Dennis Kimanthi"
                                                onChange={(e) => {
                                                    setData('name', e.target.value);
                                                }}
                                                value={data.name}
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Phone:</Label>
                                            <Input
                                                placeholder="e.g 0700011122"
                                                onChange={(e) => {
                                                    setData('phone', e.target.value);
                                                }}
                                                value={data.phone}
                                            />
                                            <InputError message={errors.phone} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button
                                        className={`bg-primary/70 ${processing ? 'cursor-progress' : ''} `}
                                        onClick={submit}
                                        disabled={processing || !valid}
                                    >
                                        {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {processing ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex w-full justify-center">
                    <div className="rounded-lg border shadow-sm md:w-8/12">
                        <Table>
                            <TableHeader className="">
                                <TableRow className="rounded-2xl hover:text-primary">
                                    <TableHead>No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-end">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {riders?.length > 0 ? (
                                    riders.map((rider, i) => (
                                        <TableRow>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>{rider.name}</TableCell>
                                            <TableCell>{rider.phone}</TableCell>
                                            <TableCell>{rider.active ? 'Active' : 'Inactive'}</TableCell>
                                            <TableCell className="flex justify-end gap-2">
                                                <IconButton onClick={() => editRider(rider)} icon={Edit2Icon} colorVariant="success" />
                                                <IconButton onClick={()=>riderInfo(rider.id)} icon={InfoIcon} colorVariant="info" />
                                                <Tooltip>
                                                    {' '}
                                                    <TooltipTrigger>
                                                        <IconButton onClick={() => onDelete(rider.id)} icon={Trash2Icon} colorVariant="danger" />
                                                    </TooltipTrigger>
                                                    <TooltipContent  className='bg-red-200 text-red-700'>
                                                        <p>Are you sure you want to delete this rider?</p>
                                                    </TooltipContent>
                                                </Tooltip>{' '}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
