import axios from "axios";

const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: { "x-apisports-key": process.env.API_KEY },
});

export async function tableforseason(leagueid, season) {
  const res = await api.get(`/standings?league=${leagueid}&season=${season}`);

  if (!res.data.response || res.data.response.length === 0) {
    throw new Error("Nema podataka za ovu ligu/sezonu");
  }

  const leagueData = res.data.response[0].league;
  if (!leagueData || !leagueData.standings) {
    throw new Error("API nije vratio standings");
  }

  // flattenujemo prvi podniz → niz timova
  return leagueData.standings[0];
}
