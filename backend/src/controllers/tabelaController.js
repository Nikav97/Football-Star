import LeagueTable from "../models/Tabela.js";
import { tableforseason } from "../services/TabelaPull.js";

// vraća standings za ligu/sezonu
export async function getLeagueStandings(req, res) {
  try {
    const { league, season } = req.query;

    let data = await LeagueTable.findOne({ leagueId: league, season });
    if (!data) {
      const { leagueName, standings } = await tableforseason(league, season);

      data = await LeagueTable.findOneAndUpdate(
        { leagueId: league, season },
        { leagueId: league, leagueName, season, standings },
        { upsert: true, returnDocument: "after" }
      );
    }

    res.json({ success: true, standings: data.standings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// vraća sve lige i njihove sezone
export async function getAvailableLeagues(req, res) {
  try {
    const docs = await LeagueTable.find({}, { leagueId: 1, leagueName: 1, season: 1, _id: 0 });
    const map = {};
    docs.forEach(doc => {
      if (!map[doc.leagueId]) {
        map[doc.leagueId] = { name: doc.leagueName || `League ${doc.leagueId}`, seasons: [] };
      }
      map[doc.leagueId].seasons.push(doc.season);
    });
    res.json({ success: true, leagues: map });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch leagues" });
  }
}

// briše sve tabele
export async function deleteAllTables(req, res) {
  try {
    await LeagueTable.deleteMany({});
    res.json({ success: true, message: "Svi zapisi iz LeagueTable su obrisani" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
