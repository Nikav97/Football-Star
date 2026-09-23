import { getLeagueTeams } from "../services/timoviapi.js";
import Team from "../models/Team.js";


// export async function fetchLeagueTeams(req, res) {
//   try {
//     const { league, season } = req.query;
//     const { leagueName, teams } = await getLeagueTeams(league, season);
//     res.json({ success: true, leagueName, teams });
//   } catch (err) {
//     console.error("Greška u fetchLeagueTeams:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// }


export const fetchLeagueTeams = async (req, res) => {
  try {
    const { league, season } = req.query;
    const teams = await Team.find({ leagueId: league, season: season });
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export async function deleteAllTeams(req, res) {
  try {
    await Team.deleteMany({});
    res.json({ success: true, message: "Svi timovi su obrisani iz baze" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
