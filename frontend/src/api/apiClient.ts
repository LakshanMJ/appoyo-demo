import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const rosterApi = {
  createShift: async (dto) => {
    const response = await api.post(
      "/shifts",
      dto
    );
    return response.data;
  }
};