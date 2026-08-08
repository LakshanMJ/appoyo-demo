import { format } from "date-fns";

// export function formatShiftTime(date: string) {
//   return format(new Date(date), "h:mm a");
// }

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const ORG_TZ = 'Australia/Brisbane';

export function formatShiftTime(time: string) {
  return dayjs(time)
    .tz(ORG_TZ)
    .format('h:mm A');
}