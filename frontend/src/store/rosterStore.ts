import { create } from 'zustand';
import { MOCK_SHIFTS, MOCK_VACANT_SHIFTS, PARTICIPANTS, STAFF } from '../data/mockData';
import { rosterApi } from '../api/apiClient';
import type { Caregiver, CreateShiftDto, Participant, Shift } from '../types/roster';
import axios from 'axios';
import { moveShiftToDate } from '../utils/shiftDate';

// Toggle this to false once your NestJS endpoints are live —
// it lets the frontend be built and demoed independently of the backend.
const USE_MOCK_DATA = false;

interface RosterStore {
  participants: Participant[];
  shifts: Shift[];
  vacantShifts: Shift[];
  caregivers: Caregiver[];
  isLoading: boolean;

  loadWeek: (weekStartIso: string) => Promise<void>;
  loadCaregivers: () => Promise<void>;
  loadParticipants: () => Promise<void>;
  loadShifts: (startDate: string, endDate: string) => Promise<void>;
  createParticipant: (data: {
    name: string;
    phone?: string;
    address?: string;
    allocatedBudget?: number;
  }) => Promise<void>;

  moveShift: (shiftId: string, targetParticipantId: string | null, targetDate: string) => Promise<void>;
  createShift: (
    dto: CreateShiftDto
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  duplicateShift: (shift: Shift) => Promise<void>;
}

export const useRosterStore = create<RosterStore>((set, get) => ({
  // participants: PARTICIPANTS,
  participants: [],
  shifts: MOCK_SHIFTS,
  vacantShifts: MOCK_VACANT_SHIFTS,
  caregivers: [],
  isLoading: false,

  // 1 - working
  loadCaregivers: async () => {
    try {
      const caregivers = await rosterApi.caregivers.getAll();
      set({
        caregivers,
      });
    } catch (error) {
      console.error(
        "Failed loading caregivers",
        error
      );
    }
  },

  //2 - working
  createParticipant: async (data) => {
    try {
      const participant = await rosterApi.participants.create(data);
      set((state) => ({
        participants: [
          ...state.participants,
          participant,
        ],
      }));
    } catch (error) {
      console.error("Failed to create participant", error);
    }
  },

  // 3 - working
  loadParticipants: async () => {
    try {
      const participants = await rosterApi.participants.getAll();
      set({
        participants,
      });
    } catch (error) {
      console.error("Failed to load participants", error);
    }
  },

  // 4 - working
  createShift: async (dto) => {
    console.log(dto, 'createShift dto')
    const tempId = `temp-${Date.now()}`;
    const optimisticShift: Shift = {
      ...dto,
      id: tempId,
      hasAlert: dto.hasAlert ?? false,
      colorKey: dto.caregiverId ?? '',
    };
    set((state) =>
      dto.participantId
        ? { shifts: [...state.shifts, optimisticShift] }
        : { vacantShifts: [...state.vacantShifts, optimisticShift] },
    );
    try {
      const created = await rosterApi.shifts.create(dto);
      const normalizedShift: Shift = {
        ...created,
        hasAlert: dto.hasAlert ?? false,
        colorKey: created.caregiverId ?? "unassigned",
        date: dto.date,
      };
      set((state) => ({
        shifts: state.shifts.map((s) =>
          s.id === tempId ? normalizedShift : s
        ),
        vacantShifts: state.vacantShifts.map((s) =>
          s.id === tempId ? normalizedShift : s
        ),
      }));
      return {
        success: true,
      };
    } catch (err) {
      console.error(err);
      set((state) => ({
        shifts: state.shifts.filter((s) => s.id !== tempId),
        vacantShifts: state.vacantShifts.filter((s) => s.id !== tempId),
      }));
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message:
            err.response?.data?.message ??
            "Failed to create shift",
        };
      }
      return {
        success: false,
        message: "Unexpected error occurred",
      };
    }
  },

  // 5 - working
  // get the shifts for the current week and update the store
  loadShifts: async (startDate, endDate) => {
    try {
      const shifts = await rosterApi.shifts.getAll(
        startDate,
        endDate
      );
      set({
        shifts: shifts.filter((s) => s.participantId),
        vacantShifts: shifts.filter((s) => !s.participantId),
      });
    } catch (error) {
      console.error('Failed loading shifts', error);
    }
  },

  // 6
  moveShift: async (
    shiftId,
    targetParticipantId,
    targetDate,
  ) => {
    const prevShifts = get().shifts;
    const prevVacant = get().vacantShifts;

    const allShifts = [
      ...prevShifts,
      ...prevVacant,
    ];

    const moved = allShifts.find(
      (shift) => shift.id === shiftId,
    );

    if (!moved) {
      console.warn(
        'Could not find shift:',
        shiftId,
      );
      return;
    }

    /*
     * Change the calendar date while preserving
     * the original start/end times.
     *
     * Example:
     *
     * Aug 5 09:00 → Aug 5 17:00
     *
     * dragged to Aug 7
     *
     * becomes:
     *
     * Aug 7 09:00 → Aug 7 17:00
     */
    const { startTime, endTime } =
      moveShiftToDate(
        moved.startTime,
        moved.endTime,
        targetDate,
      );
    console.log('MOVE SHIFT:', {
      originalStart: moved.startTime,
      originalEnd: moved.endTime,
      targetDate,
      newStart: startTime,
      newEnd: endTime,
    });

    const updated: Shift = {
      ...moved,
      participantId: targetParticipantId,
      startTime,
      endTime,
    };

    /*
     * Optimistic update.
     *
     * If participantId exists → participant row
     * If participantId is null → vacant row
     */
    set({
      shifts: [
        ...prevShifts.filter(
          (shift) => shift.id !== shiftId,
        ),
        ...(targetParticipantId
          ? [updated]
          : []),
      ],

      vacantShifts: [
        ...prevVacant.filter(
          (shift) => shift.id !== shiftId,
        ),
        ...(targetParticipantId === null
          ? [updated]
          : []),
      ],
    });

    /*
     * Persist the move to backend.
     */
    try {
      if (USE_MOCK_DATA) {
        return;
      }

      await rosterApi.shifts.moveShift({
        shiftId,
        participantId: targetParticipantId,
        startTime,
        endTime,
      });
    } catch (err) {
      console.error(
        'Failed to move shift, rolling back',
        err,
      );

      set({
        shifts: prevShifts,
        vacantShifts: prevVacant,
      });
    }
  },

  // ......................................................check and delete.................................................................
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

  // 2
  getStaff: (staffId) => STAFF[staffId] ?? { id: staffId, name: 'Unknown Staff' },

  // Optimistic move: update local state immediately so the drag feels instant,
  // then persist to the backend. Roll back if the request fails.
  // 3
  // moveShift: async (shiftId, targetParticipantId, targetDate) => {
  //   const prevShifts = get().shifts;
  //   const prevVacant = get().vacantShifts;

  //   const allShifts = [...prevShifts, ...prevVacant];
  //   const moved = allShifts.find((s) => s.id === shiftId);
  //   if (!moved) return;

  //   const updated: Shift = { ...moved, participantId: targetParticipantId, date: targetDate };

  //   set({
  //     shifts: [...prevShifts.filter((s) => s.id !== shiftId), ...(targetParticipantId ? [updated] : [])].filter(
  //       (s) => s.participantId !== null,
  //     ),
  //     vacantShifts: [
  //       ...prevVacant.filter((s) => s.id !== shiftId),
  //       ...(targetParticipantId === null ? [updated] : []),
  //     ],
  //   });

  //   if (USE_MOCK_DATA) return;
  //   try {
  //     await rosterApi.moveShift({ shiftId, participantId: targetParticipantId, date: targetDate });
  //   } catch (err) {
  //     console.error('Failed to move shift, rolling back', err);
  //     set({ shifts: prevShifts, vacantShifts: prevVacant });
  //   }
  // },



  // 5
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

  // 6
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
