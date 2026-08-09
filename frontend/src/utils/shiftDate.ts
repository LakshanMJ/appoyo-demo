import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const ORG_TZ = 'Australia/Brisbane';

export function getShiftRosterDate(startTime: string): string {
  return dayjs(startTime)
    .tz(ORG_TZ)
    .format('YYYY-MM-DD');
}

export function moveShiftToDate(
  startTime: string,
  endTime: string,
  targetDate: string,
) {
  const start = dayjs.utc(startTime).tz(ORG_TZ);
  const end = dayjs.utc(endTime).tz(ORG_TZ);

  const newStart = dayjs.tz(
    `${targetDate} ${start.format('HH:mm:ss')}`,
    'YYYY-MM-DD HH:mm:ss',
    ORG_TZ,
  );

  const newEnd = dayjs.tz(
    `${targetDate} ${end.format('HH:mm:ss')}`,
    'YYYY-MM-DD HH:mm:ss',
    ORG_TZ,
  );

  return {
    startTime: newStart.toISOString(),
    endTime: newEnd.toISOString(),
  };
}