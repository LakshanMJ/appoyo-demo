// Domain types — these mirror what the NestJS API is expected to return.
// Keep this file as the single source of truth; the backend DTOs should match.

export type ShiftTag = 'assistance' | 'transport' | 'domestic' | 'community' | 'nursing';

export interface Staff {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Caregiver {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Participant {
  id: string;
  name: string;
  allocatedBudget: number;
  usedBudget: number;
}

export type ShiftType =
  | 'assistance'
  | 'transport'
  | 'domestic'
  | 'community'
  | 'nursing';
  
export interface Shift {
  id: string;
  participantId: string | null; // null = vacant / unassigned shift row
  caregiverId: string | null;
  date: string; // ISO date, e.g. "2026-02-23"
  startTime: string; // "07:00"
  endTime: string; // "20:00"
  type: ShiftType;
  hasAlert: boolean; // renders the red "!" pill variant
  colorKey: string; // deterministic color derived from staffId, see lib/shiftColor.ts
}

export interface RosterWeek {
  weekStart: string; // ISO date, Monday
  weekEnd: string; // ISO date, Sunday
  participants: Participant[];
  shifts: Shift[];
  vacantShifts: Shift[];
}

// Payloads sent to the NestJS API

export interface CreateShiftDto {
  participantId: string | null;
  caregiverId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
  hasAlert?: boolean;
}

export interface MoveShiftDto {
  shiftId: string;
  participantId: string | null;
  startTime: string;
  endTime: string;
}
