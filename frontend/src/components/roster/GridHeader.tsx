import type { DayColumn } from '../../utils/week';
import { cellBorderClasses } from '../../utils/gridCell';

interface GridHeaderProps {
  days: DayColumn[];
}

export function GridHeader({ days }: GridHeaderProps) {
  return (
    <>
      <div className={`sticky top-0 z-10 border-b-2 border-slate-300 bg-[#F4F5F7] px-3 py-4 text-left text-[15px] font-semibold text-slate-800 ${cellBorderClasses(0)}`}>
        Participant
      </div>
      {days.map((day, idx) => (
        <div
          key={day.isoDate}
          className={`sticky top-0 z-10 border-b-2 border-slate-300 bg-[#F4F5F7] px-3 py-4 text-left text-[15px] font-semibold text-slate-800 ${cellBorderClasses(idx + 1)}`}
        >
          {day.dayLabel} <span>{day.dayNumber}</span>
        </div>
      ))}
    </>
  );
}
