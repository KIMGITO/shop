import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import AppearanceTabs from './appearance-tabs';
import { Button } from './ui/button';
import { EyeClosed, EyeIcon, } from 'lucide-react';
import { useState } from 'react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {

    const [showMoodToggle, setShowMoodToggle] = useState(false);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-6">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>

            <div className="flex md:hidden">
                {showMoodToggle ? <AppearanceTabs /> : <div></div>}
                <Button className="" size={'sm'} variant={'ghost'} onClick={() => setShowMoodToggle(!showMoodToggle)}>
                    {showMoodToggle ? <EyeClosed className="text-primary" /> : <EyeIcon className="text-primary" />}
                </Button>
            </div>
            <AppearanceTabs className="hidden md:flex" />
        </header>
    );
}
