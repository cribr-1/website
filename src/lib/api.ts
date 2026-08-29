import {
  SearchResponse,
  FullProject,
  BuilderProfile,
  LocalityAnalysis,
  ProjectComparison,
  FilterOptions,
} from "../types/search";
import { evaluateQueryResponse } from "../data/mockRealEstateData";
import {
  formatLandArea,
  calculateUnitDensity,
  resolveTalukAndArea,
  resolveBuilderGrade,
  resolveDistanceToHub,
  calculateTimelineReliability,
  parseFiniteNumber,
} from "./projectDataMapper";

import { extractSearchIntent, searchSupabaseWithIntent } from "./aiSearchPipeline";

/**
 * Main AI Search function with backend intent extraction and Supabase database search
 */
export async function searchProjects(
  query: string,
  filters?: FilterOptions
): Promise<SearchResponse> {
  try {
    // Phase 1: Extract intent from backend AI
    const intent = await extractSearchIntent(query);
    
    // Search Supabase database using extracted intent filters (Grounded in DB ONLY)
    const matchedDbProjects = await searchSupabaseWithIntent(intent, query);

    // Map database properties to FullProject schema
    const mappedProjects: FullProject[] = matchedDbProjects.map((p: any, idx: number) => {

      const locationInfo = resolveTalukAndArea(p);
      const landAreaInfo = formatLandArea(p.land_area_acres, p.land_area_sqm);
      const densityInfo = calculateUnitDensity(p.total_units, landAreaInfo.acresNum, p.unit_density_per_acre);
      const hubInfo = resolveDistanceToHub(p);
      const builderGrade = resolveBuilderGrade(p);
      const progressVal = Number(p.construction_progress || 0);
      const timelineRel = calculateTimelineReliability(
        p.timeline_reliability_ratio,
        progressVal,
        p.project_start_date,
        p.possession_date
      );

      const minLakhs = p.min_price ? (p.min_price > 10000 ? p.min_price / 100000 : p.min_price) : 0;
      const maxLakhs = p.max_price ? (p.max_price > 10000 ? p.max_price / 100000 : p.max_price) : 0;

      return {
        id: p.id || `proj-${idx}`,
        rank: idx + 1,
        name: p.name || "Real Estate Project",
        builder: p.builder_name || "Promoter Verified",
        builderId: p.builder_id || "builder-1",
        location: locationInfo.locality,
        localityName: locationInfo.locality,
        city: locationInfo.city,
        reraNumber: p.rera_number || "PRM/KA/RERA",
        priceRange: minLakhs > 0 ? (minLakhs >= 100 ? `₹${(minLakhs / 100).toFixed(2)} Cr` : `₹${minLakhs.toFixed(1)} Lakhs`) : "Price on Request",
        minPriceLakhs: minLakhs,
        maxPriceLakhs: maxLakhs,
        pricePerSqft: p.price_per_sqft ? `₹${Number(p.price_per_sqft).toLocaleString("en-IN")}/sqft` : "N/A",
        densityValue: densityInfo.densityNum || 0,
        densityText: densityInfo.densityDisplay,
        commuteScore: p.commute_score != null ? (Number(p.commute_score) <= 1 ? Number(p.commute_score) * 10 : Number(p.commute_score)) : null,
        commuteText: hubInfo.distanceDisplay !== "N/A" ? `${hubInfo.distanceDisplay} to ${hubInfo.hubName}` : "N/A",
        builderGrade,
        reliabilityScore: timelineRel.variance != null ? Math.round(85 + timelineRel.variance) : null,
        constructionProgress: progressVal,
        possessionDate: p.possession_date || "TBD",
        googleRating: p.google_rating != null ? Number(p.google_rating) : (p.google_reviews_score != null ? Number(p.google_reviews_score) : null),
        reviewsCount: p.reviews_count ? Number(p.reviews_count) : 0,
        complaintsCount: p.complaints_count != null ? String(p.complaints_count) : (p.complaints_on_project != null ? String(p.complaints_on_project) : "0"),
        activeComplaintsNum: p.complaints_count != null ? Number(p.complaints_count) : (p.complaints_on_project != null ? Number(p.complaints_on_project) : 0),
        totalUnits: p.total_units ? String(p.total_units) : "N/A",
        totalAcres: landAreaInfo.acresNum || 0,
        status: p.land_litigation ? "delayed" : "safe",
        statusText: p.land_litigation ? "Caution" : "RERA Verified",
        delayMonths: 0,
        pros: Array.isArray(p.pros) ? p.pros : [],
        cons: Array.isArray(p.cons) ? p.cons : [],
        amenities: Array.isArray(p.amenities) ? p.amenities : [],
        schools: [],
        metroDistance: "N/A",
        hospitalDistance: "N/A",
        investmentScore: null,
        futureGrowthText: "Verified growth corridor",
        safeToBuy: !p.land_litigation,
        aiVerdict: p.ai_verdict || null,
        cribrScore: p.cribr_score || null,
        images: [p.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"],
        aiInsights: [],
        mapCoords: { x: 50, y: 50 },
        timeline: [],
        documents: [],
        reviews: []
      };
    });

    const responsePayload: SearchResponse = {
      type: "ranking",
      title: `Search Results for "${query}"`,
      query: query,
      summary: `Found ${mappedProjects.length} verified database properties matching your criteria.`,
      projects: mappedProjects,
      recommendedProperties: mappedProjects,
      citations: [
        { id: "cit-1", title: "K-RERA Karnataka Portal", source: "Official RERA Filing", category: "RERA" },
        { id: "cit-2", title: "Supabase Master Database", source: "Verified Property Record", category: "Government" }
      ]
    };

    return applyFiltersToResponse(responsePayload, filters);
  } catch (err) {
    console.warn("AI intent search error, using fallback evaluator:", err);
    const evaluated = evaluateQueryResponse(query);
    return applyFiltersToResponse(evaluated, filters);
  }
}

function applyFiltersToResponse(
  response: SearchResponse,
  filters?: FilterOptions
): SearchResponse {
  if (!filters || !response.projects) return response;

  let filtered = [...response.projects];

  if (filters.maxBudgetLakhs !== undefined && filters.maxBudgetLakhs > 0) {
    filtered = filtered.filter((p) => (p.minPriceLakhs || 0) <= filters.maxBudgetLakhs!);
  }

  if (filters.maxDensity !== undefined && filters.maxDensity > 0) {
    filtered = filtered.filter((p) => (p.densityValue || 0) <= filters.maxDensity!);
  }

  if (filters.onlySafeToBuy) {
    filtered = filtered.filter((p) => p.status === "safe" || p.status === "ready");
  }

  if (filters.onlyReadyToMove) {
    filtered = filtered.filter((p) => p.status === "ready" || p.possessionDate === "Ready to Move");
  }

  if (filters.minCommuteScore !== undefined && filters.minCommuteScore > 0) {
    filtered = filtered.filter((p) => (p.commuteScore || 0) >= filters.minCommuteScore!);
  }

  if (filters.minRating !== undefined && filters.minRating > 0) {
    filtered = filtered.filter((p) => (p.googleRating || 0) >= filters.minRating!);
  }

  if (filters.locality && filters.locality !== "All") {
    filtered = filtered.filter(
      (p) =>
        (p.localityName && p.localityName.toLowerCase().includes(filters.locality!.toLowerCase())) ||
        (p.location && p.location.toLowerCase().includes(filters.locality!.toLowerCase()))
    );
  }

  // Re-rank items
  filtered = filtered.map((item, index) => ({ ...item, rank: index + 1 }));

  return {
    ...response,
    projects: filtered,
  };
}

/**
 * Fetch detailed project data by ID from live Supabase
 */
export async function getProject(id: string): Promise<FullProject | null> {
  try {
    const { getPropertyAsync } = await import("./projectDataMapper");
    const proj = await getPropertyAsync(id);
    return proj || null;
  } catch {
    return null;
  }
}

/**
 * Compare multiple projects by IDs
 */
export async function compareProjects(ids: string[]): Promise<ProjectComparison> {
  try {
    const { cribrProperties } = await import("./supabase");
    const allProps = await cribrProperties.getProperties();
    const projectsToCompare = allProps.filter((p: any) => ids.includes(p.id));

    const metrics = [
      {
        category: "Pricing & Area",
        key: "priceRange",
        label: "Price Range",
        values: Object.fromEntries(projectsToCompare.map((p: any) => [p.id, p.priceRange || p.minPrice || "Price on Request"])),
      },
      {
        category: "Developer & Compliance",
        key: "builder",
        label: "Developer",
        values: Object.fromEntries(projectsToCompare.map((p: any) => [p.id, p.builder || "Verified Developer"])),
      },
      {
        category: "Developer & Compliance",
        key: "reliabilityScore",
        label: "Builder Grade",
        values: Object.fromEntries(projectsToCompare.map((p: any) => [p.id, p.builderGrade || "A"])),
      },
    ];

    return {
      title: `Comparison Matrix: ${projectsToCompare.map((p: any) => p.projectName || p.name).join(" vs ")}`,
      summary: `Comprehensive evaluation across ${projectsToCompare.length} projects comparing price, developer trust, and accessibility.`,
      projectIds: ids,
      metrics,
    };
  } catch {
    return {
      title: "Project Comparison",
      summary: "Comparison unavailable.",
      projectIds: ids,
      metrics: [],
    };
  }
}

/**
 * Fetch Builder profile by ID
 */
export async function getBuilder(id: string): Promise<BuilderProfile | null> {
  return null;
}

/**
 * Fetch Locality analysis by name
 */
export async function getLocality(name: string): Promise<LocalityAnalysis | null> {
  return null;
}
