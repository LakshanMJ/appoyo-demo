import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { IoCopy, IoPencil } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import {
  FaHandsHelping,
  FaCar,
  FaHome,
  FaUsers,
  FaHeartbeat,
} from 'react-icons/fa';
import type { Caregiver, Shift } from '../../types/roster';
import { getShiftColor } from '../../utils/shiftColor';
import { formatShiftTime } from '../../utils/time';
import { MoreVertical } from 'lucide-react';

interface ShiftCardProps {
  shift: Shift;
  caregiver?: Caregiver;
  onDuplicate?: (shift: Shift) => void;
  onClick?: (shift: Shift) => void;
  onEditShift?: (shift: Shift) => void;
  onDelete?: (shift: Shift) => void;
}

const shiftTypeConfig = {
  assistance: {
    label: 'Assistance',
    icon: FaHandsHelping,
    color: 'text-amber-500',
  },
  transport: {
    label: 'Transport',
    icon: FaCar,
    color: 'text-indigo-600',
  },
  domestic: {
    label: 'Domestic',
    icon: FaHome,
    color: 'text-green-600',
  },
  community: {
    label: 'Community',
    icon: FaUsers,
    color: 'text-purple-500',
  },
  nursing: {
    label: 'Nursing',
    icon: FaHeartbeat,
    color: 'text-rose-500',
  },
};

const GAP = 4;

const MENU_WIDTH = 40;
const MENU_HEIGHT = 104;

type MenuCoords = {
  top: number;
  left: number;
};

export function ShiftCard({
  shift,
  caregiver,
  onDuplicate,
  onClick,
  onEditShift,
  onDelete,
}: ShiftCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: shift.id,
    data: { shift },
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const computeCoords = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openRight = spaceRight >= MENU_WIDTH || spaceRight >= spaceLeft;
    const left = openRight
      ? rect.right - MENU_WIDTH
        ? rect.left
        : rect.left
      : rect.right - MENU_WIDTH;

    const openBelow = spaceBelow >= MENU_HEIGHT || spaceBelow >= spaceAbove;
    const top = openBelow ? rect.bottom + GAP : rect.top - MENU_HEIGHT - GAP;

    setCoords({
      top,
      left: openRight ? rect.left : rect.right - MENU_WIDTH,
    });
  };

  const toggleMenu = () => {
    if (!menuOpen) computeCoords();
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    const handleReposition = () => computeCoords();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [menuOpen]);

  const color = getShiftColor(shift.caregiverId || 'unassigned');

  const style = {
    transform: CSS.Translate.toString(transform),
    borderLeftColor: color.border,
    backgroundColor: color.bg,
  };

  const config = shiftTypeConfig[shift.type as keyof typeof shiftTypeConfig];
  const Icon = config?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick?.(shift)}
      className={`group relative cursor-grab overflow-hidden rounded-md border-l-2 bg-white p-3 font-inter shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md active:cursor-grabbing ${isDragging ? 'opacity-40' : ''
        }`}
    >
      <div
        className="absolute right-0 top-0 h-0 w-0"
        style={{
          borderTop: `18px solid ${color.border}`,
          borderLeft: '18px solid transparent',
        }}
      />

      <button
        ref={triggerRef}
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu();
        }}
        // className="absolute right-1 top-1 z-10 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 data-[open=true]:opacity-100 data-[open=true]:bg-slate-100"
        className="absolute right-1 top-1 z-10 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:text-slate-600 group-hover:opacity-100 data-[open=true]:opacity-100"
        data-open={menuOpen}
        aria-label="Shift options"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: MENU_WIDTH,
            }}
            className="z-50 overflow-hidden rounded-lg border border-slate-200/80 bg-white p-1 shadow-[0_4px_16px_rgba(15,23,42,0.12)]"
          >
            {/* Edit */}
            <button
              type="button"
              role="menuitem"
              aria-label="Edit shift"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onEditShift?.(shift);
              }}
              className="flex h-6 w-full items-center justify-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-teal-50 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
            >
              <IoPencil className="h-3.5 w-3.5" />
            </button>

            {/* Duplicate */}
            <button
              type="button"
              role="menuitem"
              aria-label="Duplicate shift"
              onClick={() => {
                setMenuOpen(false);
                onDuplicate?.(shift);
              }}
              className="flex h-6 w-full items-center justify-center rounded-md text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <IoCopy className="h-3.5 w-3.5" />
            </button>

            {/* Delete */}
            <button
              type="button"
              role="menuitem"
              aria-label="Delete shift"
              onClick={() => {
                setMenuOpen(false);
                onDelete?.(shift);
              }}
              className="flex h-6 w-full items-center justify-center rounded-md text-red-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
            >
              <AiFillDelete className="h-3.5 w-3.5" />
            </button>
          </div>
          ,
          document.body
        )}

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
            {/* <span className="truncate whitespace-nowrap text-xs font-semibold text-slate-800">
              {caregiver.name}
            </span> */}
            <span className="truncate whitespace-nowrap text-xs font-semibold text-[#183554]">
              {caregiver.name}
            </span>
          </>
        ) : (
          <>
            <div className="h-6 w-6 shrink-0 rounded-full bg-slate-200" />
            <span className="truncate whitespace-nowrap text-xs font-semibold text-[#183554]">
              Unassigned
            </span>
          </>
        )}
      </div>
      <p className="mb-1 whitespace-nowrap text-[8px] font-bold text-[#183554]">
        {formatShiftTime(shift.startTime)} - {formatShiftTime(shift.endTime)}
      </p>

      <div className="flex items-center justify-between">
        {config ? (
          <span className="flex items-center gap-1 rounded-sm bg-[#FFEED4] px-1.5 py-0.5 text-[8px] font-medium text-[#251926]">
            {Icon && (
              <Icon
                className={`h-3 w-3 ${config.color}`}
              />
            )}
            {config.label}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500">
            Unknown
          </span>
        )}
      </div>
    </div>
  );
}