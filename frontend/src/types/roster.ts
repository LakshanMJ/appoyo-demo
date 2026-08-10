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
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1: string;
  addressLine2: string;
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
  participantId: string | null;
  caregiverId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
  hasAlert: boolean;
  colorKey: string;
}

export interface RosterWeek {
  weekStart: string;
  weekEnd: string;
  participants: Participant[];
  shifts: Shift[];
  vacantShifts: Shift[];
}

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
  caregiverId: string | null;
  startTime: string;
  endTime: string;
}