import { Router } from "express";
import { ProjectService } from "../services/ProjectService";
import { aiService } from "../services/AIService";
import { mapToWhitelistedProject } from "../../lib/projectDataMapper";

export const compareAIRouter = Router();
const projectService = new ProjectService();

/** Race the AI call against a timeout — always returns a result (AI or fallback). */
async function compareWithTimeout(projects: any[], timeoutMs = 18000): Promise<any> {
  let result: any = null;
  let isAI = false;

  try {
    const aiPromise = aiService.compareProjectsWithAI(projects);
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("AI comparison timed out")), timeoutMs)
    );

    result = await Promise.race([aiPromise, timeoutPromise]);
    if (result && (result.overallRecommendation || result.projects)) {
      isAI = result.isAIGenerated !== false && result.source !== "deterministic";
    }
  } catch (err: any) {
    console.warn("[CompareAPI] AI call failed/timed-out, using deterministic fallback:", err?.message);
    result = null;
  }

  // If AI call failed or timed out, use deterministic fallback
  if (!result) {
    result = aiService.generateGroundedComparisonFallback(projects);
    isAI = false;
  }

  // Ensure exact correspondence between returned projects and analysis.projects
  if (Array.isArray(result.projects)) {
    result.projects = projects.map((p, idx) => {
      const existing = result.projects.find((ap: any) =>
        ap.projectId === p.id ||
        (p.slug && ap.projectId === p.slug) ||
        (p.name && ap.projectId && p.name.toLowerCase() === String(ap.projectId).toLowerCase()) ||
        (p.project_name && ap.projectId && p.project_name.toLowerCase() === String(ap.projectId).toLowerCase())
      ) || result.projects[idx] || {};

      return {
        ...existing,
        projectId: p.id,
      };
    });
  }

  return {
    ...result,
    source: isAI ? "ai" : "deterministic",
    isAIGenerated: isAI,
  };
}

compareAIRouter.post("/compare", async (req, res) => {
  try {
    const { projectIds } = req.body;

    if (!Array.isArray(projectIds) || projectIds.length < 2 || projectIds.length > 4) {
      return res.status(400).json({ error: "Please provide between 2 and 4 valid project IDs." });
    }

    // De-duplicate just in case
    const uniqueIds = Array.from(new Set(projectIds));
    if (uniqueIds.length < 2) {
      return res.status(400).json({ error: "Please provide at least 2 distinct projects." });
    }

    // Resolve projects strictly
    const projects = [];
    for (const id of uniqueIds) {
      const proj = await projectService.getProjectByIdOrName(id);
      if (!proj) {
        return res.status(404).json({ error: `Project not found for ID: ${id}` });
      }
      projects.push(proj);
    }

    // Call AI with timeout — guaranteed to return a comparison (AI or deterministic)
    const analysis = await compareWithTimeout(projects);

    // Return the objective facts + AI analysis combined
    const mappedProjects = projects.map(p => mapToWhitelistedProject(p));

    return res.json({
      success: true,
      projects: mappedProjects,
      analysis,
    });
  } catch (error: any) {
    console.error("[CompareAPI] Error:", error);
    return res.status(500).json({ error: "Internal server error during comparison." });
  }
});
