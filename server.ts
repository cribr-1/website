/**
 * CRIBR Local Development Server Entrypoint
 * Imports the single, unified Express application from src/server/app.ts
 * and attaches Vite middleware for local hot-reloading development.
 */
import path from "path";
import express from "express";
import { createServer as createViteServer } from "vite";
import app from "./src/server/app";
import { SERVER_CONFIG } from "./src/server/config";

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler Middleware
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[CRIBR Server Error]:", err);
    res.status(err.status || 500).json({
      error: err?.message || "An unexpected internal server error occurred.",
      timestamp: new Date().toISOString(),
    });
  });

  if (!process.env.VERCEL) {
    app.listen(Number(SERVER_CONFIG.PORT), "0.0.0.0", () => {
      console.log(`[CRIBR Platform] Development Server listening on http://localhost:${SERVER_CONFIG.PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
