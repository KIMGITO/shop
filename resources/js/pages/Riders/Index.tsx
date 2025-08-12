import AppLayout from "@/layouts/app-layout";
import { RiderProps } from "../Dashboard/types";
import { Head } from "@inertiajs/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import CreateButton from "@/components/createButton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { title } from "process";
import { url } from "inspector";

export default function Index({ riders }: { riders: RiderProps []}) {
    const breadcrumb =[ {
        title: "Riders",
        url: "/riders"
    },
        {
            title: 'HOME',
            url:'/dashboard'
    }
    ]
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Sales Records" />
            <Toaster position="top-center" richColors />

            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Sales Records</h1>
                    <CreateButton action="New Sale" toRoute="sale.create" />
                </div>

                <div className="rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader className="">
                            <TableRow className="rounded-2xl hover:text-primary">
                                <TableHead>No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                riders && riders.map((rider, i) => (
                                    <TableRow>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{rider.name}</TableCell>
                                        <TableCell>{rider.phone_number}</TableCell>
                                        <TableCell>{rider.active ? 'Active' : 'Inactive'}</TableCell>
                                        <TableCell>{ "Action button"}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
                </div>
        </AppLayout>
    )
}
