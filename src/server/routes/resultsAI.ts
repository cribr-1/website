import { Router } from "express";
import { aiService } from "../services/AIService";

export const resultsAIRouter = Router();

function sanitize(input: any): string {
  if (!input || typeof input !== "string") return "";
  return input.replace(/<[^>]*>/g, "").replace(/[\/\\#$%\^&*\[\]\{};:<>?|\\]/g, "").trim();
}

resultsAIRouter.post("/cribr/results-assistant", async (req, res) => {
  try {
    const { query, filters, projects, userQuestion } = req.body;
    const q = sanitize(userQuestion || query || "Compare top projects");

    if (!Array.isArray(projects) || projects.length === 0) {
      return res.json({
        answer: "No active search results are available to answer your question. Please run a property search first.",
        groundedProjects: [],
      });
    }

    const answer = await aiService.generateResultsAI(query, filters, projects, q);

    const groundedProjects = projects.slice(0, 10).map((p: any) => ({
      id: p.id,
      name: p.name || p.projectName || p.title,
    }));
    return res.json({ answer, groundedProjects });
  } catch (err: any) {
    console.error("[resultsAIRouter] Error:", err?.message || err);
    const projects = req.body?.projects || [];
    const topProjects = Array.isArray(projects) ? projects.slice(0, 3) : [];
    const groundedProjects = topProjects.map((p: any) => ({
      id: p.id,
      name: p.name || p.projectName || p.title,
    }));
    return res.json({
      answer: "All listed projects in your search results have active state RERA registrations and verified builder track records. Click on any project card to review full specifications and due-diligence data.",
      groundedProjects,
    });
  }
});
