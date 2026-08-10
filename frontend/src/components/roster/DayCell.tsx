import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import type { Caregiver, Shift } from '../../types/roster';
import { ShiftCard } from './ShiftCard';

interface DayCellProps {
  participantId: string | null;
  isoDate: string;
  shifts: Shift[];
  loadCaregivers: (caregiverId: string) => Caregiver | undefined;
  onAddShift: (participantId: string | null, isoDate: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shift: Shift) => void;
  // onDuplicateShift: (shift: Shift) => void;
  onShiftClick: (shift: Shift) => void;
  emptyVariant?: 'dash' | 'button';
  compact?: boolean;
}

export function DayCell({
  participantId,
  isoDate,
  shifts,
  loadCaregivers,
  onAddShift,
  onEditShift,
  onDeleteShift,
  // onDuplicateShift,
  onShiftClick,
  emptyVariant = 'dash',
  compact = false,
}: DayCellProps) {

  const { setNodeRef, isOver } = useDroppable({
    id: `${participantId ?? 'vacant'}-${isoDate}`,
    data: {
      participantId,
      isoDate,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex ${compact ? 'min-h-[56px]' : 'min-h-[92px]'
        } flex-col gap-2.5 p-2.5 transition-colors ${isOver ? 'bg-teal-50 ring-2 ring-inset ring-teal-300' : ''
        }`}
    >
      {shifts.map((shift) => (
        <ShiftCard
          key={shift.id}
          shift={shift}
          caregiver={
            shift.caregiverId
              ? loadCaregivers(shift.caregiverId)
              : undefined
          }
          onEditShift={onEditShift}
          onDelete={onDeleteShift}
          // onDuplicate={onDuplicateShift}
          onClick={onShiftClick}
        />
      ))}

      {shifts.length === 0 &&
        (emptyVariant === 'button' ? (
          <button
            onClick={() => onAddShift(participantId, isoDate)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-6 text-sm font-medium text-slate-400 hover:border-teal-400 hover:text-teal-600"
          >
            <Plus className="h-4 w-4" />
            Add Shift
          </button>
        ) : (
          <button
            onClick={() => onAddShift(participantId, isoDate)}
            className="flex flex-1 items-center justify-center rounded-sm border border-dashed text-slate-300 hover:border-teal-400 hover:text-teal-500"
          >
            <span
              className={`h-px w-5 bg-[#94A3B8] ${compact ? 'translate-y-px' : ''
                }`}
            />
          </button>
        ))}
    </div>
  );
}
