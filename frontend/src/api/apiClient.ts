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
    create: async (dto:any) => {
      const response = await api.post("/shifts", dto);
      return response.data;
    },
    getAll: async (startDate: string, endDate: string) => {
        console.time('GET /shifts');
      const response = await api.get('/shifts', {
        params: {
          startDate,
          endDate,
        },
      });
       console.timeEnd('GET /shifts');
      return response.data;
    },
    delete: async (shiftId: string) => {
      const response = await api.delete(`/shifts/${shiftId}`);
      return response.data;
    },
    moveShift: async (data:any) => {
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
    update: async (shiftId:any, dto:any) => {
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
      firstName: string;
      lastName: string;
      phone?: string;
      addressLine1: string;
      addressLine2: string;
      allocatedBudget?: number;
    }) => {
      const response = await api.post('/participants', data);
      return response.data;
    },
  },

};