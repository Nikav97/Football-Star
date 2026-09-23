import express from "express";
import { getLeaguePlayers } from "../controllers/ligaController.js";

const router = express.Router();

router.get("/league/:leagueId/:season/players", getLeaguePlayers);

export default router;
