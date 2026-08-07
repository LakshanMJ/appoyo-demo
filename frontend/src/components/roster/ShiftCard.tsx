import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Copy,
  HandHelping,
  Car,
  House,
  Users,
  HeartPulse,
} from 'lucide-react';
import type { Caregiver, Shift } from '../../types/roster';
import { getShiftColor } from '../../utils/shiftColor';
import { formatShiftTime } from '../../utils/time';

interface ShiftCardProps {
  shift: Shift;
  caregiver?: Caregiver;
  onDuplicate?: (shift: Shift) => void;
  onClick?: (shift: Shift) => void;
}

const shiftTypeConfig = {
  assistance: {
    label: 'Assistance',
    icon: HandHelping,
  },
  transport: {
    label: 'Transport',
    icon: Car,
  },
  domestic: {
    label: 'Domestic',
    icon: House,
  },
  community: {
    label: 'Community',
    icon: Users,
  },
  nursing: {
    label: 'Nursing',
    icon: HeartPulse,
  },
};

export function ShiftCard({ shift, caregiver, onDuplicate, onClick }: ShiftCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: shift.id,
    data: { shift },
  });
  console.log("SHIFT CARD DATA", shift);
  const color = getShiftColor(shift.caregiverId || 'unassigned');

  const style = {
    transform: CSS.Translate.toString(transform),
    borderLeftColor: color.border,
    backgroundColor: color.bg,
  };

  const config =
    shiftTypeConfig[shift.type as keyof typeof shiftTypeConfig];

  const Icon = config?.icon;
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
        {caregiver ? (
          <>
            {caregiver.avatarUrl ? (
              <img
                src={caregiver.avatarUrl}
                alt=""
                className="h-6 w-6 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="h-6 w-6 shrink-0 rounded-full bg-slate-300" />
            )}

            <span className="truncate whitespace-nowrap text-xs font-semibold text-slate-800">
              {caregiver.name}
            </span>
          </>
        ) : (
          <>
            <div className="h-6 w-6 shrink-0 rounded-full bg-slate-200" />

            <span className="truncate whitespace-nowrap text-xs font-semibold text-slate-500">
              Unassigned
            </span>
          </>
        )}
      </div>

      <p className="mb-1 whitespace-nowrap text-[10px] font-medium text-slate-500">
        {formatShiftTime(shift.startTime)} - {formatShiftTime(shift.endTime)}
      </p>

      <div className="flex items-center justify-between">
        {config ? (
          <span className="flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
            {Icon && <Icon className="h-3 w-3" />}
            {config.label}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500">
            Unknown
          </span>
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
