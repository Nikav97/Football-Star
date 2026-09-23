import { create } from "zustand";
import axios from "axios";
import useLeagueStore from "./leagueStore";

const usePlayerStore = create((set) => ({
  players: [],
  loading: false,
  error: null,

  // 🔹 Povuci sve igrače iz lige
  fetchPlayersByLeague: async () => {
    const { league, season } = useLeagueStore.getState();
    if (!league || !season) {
      set({ error: "League or season not set" });
      return;
    }

    try {
      set({ loading: true, error: null });
      const res = await axios.get(
        `http://localhost:5000/api/league/${league}/${season}/players`
      );
      if (res.data.success) {
        set({ players: res.data.players || [] });
      } else {
        set({ error: res.data.message });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // 🔹 Povuci igrače samo za jedan tim
  fetchPlayersByTeam: async (teamId, season) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(
        `http://localhost:5000/api/team/${teamId}/${season}/players`
      );
      if (res.data.success) {
        set({ players: res.data.players || [] });
      } else {
        set({ error: res.data.message });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  }
}));

export default usePlayerStore;
