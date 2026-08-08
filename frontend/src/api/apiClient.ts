import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const rosterApi = {

  caregivers: {
    getAll: async () => {
      const response = await api.get("/caregivers");
      return response.data;
    },
  },

  shifts: {
    create: async (dto) => {
      const response = await api.post("/shifts", dto);
      return response.data;
    },
    getAll: async (startDate: string, endDate: string) => {
      const response = await api.get('/shifts', {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    },
    delete: async (shiftId: string) => {
      const response = await api.delete(`/shifts/${shiftId}`);
      return response.data;
    },
    moveShift: async (data) => {
      const response = await api.patch(
        `/shifts/${data.shiftId}/move`,
        {
          participantId: data.participantId,
          startTime: data.startTime,
          endTime: data.endTime,
        },
      );
      return response.data;
    },
    update: async (shiftId, dto) => {
      const response = await api.patch(
        `/shifts/${shiftId}`,
        dto
      );
      return response.data;
    },
  },

  participants: {
    getAll: async () => {
      const response = await api.get("/participants");
      return response.data;
    },

    create: async (data: {
      name: string;
      phone?: string;
      address?: string;
      allocatedBudget?: number;
    }) => {
      const response = await api.post('/participants', data);
      return response.data;
    },
  },

};