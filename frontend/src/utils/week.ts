import { addDays, addWeeks, format, startOfWeek, subWeeks } from 'date-fns';

export interface DayColumn {
  date: Date;
  isoDate: string;
  dayLabel: string;
  dayNumber: string;
}

export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

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
  const end = addDays(weekStart, 6);
  return `${format(weekStart, 'dd MMM yyyy')} - ${format(end, 'dd MMM yyyy')}`;
}

export function nextWeek(weekStart: Date): Date {
  return addWeeks(weekStart, 1);
}

export function prevWeek(weekStart: Date): Date {
  return subWeeks(weekStart, 1);
}
