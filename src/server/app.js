/**
 * CRIBR Server App
 * Single source of truth for the Express Application configuration.
 * Imported by both local development server (server.ts) and Vercel serverless function (api/[...path].ts).
 */
import express from "express";
import rateLimit from "express-rate-limit";
import { masterRouter } from "./routes";
var app = express();
app.use(express.json({ limit: "10mb" }));
app.set("trust proxy", 1);
// Configure CORS for cross-origin frontend requests
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, Accept");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
// Configure Rate Limiter for API protection
var apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    validate: false,
    message: { error: "Too many requests. Please try again after 15 minutes." },
});
// Apply rate limiter to API endpoints
app.use("/api/", apiLimiter);
// Mount master router at both root and /api for full path resilience
app.use(masterRouter);
app.use("/api", masterRouter);
export default app;
