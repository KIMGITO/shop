'use client';

import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import DashboardBottom from './bottomSection';
import DashboardHeader from './header';
import DashboardMain from './mainContent';
import DashboardQuickActions from './quickActions';
import DashboardStatusCards from './statusCards';
import { DashboardProps } from './types';
import { toast, Toaster } from 'sonner';
import { useEffect } from 'react';

// Constants for static configuration
const breadcrumb = [
    {
        title: 'HOME',
        href: '/dashboard',
    },
];

/**
 * Main dashboard component for MilkBar application
 * Displays key metrics, quick actions, and data visualizations
 */
export default function MilkBarDashboard({ flash }: { flash?: string }) {
    // Extract all props from the page in one destructure
    const {
        totalCustomers,
        todaySales,
        dailyTarget,
        monthlyTarget,
        monthlySales,
        newCustomers,
        pendingOrders,
        recentOrders,
        totalDebts,
        debtors,
        targetAchievement,
        targetCustomers,
        salesData,
        currentCycle,
       
    } = usePage().props as unknown as DashboardProps;

    // Organized data structure for passing to child components
    const dashboardData = {
       
        state: {
            currentCycle,
        },
        metrics: {
            totalCustomers,
            todaySales,
            dailyTarget,
            monthlyTarget,
            monthlySales,
            newCustomers,
            pendingOrders,
            totalDebts,
            debtors,
            targetAchievement,
            targetCustomers,
        },
        orders: {
            recent: recentOrders,
        },

        charts: {
            salesData: salesData,
        },
    };

    useEffect(() => {
        if(flash)
       { toast.success('Success', {
            description: flash,
            duration: 3000,
        });}
    }, [flash])
    
    const onChange = () => {
        return true;
    }

    return (
        <AppLayout  breadcrumbs={breadcrumb}>
            <div className="flex flex-col">
                <Toaster position='top-center' richColors />
                <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                    {/* Dashboard Header - Contains title and global actions */}
                    <DashboardHeader onChange={onChange}  />

                    {/* Quick Action Buttons - For common operations */}
                    <DashboardQuickActions />

                    {/* Key Metrics Display - Cards showing important numbers */}
                    <DashboardStatusCards data={dashboardData.metrics} />

                    {/* Main Data Visualization - Charts and primary content */}
                    <DashboardMain onChange={() => onchange()} />

                    {/* Secondary Data Display - Tables and additional info */}
                    {/* <DashboardBottom orders={dashboardData.orders} /> */}
                </div>
            </div>
        </AppLayout>
    );
}

// Type definitions for better type safety

