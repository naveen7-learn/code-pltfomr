import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import pullRequestRoutes from "./routes/pullRequestRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
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

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/projects/:projectId/pull-requests", pullRequestRoutes);
  app.use("/api/projects/:projectId/pull-requests/:pullRequestId/comments", commentRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
