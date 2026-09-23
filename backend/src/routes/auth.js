import express from "express";
import {getMe} from "../controllers/authController.js"
import {
  register,
  login,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);

export default router;