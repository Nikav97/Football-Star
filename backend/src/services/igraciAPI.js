import axios from "axios";

const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: { "x-apisports-key": process.env.API_KEY },
});

// Helper za pauzu (da izbegneš 429)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Rekurzivna funkcija za skupljanje svih igrača iz lige/sezone
export async function playersData(leagueId, season, page = 1, players = []) {
  try {
    const res = await api.get("/players", {
      params: { league: leagueId, season, page }
    });

    const data = res.data;

    // Dodaj trenutnu stranicu u listu
    players = [...players, ...data.response];

    // Ako ima još stranica
    if (data.paging.current < data.paging.total) {
      const nextPage = data.paging.current + 1;

      // Pauza na svakoj stranici (sigurnije na free planu)
      await sleep(1000);

      // Rekurzivno pozovi sledeću stranicu
      return playersData(leagueId, season, nextPage, players);
    }

    // Kada dođemo do kraja, vrati sve igrače
    return players;
  } catch (err) {
    console.error("Greška u playersData:", err.message);
    throw err;
  }

}




// povlačenje svih igrača jednog tima u sezoni sa paginacijom
export async function playersByTeam(teamId, season, page = 1, players = []) {
  try {
    const res = await api.get("/players", {
      params: { team: teamId, season, page }
    });

    const data = res.data;

    // dodaj trenutnu stranicu u listu
    players = [...players, ...data.response];

    // ako ima još stranica
    if (data.paging.current < data.paging.total) {
      const nextPage = data.paging.current + 1;
      await sleep(1000); // mala pauza da izbegneš rate limit
      return playersByTeam(teamId, season, nextPage, players);
    }

    // kada dođemo do kraja, vrati sve igrače
    return players;
  } catch (err) {
    console.error("Greška u playersByTeam:", err.message);
    throw err;
  }
}
