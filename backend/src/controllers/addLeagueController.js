import LeagueTable from "../models/Tabela.js";
import { getLeagueTeams } from "../services/timoviapi.js";
import { tableforseason } from "../services/TabelaPull.js";

export const addLeagueController = async (req, res) => {
  try {
    const { leagueId, season } = req.body;
    if (!leagueId || !season) {
      return res.status(400).json({ success: false, message: "Missing leagueId or season" });
    }

    // prvo proveri da li već postoji
    let existing = await LeagueTable.findOne({ leagueId, season });
    if (existing) {
      return res.json({ success: true, message: "League/season already exists", league: existing });
    }

    // povuci timove
    const { leagueName, teams } = await getLeagueTeams(leagueId, season);

    // povuci standings
    const { standings } = await tableforseason(leagueId, season);

    // snimi u bazu oba seta podataka
    const newLeague = await LeagueTable.create({
      leagueId,
      leagueName,
      season,
      teams,
      standings
    });

    res.json({ success: true, message: "League/season added", league: newLeague, teams, standings });
  } catch (err) {
    console.error("Error in addLeagueController:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
