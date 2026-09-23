// healthApi.js
import apiClient from "./apiClient";

export const getHealth = async () => {
  const response = await apiClient.get("/health"); // ✅ no extra /api
  return response.data;
};
