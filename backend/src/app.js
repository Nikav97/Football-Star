import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import tableRouter from "./routes/tabelaruta.js";
import playersRoutes from "./routes/igraciRuta.js";
import leagueRoutes from "./routes/ligaRoutes.js";
import dotenv from "dotenv";
import resetruta from "./routes/resetRoutes.js";
dotenv.config();
const app = express();

// Security & middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Football Stats Hub API is running",
  });
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Internal routes
app.use("/api/external", teamRoutes);
// mountuj rute pod /api/auth
app.use("/api/password", resetruta);
// External routes
app.use("/api/external/table", tableRouter);

// 👇 ovde mountuješ samo prefix
app.use("/api", leagueRoutes);
app.use("/api", playersRoutes);
app.use("/api/admin", adminRoutes);   // 👈 ovo dodaj
export default app;
