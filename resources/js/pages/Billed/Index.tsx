import { CardTitle } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Filter } from "lucide-react";


export default function Index() {
    <AppLayout>
        <Head title="Billed" />
        <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between">
                <CardTitle className="p-2">Billing Data</CardTitle>
                <CardTitle className="p-2">
                    <Filter/>
                </CardTitle>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <Table>
                
                </Table> 
            </div>

        </div>
    </AppLayout>
}