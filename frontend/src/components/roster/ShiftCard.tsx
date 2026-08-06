import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { AlertTriangle, Copy } from 'lucide-react';
import type { Shift, Staff } from '../../types/roster';
import { getShiftColor } from '../../utils/shiftColor';

interface ShiftCardProps {
  shift: Shift;
  staff: Staff;
  onDuplicate?: (shift: Shift) => void;
  onClick?: (shift: Shift) => void;
}

export function ShiftCard({ shift, staff, onDuplicate, onClick }: ShiftCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: shift.id,
    data: { shift },
  });

  const color = getShiftColor(shift.staffId);

  const style = {
    transform: CSS.Translate.toString(transform),
    borderLeftColor: color.border,
    backgroundColor: color.bg,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick?.(shift)}
      className={`group relative cursor-grab overflow-hidden rounded-lg border-l-4 bg-white p-3 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md active:cursor-grabbing ${isDragging ? 'opacity-40' : ''
        }`}
    >
      <div
        className="absolute right-0 top-0 h-0 w-0"
        style={{
          borderTop: `18px solid ${color.border}`,
          borderLeft: '18px solid transparent',
        }}
      />

      <div className="mb-2 flex items-center gap-1">
        {staff.avatarUrl ? (
          <img
            src={staff.avatarUrl}
            alt=""
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="h-6 w-6 shrink-0 rounded-full bg-slate-300" />
        )}

        <span className="truncate whitespace-nowrap text-xs font-semibold text-slate-800">
          {staff.name}
        </span>
      </div>

      <p className="mb-1 whitespace-nowrap text-[10px] font-medium text-slate-500">
        {shift.startTime} - {shift.endTime}
      </p>

      <div className="flex items-center justify-between">
        {shift.hasAlert ? (
          <span className="flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600">
            <AlertTriangle className="h-3 w-3 fill-red-600 text-white" />
            Assistance
          </span>
        ) : (
          <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-500">Assistance</span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate?.(shift);
          }}
          className="rounded p-1 text-slate-300 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-500 group-hover:opacity-100"
          aria-label="Duplicate shift"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
