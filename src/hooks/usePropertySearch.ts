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
  const rawQ = query.toLowerCase().trim();

  // 1. Direct match
  const searchTarget = `${p.projectName} ${p.builder} ${p.locality} ${p.area} ${p.unitTypes} ${p.reraNumber}`.toLowerCase();
  if (searchTarget.includes(rawQ)) return true;

  // 2. Check if raw query contains locality or project/builder names
  if (
    (p.locality && p.locality.length > 3 && rawQ.includes(p.locality.toLowerCase())) ||
    (p.area && p.area.length > 3 && rawQ.includes(p.area.toLowerCase())) ||
    (p.projectName && rawQ.includes(p.projectName.toLowerCase())) ||
    (p.builder && rawQ.includes(p.builder.toLowerCase()))
  ) {
    return true;
  }

  // 3. Extract core keywords by removing conversational noise
  const cleanQ = rawQ
    .replace(/\b(tell me|show me|find me|give me|looking for|projects in|project in|properties in|flats in|apartments in|homes in|in|near|around|at|the|best|top|all)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleanQ && searchTarget.includes(cleanQ)) return true;

  // 4. Token match for significant terms
  const tokens = cleanQ.split(/\s+/).filter(t => t.length >= 3);
  if (tokens.length > 0 && tokens.every(t => searchTarget.includes(t))) {
    return true;
  }
  if (tokens.length > 0 && tokens.some(t => p.locality.toLowerCase().includes(t) || p.area.toLowerCase().includes(t) || p.projectName.toLowerCase().includes(t))) {
    return true;
  }

  // Complex multi-word price heuristic fallback
  const crMatch = rawQ.match(/(\d+(?:\.\d+)?)\s*cr/);
  const requestedCr = crMatch ? parseFloat(crMatch[1]) : null;

  const lakhMatch = rawQ.match(/(\d+(?:\.\d+)?)\s*lakh/);
  const requestedLakh = lakhMatch ? parseFloat(lakhMatch[1]) : null;
  
  if ((requestedCr || requestedLakh) && p.minPriceLakhs) {
    let targetPriceLakhs = 0;
    if (requestedCr) targetPriceLakhs = requestedCr * 100;
    if (requestedLakh) targetPriceLakhs = requestedLakh;

    if (targetPriceLakhs > 0 && p.minPriceLakhs <= targetPriceLakhs) {
      return true;
    }
  }
  
  return false;
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
    return p.minPriceLakhs !== null && p.minPriceLakhs >= 200;
  }
  if (category === "Affordable") {
    return p.minPriceLakhs !== null && p.minPriceLakhs <= 100;
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

    // 1. If AI ran and returned an array (even empty), we trust the AI results over client fallback.
    if (aiResults !== null) {
      if (aiResults.length === 0) {
        // AI found no exact matches → suggestion mode
        return { filteredProjects: [], isSuggestionMode: true };
      }
      
      const categoryFiltered = aiResults.filter(p => matchesCategory(p, selectedCategory));
      if (categoryFiltered.length > 0) {
        return { filteredProjects: categoryFiltered, isSuggestionMode: false };
      }
      // AI had results but category filter killed them → show AI results without category as suggestion?
      // Actually, if category filter kills it, it's 0 matches for this category. Suggestion mode!
      return { filteredProjects: [], isSuggestionMode: true };
    }

    // 2. Client-side filtering (for simple queries, or if AI failed/returned null)
    const clientFiltered = projects.filter((p) => {
      return matchesCategory(p, selectedCategory) && matchesSearchQuery(p, q);
    });

    if (clientFiltered.length > 0) {
      return { filteredProjects: clientFiltered, isSuggestionMode: false };
    }

    // Zero results from client → suggestion mode
    if (q && projects.length > 0) {
      return { filteredProjects: [], isSuggestionMode: true };
    }

    // Default (no query) → show all
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
