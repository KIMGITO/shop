import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export function formatSmartDate(dateInput: string | Date): string {
    const date = dayjs(dateInput);
    const now = dayjs();

    const diffDays = now.diff(date, 'day');

    if (diffDays == 0) {
        return 'Today'
    }
    else if (diffDays <= 7) {
        return date.format('dddd'); // e.g. "Monday"
    }
    // else if (diffDays <= 30) {
    //     return date.fromNow(); // e.g. "14 days ago"
    // }
    else {
        return date.format('Do MMMM'); // e.g. "19th July"
    }
}
