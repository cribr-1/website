import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SearchResponse,
  FullProject,
  FilterOptions,
  ChatMessage,
  StreamingStep,
} from "../types/search";
import { searchProjects, getProject } from "../lib/api";
import { cribrAnalyticsEngine } from "../lib/supabase";

interface SearchContextType {
  pageMode: number; // 1: Landing, 2: Results, 3: Detail, 4: Comparison
  setPageMode: (mode: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResponse: SearchResponse | null;
  isLoading: boolean;
  streamingReasoningStep: string;
  chatHistory: ChatMessage[];
  submitFollowUp: (followUpText: string) => Promise<void>;
  resetSession: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  selectedProject: FullProject | null;
  setSelectedProject: (project: FullProject | null) => void;
  executeSearch: (query: string, filtersOverride?: FilterOptions) => Promise<void>;
  viewMode: "list" | "map";
  setViewMode: (mode: "list" | "map") => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  activeFilterCount: number;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  selectedForCompare: string[];
  toggleCompareSelect: (project: FullProject) => void;
  clearCompareSelection: () => void;
  compareModalOpen: boolean;
  setCompareModalOpen: (open: boolean) => void;
  recentSearches: string[];
  selectProjectById: (id: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageMode, setPageMode] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingReasoningStep, setStreamingReasoningStep] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<FullProject | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load saved preferences and ensure frontend starts completely clean
  useEffect(() => {
    try {
      localStorage.removeItem("cribr_recent_searches");
      localStorage.removeItem("cribr_last_response");
      localStorage.removeItem("cribr_bookmarks");
      localStorage.removeItem("cribr_saved_homes");
      
      const savedTheme = localStorage.getItem("cribr_theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("cribr_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("cribr_theme", "light");
      }
      return next;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((b) => b !== id) : [...prev, id];
      try {
        localStorage.setItem("cribr_bookmarks", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const toggleCompareSelect = (project: FullProject) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(project.id)) {
        return prev.filter((id) => id !== project.id);
      }
      if (prev.length >= 4) {
        return prev; // max 4 projects
      }
      return [...prev, project.id];
    });
  };

  const clearCompareSelection = () => {
    setSelectedForCompare([]);
  };

  const resetFilters = () => {
    setFilters({});
    if (searchQuery) {
      executeSearch(searchQuery, {});
    }
  };

  const resetSession = () => {
    setChatHistory([]);
    setSearchQuery("");
    setSearchResponse(null);
    setPageMode(1);
  };

  const activeFilterCount = Object.values(filters).filter(
    (val) => val !== undefined && val !== false && val !== ""
  ).length;

  const executeSearch = async (query: string, filtersOverride?: FilterOptions) => {
    if (!query || !query.trim()) return;

    setSearchQuery(query);
    setIsLoading(true);
    setPageMode(2);

    // Save query to recents if unique
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 6);
    });

    const effectiveFilters = filtersOverride || filters;

    // Stream animated reasoning steps
    setStreamingReasoningStep("Understanding your query & real estate intent...");
    await new Promise((r) => setTimeout(r, 400));
    setStreamingReasoningStep("Searching RERA database & developer records...");
    await new Promise((r) => setTimeout(r, 500));
    setStreamingReasoningStep("Comparing builder reliability & density ratios...");
    await new Promise((r) => setTimeout(r, 500));
    setStreamingReasoningStep("Calculating 100-point CRIBR Property Scores...");
    await new Promise((r) => setTimeout(r, 500));
    setStreamingReasoningStep("Formatting intelligence report with verified citations...");

    const result = await searchProjects(query, effectiveFilters);
    cribrAnalyticsEngine.trackSearchQuery(query, result.projects?.length || 0);

    // Record user chat message in continuous session memory
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantMsg: ChatMessage = {
      id: `ast-${Date.now()}`,
      role: "assistant",
      content: result.summary || `Intelligence report compiled for ${query}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      responsePayload: result,
      citations: result.citations,
    };

    setChatHistory((prev) => [...prev, userMsg, assistantMsg]);
    setSearchResponse(result);
    setStreamingReasoningStep("");
    setIsLoading(false);
  };

  const submitFollowUp = async (followUpText: string) => {
    if (!followUpText.trim()) return;
    const fullQuery = `${searchQuery} — Follow-up: ${followUpText}`;
    await executeSearch(fullQuery);
  };

  const selectProjectById = async (id: string) => {
    const proj = await getProject(id);
    if (proj) {
      setSelectedProject(proj);
      setPageMode(3);
      cribrAnalyticsEngine.trackProjectView(proj.id, proj.name);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        pageMode,
        setPageMode,
        searchQuery,
        setSearchQuery,
        searchResponse,
        isLoading,
        streamingReasoningStep,
        chatHistory,
        submitFollowUp,
        resetSession,
        isDarkMode,
        toggleDarkMode,
        selectedProject,
        setSelectedProject,
        executeSearch,
        viewMode,
        setViewMode,
        filters,
        setFilters,
        resetFilters,
        activeFilterCount,
        bookmarks,
        toggleBookmark,
        selectedForCompare,
        toggleCompareSelect,
        clearCompareSelection,
        compareModalOpen,
        setCompareModalOpen,
        recentSearches,
        selectProjectById,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
