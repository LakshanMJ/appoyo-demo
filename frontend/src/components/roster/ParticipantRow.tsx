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

// TODO: source from org/context instead of hardcoding, same as AddShiftModal
const ORG_TZ = 'Australia/Brisbane';

interface ParticipantRowProps {
  participant: Participant;
  days: DayColumn[];
  shifts: Shift[];
  loadCaregivers: (caregiverId: string) => Staff | undefined;
  onAddShift: (participantId: string | null, isoDate: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shift: Shift) => void;
  onDuplicateShift: (shift: Shift) => void;
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

// Group once per render instead of re-filtering + re-parsing dates
// for every day column (was O(days * shifts) date parses before).
function shiftLocalDate(isoString: string): string {
  return dayjs(isoString).tz(ORG_TZ).format('YYYY-MM-DD');
}

export function ParticipantRow({
  participant,
  days,
  shifts,
  loadCaregivers,
  onAddShift,
  onEditShift,
  onDeleteShift,
  onDuplicateShift,
  onShiftClick,
}: ParticipantRowProps) {
  return (
    <>
      <div className={`px-3 py-4 ${cellBorderClasses(0)}`}>
        <p className="text-[15px] font-semibold text-slate-900">{participant.name}</p>
        <p className="mt-1 text-sm text-slate-500">
          Allocated: <span className="font-medium text-teal-600">{formatMoney(participant.allocatedBudget)}</span>
        </p>
        <p className="text-sm text-slate-500">
          Used: <span className="font-medium text-teal-600">{formatMoney(participant.usedBudget)}</span>
        </p>
      </div>

      {days.map((day, idx) => (
        <div key={day.isoDate} className={cellBorderClasses(idx + 1)}>
          <DayCell
            participantId={participant.id}
            isoDate={day.isoDate}
            shifts={shifts.filter(
              (shift) => getShiftRosterDate(shift.startTime) === day.isoDate
            )}
            loadCaregivers={loadCaregivers}
            onAddShift={onAddShift}
            onEditShift={onEditShift}
            onDeleteShift={onDeleteShift}
            onDuplicateShift={onDuplicateShift}
            onShiftClick={onShiftClick}
            emptyVariant="dash"
          />
        </div>
      ))}
    </>
  );
}