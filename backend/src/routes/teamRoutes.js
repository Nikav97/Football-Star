import express from "express";

import { fetchLeagueTeams, deleteAllTeams } from "../controllers/teamController.js"


const router = express.Router();
router.get("/league/teams", fetchLeagueTeams);

router.delete("/league/all", deleteAllTeams);

export default router;