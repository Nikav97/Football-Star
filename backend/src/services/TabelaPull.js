// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://v3.football.api-sports.io",
//   headers: { "x-apisports-key": process.env.API_KEY },
// });

// // helper za pauzu (da izbegneš rate limit)
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // standings za celu ligu u sezoni
// export async function tableforseason(leagueId, season) {
//   const res = await api.get(`/standings?league=${leagueId}&season=${season}`);

//   if (!res.data.response || res.data.response.length === 0) {
//     throw new Error("Nema podataka za ovu ligu/sezonu");
//   }

//   const leagueData = res.data.response[0].league;
//   if (!leagueData || !leagueData.standings) {
//     throw new Error("API nije vratio standings");
//   }

//   return { leagueName: leagueData.name, standings: leagueData.standings[0] };
// }

// // povlačenje svih igrača jednog tima u sezoni sa paginacijom
// export async function playersByTeam(teamId, season, page = 1, players = []) {
//   const res = await api.get("/players", {
//     params: { team: teamId, season, page }
//   });

//   const data = res.data;
//   players = [...players, ...data.response];

//   if (data.paging.current < data.paging.total) {
//     const nextPage = data.paging.current + 1;
//     await sleep(1000);
//     return playersByTeam(teamId, season, nextPage, players);
//   }

//   return players;
// }
import axios from "axios";

const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: { "x-apisports-key": process.env.API_KEY },
});

// helper za pauzu (da izbegneš rate limit)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// standings za celu ligu u sezoni + ime lige
export async function tableforseason(leagueId, season) {
  // prvo povuci standings
  const res = await api.get(`/standings?league=${leagueId}&season=${season}`);

  if (!res.data.response || res.data.response.length === 0) {
    throw new Error("Nema podataka za ovu ligu/sezonu");
  }

  const leagueData = res.data.response[0].league;
  if (!leagueData || !leagueData.standings) {
    throw new Error("API nije vratio standings");
  }

  const standings = leagueData.standings[0];

  // zatim povuci ime lige iz /leagues endpointa
  const leagueRes = await api.get(`/leagues?id=${leagueId}`);
  const leagueName = leagueRes.data.response[0]?.league?.name || `League ${leagueId}`;

  return { leagueName, standings };
}

// povlačenje svih igrača jednog tima u sezoni sa paginacijom
export async function playersByTeam(teamId, season, page = 1, players = []) {
  const res = await api.get("/players", {
    params: { team: teamId, season, page }
  });

  const data = res.data;
  players = [...players, ...data.response];

  if (data.paging.current < data.paging.total) {
    const nextPage = data.paging.current + 1;
    await sleep(1000);
    return playersByTeam(teamId, season, nextPage, players);
  }

  return players;
}
