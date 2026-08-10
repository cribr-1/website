import {
  FullProject,
  BuilderProfile,
  LocalityAnalysis,
  SearchResponse,
  CitationItem,
} from "../types/search";
import { getFeaturedProperties } from "../data";

export const COMMON_CITATIONS: Record<string, CitationItem> = {
  rera: {
    id: "cit-rera",
    source: "Karnataka RERA Authority (K-RERA)",
    title: "Official Real Estate Regulatory Authority Filing",
    url: "https://rera.karnataka.gov.in",
    dateVerified: "Jul 2026",
    category: "RERA",
  },
  places: {
    id: "cit-places",
    source: "Google Places & Transit API",
    title: "Geospatial Distance & Commute Analysis",
    dateVerified: "Jul 2026",
    category: "Transit",
  },
};

export const MOCK_PROJECTS: FullProject[] = [];

export const MOCK_BUILDERS: Record<string, BuilderProfile> = {};

export const MOCK_LOCALITIES: Record<string, LocalityAnalysis> = {};

export const MOCK_INVESTMENT_RECOMMENDATION = {
  title: "AI Real Estate Investment Strategy & Yield Forecast",
  summary: "Properties added from the Admin Panel will be analyzed for rental yield and capital appreciation.",
  topGrowthLocality: "Metropolitan Area",
  averageGrossYield: "5.2%",
  topROIProject: "N/A",
  recommendedProjectIds: [] as string[],
  citations: [COMMON_CITATIONS.rera],
  growthDrivers: []
};

// Helper parser to match queries to live database/admin properties
export function evaluateQueryResponse(query: string): SearchResponse {
  const q = query.toLowerCase().trim();
  const allProps = getFeaturedProperties();

  if (allProps.length === 0) {
    return {
      type: "ranking",
      title: "Property Intelligence Matrix",
      summary: "No properties available yet.",
      query,
      projects: [],
      citations: [COMMON_CITATIONS.rera],
      followUpChips: ["Refresh Data"]
    };
  }

  const filtered = allProps.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.developer.toLowerCase().includes(q) ||
    p.location.toLowerCase().includes(q)
  );

  return {
    type: "ranking",
    title: filtered.length > 0 ? `Results for "${query}"` : "No matching properties found.",
    summary: filtered.length > 0 ? `Found ${filtered.length} matching properties.` : "No matching properties found.",
    query,
    projects: filtered as any[],
    citations: [COMMON_CITATIONS.rera],
    followUpChips: []
  };
}
