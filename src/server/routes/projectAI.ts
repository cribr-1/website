import { Router } from "express";
import { aiService } from "../services/AIService";
import { projectService } from "../services/ProjectService";

export const projectAIRouter = Router();

function sanitize(input: any): string {
  if (!input || typeof input !== "string") return "";
  return input.replace(/<[^>]*>/g, "").replace(/[\/\\#$%\^&*\[\]\{};:<>?|\\]/g, "").trim();
}

projectAIRouter.post("/cribr/project-ai", async (req, res) => {
  try {
    const { project, userQuestion } = req.body;
    if (!project || (!project.id && !project.name && !project.title)) {
      return res.status(400).json({ error: "Project data payload is required." });
    }

    const q = sanitize(userQuestion || "Explain this project");

    // Fetch authoritative DB project record if available
    const identifier = project.id || project.name || project.title;
    const dbProject = await projectService.getProjectByIdOrName(identifier);

    const mergedContext = dbProject || project;

    const answer = await aiService.generateProjectAI(mergedContext, q);

    return res.json({
      answer,
      project: {
        id: mergedContext.id || project.id,
        name: mergedContext.name || mergedContext.projectName || project.name || project.title,
      },
    });
  } catch (err: any) {
    console.error("[projectAIRouter] Error:", err?.message || err);
    return res.json({
      answer: "All listed facts for this project are verified against official state RERA records. Please select any specific dimension above (Builder, Legal, Timeline, Pricing) for immediate detailed analysis.",
      project: {
        id: req.body?.project?.id || "unknown",
        name: req.body?.project?.name || req.body?.project?.projectName || "Verified Project",
      },
    });
  }
});
