import type { DayColumn } from '../../utils/week';
import { cellBorderClasses } from '../../utils/gridCell';

interface GridHeaderProps {
  days: DayColumn[];
}

export function GridHeader({ days }: GridHeaderProps) {
  return (
    <>
      <div
        className={`sticky top-0 z-10 border-b-1 border-[#DCE1E5] bg-[#EBEFF0] h-10 flex items-center px-3 text-left text-[15px] font-semibold text-[#183554] ${cellBorderClasses(0)}`}
      >
        Participant
      </div>
      {days.map((day, idx) => (
        <div
          key={day.isoDate}
          className={`sticky top-0 z-10 h-10 flex items-center gap-1
            border-1 border-[#DCE1E5]
            bg-[#EBEFF0]
            px-3
            text-left text-[15px] font-semibold
            ${cellBorderClasses(idx + 1)}`}
          >
          <span className="text-[#183554]">{day.dayLabel}</span>
          <span className="text-[#64748B]">{day.dayNumber}</span>
        </div>
      ))}
    </>
  );
}
