import express from "express";
import { 
  getLeagueStandings, 
  getAvailableLeagues, 
  deleteAllTables 
} from "../controllers/tabelaController.js";

const router = express.Router();

// Vraća standings za ligu/sezonu
router.get("/league/standings", getLeagueStandings);

// Vraća listu dostupnih liga i sezona
router.get("/league/list", getAvailableLeagues);

// Briše sve tabele iz baze
router.delete("/league/all", deleteAllTables);

export default router;
