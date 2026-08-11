import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { cribrProperties } from "../lib/supabase";
import { WhitelistedProject, mapToWhitelistedProject } from "../lib/projectDataMapper";

export interface UsePropertySearchResult {
  /** All projects fetched from Supabase (normalized). */
  projects: WhitelistedProject[];
  /** Projects after search query + category filter applied. */
  filteredProjects: WhitelistedProject[];
  /** True while the initial Supabase fetch is in-flight. */
  isLoading: boolean;
  /** True while an AI search is running. */
  isSearching: boolean;
  /** Non-null when the Supabase fetch failed. */
  error: string | null;
  /** Re-fetch projects from Supabase. */
  refresh: () => Promise<void>;
  /** The currently active category filter. */
  selectedCategory: string;
  /** Set the category filter. */
  setSelectedCategory: (cat: string) => void;
  /** True when showing suggestions instead of exact matches. */
  isSuggestionMode: boolean;
}

/**
 * Client-side heuristic search (fallback).
 * Handles complex multi-word queries like "3 bhk in bangalore under 1.5cr".
 */
function matchesSearchQuery(p: WhitelistedProject, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim();

  // Basic exact substring match (fast path)
  const basicMatch = [
    p.projectName, p.builder, p.locality, p.area, p.unitTypes, p.reraNumber, p.builderGrade
  ].filter(Boolean).some((val) => val.toLowerCase().includes(q));
  if (basicMatch) return true;

  // Complex multi-word heuristic fallback
  const bhkMatch = q.match(/(\d)\s*bhk/);
  const requestedBhk = bhkMatch ? bhkMatch[1] : null;

  const crMatch = q.match(/(\d+(?:\.\d+)?)\s*cr/);
  const requestedCr = crMatch ? parseFloat(crMatch[1]) : null;

  const lakhMatch = q.match(/(\d+(?:\.\d+)?)\s*lakh/);
  const requestedLakh = lakhMatch ? parseFloat(lakhMatch[1]) : null;

  const noiseWords = ['in', 'at', 'near', 'under', 'for', 'bhk', 'cr', 'lakhs', 'lakh', 'budget', 'best', 'top', 'good', 'projects', 'properties', 'with', 'the', 'a', 'an', 'and', 'or'];
  const terms = q.split(/\s+/).filter(t => !noiseWords.includes(t) && isNaN(Number(t)) && t.length > 1);

  let matches = true;

  if (requestedBhk && p.unitTypes) {
    if (!p.unitTypes.replace(/\s/g, '').toLowerCase().includes(`${requestedBhk}bhk`)) {
      matches = false;
    }
  }

  if (matches && (requestedCr || requestedLakh) && p.minPrice) {
    const minStr = p.minPrice.toLowerCase();
    const isCrore = minStr.includes('cr');
    const isLakh = minStr.includes('lakh');
    const val = parseFloat(minStr.replace(/[^0-9.]/g, ""));

    let dbPriceInCr = 999;
    if (isCrore && !isNaN(val)) dbPriceInCr = val;
    if (isLakh && !isNaN(val)) dbPriceInCr = val / 100;

    let targetPriceInCr = 0;
    if (requestedCr) targetPriceInCr = requestedCr;
    if (requestedLakh) targetPriceInCr = requestedLakh / 100;

    if (targetPriceInCr > 0 && dbPriceInCr > targetPriceInCr) {
      matches = false;
    }
  }

  if (matches && terms.length > 0) {
    const projectText = [p.projectName, p.builder, p.locality, p.area].filter(Boolean).join(" ").toLowerCase();
    // At least one keyword must match (relaxed: OR instead of AND)
    const anyTermMatches = terms.some(term => projectText.includes(term));
    if (!anyTermMatches) {
      matches = false;
    }
  }

  return matches;
}

/**
 * Category filter.
 */
function matchesCategory(p: WhitelistedProject, category: string): boolean {
  if (category === "All") return true;
  if (category === "Ready to Move") {
    return p.possessionDate === "Ready to Move" || p.possessionDate.toLowerCase().includes("ready") || p.possessionDate.includes("2024");
  }
  if (category === "Luxury") {
    const minStr = p.minPrice.toLowerCase();
    const isCrore = minStr.includes("cr");
    const val = parseFloat(minStr.replace(/[^0-9.]/g, ""));
    return isCrore && val >= 2.0;
  }
  if (category === "Affordable") {
    const minStr = p.minPrice.toLowerCase();
    const isLakh = minStr.includes("lakh");
    const isCrore = minStr.includes("cr");
    const val = parseFloat(minStr.replace(/[^0-9.]/g, ""));
    return isLakh || (isCrore && val <= 1.0);
  }
  if (category === "Investment") {
    return p.builderGrade.includes("A");
  }
  if (category === "Villa") {
    return p.unitTypes.toLowerCase().includes("villa");
  }
  if (category === "Apartments") {
    return !p.unitTypes.toLowerCase().includes("villa") && !p.unitTypes.toLowerCase().includes("plot");
  }
  return true;
}

