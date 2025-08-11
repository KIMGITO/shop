import { Toaster } from '@/components/ui/sonner';
import DashboardCalendar from './calendar';
import DashboardChart from './chart';
import InventoryAlert from './inventory-alert';
import ProductPerformance from './product-performance';
import Debtors from './debtors';

export default function DashboardMain({onChange}) {

    return (
        <div className="grid flex-col-reverse gap-4 lg:grid-cols-3">
            <div className="col-span-1 space-y-4 lg:col-span-2">
                {/* Sales Trend Chart with time range selector */}
                {/* <Toaster richColors position="top-center" /> */}
                <DashboardChart />

                {/* Combined Product Performance and Inventory Status */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Product Performance - Compact */}
                    <ProductPerformance />

                    {/* Inventory Status - Compact */}
                    <InventoryAlert />
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-1">
                {/* Compact Calendar with Events */}

                <DashboardCalendar onChange={()=>onChange()} />
                {/* Debtors List - More compact */}
                <Debtors/>
            </div>
        </div>
    );
}
