import apiClient from "./apiClient";

export const addLeagueSeason = async (leagueId, season) => {
  const res = await apiClient.post("/admin/leagues", { leagueId, season });
  return res.data;
};
