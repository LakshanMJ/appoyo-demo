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