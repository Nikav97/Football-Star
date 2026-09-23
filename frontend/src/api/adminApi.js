import apiClient from "./apiClient";

export const getUsers = async () => {
  const response = await apiClient.get("/admin/users");

  return response.data;
};