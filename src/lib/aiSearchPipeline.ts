/**
 * AI-Assisted Property Discovery Pipeline Client Helper
 * Handles Phase 1 Intent Extraction, Phase 2 Result Set Assistant, and Phase 3 Project AI.
 */
import { supabase } from "./supabase";
import { getFeaturedProperties } from "../data";

export interface AISearchIntent {
  locality?: string | null;
  unitType?: string | null;
  maxPriceINR?: number | null;
  minPriceINR?: number | null;
  minBuilderGrade?: string | null;
  maxDistanceHubKm?: number | null;
  nearestOfficeHub?: string | null;
  possessionYear?: number | null;
  maxComplaints?: number | null;
  builderName?: string | null;
  keywords?: string[];
}

/**
 * Phase 1: Call Backend to Extract Structured Search Intent
 */
export async function extractSearchIntent(query: string): Promise<AISearchIntent> {
  if (!query || !query.trim()) {
    return {};
  }
  try {
    const res = await fetch("/api/ai-search-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.trim() })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.intent) {
        return data.intent;
      }
    }
  } catch (err) {
    console.warn("Server AI intent extraction unavailable, using client intent fallback:", err);
  }

  // Fallback client intent extraction
  const qLower = query.toLowerCase();
  const intent: AISearchIntent = {};

  if (qLower.includes("sarjapur")) intent.locality = "Sarjapur Road";
  else if (qLower.includes("varthur")) intent.locality = "Varthur";
  else if (qLower.includes("whitefield")) intent.locality = "Whitefield";

  if (qLower.includes("1bhk") || qLower.includes("1 bhk")) intent.unitType = "1BHK";
  else if (qLower.includes("2bhk") || qLower.includes("2 bhk")) intent.unitType = "2BHK";
  else if (qLower.includes("3bhk") || qLower.includes("3 bhk")) intent.unitType = "3BHK";
  else if (qLower.includes("4bhk") || qLower.includes("4 bhk")) intent.unitType = "4BHK";

  const crMatch = qLower.match(/(?:under|below|less than|<)?\s*₹?\s*(\d+(?:\.\d+)?)\s*cr/);
  if (crMatch) {
    intent.maxPriceINR = parseFloat(crMatch[1]) * 10000000;
  }

  return intent;
}

/**
 * Phase 1: Convert Extracted Intent to Supabase Query (Grounding ONLY in DB)
 */
export async function searchSupabaseWithIntent(intent: AISearchIntent, originalQuery: string = ""): Promise<any[]> {
  console.log("[SEARCH PIPELINE] ==========================================");
  console.log("[SEARCH PIPELINE] Raw user query:", originalQuery);
  console.log("[SEARCH PIPELINE] Extracted AI intent:", JSON.stringify(intent, null, 2));

  try {
    const res = await fetch("/api/search-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent, originalQuery })
    });
    if (res.ok) {
      const data = await res.json();
      console.log("[SEARCH PIPELINE] Backend search returned", data?.length ?? 0, "rows");
      return data || [];
    } else {
      console.error("[SEARCH PIPELINE] Backend search failed:", res.status);
    }
  } catch (err) {
    console.error("[SEARCH PIPELINE] Backend search exception:", err);
  }
  
  return [];
}


export async function queryResultsAssistant(
  query: string,
  filters: any,
  projects: any[],
  userQuestion: string
): Promise<{ answer: string; groundedProjects: any[] }> {
  return queryResultSetAI(query, filters, projects, userQuestion);
}
export async function queryResultSetAI(
  query: string,
  filters: any,
  projects: any[],
  userQuestion: string
): Promise<{ answer: string; groundedProjects: any[] }> {
  try {
    const res = await fetch("/api/cribr/results-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, filters, projects, userQuestion })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return data;
      }
    } else {
      const rawText = await res.text().catch(() => "Could not read response text");
      console.error("Results assistant API failed:", res.status, rawText);
      try {
        const errorData = JSON.parse(rawText);
        if (errorData?.error) {
          return { answer: `[BACKEND ERROR]: ${errorData.error} - ${errorData.details || ''}`, groundedProjects: [] };
        }
      } catch (e) {
        // Not JSON
        return { answer: `[HTTP ${res.status} ERROR]: ${rawText.substring(0, 500)}`, groundedProjects: [] };
      }
    }
  } catch (err: any) {
    console.warn("Results assistant API error:", err);
    return { answer: `[NETWORK ERROR]: ${err.message}`, groundedProjects: [] };
  }

  return {
    answer: "Unable to connect to result set assistant. The AI service is currently unavailable. Please try again later.",
    groundedProjects: []
  };
}

/**
 * Phase 3: Call Per-Project Deep Intelligence AI Assistant
 */
export async function queryProjectAI(
  project: any,
  userQuestion: string
): Promise<{ answer: string; project: any }> {
  try {
    const res = await fetch("/api/cribr/project-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project, userQuestion })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return data;
      }
    } else {
      const rawText = await res.text().catch(() => "Could not read response text");
      console.error("Project AI assistant API failed:", res.status, rawText);
      try {
        const errorData = JSON.parse(rawText);
        if (errorData?.error) {
          return { answer: `[BACKEND ERROR]: ${errorData.error} - ${errorData.details || ''}`, project: { id: project?.id, name: project?.name || project?.projectName } };
        }
      } catch (e) {
        // Not JSON
        return { answer: `[HTTP ${res.status} ERROR]: ${rawText.substring(0, 500)}`, project: { id: project?.id, name: project?.name || project?.projectName } };
      }
    }
  } catch (err: any) {
    console.warn("Project AI assistant API error:", err);
    return { answer: `[NETWORK ERROR]: ${err.message}`, project: { id: project?.id, name: project?.name || project?.projectName } };
  }

  return {
    answer: "Unable to generate project intelligence. Our AI systems might be experiencing high traffic or the backend is unreachable. Please try again later.",
    project: { id: project?.id, name: project?.name || project?.projectName }
  };
}
