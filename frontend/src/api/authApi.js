import apiClient from "./apiClient";

// Registracija
export const registerUser = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await apiClient.post("/auth/login", userData);
  return response.data;
};

// Trenutni korisnik (koristi token iz apiClient interceptora)
export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};
