import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ReminderProps } from './types';

export default function DashboardHeader({onChange}) {
    const [reminders, setReminders] = useState<ReminderProps[]>([]);
    const [remindersIsLoading, setRemindersIsLoading] = useState(true);

    const date = new Date().toLocaleDateString('en-CA');

    useEffect(() => {

        if (onChange) {
            axios
                .get(`/reminders/${date}`)
                .then((res) => {
                    const reminders = res.data;
                    setReminders(reminders);
                })
                .catch((error) => {
                    const message = error.response.data.message;
                    toast.error(message, {
                        duration: 3000,
                    });
                })
                .finally(() => {
                    setRemindersIsLoading(false);
                });
        }
        
    }, [onChange, date]);
    
    useEffect(() => {
        axios
            .get(`/reminders/${date}`)
            .then((res) => {
                const reminders = res.data;
                setReminders(reminders);
            })
            .catch((error) => {
                const message = error.response.data.message;
                toast.error(message, {
                    duration: 3000,
                });
            })
            .finally(() => {
                setRemindersIsLoading(false);
            });
    },[date]);


    return (
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:space-y-0">
            <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">KayKay's Dashboard</h2>
                <p className="text-muted-foreground">
                    Today is on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            <div className="w-full overflow-hidden md:w-1/2">
                <div className="animate-marquee whitespace-nowrap">
                    {reminders.length > 0
                        ? reminders.map((reminder, i) => (
                              <span className="mx-8 font-medium" key={reminder.id}>
                                {i + 1} <span className="">{reminder.name}</span>{ ': '}{reminder.description}
                              </span>
                          ))
                        : [1, 2, 3].map((number,i) => <span className="mx-8 font-medium" key={i}>No reminders today</span>)}
                    {<span>and....Remember: To keep place clean.</span>}
                </div>
            </div>
            <div className="flex items-center justify-between gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>PDF</DropdownMenuItem>
                        <DropdownMenuItem>CSV</DropdownMenuItem>
                        <DropdownMenuItem>Excel</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
