import { create } from 'zustand';
import { MOCK_SHIFTS, MOCK_VACANT_SHIFTS, PARTICIPANTS, STAFF } from '../data/mockData';
import { rosterApi } from '../lib/api';
import type { CreateShiftDto, Participant, Shift, Staff } from '../types/roster';

// Toggle this to false once your NestJS endpoints are live —
// it lets the frontend be built and demoed independently of the backend.
const USE_MOCK_DATA = true;

interface RosterStore {
  participants: Participant[];
  shifts: Shift[];
  vacantShifts: Shift[];
  isLoading: boolean;

  loadWeek: (weekStartIso: string) => Promise<void>;
  getStaff: (staffId: string) => Staff;

  moveShift: (shiftId: string, targetParticipantId: string | null, targetDate: string) => Promise<void>;
  createShift: (dto: CreateShiftDto) => Promise<void>;
  duplicateShift: (shift: Shift) => Promise<void>;
  addParticipant: (name: string) => void;
}

export const useRosterStore = create<RosterStore>((set, get) => ({
  participants: PARTICIPANTS,
  shifts: MOCK_SHIFTS,
  vacantShifts: MOCK_VACANT_SHIFTS,
  isLoading: false,

  loadWeek: async (weekStartIso) => {
    if (USE_MOCK_DATA) return; // mock data is already loaded synchronously
    set({ isLoading: true });
    try {
      const week = await rosterApi.getWeek(weekStartIso);
      set({
        participants: week.participants,
        shifts: week.shifts,
        vacantShifts: week.vacantShifts,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to load roster week', err);
      set({ isLoading: false });
    }
  },

  getStaff: (staffId) => STAFF[staffId] ?? { id: staffId, name: 'Unknown Staff' },

  // Optimistic move: update local state immediately so the drag feels instant,
  // then persist to the backend. Roll back if the request fails.
  moveShift: async (shiftId, targetParticipantId, targetDate) => {
    const prevShifts = get().shifts;
    const prevVacant = get().vacantShifts;

    const allShifts = [...prevShifts, ...prevVacant];
    const moved = allShifts.find((s) => s.id === shiftId);
    if (!moved) return;

    const updated: Shift = { ...moved, participantId: targetParticipantId, date: targetDate };

    set({
      shifts: [...prevShifts.filter((s) => s.id !== shiftId), ...(targetParticipantId ? [updated] : [])].filter(
        (s) => s.participantId !== null,
      ),
      vacantShifts: [
        ...prevVacant.filter((s) => s.id !== shiftId),
        ...(targetParticipantId === null ? [updated] : []),
      ],
    });

    if (USE_MOCK_DATA) return;
    try {
      await rosterApi.moveShift({ shiftId, participantId: targetParticipantId, date: targetDate });
    } catch (err) {
      console.error('Failed to move shift, rolling back', err);
      set({ shifts: prevShifts, vacantShifts: prevVacant });
    }
  },

  createShift: async (dto) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticShift: Shift = { ...dto, id: tempId, hasAlert: dto.hasAlert ?? true, colorKey: dto.staffId };

    set((state) =>
      dto.participantId
        ? { shifts: [...state.shifts, optimisticShift] }
        : { vacantShifts: [...state.vacantShifts, optimisticShift] },
    );

    if (USE_MOCK_DATA) return;
    try {
      const created = await rosterApi.createShift(dto);
      set((state) => ({
        shifts: state.shifts.map((s) => (s.id === tempId ? created : s)),
        vacantShifts: state.vacantShifts.map((s) => (s.id === tempId ? created : s)),
      }));
    } catch (err) {
      console.error('Failed to create shift, rolling back', err);
      set((state) => ({
        shifts: state.shifts.filter((s) => s.id !== tempId),
        vacantShifts: state.vacantShifts.filter((s) => s.id !== tempId),
      }));
    }
  },

  duplicateShift: async (shift) => {
    await get().createShift({
      participantId: shift.participantId,
      staffId: shift.staffId,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      tag: shift.tag,
      hasAlert: shift.hasAlert,
    });
  },

  addParticipant: (name) => {
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name,
      allocatedBudgetCents: 0,
      usedBudgetCents: 0,
    };
    set((state) => ({ participants: [...state.participants, newParticipant] }));
  },
}));
