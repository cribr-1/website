/**
 * AIService - Single source of truth for Groq SDK inference & anti-hallucination context formatting.
 */
import Groq from "groq-sdk";
import { SERVER_CONFIG } from "../config";

export const MASTER_SYSTEM_PROMPT = `You are CRIBR AI Property Advisor.

You ONLY answer using the verified project context supplied below.

Rules:
- Never invent information.
- Never use outside knowledge.
- Never ask the user for information already present in the context.
- If information is missing from the context, explicitly say: "This information is not available in the verified project data."
- Write naturally like an experienced property consultant.
- Explain your reasoning in plain language.
- Distinguish facts from recommendations.`;

export function cleanGroqContent(content: string): string {
  if (!content) return "";
  return content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export function projectToMarkdown(p: any): string {
  if (!p) return "No project data available.";

  let md = `## ${p.name || p.projectName || "Unknown Project"}\n\n`;
  if (p.builder_name || p.builder || p.developer) {
    md += `**Builder:** ${p.builder_name || p.builder || p.developer}${p.builder_grade || p.builderGrade ? " (Grade: " + (p.builder_grade || p.builderGrade) + ")" : ""}\n`;
  }
  if (p.rera_project_name) md += `**RERA Project Name:** ${p.rera_project_name}\n`;
  if (p.rera_number || p.reraNumber) md += `**RERA Number:** ${p.rera_number || p.reraNumber}\n`;
  if (p.locality || p.location) md += `**Location:** ${p.locality || p.location}${p.city ? ", " + p.city : ""}\n`;

  if (p.min_price || p.max_price || p.price || p.price_per_sqft || p.unit_types || p.configurations) {
    md += `\n### Pricing & Configuration\n`;
    if (p.min_price || p.price) md += `- **Minimum Price:** ₹${p.min_price || p.price}\n`;
    if (p.max_price) md += `- **Maximum Price:** ₹${p.max_price}\n`;
    if (p.price_per_sqft || p.pricePerSqft) md += `- **Price Per SqFt:** ₹${p.price_per_sqft || p.pricePerSqft}\n`;
    if (p.unit_types || p.configurations) md += `- **Configurations:** ${Array.isArray(p.unit_types) ? p.unit_types.join(", ") : (p.unit_types || p.configurations)}\n`;
  }

  if (p.total_units || p.totalUnits || p.land_area_sqm || p.land_area_acres) {
    md += `\n### Project Metrics\n`;
    if (p.total_units || p.totalUnits) md += `- **Total Units:** ${p.total_units || p.totalUnits}\n`;
    if (p.land_area_sqm) md += `- **Land Area:** ${p.land_area_sqm} Sqm\n`;
    if (p.land_area_acres) md += `- **Land Area (Acres):** ${p.land_area_acres} Acres\n`;
    const density = p.unit_density_per_acre ? `${p.unit_density_per_acre} units/acre` : "N/A";
    md += `- **Density:** ${density}\n`;
  }

  if (p.project_start_date || p.possession_date || p.possession || p.construction_progress !== undefined || p.progress !== undefined) {
    md += `\n### Status & Timeline\n`;
    if (p.project_start_date) md += `- **Start Date:** ${p.project_start_date}\n`;
    if (p.possession_date || p.possession) md += `- **Possession Date:** ${p.possession_date || p.possession}\n`;
    const progress = p.construction_progress ?? p.progress;
    if (progress !== undefined) md += `- **Construction Progress:** ${progress}%\n`;
  }

  md += `\n### Risk & Compliance (Verified)\n`;
  md += `- **RERA Complaints:** ${p.complaints_count ?? p.complaintsCount ?? 0}\n`;
  md += `- **Land Litigation:** ${p.land_litigation ? "Yes" : "No"}\n`;

  if (p.nearest_office_hub || p.nearestHub || p.cribr_score || p.overallScore || p.google_rating || p.rating) {
    md += `\n### Commute & Ratings\n`;
    if (p.nearest_office_hub || p.nearestHub) md += `- **Nearest Tech Hub:** ${p.nearest_office_hub || p.nearestHub}\n`;
    if (p.distance_to_hub_km || p.commuteDistance) md += `- **Distance to Hub:** ${p.distance_to_hub_km || p.commuteDistance} km\n`;
    if (p.cribr_score || p.overallScore) md += `- **CRIBR Score:** ${p.cribr_score || p.overallScore}/100\n`;
    if (p.google_rating || p.rating) md += `- **Google Rating:** ${p.google_rating || p.rating} Stars\n`;
  }

  if (p.google_review_summary) {
    const summary = p.google_review_summary.length > 300 ? p.google_review_summary.substring(0, 300) + "..." : p.google_review_summary;
    md += `\n**Review Summary:** ${summary}\n`;
  }

  return md;
}

export function datasetToMarkdown(dataset: any[]): string {
  if (!dataset || dataset.length === 0) return "No projects found.";
  return dataset
    .map((p, i) => `\n# PROJECT ${i + 1}\n${projectToMarkdown(p)}\n\n---\n`)
    .join("");
}

export class AIService {
  private groq: Groq | null = null;

  constructor() {
    const apiKey = SERVER_CONFIG.GROQ.API_KEY;
    if (apiKey && apiKey.trim()) {
      try {
        this.groq = new Groq({ apiKey: apiKey.trim() });
      } catch (err) {
        console.error("[AIService] Failed to initialize Groq client:", err);
      }
    }
  }

  public isConfigured(): boolean {
    return !!this.groq;
  }

  private async callGroqModels(systemPrompt: string, userMessage: string, temperature = 0.25): Promise<string | null> {
    if (!this.groq) return null;

    const models = [SERVER_CONFIG.GROQ.PRIMARY_MODEL, ...SERVER_CONFIG.GROQ.FALLBACK_MODELS];

    let lastError = "Unknown error";
    for (const model of models) {
      try {
        const completion = await this.groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature,
        });

        const raw = completion.choices[0]?.message?.content || "";
        const cleaned = cleanGroqContent(raw);
        if (cleaned) return cleaned;
      } catch (err: any) {
        lastError = err?.message || err;
        console.warn(`[AIService] Groq model ${model} failed:`, lastError);
      }
    }

    throw new Error(`All Groq models failed. Last error: ${lastError}`);
  }

  /**
   * Conversational Chat Answer
   */
  async generateChatAnswer(userMessage: string, history: any[] = []): Promise<string> {
    const systemPrompt = `${MASTER_SYSTEM_PROMPT}

You are a senior real estate intelligence advisor helping a homebuyer evaluating residential projects in India.
Answer the user's questions clearly, accurately, and professionally.
Maintain conversation context when historical messages are provided.`;

    let userPrompt = `USER MESSAGE: "${userMessage}"`;
    if (history && history.length > 0) {
      const historyStr = history
        .map((h: any) => `${h.sender || h.role}: ${h.text || h.content}`)
        .join("\n");
      userPrompt = `CONVERSATION HISTORY:\n${historyStr}\n\nLATEST USER MESSAGE: "${userMessage}"`;
    }

    return this.callGroqModels(systemPrompt, userPrompt, 0.3);
  }

  /**
   * Single Project AI Intelligence
   */
  async generateProjectAI(projectContext: any, userQuestion: string): Promise<string> {
    const systemPrompt = `${MASTER_SYSTEM_PROMPT}\n\nVERIFIED PROJECT FACTSHEET:\n${projectToMarkdown(projectContext)}`;
    const userMessage = `USER QUESTION: "${userQuestion}"`;
    return this.callGroqModels(systemPrompt, userMessage, 0.25);
  }

  /**
   * Result-Set Grounded AI Intelligence
   */
  async generateResultsAI(query: string, filters: any, projects: any[], userQuestion: string): Promise<string> {
    const dataset = projects.slice(0, 5);
    const systemPrompt = `${MASTER_SYSTEM_PROMPT}\n\nACTIVE SEARCH RESULT DATASET (${dataset.length} Projects):\n${datasetToMarkdown(dataset)}`;
    const userMessage = `USER QUESTION: "${userQuestion}"\nORIGINAL SEARCH QUERY: "${query}"\nFILTERS: ${JSON.stringify(filters || {})}`;
    return this.callGroqModels(systemPrompt, userMessage, 0.25);
  }

  /**
   * Search Intent Extraction (JSON Mode)
   */
  async extractSearchIntent(query: string): Promise<any | null> {
    if (!this.groq) return null;

    const systemPrompt = `You are CRIBR's real estate search intent parser. Return JSON ONLY with this schema: {"locality":string|null,"unitType":string|null,"maxPriceINR":number|null,"minPriceINR":number|null,"minBuilderGrade":string|null,"maxDistanceHubKm":number|null,"nearestOfficeHub":string|null,"possessionYear":number|null,"maxComplaints":number|null,"builderName":string|null,"keywords":string[]}`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: SERVER_CONFIG.GROQ.INTENT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User query: "${query}"` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const raw = completion.choices[0]?.message?.content || "";
      const cleaned = cleanGroqContent(raw);
      if (cleaned) {
        return JSON.parse(cleaned);
      }
    } catch (err: any) {
      console.warn("[AIService] Intent extraction failed:", err?.message || err);
    }

    return null;
  }

  /**
   * Simple AI Search Summary
   */
  async generateGenericAISearch(query: string): Promise<string | null> {
    const systemPrompt = "You are CRIBR AI Property Advisor. Answer only real estate questions concisely.";
    return this.callGroqModels(systemPrompt, query, 0.25);
  }
}

export const aiService = new AIService();
