// import Player from "../models/Player.js";
// import { tableforseason, playersByTeam } from "./footbalAPi.js";

// // Povlačenje svih igrača za celu ligu u sezoni
// export async function playersByLeague(leagueId, season) {
//   // 1. Povuci standings → lista timova
//   const { leagueName, standings } = await tableforseason(leagueId, season);

//   let allPlayers = [];

//   // 2. Iteriraj kroz timove iz standings
//   for (const teamRow of standings) {
//     const teamId = teamRow.team.id;
//     const teamName = teamRow.team.name;

//     // prvo probaj iz baze
//     let players = await Player.find({
//       "team.id": teamId,
//       "league.season": season
//     });

//     if (!players || players.length === 0) {
//       console.log(`Povlačim iz API za tim ${teamName} (${teamId})...`);

//       const apiPlayers = await playersByTeam(teamId, season);

//       const mappedPlayers = apiPlayers.map(p => ({
//         playerId: p.player.id,
//         name: p.player.name,
//         firstname: p.player.firstname,
//         lastname: p.player.lastname,
//         age: p.player.age,
//         nationality: p.player.nationality,
//         photo: p.player.photo,
//         team: p.statistics[0].team,
//         league: p.statistics[0].league,
//         statistics: p.statistics[0]
//       }));

//       await Player.insertMany(mappedPlayers);
//       players = mappedPlayers;
//     }

//     allPlayers.push(...players);
//   }

//   return { leagueName, players: allPlayers };
// }

import Player from "../models/Player.js";
import LeagueTable from "../models/Tabela.js";
import { playersByTeam } from "./igraciAPI.js";

// Povlačenje svih igrača za celu ligu u sezoni iz baze standings
export async function playersByLeague(leagueId, season) {
  const table = await LeagueTable.findOne({ leagueId, season });
  if (!table) {
    throw new Error("Nema standings u bazi za ovu ligu/sezonu");
  }

  const { leagueName, standings } = table;
  let allPlayers = [];

  for (const teamRow of standings) {
    const teamId = teamRow.team.id;
    const teamName = teamRow.team.name;

    // prvo probaj iz baze
    let players = await Player.find({
      "team.id": teamId,
      "league.season": season
    });

    if (!players || players.length === 0) {
      console.log(`Povlačim iz API za tim ${teamName} (${teamId})...`);

      const apiPlayers = await playersByTeam(teamId, season);

      const ops = apiPlayers.map(p => ({
        updateOne: {
          filter: {
            playerId: p.player.id,
            "league.id": p.statistics[0].league.id,
            "league.season": p.statistics[0].league.season
          },
          update: {
            $set: {
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
            }
          },
          upsert: true
        }
      }));

      const result = await Player.bulkWrite(ops);
      console.log(`Upisano/azurirano: ${result.nUpserted + result.nModified}`);
      players = apiPlayers;
    }

    allPlayers.push(...players);
  }

  return { leagueName, players: allPlayers };
}
