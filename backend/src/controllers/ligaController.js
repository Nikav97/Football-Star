import { playersByLeague } from "../services/ligaApi.js";

export async function getLeaguePlayers(req, res) {
  try {
    const { leagueId, season } = req.params;
    const leagueNum = Number(leagueId);
    const seasonNum = Number(season);

    const { leagueName, players } = await playersByLeague(leagueNum, seasonNum);

    res.json({
      success: true,
      count: players.length,
      leagueId: leagueNum,
      leagueName,
      season: seasonNum,
      players
    });
  } catch (err) {
    console.error("Greška u getLeaguePlayers:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}
