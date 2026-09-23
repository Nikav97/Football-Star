import { playersData,playersByTeam } from "../services/igraciAPI.js";
import Player from "../models/Player.js";


export async function savePlayersByLeague(req, res) {
  try {
    const { leagueId, season } = req.params;

    // Povuci SVE stranice sa API-ja
    const allPlayers = await playersData(leagueId, season);

    // Mapiraj u dokumente
    const docs = allPlayers.map(p => ({
      playerId: p.player.id,
      name: p.player.name,
      firstname: p.player.firstname,
      lastname: p.player.lastname,
      age: p.player.age,
      nationality: p.player.nationality,
      photo: p.player.photo,
      team: p.statistics[0]?.team,
      league: p.statistics[0]?.league,
      statistics: p.statistics[0]
    }));

    // Bulk insert sa upsert-om (sprečava duplikate)
    const bulkOps = docs.map(doc => ({
      updateOne: {
        filter: { playerId: doc.playerId, "league.id": doc.league.id, "league.season": doc.league.season },
        update: { $set: doc },
        upsert: true
      }
    }));

    const result = await Player.bulkWrite(bulkOps, { ordered: false });

    res.json({
      success: true,
      message: `Upsert završio: ${result.upsertedCount} novih, ${result.modifiedCount} ažuriranih, ${result.matchedCount} postojećih za ligu ${leagueId}, sezonu ${season}`
    });
  } catch (err) {
    console.error("Greška u savePlayersByLeague:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}


export async function getPlayersByLeague(req, res) {
  try {
    const { leagueId, season } = req.params;
    const players = await Player.find({ "league.id": leagueId, "league.season": season });

    res.json({ success: true, players });
  } catch (err) {
    console.error("Greška u getPlayersByLeague:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getPlayersByTeam(req, res) {
  try {
    const { teamId, season } = req.params;
    const teamNum = Number(teamId);
    const seasonNum = Number(season);

    // prvo probaj iz baze
    let players = await Player.find({
      "team.id": teamNum,
      "league.season": seasonNum
    });

    if (!players || players.length === 0) {
      // povuci iz API-ja
      const apiPlayers = await playersByTeam(teamNum, seasonNum);

      // mapiraj u oblik koji odgovara šemi
      const mappedPlayers = apiPlayers.map(p => ({
        playerId: p.player.id,
        name: p.player.name,
        firstname: p.player.firstname,
        lastname: p.player.lastname,
        age: p.player.age,
        nationality: p.player.nationality,
        photo: p.player.photo,
        team: p.statistics[0].team,
        league: p.statistics[0].league,
        statistics: p.statistics[0]
      }));

      // upsert logika umesto insertMany
      const ops = mappedPlayers.map(p => ({
        updateOne: {
          filter: {
            playerId: p.playerId,
            "league.id": p.league.id,
            "league.season": p.league.season
          },
          update: { $set: p },
          upsert: true
        }
      }));

      await Player.bulkWrite(ops);

      // ponovo povuci iz baze da dobiješ sve
      players = await Player.find({
        "team.id": teamNum,
        "league.season": seasonNum
      });
    }

    res.json({ success: true, count: players.length, teamId, season, players });
  } catch (err) {
    console.error("Greška u getPlayersByTeam:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}


export async function deletePlayersByTeam(req, res) {
  try {
    const { teamId, season } = req.params;
    const teamNum = Number(teamId);
    const seasonNum = Number(season);

    const result = await Player.deleteMany({
      "team.id": teamNum,
      "league.season": seasonNum
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      teamId: teamNum,
      season: seasonNum
    });
  } catch (err) {
    console.error("Greška u deletePlayersByTeam:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Brisanje svih igrača iz baze (svi timovi, sve sezone)
export async function deleteAllPlayers(req, res) {
  try {
    const result = await Player.deleteMany({}); // briše sve dokumente

    res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Greška u deleteAllPlayers:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}


export async function getLeaguePlayers(req, res) {
  try {
    const { leagueId, season } = req.params;
    const leagueNum = Number(leagueId);
    const seasonNum = Number(season);

    // 1. Povuci sve timove iz servisa
    const teams = await getTeamsByLeague(leagueNum, seasonNum);

    let allPlayers = [];

    // 2. Iteriraj kroz timove
    for (const team of teams) {
      let players = await Player.find({
        "team.id": team.id,
        "league.season": seasonNum
      });

      if (!players || players.length === 0) {
        console.log(`Povlačim iz API za tim ${team.name} (${team.id})...`);

        const apiPlayers = await playersByTeam(team.id, seasonNum);

        const mappedPlayers = apiPlayers.map(p => ({
          playerId: p.player.id,
          name: p.player.name,
          firstname: p.player.firstname,
          lastname: p.player.lastname,
          age: p.player.age,
          nationality: p.player.nationality,
          photo: p.player.photo,
          team: p.statistics[0].team,
          league: p.statistics[0].league,
          statistics: p.statistics[0]
        }));

        await Player.insertMany(mappedPlayers);
        players = mappedPlayers;
      }

      allPlayers.push(...players);
    }

    res.json({
      success: true,
      count: allPlayers.length,
      leagueId: leagueNum,
      season: seasonNum,
      players: allPlayers
    });
  } catch (err) {
    console.error("Greška u getLeaguePlayers:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}
