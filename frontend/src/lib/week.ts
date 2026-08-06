import { addDays, addWeeks, format, startOfWeek, subWeeks } from 'date-fns';

export interface DayColumn {
  date: Date;
  isoDate: string; // "2026-02-23"
  dayLabel: string; // "Mon"
  dayNumber: string; // "23"
}

/** Returns the Monday of the week containing `date`. */
export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/** Builds the 7 day-columns (Mon–Sun) for a given week start. */
export function getWeekColumns(weekStart: Date): DayColumn[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i);
    return {
      date: d,
      isoDate: format(d, 'yyyy-MM-dd'),
      dayLabel: format(d, 'EEE'),
      dayNumber: format(d, 'd'),
    };
  });
}

export function formatWeekRange(weekStart: Date): string {
  const end = addDays(weekStart, 6); // Mon -> Sun, the 7 columns actually rendered
  return `${format(weekStart, 'dd MMM yyyy')} - ${format(end, 'dd MMM yyyy')}`;
}

export function nextWeek(weekStart: Date): Date {
  return addWeeks(weekStart, 1);
}

export function prevWeek(weekStart: Date): Date {
  return subWeeks(weekStart, 1);
}
