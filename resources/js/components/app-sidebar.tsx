/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import {
    ArrowLeftRightIcon,
    Blocks,
    BookMarkedIcon,
    BookOpen,
    BookOpenText,
    Cog,
    DollarSignIcon,
    Euro,
    Frame,
    GalleryVerticalEnd,
    Info,
    LayoutDashboardIcon,
    LayoutGrid,
    Map,
    Milk,
    PieChart,
    PillBottle,
    Settings2,
    Users,
    UsersRound,
    Wallet,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
// import { NavProjects } from '@/components/nav-projects';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { title } from 'process';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const appName = usePage().props as InertiaPageProps as { appName: string };
     const { auth } = usePage().props as unknown as {
         auth: { user: { name: string; email: string; avatar: string } };
     };
    const data = {
        user: {
            name: auth.user.name,
            email: auth.user.email,
            avatar: '/images/image.png',
        },
        teams: [
            {
                name: '',
                logo: Info,
                plan: 'Enterprise',
            },
        ],
        navMain: [
            {
                title: 'Main',
                url: '#',
                icon: LayoutGrid,
                
                isActive: true,
                
                items: [
                    {
                        title: 'Dashboard',
                        url: '/dashboard',
                        icon: LayoutDashboardIcon,
                        
                        
                        
                    },
                    {
                        title: 'Sales',
                        url: '/sale',
                        icon: DollarSignIcon,
                    },
                    {
                        title: 'Stock Movements',
                        url: '/stock-movements',
                        icon: ArrowLeftRightIcon,
                    },

                    {
                        title: 'Daily Summary',
                        url: '/summaries',
                        icon: BookOpen,
                    },
                ],
            },
            {
                title: 'Inventory',
                url: '#',
                icon: Milk,
                items: [
                    {
                        title: 'Products',
                        url: '/product',
                        icon: Milk,
                    },
                    {
                        title: 'Stocks',
                        url: '/stock',
                        icon: Blocks,
                    },
                    {
                        title: 'Bottles',
                        url: '/bottles',
                        icon: PillBottle,
                    },
                ],
            },
            {
                title: 'People & Payments',
                url: '#',
                icon: Users,
                items: [
                    {
                        title: 'Customers',
                        url: '/customers',
                        icon: UsersRound,
                    },
                    {
                        title: 'Billed',
                        url: '/billed',
                        icon: Euro,
                    },
                    {
                        title: 'Pending Bills',
                        url: '/credits',
                        icon: BookMarkedIcon,
                    },
                    {
                        title: 'Invoices',
                        url: '/invoices',
                        icon: BookOpenText,
                    },
                    {
                        title: 'Expenses',
                        url: '/expenses',
                        icon: Wallet,
                    },
                ],
            },
            {
                title: 'System',
                url: '#',
                icon: Settings2,
                items: [
                    {
                        title: 'Settings',
                        url: '/settings',
                        icon: Cog,
                    },
                ],
            },
        ],

        projects: [
            {
                name: 'Design Engineering',
                url: '#',
                icon: Frame,
            },
            {
                name: 'Sales & Marketing',
                url: '#',
                icon: PieChart,
            },
            {
                name: 'Travel',
                url: '#',
                icon: Map,
            },
        ],
    };

   

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
                
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                {' '}
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
