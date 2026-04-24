import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import axios from "axios"; 
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import pullRequestRoutes from "./routes/pullRequestRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(helmet());

  if (isProduction) {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 300,
        standardHeaders: "draft-7"
      })
    );
  }

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/api/health", (req, res) => {
    res.json({ ok: true });
  });

  // 🆕 NEW JUDGE0 COMPILER ROUTE (No Whitelist Required)
  app.post("/api/compile", async (req, res) => {
    const { code } = req.body;
    
    try {
      // Judge0 expects Base64 for safety
      const base64Code = Buffer.from(code).toString('base64');

      const response = await axios.post("https://judge0-ce.p.sulu.sh/submissions?wait=true", {
        source_code: base64Code,
        language_id: 54, // C++ (GCC 9.2.0)
        stdin: "",
      }, { timeout: 15000 });

      // Judge0 returns results in different fields based on success/fail
      const output = response.data.stdout || response.data.compile_output || response.data.stderr || "No output";
      
      res.json({ run: { output: Buffer.from(output, 'base64').toString('utf-8') } });

    } catch (error) {
      console.error("Compiler Error:", error.message);
      res.status(500).json({ error: "The compiler is currently busy. Try again in a second." });
    }
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/projects/:projectId/pull-requests", pullRequestRoutes);
  app.use("/api/projects/:projectId/pull-requests/:pullRequestId/comments", commentRoutes);
  app.use("/api/user", userRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};