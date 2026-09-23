import User from "../models/User.js";

// Vrati sve korisnike
export const getAllUsers = async () => {
  return await User.find().select("-password");
};

// Obriši korisnika po ID
export const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};
