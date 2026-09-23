import { create } from "zustand";
import apiClient from "../api/apiClient";

const useLeagueStore = create((set) => ({
  // state
  league: "39",
  season: "2024",
  options: {},
  teams: [],
  leagues: [],
  users: [],
  loading: false,
  error: "",

  // akcije
  setLeague: (league) => set({ league }),
  setSeason: (season) => set({ season }),
  setOptions: (options) => set({ options }),
  setTeams: (teams) => set({ teams }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  // fetch users
fetchUsers: async () => {
  try {
    const res = await apiClient.get("/admin/users");
    set({ users: res.data.users });
  } catch (err) {
    console.error("Error fetching users:", err);
  }
},

// delete user
deleteUser: async (id) => {
  try {
    await apiClient.delete(`/admin/users/${id}`);
    set((state) => ({
      users: state.users.filter((u) => u._id !== id),
    }));
  } catch (err) {
    console.error("Error deleting user:", err);
  }
},
// fetch leagues iz baze
fetchLeagues: async () => {
  try {
    const res = await apiClient.get("/admin/leagues"); // napravi backend GET /admin/leagues koji vraća LeagueTable.find()
    set({ leagues: res.data.leagues });
  } catch (err) {
    console.error("Error fetching leagues:", err);
  }
},

// delete league season iz baze
deleteLeagueSeason: async (leagueId, season) => {
  try {
    await apiClient.delete(`/admin/leagues/${leagueId}/${season}`); 
    set((state) => {
      const copy = { ...state.leagues };
      if (copy[leagueId]) {
        copy[leagueId].seasons = copy[leagueId].seasons.filter(s => s !== season);
        if (copy[leagueId].seasons.length === 0) {
          delete copy[leagueId];
        }
      }
      return { leagues: copy };
    });
  } catch (err) {
    console.error("Error deleting league season:", err);
  }
},




}));

export default useLeagueStore;
