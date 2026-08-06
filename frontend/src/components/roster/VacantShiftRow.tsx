import { AlertCircle } from 'lucide-react';
import type { DayColumn } from '../../lib/week';
import type { Shift, Staff } from '../../types/roster';
import { cellBorderClasses } from '../../lib/gridCell';
import { DayCell } from './DayCell';

interface VacantShiftRowProps {
  days: DayColumn[];
  shifts: Shift[];
  getStaff: (staffId: string) => Staff;
  onAddShift: (participantId: string | null, isoDate: string) => void;
  onDuplicateShift: (shift: Shift) => void;
  onShiftClick: (shift: Shift) => void;
}

export function VacantShiftRow({
  days,
  shifts,
  getStaff,
  onAddShift,
  onDuplicateShift,
  onShiftClick,
}: VacantShiftRowProps) {
  return (
    <>
      {/* <div className={`flex items-start px-3 py-4 ${cellBorderClasses(0)}`}> */}
      {/* <div className={`flex items-center justify-center px-3 py-4 ${cellBorderClasses(0)}`}> */}
        <div className={`flex items-center justify-center p-2 ${cellBorderClasses(0)}`}>
        <span className="flex items-center gap-1.5 rounded-sm bg-red-50 px-3 py-1.5 text-sm font-medium text-red-500">
          <AlertCircle className="h-4 w-4" />
          Vacant Shift
        </span>
      </div>
      {days.map((day, idx) => (
        <div key={day.isoDate} className={cellBorderClasses(idx + 1)}>
          <DayCell
            participantId={null}
            isoDate={day.isoDate}
            shifts={shifts.filter((s) => s.date === day.isoDate)}
            getStaff={getStaff}
            onAddShift={onAddShift}
            onDuplicateShift={onDuplicateShift}
            onShiftClick={onShiftClick}
            emptyVariant="dash"
            compact
          />
        </div>
      ))}
    </>
  );
}
