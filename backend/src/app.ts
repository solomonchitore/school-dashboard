import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (_req, res) => {
  res.send("🚀 School Dashboard API is running!");
});

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

export default app;