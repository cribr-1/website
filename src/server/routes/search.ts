import { Router } from "express";
import { aiService } from "../services/AIService";

export const searchRouter = Router();

function sanitize(input: any): string {
  if (!input || typeof input !== "string") return "";
  return input.replace(/<[^>]*>/g, "").replace(/[\/\\#$%\^&*\[\]\{};:<>?|\\]/g, "").trim();
}

searchRouter.post("/ai-search-intent", async (req, res) => {
  try {
    const rawQuery = sanitize(req.body.query || "");
    if (!rawQuery) {
      return res.status(400).json({ error: "Query must not be empty" });
    }

    const intent = await aiService.extractSearchIntent(rawQuery);

    if (intent) {
      return res.json({ success: true, intent, source: "groq" });
    }

    // Heuristic fallback if Groq parsing is unavailable
    const q = rawQuery.toLowerCase();
    const fallbackIntent: any = {
      locality: null,
      unitType: null,
      maxPriceINR: null,
      minPriceINR: null,
      minBuilderGrade: null,
      maxDistanceHubKm: null,
      nearestOfficeHub: null,
      possessionYear: null,
      maxComplaints: null,
      builderName: null,
      keywords: [],
    };

    if (q.includes("sarjapur")) fallbackIntent.locality = "Sarjapur Road";
    else if (q.includes("whitefield")) fallbackIntent.locality = "Whitefield";

    if (q.includes("2bhk") || q.includes("2 bhk")) fallbackIntent.unitType = "2BHK";
    else if (q.includes("3bhk") || q.includes("3 bhk")) fallbackIntent.unitType = "3BHK";

    if (q.includes("godrej")) fallbackIntent.builderName = "Godrej";
    else if (q.includes("prestige")) fallbackIntent.builderName = "Prestige";

    return res.json({ success: true, intent: fallbackIntent, source: "local_heuristic" });
  } catch (err: any) {
    console.error("[searchRouter] Intent error:", err?.message || err);
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
});

searchRouter.post("/ai-search", async (req, res) => {
  try {
    const q = sanitize(req.body.query || "");
    if (!q) {
      return res.status(400).json({ error: "Query must not be empty" });
    }

    const answer = await aiService.generateGenericAISearch(q);
    if (answer) {
      return res.json({ type: "ranking", summary: answer, query: q });
    }

    res.json({ status: "fallback_client" });
  } catch (err: any) {
    console.error("[searchRouter] AI search error:", err?.message || err);
    res.status(500).json({ error: err?.message || "Internal server error" });
  }
});

searchRouter.post("/search-projects", async (req, res) => {
  try {
    const { intent, originalQuery } = req.body;
    const { projectService } = await import("../services/ProjectService");
    const results = await projectService.searchProjects(intent, originalQuery);
    return res.json(results);
  } catch (err: any) {
    console.error("[searchRouter] Search projects error:", err?.message || err);
    res.status(500).json({ error: "Server error" });
  }
});