/**
 * Determines if a query is "complex" enough to warrant an AI search.
 * Simple single-word queries like "Godrej" are handled client-side.
 */
function isComplexQuery(query: string): boolean {
  if (!query) return false;
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 1);
  // 2+ words, or contains budget/BHK indicators
  return words.length >= 2 || /\d\s*bhk/i.test(q) || /\d+(\.\d+)?\s*cr/i.test(q) || /\d+(\.\d+)?\s*lakh/i.test(q);
}

/**
 * Call the backend AI intent extraction + Supabase DB search.
 * Returns normalized WhitelistedProject[] or null if the call fails.
 */
async function aiSearchProjects(query: string): Promise<WhitelistedProject[] | null> {
  try {
    // Phase 1: Extract structured intent via Groq AI
    const intentRes = await fetch("/api/ai-search-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.trim() })
    });

    if (!intentRes.ok) return null;
    const intentData = await intentRes.json();
    const intent = intentData?.intent;
    if (!intent) return null;

    console.log("[AI Search] Extracted intent:", intent);

    // Phase 2: Query Supabase with structured intent
    const searchRes = await fetch("/api/search-projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent, originalQuery: query.trim() })
    });

    if (!searchRes.ok) return null;
    const rows = await searchRes.json();

    if (Array.isArray(rows) && rows.length > 0) {
      console.log("[AI Search] Backend returned", rows.length, "results");
      return rows.map((row: any) => mapToWhitelistedProject(row));
    }

    return [];
  } catch (err) {
    console.warn("[AI Search] Failed, falling back to client-side:", err);
    return null;
  }
}

/**
 * Single shared hook for property loading, search, and filtering.
 *
 * Architecture:
 *   1. Fetches ALL projects from Supabase on mount (for browsing + fallback).
 *   2. When a search query is entered:
 *      a. If complex → calls backend AI (Groq intent + Supabase DB query)
 *      b. Falls back to client-side heuristic filtering
 *   3. If zero results → enters "suggestion mode" showing all projects.
 *
 * Both PropertyExplorer (Desktop) and CribrMobileHome (Mobile) consume this hook.
 */
export function usePropertySearch(searchQuery?: string): UsePropertySearchResult {
  const [projects, setProjects] = useState<WhitelistedProject[]>([]);
  const [aiResults, setAiResults] = useState<WhitelistedProject[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const lastAiQuery = useRef<string>("");

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await cribrProperties.getProperties();
      if (fetched && fetched.length > 0) {
        setProjects(fetched as WhitelistedProject[]);
      } else {
        setProjects([]);
        setError("No projects found in the database.");
      }
    } catch (err: any) {
      console.error("[usePropertySearch] Failed to load projects:", err);
      setProjects([]);
      setError(err?.message || "Failed to load projects from database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch + listen for external property change events
  useEffect(() => {
    refresh();

    const handler = () => {
      refresh();
    };

    window.addEventListener("cribr_properties_changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cribr_properties_changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  // AI search effect: fire when searchQuery changes and is complex
  useEffect(() => {
    const q = searchQuery?.trim() || "";

    // Reset AI results if query is cleared
    if (!q) {
      setAiResults(null);
      lastAiQuery.current = "";
      return;
    }

    // Don't re-run for the same query
    if (q === lastAiQuery.current) return;

    // Only use AI for complex queries
    if (!isComplexQuery(q)) {
      setAiResults(null);
      lastAiQuery.current = q;
      return;
    }

    lastAiQuery.current = q;
    let cancelled = false;

    const runAiSearch = async () => {
      setIsSearching(true);
      const results = await aiSearchProjects(q);
      if (!cancelled) {
        setAiResults(results);
        setIsSearching(false);
      }
    };

    runAiSearch();

    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  // Derive filtered results
  const { filteredProjects, isSuggestionMode } = useMemo(() => {
    const q = searchQuery?.trim() || "";

    // If AI returned results, use them (apply category filter on top)
    if (aiResults !== null && aiResults.length > 0) {
      const categoryFiltered = aiResults.filter(p => matchesCategory(p, selectedCategory));
      if (categoryFiltered.length > 0) {
        return { filteredProjects: categoryFiltered, isSuggestionMode: false };
      }
      // AI had results but category filter killed them → show AI results without category
      return { filteredProjects: aiResults, isSuggestionMode: false };
    }

    // Client-side filtering (for simple queries or AI fallback)
    const clientFiltered = projects.filter((p) => {
      return matchesCategory(p, selectedCategory) && matchesSearchQuery(p, q);
    });

    if (clientFiltered.length > 0) {
      return { filteredProjects: clientFiltered, isSuggestionMode: false };
    }

    // Zero results → suggestion mode (show all projects)
    if (q && projects.length > 0) {
      return { filteredProjects: [], isSuggestionMode: true };
    }

    return { filteredProjects: projects, isSuggestionMode: false };
  }, [projects, aiResults, searchQuery, selectedCategory]);

  return {
    projects,
    filteredProjects,
    isLoading,
    isSearching,
    error,
    refresh,
    selectedCategory,
    setSelectedCategory,
    isSuggestionMode,
  };
}
