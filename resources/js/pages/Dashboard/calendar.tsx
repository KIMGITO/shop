import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/helper/formatDate';
import axios from 'axios';
import { CheckCircleIcon, Loader, Plus, TimerIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ReminderProps } from './types';

export default function DashboardCalendar({onChange}) {
    const [date, setDate] = useState<string | undefined>(new Date().toLocaleDateString('en-CA'));
    const [reminderData, setReminderData] = useState({
        name: '',
        repeat: '',
        description: '',
        date: date,
    });
    // const [selectedDate, setSelectedDate] = useState<string| undefined>();

    const [reminderFormIsOpen, setReminderFormIsOpen] = useState(false);
    const [selectedDateReminders, setSelectedDateReminders] = useState<ReminderProps[]>([]);

    const [remindersIsLoading, setRemindersIsLoading] = useState(true);

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];

    // set a reminder as completed
    const handleReminderCompleted = (reminder: ReminderProps) => {
        const newReminders = selectedDateReminders.filter((r) => r.id !== reminder.id);
        setRemindersIsLoading(true);
        axios
            .put('/reminders', { id: reminder.id })
            .then((res) => {
                setSelectedDateReminders(newReminders);
                toast.success(res.data.message);
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    duration: 2500,
                });
            })
            .finally(() => {
                setRemindersIsLoading(false);
            });
    };

    useEffect(() => {
        setReminderData((prev) => ({
            ...prev,
            date: date,
        }));

        // get reminders for this day
        axios
            .get(`/reminders/${date}`)
            .then((response) => {
                const reminders = response.data;
                setSelectedDateReminders(reminders);
            })
            .finally(() => {
                setRemindersIsLoading(false);
            });
    }, [date]);

    const handleReminderFormSubmission = () => {
        if (reminderData.name == '' || reminderData.repeat == '' || reminderData.description == '') {
            toast.error('To set a reminder, Name, Repeat and Description are required.', {
                duration: 3000,
            });
        } else if (reminderData.name.length < 3) {
            toast.error('Title must have at least 3 characters.', {
                duration: 2000,
            });
        } else {
            axios
                .post( route('reminders.store'), reminderData)
                .then((res) => {
                    setReminderData({ date: date, repeat: '', name: '', description: '' });
                    toast.success(res.data.message, {
                        duration: 2000,
                    });
                    setReminderFormIsOpen(false);
                })
                .catch((error) => {
                    const message = error.response?.data?.message;

                    toast.error(`Failed! ${message}`, {
                        duration: 2000,
                    });
                    setReminderFormIsOpen(true);
                })

                .finally(() => {
                    axios
                        .get(`/reminders/${date}`)
                        .then((response) => {
                            const reminders = response.data;
                            setSelectedDateReminders(reminders);
                            onChange()
                           
                        })
                        .finally(() => {
                            setRemindersIsLoading(false);
                        });
                });
        }
    };
    return (
        <Card className="p-1 transition-shadow hover:shadow-md">
            <CardHeader className="p-1 pb-2">
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
                <CardDescription>Upcoming tasks and events</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-2">
                <Calendar
                    mode="single"
                    onDayClick={() => {
                        setReminderData({});
                        setReminderFormIsOpen(false);
                    }}
                    selected={new Date(date)}
                    onSelect={(date) => {
                        setDate(new Date(date).toLocaleDateString('en-CA'));
                        setRemindersIsLoading(true);
                    }}
                    className="rounded-md border"
                    classNames={{
                        day: ' mx-1 text-xs',
                        head_cell: 'text-xs',
                        cell: 'px-1',
                        nav_button: 'h-6 w-6',
                    }}
                />
            </CardContent>
            <CardFooter className="p-0 pt-0">
                <div className="w-full space-y-2 rounded-2xl bg-gray-500/20 p-2">
                    <CardDescription>Date: {formatDate(date || '')}</CardDescription>
                    {remindersIsLoading ? (
                        <div className="flex items-center justify-center space-x-4">
                            <Skeleton className="flex h-[50px] w-full items-center justify-center bg-gray-600/60">
                                <Loader className="animate-spin" />
                            </Skeleton>
                        </div>
                    ) : selectedDateReminders.length > 0 ? (
                        selectedDateReminders.slice(0, 3).map((reminder, i) => (
                            <div className="flex items-center justify-between gap-2 text-sm hover:text-primary" key={i}>
                                <div className="flex items-center gap-3">
                                    <div className={`h-2 w-2 rounded-full ${colors[i]}`}></div>
                                    <div className="">
                                        <p className="font-medium"> {reminder.name} </p>
                                        <p className="text-xs text-muted-foreground">{reminder.description}</p>
                                    </div>
                                </div>
                                <CheckCircleIcon
                                    onClick={() => {
                                        handleReminderCompleted(reminder);
                                    }}
                                    className="cursor-default"
                                    size={20}
                                />
                            </div>
                        ))
                    ) : (
                        <></>
                    )}
                    <div hidden={!reminderFormIsOpen} className="relative">
                        <Popover open={reminderFormIsOpen}>
                            <PopoverTrigger></PopoverTrigger>
                            <PopoverContent className="relative bottom-6 left-10 grid gap-2 border-2 border-white bg-secondary md:left-27">
                                <CardDescription>Add A reminder</CardDescription>
                                <Input
                                    value={reminderData.name}
                                    onChange={(e) =>
                                        setReminderData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="Reminder Title"
                                    className="h-10/12 rounded-none"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Textarea
                                        onChange={(e) => {
                                            setReminderData((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }));
                                        }}
                                        cols={2}
                                        color="red"
                                        placeholder="reminder description"
                                    />
                                    <Select
                                        onValueChange={(value) => {
                                            setReminderData((prev) => ({
                                                ...prev,
                                                repeat: value,
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className="h-[100px]">
                                            <TimerIcon />
                                            <SelectValue placeholder="repeat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={'none'}>No Repeat</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="mt-4 flex w-full justify-between">
                                    <div
                                        className="cursor-default rounded bg-gray-600 px-2 py-1"
                                        onClick={() => {
                                            setReminderFormIsOpen(false);
                                            setReminderData({ name: '', date: date, repeat: '', description: '' });
                                        }}
                                    >
                                        {/* <X size={20} /> */}
                                        Close
                                    </div>
                                    <div className="rounded bg-primary px-2 py-1" onClick={() => handleReminderFormSubmission()}>
                                        <CheckCircleIcon size={20} />
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {remindersIsLoading ? (
                        ''
                    ) : (
                        <div className="flex w-full items-center pb-2">
                            <Plus
                                className="relative right-2.5 left-11/12 rounded-full bg-primary p-1 text-secondary md:left-11/12"
                                size={30}
                                onClick={() => setReminderFormIsOpen(!reminderFormIsOpen)}
                            />
                            <div className="w-full text-start">
                                {selectedDateReminders.length > 3 ? (
                                    <span onClick={() => {}} className="cursor-pointer text-blue-500 hover:underline">
                                        More reminders
                                    </span>
                                ) : selectedDateReminders.length < 1 ? (
                                    <span onClick={() => {}} className="text-xs text-red-500">
                                        No reminders for this day.
                                    </span>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
