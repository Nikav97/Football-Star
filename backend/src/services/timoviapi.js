import axios from "axios";
import Team from "../models/Team.js";

const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: { "x-apisports-key": process.env.API_KEY }
});

export async function getLeagueTeams(league, season) {
  const res = await api.get(`/teams?league=${league}&season=${season}`);

  if (!res.data.response || res.data.response.length === 0) {
    throw new Error("Nema timova za ovu ligu/sezonu");
  }

  // uzmi ime lige iz odgovora
  const leagueName = res.data.response[0]?.league?.name || `Liga ${league}`;

  const parsedTeams = res.data.response.map(t => ({
    id: t.team.id,
    name: t.team.name,
    logo: t.team.logo,
    founded: t.team.founded,
    country: t.team.country,
    venue: {
      name: t.venue.name,
      city: t.venue.city,
      capacity: t.venue.capacity
    },
    leagueId: league,
    season: season
  }));

  // Upis u Mongo (ako ne postoji → kreiraj)
  for (const team of parsedTeams) {
    const postoji = await Team.findOne({ id: team.id, season: team.season });
    if (!postoji) {
      await Team.create(team);
      console.log(`Ubacio: ${team.name}`);
    } else {
      console.log(`Preskočen (već postoji): ${team.name}`);
    }
  }

  return { leagueName, teams: parsedTeams };
}