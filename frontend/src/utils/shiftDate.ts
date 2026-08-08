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

// export function moveShiftToDate(
//   startTime: string,
//   endTime: string,
//   targetDate: string,
// ) {
//   const start = dayjs(startTime).tz(ORG_TZ);
//   const end = dayjs(endTime).tz(ORG_TZ);

//   if (!start.isValid() || !end.isValid()) {
//     throw new Error(
//       'Invalid existing shift start/end time',
//     );
//   }

//   /*
//    * Get the existing local time.
//    *
//    * Example:
//    *
//    * start = Aug 5 09:00 Brisbane
//    * end   = Aug 5 17:00 Brisbane
//    *
//    * We want to preserve 09:00 and 17:00.
//    */

//   const startTimeString = start.format(
//     'HH:mm:ss',
//   );

//   const endTimeString = end.format(
//     'HH:mm:ss',
//   );

//   /*
//    * Build the new date by starting from
//    * the target date and setting the hours/minutes/
//    * seconds directly.
//    */

//   const [startHour, startMinute, startSecond] =
//     startTimeString.split(':').map(Number);

//   const [endHour, endMinute, endSecond] =
//     endTimeString.split(':').map(Number);

//   const newStart = dayjs
//     .tz(targetDate, ORG_TZ)
//     .hour(startHour)
//     .minute(startMinute)
//     .second(startSecond)
//     .millisecond(0);

//   const newEnd = dayjs
//     .tz(targetDate, ORG_TZ)
//     .hour(endHour)
//     .minute(endMinute)
//     .second(endSecond)
//     .millisecond(0);

//   if (!newStart.isValid() || !newEnd.isValid()) {
//     throw new Error(
//       `Failed to create new shift date: ${targetDate}`,
//     );
//   }

//   return {
//     startTime: newStart.toISOString(),
//     endTime: newEnd.toISOString(),
//   };
// }

// export function moveShiftToDate(
//   startTime: string,
//   endTime: string,
//   targetDate: string,
// ) {
//   const start = new Date(startTime);
//   const end = new Date(endTime);

//   const startHours = start.getUTCHours();
//   const startMinutes = start.getUTCMinutes();
//   const startSeconds = start.getUTCSeconds();
//   const startMilliseconds = start.getUTCMilliseconds();

//   const endHours = end.getUTCHours();
//   const endMinutes = end.getUTCMinutes();
//   const endSeconds = end.getUTCSeconds();
//   const endMilliseconds = end.getUTCMilliseconds();

//   const newStart = new Date(
//     `${targetDate}T${String(startHours).padStart(2, '0')}:${String(
//       startMinutes,
//     ).padStart(2, '0')}:${String(startSeconds).padStart(
//       2,
//       '0',
//     )}.${String(startMilliseconds).padStart(3, '0')}Z`,
//   );

//   const newEnd = new Date(
//     `${targetDate}T${String(endHours).padStart(2, '0')}:${String(
//       endMinutes,
//     ).padStart(2, '0')}:${String(endSeconds).padStart(
//       2,
//       '0',
//     )}.${String(endMilliseconds).padStart(3, '0')}Z`,
//   );

//   return {
//     startTime: newStart.toISOString(),
//     endTime: newEnd.toISOString(),
//   };
// }

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