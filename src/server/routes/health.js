import { Router } from "express";
import { aiService } from "../services/AIService";
import { projectService } from "../services/ProjectService";
export var healthRouter = Router();
healthRouter.get("/health", function (_req, res) {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        services: {
            groq: aiService.isConfigured(),
            supabase: projectService.isConfigured(),
        },
    });
});
