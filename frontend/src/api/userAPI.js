import apiClient from "./apiClient";

// povuci sve korisnike
export const getUsers = async () => {
  const res = await apiClient.get("/admin/users");
  return res.data.users;
};

// obriši korisnika
export const deleteUserById = async (id) => {
  await apiClient.delete(`/admin/users/${id}`);
};
