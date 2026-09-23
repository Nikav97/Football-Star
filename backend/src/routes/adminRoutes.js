import express from "express";
import { showUsers, deleteUser } from "../controllers/UserController.js";
import { getLeagues, deleteLeagueSeason, getLeagueStandings, addLeagueSeason,getLeagueTeams33 } from "../controllers/LegueController.js";

const router = express.Router();

// USERS
router.get("/users", showUsers);
router.delete("/users/:id", deleteUser);

// LEAGUES
router.post("/leagues", addLeagueSeason);               // dodavanje nove lige/sezone
router.get("/leagues", getLeagues);                     // listanje liga/sezona iz baze
router.get("/leagues/:leagueId/:season", getLeagueStandings); // standings za ligu/sezonu
router.delete("/leagues/:leagueId/:season", deleteLeagueSeason); // brisanje jedne sezone
router.get("/leagues/:leagueId/:season/teams", getLeagueTeams33);

export default router;
