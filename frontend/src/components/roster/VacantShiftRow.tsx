import { AlertCircle } from 'lucide-react';
import type { DayColumn } from '../../utils/week';
import type { Caregiver, Shift } from '../../types/roster';
import { cellBorderClasses } from '../../utils/gridCell';
import { DayCell } from './DayCell';
import { getShiftRosterDate } from '../../utils/shiftDate';

interface VacantShiftRowProps {
  days: DayColumn[];
  shifts: Shift[];
  loadCaregivers: (caregiverId: string) => Caregiver | undefined;
  onAddShift: (participantId: string | null, isoDate: string) => void;
  // onDuplicateShift: (shift: Shift) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shift: Shift) => void; 
  onShiftClick: (shift: Shift) => void;
}

export function VacantShiftRow({
  days,
  shifts,
  loadCaregivers,
  onAddShift,
  onEditShift,
  onDeleteShift,
  // onDuplicateShift,
  onShiftClick,
}: VacantShiftRowProps) {
  return (
    <>
      <div className={`flex items-center align-left p-2 border-1 ${cellBorderClasses(0)}`}>
        <span className="flex items-center gap-1.5 rounded-sm bg-[#FAE9F1] px-3 py-1.5 text-sm font-medium text-[#791C20]">
          <AlertCircle className="h-4 w-4 text-[#D81428]" />
          Vacant Shift
        </span>
      </div>

      {days.map((day, idx) => {
        const dayShifts = shifts.filter(
          (shift) => getShiftRosterDate(shift.startTime) === day.isoDate
        );

        return (
          <div
            key={day.isoDate}
            className={`border-1 border-[#CBD5E1] ${cellBorderClasses(
              idx + 1
            )}`}
          >
            <DayCell
              participantId={null}
              isoDate={day.isoDate}
              shifts={dayShifts}
              loadCaregivers={loadCaregivers}
              onAddShift={onAddShift}
              // onDuplicateShift={onDuplicateShift}
              onEditShift={onEditShift}
              onDeleteShift={onDeleteShift} 
              onShiftClick={onShiftClick}
              emptyVariant="dash"
              compact
            />
          </div>
        );
      })}
    </>
  );
}