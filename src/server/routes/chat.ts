import { Router } from "express";
import { aiService } from "../services/AIService";

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

    return res.json({
      text: aiAnswer,
      recommendedProperties: [],
    });
  } catch (err: any) {
    console.error("[chatRouter] Error:", err?.message || err);
    res.status(500).json({ error: err?.message || "AI service error" });
  }
});
