import { useState, useEffect, useCallback, useMemo } from "react";
import { cribrProperties } from "../lib/supabase";
import { WhitelistedProject } from "../lib/projectDataMapper";

export interface UsePropertySearchResult {
  /** All projects fetched from Supabase (normalized). */
  projects: WhitelistedProject[];
  /** Projects after search query + category filter applied. */
  filteredProjects: WhitelistedProject[];
  /** True while the initial Supabase fetch is in-flight. */
  isLoading: boolean;
  /** Non-null when the Supabase fetch failed. */
  error: string | null;
  /** Re-fetch projects from Supabase. */
  refresh: () => Promise<void>;
  /** The currently active category filter. */
  selectedCategory: string;
  /** Set the category filter. */
  setSelectedCategory: (cat: string) => void;
}

/**
 * Canonical search function. Operates ONLY on WhitelistedProject fields.
 * Both Desktop and Mobile share this exact implementation.
 */
function matchesSearchQuery(p: WhitelistedProject, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return [
    p.projectName,
    p.builder,
    p.locality,
    p.area,
    p.unitTypes,
    p.reraNumber,
    p.builderGrade,
    p.googleReviewSummary,
  ]
    .filter(Boolean)
    .some((val) => val.toLowerCase().includes(q));
}

/**
 * Canonical category filter.
 * Since WhitelistedProject does not carry a `category` field,
 * we match against possession status for "Ready to Move" and
 * treat "All" as unfiltered. Other categories pass through
 * as-is — future iterations may add a `category` field to
 * WhitelistedProject.
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
 * Single shared hook for property loading, search, and filtering.
 *
 * Architecture:
 *   Supabase → cribrProperties.getProperties() → mapToWhitelistedProject() → usePropertySearch()
 *
 * Both PropertyExplorer (Desktop) and CribrMobileHome (Mobile) consume this hook.
 * No component should ever implement its own fetch, search, or normalization logic.
 *
 * @param searchQuery — The current search query string (owned by parent component / App.tsx).
 */
export function usePropertySearch(searchQuery?: string): UsePropertySearchResult {
  const [projects, setProjects] = useState<WhitelistedProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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

  // Derived: filtered projects based on search query + category
  const filteredProjects = useMemo(() => {
    const q = searchQuery?.trim() || "";
    return projects.filter((p) => {
      return matchesCategory(p, selectedCategory) && matchesSearchQuery(p, q);
    });
  }, [projects, searchQuery, selectedCategory]);

  return {
    projects,
    filteredProjects,
    isLoading,
    error,
    refresh,
    selectedCategory,
    setSelectedCategory,
  };
}
