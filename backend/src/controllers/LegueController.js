import LeagueTable from "../models/Tabela.js";
import { tableforseason } from "../services/TabelaPull.js";

// GET leagues iz baze
export const getLeagues = async (req, res) => {
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
};

// DELETE league season iz baze
export const deleteLeagueSeason = async (req, res) => {
  try {
    const leagueId = parseInt(req.params.leagueId, 10);
    const season = parseInt(req.params.season, 10);
    await LeagueTable.deleteOne({ leagueId, season });
    res.json({ success: true, message: "League season deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET standings iz baze za ligu/sezonu
export const getLeagueStandings = async (req, res) => {
  try {
    const leagueId = parseInt(req.params.leagueId, 10);
    const season = parseInt(req.params.season, 10);
    const doc = await LeagueTable.findOne({ leagueId, season });
    if (!doc) {
      return res.status(404).json({ success: false, message: "League/season not found" });
    }
    res.json({
      success: true,
      leagueName: doc.leagueName,
      standings: doc.standings || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

import { getLeagueTeams } from "../services/timoviapi.js"; // ovo je tvoja funkcija koja parsira timove sa venue

export const addLeagueSeason = async (req, res) => {
  try {
    const { leagueId, season } = req.body;
    if (!leagueId || !season) {
      return res.status(400).json({ success: false, message: "Missing leagueId or season" });
    }

    // proveri da li već postoji
    let existing = await LeagueTable.findOne({ leagueId, season });
    if (existing) {
      return res.json({ success: true, message: "League/season already exists", league: existing });
    }

    // povuci standings + leagueName
    const { leagueName, standings } = await tableforseason(leagueId, season);

    // snimi u bazu
    const newLeague = await LeagueTable.create({
      leagueId,
      leagueName,
      season,
      standings
    });

    // odmah povuci i timove sa stadionima i upiši u Team kolekciju
    const { teams } = await getLeagueTeams(leagueId, season);

    res.json({
      success: true,
      message: "League/season added",
      league: newLeague,
      teams // 👈 sada vraćaš i timove sa venue
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// backup
// ADD league/season → povlači ime lige i standings iz API-a i upisuje u bazu
// export const addLeagueSeason = async (req, res) => {
//   try {
//     const { leagueId, season } = req.body;
//     if (!leagueId || !season) {
//       return res.status(400).json({ success: false, message: "Missing leagueId or season" });
//     }

//     // proveri da li već postoji
//     let existing = await LeagueTable.findOne({ leagueId, season });
//     if (existing) {
//       return res.json({ success: true, message: "League/season already exists", league: existing });
//     }

//     // povuci standings + leagueName iz API-a
//     const { leagueName, standings } = await tableforseason(leagueId, season);

//     // snimi u bazu
//     const newLeague = await LeagueTable.create({
//       leagueId,
//       leagueName,
//       season,
//       standings
//     });

//     res.json({ success: true, message: "League/season added", league: newLeague });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
export const dodajligu = async (req, res) => {
  try {
    const leagueId = parseInt(req.params.leagueId, 10);
    const season = parseInt(req.params.season, 10);

    const doc = await LeagueTable.findOne({ leagueId, season });
    if (!doc) {
      return res.status(404).json({ success: false, message: "League/season not found" });
    }

    // ako si standings upisao u bazu, timovi su tu
    const teams = doc.standings?.map(s => s.team) || [];
    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
import Team from "../models/Team.js";

export const getLeagueTeams33 = async (req, res) => {
  try {
    const leagueId = parseInt(req.params.leagueId, 10);
    const season = parseInt(req.params.season, 10);

    const teams = await Team.find({ leagueId, season });
    if (!teams || teams.length === 0) {
      return res.status(404).json({ success: false, message: "No teams found" });
    }

    res.json({ success: true, teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
