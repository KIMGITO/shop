<?php

namespace App\Console\Commands;

use Log;
use Carbon\Carbon;
use App\Models\Reminder;
use Illuminate\Console\Command;

class SetNextReminderDate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:set-next-reminder-date';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {


        $activeReminders = Reminder::where('complete', false)
        ->where('repeat', '!=', 'none')
            ->get();
        foreach ($activeReminders as $reminder) {
            $this->setNextReminder($reminder);
        }
    }

    private static function setNextReminder(Reminder $reminder){
        $today = Carbon::today();
        
        if($reminder->show_on <= $today){
            $reminder->show_on = match ($reminder->repeat) {
                'daily' => $today->addDay(),
                'weekly' => $today->addWeek(),
                'monthly' => $today->addMonth(),
                default => $today,
            };
            $reminder->save();
        } else {
            // If the reminder is not due today, we do nothing
            return;
        }
    }
}
