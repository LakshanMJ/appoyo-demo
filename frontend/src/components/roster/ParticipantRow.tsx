import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { DayColumn } from '../../utils/week';
import type { Participant, Shift, Staff } from '../../types/roster';
import { cellBorderClasses } from '../../utils/gridCell';
import { DayCell } from './DayCell';
import { getShiftRosterDate } from '../../utils/shiftDate';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ParticipantRowProps {
  participant: Participant;
  days: DayColumn[];
  shifts: Shift[];
  loadCaregivers: (caregiverId: string) => Staff | undefined;
  onAddShift: (participantId: string | null, isoDate: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shift: Shift) => void;
  // onDuplicateShift: (shift: Shift) => void;
  onShiftClick: (shift: Shift) => void;
}

function formatMoney(amount?: number): string {
  if (amount == null) return '$0';

  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}k`;
  }

  return `$${amount.toLocaleString('en-AU', {
    maximumFractionDigits: 0,
  })}`;
}

export function ParticipantRow({
  participant,
  days,
  shifts,
  loadCaregivers,
  onAddShift,
  onEditShift,
  onDeleteShift,
  // onDuplicateShift,
  onShiftClick,
}: ParticipantRowProps) {
  return (
    <>
      <div
        className={`border-1 border-[#CBD5E1] px-3 pt-1 pb-4 ${cellBorderClasses(0)}`}
      >
        <p className="text-[15px] font-semibold text-[#183554]">
          {[participant.firstName, participant.lastName].filter(Boolean).join(' ')}
        </p>

        <p className="mt-1 text-xs text-[#183554]">
          Allocated:{' '}
          <span className="font-medium text-[#1DBF87]">
            {formatMoney(participant.allocatedBudget)}
          </span>
        </p>

        <p className="text-xs text-[#183554]">
          Used:{' '}
          <span className="font-medium text-[#1DBF87]">
            {formatMoney(participant.usedBudget)}
          </span>
        </p>
      </div>

      {days.map((day, idx) => (
        <div
          key={day.isoDate}
          className={`border-1 border-[#CBD5E1] ${cellBorderClasses(
            idx + 1
          )}`}
        >
          <DayCell
            participantId={participant.id}
            isoDate={day.isoDate}
            shifts={shifts.filter(
              (shift) =>
                getShiftRosterDate(shift.startTime) === day.isoDate
            )}
            loadCaregivers={loadCaregivers}
            onAddShift={onAddShift}
            onEditShift={onEditShift}
            onDeleteShift={onDeleteShift}
            // onDuplicateShift={onDuplicateShift}
            onShiftClick={onShiftClick}
            emptyVariant="dash"
          />
        </div>
      ))}
    </>
  );
}