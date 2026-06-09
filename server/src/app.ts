import cors from "cors";
import express from "express";
import { leadRoutes } from "./routes/leadRoutes";
import { metricsRoutes } from "./routes/metricsRoutes";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/leads", leadRoutes);
  app.use("/api/metrics", metricsRoutes);

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    res.status(400).json({ message });
  });

  return app;
}
