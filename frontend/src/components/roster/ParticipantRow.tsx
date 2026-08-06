import type { DayColumn } from '../../lib/week';
import type { Participant, Shift, Staff } from '../../types/roster';
import { cellBorderClasses } from '../../lib/gridCell';
import { DayCell } from './DayCell';

interface ParticipantRowProps {
  participant: Participant;
  days: DayColumn[];
  shifts: Shift[];
  getStaff: (staffId: string) => Staff;
  onAddShift: (participantId: string | null, isoDate: string) => void;
  onDuplicateShift: (shift: Shift) => void;
  onShiftClick: (shift: Shift) => void;
}

function formatMoney(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1000) {
    return `$${Math.round(dollars / 1000)}k`;
  }
  return `$${dollars.toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

export function ParticipantRow({
  participant,
  days,
  shifts,
  getStaff,
  onAddShift,
  onDuplicateShift,
  onShiftClick,
}: ParticipantRowProps) {
  return (
    <>
      <div className={`px-3 py-4 ${cellBorderClasses(0)}`}>
        <p className="text-[15px] font-semibold text-slate-900">{participant.name}</p>
        <p className="mt-1 text-sm text-slate-500">
          Allocated: <span className="font-medium text-teal-600">{formatMoney(participant.allocatedBudgetCents)}</span>
        </p>
        <p className="text-sm text-slate-500">
          Used: <span className="font-medium text-teal-600">{formatMoney(participant.usedBudgetCents)}</span>
        </p>
      </div>

      {days.map((day, idx) => (
        <div key={day.isoDate} className={cellBorderClasses(idx + 1)}>
          <DayCell
            participantId={participant.id}
            isoDate={day.isoDate}
            shifts={shifts.filter((s) => s.date === day.isoDate)}
            getStaff={getStaff}
            onAddShift={onAddShift}
            onDuplicateShift={onDuplicateShift}
            onShiftClick={onShiftClick}
            emptyVariant="dash"
          />
        </div>
      ))}
    </>
  );
}
