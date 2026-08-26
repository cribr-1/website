import { Router } from "express";
import { ProjectService } from "../services/ProjectService";
import { aiService } from "../services/AIService";
import { mapToWhitelistedProject } from "../../lib/projectDataMapper";

export const compareAIRouter = Router();
const projectService = new ProjectService();

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

    // Call AI
    const analysis = await aiService.compareProjectsWithAI(projects);
    
    if (!analysis) {
      return res.status(500).json({ error: "AI comparison failed to generate." });
    }

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
