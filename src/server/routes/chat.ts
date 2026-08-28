import { Router } from "express";
import { aiService } from "../services/AIService";
import { projectService } from "../services/ProjectService";
import { mapToWhitelistedProject } from "../../lib/projectDataMapper";

export const chatRouter = Router();

function sanitize(input: any): string {
  if (!input || typeof input !== "string") return "";
  return input.replace(/<[^>]*>/g, "").replace(/[\/\\#$%\^&*\[\]\{};:<>?|\\]/g, "").trim();
}

chatRouter.post("/cribr/chat", async (req, res) => {
  try {
    const rawMessage = req.body.message || "";
    const history = Array.isArray(req.body.history) ? req.body.history : [];
    const message = sanitize(rawMessage);

    if (!message) {
      return res.status(400).json({ error: "Message input cannot be empty." });
    }

    const aiAnswer = await aiService.generateChatAnswer(message, history || []);

    const allProjects = await projectService.getAllProjects();
    const aiAnswerLower = aiAnswer.toLowerCase();
    const rawMatches = allProjects.filter(p => {
      const name = (p.name || p.projectName || "").toLowerCase();
      // Only match if name is significant and actually in the text
      return name.length > 3 && aiAnswerLower.includes(name);
    });

    const recommendedProperties = rawMatches.slice(0, 3).map(mapToWhitelistedProject);

    return res.json({
      text: aiAnswer,
      recommendedProperties,
    });
  } catch (err: any) {
    console.error("[chatRouter] Error:", err?.message || err);
    res.status(500).json({ error: err?.message || "AI service error" });
  }
});
