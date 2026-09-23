import express from "express";
import { savePlayersByLeague, getPlayersByLeague,getPlayersByTeam ,deletePlayersByTeam } from "../controllers/igraciController.js";
import { deleteAllPlayers } from "../controllers/igraciController.js";
const router = express.Router();

router.get("/league/:leagueId/:season/save-players", savePlayersByLeague);
router.get("/league/:leagueId/:season/players", getPlayersByLeague);
router.get("/team/:teamId/:season/players", getPlayersByTeam);
router.delete("/team/:teamId/:season/players", deletePlayersByTeam);
router.delete("/players/all", deleteAllPlayers);
export default router;
