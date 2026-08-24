import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// 🔒 Security & middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// ✅ Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Football Stats Hub API is running",
  });
});

export default app;
