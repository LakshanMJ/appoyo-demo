import { create } from 'zustand';
import { rosterApi } from '../api/apiClient';
import type { Caregiver, CreateShiftDto, Participant, Shift } from '../types/roster';
import axios from 'axios';
import { moveShiftToDate } from '../utils/shiftDate';
import { toast } from 'sonner';

const USE_MOCK_DATA = false;

interface RosterStore {
  participants: Participant[];
  shifts: Shift[];
  vacantShifts: Shift[];
  caregivers: Caregiver[];
  isLoading: boolean;

  loadCaregivers: () => Promise<void>;
  loadParticipants: () => Promise<void>;
  loadShifts: (startDate: string, endDate: string) => Promise<void>;
  createParticipant: (data: {
    firstName: string;
    lastName: string;
    phone?: string;
    addressLine1: string;
    addressLine2: string;
    allocatedBudget?: number;
  }) => Promise<{
    success: boolean;
    message?: string;
  }>;
  moveShift: (shiftId: string, targetParticipantId: string | null, targetDate: string) => Promise<void>;
  createShift: (
    dto: CreateShiftDto
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  updateShift: (
    shiftId: string,
    dto: CreateShiftDto
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  deleteShift: (
    shiftId: string
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
}

export const useRosterStore = create<RosterStore>((set, get) => ({
  participants: [],
  shifts: [],
  vacantShifts: [],
  caregivers: [],
  isLoading: false,

  // 1
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

  //2
  // createParticipant: async (data) => {
  //   try {
  //     const participant = await rosterApi.participants.create(data);
  //     set((state) => ({
  //       participants: [
  //         ...state.participants,
  //         participant,
  //       ],
  //     }));
  //   } catch (error) {
  //     console.error("Failed to create participant", error);
  //   }
  // },
  createParticipant: async (data) => {
    try {
      await rosterApi.participants.create(data);
      await get().loadParticipants();

      return {
        success: true,
      };
    } catch (error: any) {
      console.error(error);

      return {
        success: false,
        message: error.response?.data?.message,
      };
    }
  },

  // 3
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

  // 4
  createShift: async (dto) => {
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

  // 5
  // loadShifts: async (startDate, endDate) => {
  //   try {
  //     const shifts = await rosterApi.shifts.getAll(
  //       startDate,
  //       endDate
  //     );
  //     set({
  //       shifts: shifts.filter((s: any) => s.participantId),
  //       vacantShifts: shifts.filter((s: any) => !s.participantId),
  //     });
  //   } catch (error) {
  //     console.error('Failed loading shifts', error);
  //   }
  // },

  loadShifts: async (startDate, endDate) => {
    try {
      console.log('🟡 loadShifts START', { startDate, endDate });

      const shifts = await rosterApi.shifts.getAll(
        startDate,
        endDate
      );

      console.log('🟢 loadShifts RECEIVED:', shifts);
      console.log('🟢 NUMBER OF SHIFTS:', shifts.length);

      set({
        shifts: shifts.filter((s: any) => s.participantId),
        vacantShifts: shifts.filter((s: any) => !s.participantId),
      });

      console.log('🟢 Zustand shifts SET');
    } catch (error) {
      console.error('🔴 loadShifts FAILED:', error);
      throw error;
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
      caregiverId:
        targetParticipantId === null
          ? null
          : moved.caregiverId,
      startTime,
      endTime,
    };

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

    try {
      if (USE_MOCK_DATA) {
        return;
      }

      await rosterApi.shifts.moveShift({
        shiftId,
        participantId: targetParticipantId,
        caregiverId:
          targetParticipantId === null
            ? null
            : moved.caregiverId,
        startTime,
        endTime,
      });
    } catch (err: any) {
      console.error(
        'Failed to move shift, rolling back',
        err,
      );

      set({
        shifts: prevShifts,
        vacantShifts: prevVacant,
      });

      toast.error(
        err.response?.data?.message || 'Unable to move shift.',
        {
          style: {
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
          },
        },
      );
    }
  },

  // 7
  updateShift: async (shiftId, dto) => {
    try {
      const updated = await rosterApi.shifts.update(
        shiftId,
        dto
      );
      set((state) => ({
        shifts: state.shifts.map((shift) =>
          shift.id === shiftId
            ? {
              ...shift,
              ...updated,
              participantId: dto.participantId,
              startTime: dto.startTime,
              endTime: dto.endTime,
            }
            : shift
        ),
        vacantShifts: state.vacantShifts.map((shift) =>
          shift.id === shiftId
            ? {
              ...shift,
              ...updated,
              participantId: dto.participantId,
              startTime: dto.startTime,
              endTime: dto.endTime,
            }
            : shift
        ),
      }));
      return { success: true };
    } catch (err) {
      console.error('Failed to update shift', err);
      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message:
            err.response?.data?.message ??
            'Failed to update shift',
        };
      }
      return {
        success: false,
        message: 'Unexpected error occurred',
      };
    }
  },

  // 8
  deleteShift: async (shiftId) => {
    const prevShifts = get().shifts;
    const prevVacantShifts = get().vacantShifts;

    set({
      shifts: prevShifts.filter(
        (shift) => shift.id !== shiftId
      ),
      vacantShifts: prevVacantShifts.filter(
        (shift) => shift.id !== shiftId
      ),
    });

    if (USE_MOCK_DATA) {
      return { success: true };
    }

    try {
      await rosterApi.shifts.delete(shiftId);

      return {
        success: true,
      };
    } catch (err) {
      console.error(
        'Failed to delete shift, rolling back',
        err
      );

      set({
        shifts: prevShifts,
        vacantShifts: prevVacantShifts,
      });

      if (axios.isAxiosError(err)) {
        return {
          success: false,
          message:
            err.response?.data?.message ??
            'Failed to delete shift',
        };
      }

      return {
        success: false,
        message: 'Unexpected error occurred',
      };
    }
  },
}));
