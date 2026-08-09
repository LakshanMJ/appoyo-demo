import { Plus } from 'lucide-react';
import type { DayColumn } from '../../utils/week';
import { cellBorderClasses } from '../../utils/gridCell';

interface AddParticipantRowProps {
  days: DayColumn[];
  onAddParticipant: () => void;
  onAddShift: (isoDate: string) => void;
}

export function AddParticipantRow({ days, onAddParticipant, onAddShift }: AddParticipantRowProps) {
  return (
    <>
      <div className={`px-3 py-3 border-1 ${cellBorderClasses(0)}`}>
        <button
          onClick={onAddParticipant}
          className="w-full whitespace-nowrap rounded-lg bg-[#0B2545] px-4 py-2.5 text-sm font-medium text-[#DBE0E8] hover:bg-[#132C50]"
        >
          Add Participant
        </button>
      </div>
      {days.map((day, idx) => (
        <div key={day.isoDate} className={`px-3 py-3 border-1 ${cellBorderClasses(idx + 1)}`}>
          <button
            onClick={() => onAddShift(day.isoDate)}
            className="flex w-full items-center justify-center gap-1.5 rounded-sm border-0 py-2.5 text-sm font-medium text-[slate-500] transition-colors hover:text-teal-600"
            style={{
              border: '1px dashed #e2e8f0',
            }}
          >
            <Plus className="h-4 w-4" />
            Add Shift
          </button>
        </div>
      ))}
    </>
  );
}
