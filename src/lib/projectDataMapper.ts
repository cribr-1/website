import { FullProject } from "../types/search";

export const ACRE_TO_SQM = 4046.8564224;

export interface SupabaseProject {
  id?: string;
  name: string;
  rera_number?: string | null;
  builder_id?: string | null;
  builder_name?: string | null;
  city?: string | null;
  taluk?: string | null;
  location?: string | null;
  status: "draft" | "published" | "archived";
  project_start_date?: string | null;
  possession_date?: string | null;
  construction_progress?: number | null;
  min_price_lakhs?: number | null;
  max_price_lakhs?: number | null;
  price_per_sqft?: number | null;
  price_range?: string | null;
  total_units?: number | null;
  land_area_acres?: number | null;
  land_area_sqm?: number | null;
  unit_density_per_acre?: number | null;
  timeline_reliability_ratio?: number | string | null;
  commute_score?: number | null;
  nearest_office_hub?: string | null;
  distance_to_hub_km?: number | null;
  builder_grade?: string | null;
  google_rating?: number | null;
  reviews_count?: number | null;
  complaints_count?: number | null;
  land_litigation?: boolean | string | null;
  verification_title_audit_note?: string | null;
  google_review_summary?: string | null;
  cribr_score?: number | null;
  ai_verdict?: string | null;
  amenities?: string[] | null;
  pros?: string[] | null;
  cons?: string[] | null;
  created_at?: string;
}

export interface WhitelistedProjectCard {
  id: string;
  projectName: string;
  builderName: string;
  locality: string;
  taluk: string;
  area: string;
  reraStatus: string;
  priceRange: string;
  pricePerSqft: string;
  unitTypes: string[];
  possessionDate: string;
  constructionProgress: number | string;
  landArea: string;
  totalUnits: string | number;
  commuteScore: number | string;
  builderGrade: string;
  builderGradeDisplay: string;
  googleRating: number | string;
  heroImage?: string;
  rank?: number;
}

export interface WhitelistedProjectOverview {
  id: string;
  projectName: string;
  reraNumber: string;
  builderName: string;
  locality: string;
  taluk: string;
  area: string;

  projectStartDate: string;
  possessionDate: string;
  constructionProgress: number | string;
  totalUnits: number | string;
  landAreaAcres: string;
  landAreaSqm: string;
  yearsToPossession: string;
  timelineReliabilityRatio: string;
  timelineReliabilityStatus: string;
  timelineReliabilityDisplay: string;

  unitTypes: string[];
  minPrice: string;
  maxPrice: string;
  pricePerSqft: string;

  unitDensity: string;

  nearestOfficeHub: string;
  distanceToHubKm: string;
  commuteScore: number | string;

  builderGrade: string;
  builderGradeDisplay: string;
  googleRating: number | string;
  googleReviewSummary: string;
  verificationTitleAuditNote: string;
  complaintsCount: number | string;
  landLitigationStatus: string;

  heroImage?: string;
  images?: string[];
  minPriceLakhs?: number | null;
  maxPriceLakhs?: number | null;
  pricePerSqftNum?: number | null;
  priceStatus?: "Available" | "On Request";
}

export interface WhitelistedProject {
  id: string;
  name?: string;
  projectName: string;
  builder: string;
  builder_name?: string;
  builderName?: string;
  slug?: string;
  locality: string;
  taluk: string;
  area: string;
  reraNumber: string;
  projectStartDate: string;
  possessionDate: string;
  constructionProgress: number | string;
  landAreaSqm: string;
  landAreaAcres: string;
  totalUnits: string;
  complaints: string | number;
  landLitigation: string;
  verificationTitleAuditNote: string;
  unitTypes: string;
  minPrice: string;
  maxPrice: string;
  pricePerSqft: string;
  unitDensity: string;
  yearsToPossession: string;
  timelineReliabilityRatio: string;
  timelineReliabilityDisplay: string;
  nearestOfficeHub: string;
  distanceToHub: string;
  commuteScoreDisplay: string;
  builderGrade: string;
  builderGradeDisplay: string;
  builderReliability: number | null;
  googleRating: string;
  googleReviewSummary: string;

  // Normalized search/filter fields
  minPriceLakhs: number | null;
  maxPriceLakhs: number | null;
  pricePerSqftNum: number | null;
  priceStatus: "Available" | "On Request";

  image?: string;
  images?: string[];
}

/**
 * Parses any input into a valid finite number or returns null.
 */
export function parseFiniteNumber(val: any): number | null {
  if (val == null) return null;
  if (typeof val === "number") {
    return Number.isFinite(val) ? val : null;
  }
  if (typeof val === "string") {
    const clean = val.replace(/,/g, "").replace(/[^0-9.-]/g, "").trim();
    if (!clean || clean === "-" || clean === ".") return null;
    const num = parseFloat(clean);
    return Number.isFinite(num) ? num : null;
  }
  return null;
}

/**
 * Formats land area with exact 1 Acre = 4046.8564224 sq.m conversion.
 * Never outputs NaN or invalid strings.
 */
export function formatLandArea(
  acresInput: any,
  sqmInput?: any
): {
  acresDisplay: string;
  sqmDisplay: string;
  acresNum: number | null;
  sqmNum: number | null;
} {
  const directSqm = parseFiniteNumber(sqmInput);
  const directAcres = parseFiniteNumber(acresInput);

  let acres: number | null = directAcres;
  let sqm: number | null = directSqm;

  if (acres != null && acres > 0) {
    if (sqm == null || sqm <= 0) {
      sqm = acres * ACRE_TO_SQM;
    }
  } else if (sqm != null && sqm > 0) {
    acres = sqm / ACRE_TO_SQM;
  }

  const acresDisplay =
    acres != null && acres > 0
      ? `${acres % 1 === 0 ? acres.toFixed(0) : acres.toFixed(2).replace(/\.?0+$/, "")} Acres`
      : "N/A";

  const sqmDisplay =
    sqm != null && sqm > 0
      ? `${Math.round(sqm).toLocaleString("en-IN")} sq.m`
      : "N/A";

  return {
    acresDisplay,
    sqmDisplay,
    acresNum: acres,
    sqmNum: sqm,
  };
}

/**
 * Calculates Unit Density (Total Units / Land Area in Acres).
 * Only executes with strictly valid finite numbers > 0.
 */
export function calculateUnitDensity(
  totalUnitsInput: any,
  acresInput: any,
  explicitDensity?: any
): { densityNum: number | null; densityDisplay: string } {
  if (
    explicitDensity &&
    typeof explicitDensity === "string" &&
    explicitDensity.trim() !== "" &&
    explicitDensity.trim() !== "N/A"
  ) {
    const explicitNum = parseFiniteNumber(explicitDensity);
    if (explicitNum != null && explicitNum > 0) {
      return {
        densityNum: Math.round(explicitNum),
        densityDisplay: explicitDensity.includes("unit")
          ? explicitDensity.trim()
          : `${Math.round(explicitNum)} units/acre`,
      };
    }
  }

  const units = parseFiniteNumber(totalUnitsInput);
  const acres = parseFiniteNumber(acresInput);

  if (units != null && units > 0 && acres != null && acres > 0) {
    const density = Math.round(units / acres);
    if (Number.isFinite(density) && density > 0) {
      return {
        densityNum: density,
        densityDisplay: `${density} units/acre`,
      };
    }
  }

  return {
    densityNum: null,
    densityDisplay: "N/A",
  };
}

/**
 * Resolves Taluk, Locality, City and Area display according to the hierarchy:
 * Taluk → Area / Micro-market → City → N/A
 */
export function resolveTalukAndArea(row: any): {
  taluk: string;
  locality: string;
  city: string;
  areaDisplay: string;
} {
  if (!row) {
    return {
      taluk: "N/A",
      locality: "Bangalore",
      city: "Bangalore",
      areaDisplay: "Bangalore",
    };
  }

  const talukVal =
    row.taluk ||
    row.taluk_name ||
    row.talukName ||
    row.taluk_area ||
    row["Taluk / Area"] ||
    row["Taluk/Area"];
  const localityVal =
    row.locality ||
    row.localityName ||
    row.location ||
    row.micro_market ||
    row.microMarket ||
    row["Locality"];
  const cityVal = row.city || "Bangalore";

  let cleanTaluk =
    talukVal &&
    typeof talukVal === "string" &&
    talukVal.trim() !== "" &&
    talukVal.trim().toLowerCase() !== "null" &&
    talukVal.trim().toLowerCase() !== "undefined" &&
    talukVal.trim().toLowerCase() !== "bangalore" &&
    talukVal.trim().toLowerCase() !== "bengaluru"
      ? talukVal.trim()
      : "";

  const cleanLocality =
    localityVal &&
    typeof localityVal === "string" &&
    localityVal.trim() !== "" &&
    localityVal.trim().toLowerCase() !== "null" &&
    localityVal.trim().toLowerCase() !== "undefined"
      ? localityVal.trim()
      : "";

  // Infer official Taluk from documented micro-market if missing
  if (!cleanTaluk && cleanLocality) {
    const locLower = cleanLocality.toLowerCase();
    if (
      locLower.includes("dommasandra") ||
      locLower.includes("chikkavadera") ||
      locLower.includes("sarjapur hobli") ||
      locLower.includes("sompura") ||
      locLower.includes("thigalachodadenahalli")
    ) {
      cleanTaluk = "Anekal";
    } else if (
      locLower.includes("kodathi") ||
      locLower.includes("choodasandra")
    ) {
      cleanTaluk = "Bengaluru South";
    } else if (
      locLower.includes("mullur") ||
      locLower.includes("gunjur") ||
      locLower.includes("varthur") ||
      locLower.includes("sarjapura road") ||
      locLower.includes("sarjapur road")
    ) {
      cleanTaluk = "Bengaluru East";
    }
  }

  const cleanCity =
    cityVal &&
    typeof cityVal === "string" &&
    cityVal.trim() !== "" &&
    cityVal.trim().toLowerCase() !== "null" &&
    cityVal.trim().toLowerCase() !== "undefined"
      ? cityVal.trim()
      : "Bangalore";

  const areaDisplay = cleanTaluk || cleanLocality || cleanCity || "Bangalore";
  const localityDisplay = cleanLocality || cleanTaluk || cleanCity || "Bangalore";

  return {
    taluk: cleanTaluk || "N/A",
    locality: localityDisplay,
    city: cleanCity,
    areaDisplay,
  };
}

/**
 * Office Grades lookup table from client's "Cribr Raw Data - Office Grades.csv".
 * Maps builder names → { grade, reliability_score (0–1), tier }.
 */
const OFFICE_GRADES: Record<string, { grade: string; reliability: number; tier: string }> = {
  "brigade enterprises": { grade: "A+", reliability: 1.0, tier: "Premium" },
  "godrej properties": { grade: "A+", reliability: 1.0, tier: "Premium" },
  "l&t realty": { grade: "A+", reliability: 0.97, tier: "Premium" },
  "prestige estates": { grade: "A+", reliability: 1.0, tier: "Premium" },
  "sobha limited": { grade: "A+", reliability: 1.0, tier: "Premium" },
  "tata housing development company": { grade: "A+", reliability: 0.98, tier: "Premium" },
  "bhartiya urban": { grade: "A", reliability: 0.88, tier: "Grade A" },
  "birla estates": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "embassy property developments": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "kalyani developers": { grade: "A", reliability: 0.88, tier: "Grade A" },
  "mahindra lifespace developers": { grade: "A", reliability: 0.88, tier: "Grade A" },
  "ncc urban infrastructure": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "puravankara limited": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "shapoorji pallonji real estate": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "tata projects": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "total environment building systems": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "vardhita constructions": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "assetz property group": { grade: "A-", reliability: 0.85, tier: "Grade A" },
  "century real estate holdings": { grade: "A-", reliability: 0.85, tier: "Grade A" },
  "mana projects": { grade: "A-", reliability: 0.85, tier: "Grade A" },
  "nambiar builders": { grade: "A-", reliability: 0.85, tier: "Grade A" },
  "kolte-patil developers": { grade: "A-", reliability: 0.85, tier: "Grade A" },
  "arvind smartspaces": { grade: "B+", reliability: 0.80, tier: "Grade B" },
  "bren corporation": { grade: "B+", reliability: 0.80, tier: "Grade B" },
  "casagrand builder private limited": { grade: "B+", reliability: 0.80, tier: "Grade B" },
  "concorde group": { grade: "B+", reliability: 0.80, tier: "Grade B" },
  "dnr corporation": { grade: "B+", reliability: 0.79, tier: "Grade B" },
  "divyasree developers": { grade: "B+", reliability: 0.80, tier: "Grade B" },
  "salarpuria sattva group": { grade: "B+", reliability: 0.80, tier: "Grade B" },
  "shriram properties limited": { grade: "B+", reliability: 0.80, tier: "Grade B" },
  "vaishnavi group": { grade: "B+", reliability: 0.80, tier: "Grade B" },
  "abhee ventures": { grade: "B", reliability: 0.75, tier: "Grade B" },
  "candeur landmark developers": { grade: "B", reliability: 0.75, tier: "Grade B" },
  "candeur": { grade: "B", reliability: 0.75, tier: "Grade B" },
  "dsr infraprojects": { grade: "B", reliability: 0.75, tier: "Grade B" },
  "iinspira worldcity projects pvt ltd (assetz)": { grade: "B", reliability: 0.75, tier: "Grade B" },
  "nexplace infrastructure (abhee ventures)": { grade: "B", reliability: 0.75, tier: "Grade B" },
  "ozone group": { grade: "B", reliability: 0.75, tier: "Grade B" },
  "snn builders": { grade: "B", reliability: 0.75, tier: "Grade B" },
  "prestige projects pvt ltd": { grade: "A+", reliability: 1.0, tier: "Premium" },
  "godrej properties limited": { grade: "A+", reliability: 1.0, tier: "Premium" },
  "brigade enterprises ltd": { grade: "A+", reliability: 1.0, tier: "Premium" },
  "vardhita properties pvt ltd (birla estates)": { grade: "A", reliability: 0.90, tier: "Grade A" },
  "nambiar ensembleresidential projects llp": { grade: "A-", reliability: 0.85, tier: "Grade A" },
};

/**
 * Office Hubs coordinates from client's "Cribr Raw Data - Office Hubs.csv".
 */
const OFFICE_HUBS: Array<{ name: string; lat: number; lon: number }> = [
  { name: "Whitefield", lat: 12.9698, lon: 77.7499 },
  { name: "Electronic City", lat: 12.8399, lon: 77.6770 },
  { name: "Manyata Tech Park", lat: 13.0475, lon: 77.6205 },
  { name: "Sarjapur Road", lat: 12.9079, lon: 77.6947 },
  { name: "Outer Ring Road (Marathahalli)", lat: 12.9592, lon: 77.6974 },
  { name: "Koramangala", lat: 12.9352, lon: 77.6245 },
  { name: "Hebbal", lat: 13.0353, lon: 77.5971 },
  { name: "Yeshwanthpur", lat: 13.0289, lon: 77.5501 },
  { name: "Bagmane Tech Park", lat: 12.9855, lon: 77.6554 },
  { name: "ITPL", lat: 12.9873, lon: 77.7486 },
  { name: "Embassy Golf Links", lat: 12.9540, lon: 77.6464 },
  { name: "Bellandur", lat: 12.9259, lon: 77.6762 },
  { name: "Devanahalli", lat: 13.2257, lon: 77.7094 },
  { name: "JP Nagar", lat: 12.9063, lon: 77.5857 },
  { name: "Bannerghatta Road", lat: 12.8742, lon: 77.5986 },
  { name: "Rajajinagar", lat: 12.9916, lon: 77.5540 },
  { name: "HSR Layout", lat: 12.9116, lon: 77.6474 },
  { name: "Yelahanka", lat: 13.1007, lon: 77.5963 },
];

/**
 * Haversine distance between two lat/lon points in km.
 */
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes the nearest office hub from the Office Hubs table using Haversine.
 * Returns hub name and distance in km.
 */
export function computeNearestHub(lat: number, lon: number): { hubName: string; distanceKm: number } | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return null;
  }

  let nearestHub = OFFICE_HUBS[0];
  let nearestDist = Infinity;

  for (const hub of OFFICE_HUBS) {
    const dist = haversineDistanceKm(lat, lon, hub.lat, hub.lon);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestHub = hub;
    }
  }

  if (Number.isFinite(nearestDist) && nearestDist > 0 && nearestDist < 100) {
    return { hubName: nearestHub.name, distanceKm: Math.round(nearestDist * 100) / 100 };
  }
  return null;
}

/**
 * Looks up builder reliability score (0–1) from the Office Grades table.
 * Returns the numeric reliability_score, or null if not found.
 */
export function resolveBuilderReliability(row: any): number | null {
  if (!row) return null;

  // Check for explicit builder_reliability field first
  const explicitReliability = row.builder_reliability ?? row.builderReliability ?? row.reliability_score;
  if (explicitReliability != null) {
    const num = typeof explicitReliability === 'number' ? explicitReliability : parseFloat(String(explicitReliability));
    if (Number.isFinite(num) && num >= 0 && num <= 1) return num;
  }

  // Lookup from Office Grades table by builder name
  const builderName = String(
    row.builder || row.developer || row.builder_name || row.builderName || ""
  ).toLowerCase().trim();

  if (!builderName) return null;

  // Direct match
  if (OFFICE_GRADES[builderName]) {
    return OFFICE_GRADES[builderName].reliability;
  }

  // Partial match: check if any key is contained in builder name or vice versa
  for (const [key, value] of Object.entries(OFFICE_GRADES)) {
    if (builderName.includes(key) || key.includes(builderName)) {
      return value.reliability;
    }
  }

  return null;
}

/**
 * Resolves Builder Grade without fabricated "Grade B" or "A" fallbacks.
 * Uses Office Grades table first, then explicit data fields.
 * Unrated or unknown builders return "Not Found" or "Unrated".
 */
export function resolveBuilderGrade(row: any): string {
  if (!row) return "Unrated";

  // Try Office Grades table lookup first
  const builderName = String(
    row.builder || row.developer || row.builder_name || row.builderName || ""
  ).toLowerCase().trim();

  if (builderName) {
    const direct = OFFICE_GRADES[builderName];
    if (direct) return direct.grade;
    for (const [key, value] of Object.entries(OFFICE_GRADES)) {
      if (builderName.includes(key) || key.includes(builderName)) {
        return value.grade;
      }
    }
  }

  // Fallback to explicit field
  const explicit =
    row.builder_grade ||
    row.builderGrade ||
    row.grade ||
    row.developer_grade ||
    row.developerGrade;

  if (explicit != null && typeof explicit === "string") {
    const trimmed = explicit.trim();
    if (
      trimmed.toLowerCase() === "not found" ||
      trimmed.toLowerCase() === "unrated" ||
      trimmed.toLowerCase() === "not listed"
    ) {
      return "Not Found";
    }
    if (
      trimmed !== "" &&
      trimmed.toLowerCase() !== "null" &&
      trimmed.toLowerCase() !== "undefined" &&
      trimmed !== "N/A"
    ) {
      return trimmed.replace(/^Grade\s+/i, "").trim();
    }
  }

  return "Unrated";
}

/**
 * Formats builder grade display text safely.
 */
export function formatBuilderGradeDisplay(grade: string | null | undefined): string {
  if (!grade || grade === "Unrated" || grade === "Not Found" || grade === "N/A") {
    return grade === "Not Found" ? "Unrated (Not Listed)" : (grade || "Unrated");
  }
  const clean = String(grade).trim();
  if (clean.startsWith("Grade")) return clean;
  return `Grade ${clean}`;
}

/**
 * Resolves Distance to Hub.
 * Priority: 1) Direct numeric field, 2) String parsing, 3) Haversine from project lat/lon vs Office Hubs table.
 * Client spec: "Computed from lat/lon vs office hubs coordinates".
 */
export function resolveDistanceToHub(row: any): {
  distanceDisplay: string;
  distanceKm: number | null;
  hubName: string;
} {
  if (!row) {
    return { distanceDisplay: "N/A", distanceKm: null, hubName: "IT Hub" };
  }

  const hubNameField =
    row.nearest_office_hub ||
    row.nearestOfficeHub ||
    row.nearestHub ||
    row.hubName ||
    "";

  // 1. Direct numeric distance_to_hub_km
  const directKm = parseFiniteNumber(
    row.distance_to_hub_km ??
      row.distanceToHubKm ??
      row.distance_from_nearest_office_hub ??
      row.distance_km ??
      row.distanceKm
  );
  if (directKm != null && directKm > 0) {
    return {
      distanceDisplay: `${directKm.toFixed(2)} km`,
      distanceKm: directKm,
      hubName: hubNameField || "Tech Corridor",
    };
  }

  // 2. Commute string parsing
  const commuteText =
    row.commuteText ||
    row.commute_text ||
    row.distanceToHub ||
    row.distance;

  if (commuteText && typeof commuteText === "string") {
    const match = commuteText.match(/([\d.]+)\s*km/i);
    if (match) {
      const parsed = parseFloat(match[1]);
      if (Number.isFinite(parsed) && parsed > 0) {
        return {
          distanceDisplay: `${parsed.toFixed(2)} km`,
          distanceKm: parsed,
          hubName: hubNameField || "Tech Corridor",
        };
      }
    }
  }

  // 3. Compute nearest hub from project lat/lon vs Office Hubs table (Haversine)
  const lat = parseFiniteNumber(row.latitude ?? row.lat);
  const lon = parseFiniteNumber(row.longitude ?? row.lng ?? row.lon);
  if (lat != null && lon != null) {
    const nearest = computeNearestHub(lat, lon);
    if (nearest) {
      return {
        distanceDisplay: `${nearest.distanceKm.toFixed(2)} km`,
        distanceKm: nearest.distanceKm,
        hubName: nearest.hubName,
      };
    }
  }

  return {
    distanceDisplay: "N/A",
    distanceKm: null,
    hubName: hubNameField || "Tech Corridor",
  };
}

/**
 * Resolves the Property Title Summary.
 * Client spec format: "Title is [clear / unclear / disputed / encumbered] — [one key reason]."
 * Under 15 words. One sentence only.
 * Source: Karnataka RERA Title Opinion Report (processed via GPT).
 * Falls back to synthesis from litigation/RERA fields if no explicit summary exists.
 */
export function resolveTitleAuditNote(row: any): string {
  if (!row) return "Title status inconclusive — no data available.";

  // 1. Check for explicit property_title_summary from Base Data / client data
  const explicitNote =
    row.property_title_summary ||
    row.propertyTitleSummary ||
    row.verification_title_audit_note ||
    row.verificationTitleAuditNote ||
    row.title_audit_note ||
    row.titleAuditNote;

  if (
    explicitNote &&
    typeof explicitNote === "string" &&
    explicitNote.trim() !== "" &&
    explicitNote.trim() !== "N/A" &&
    !explicitNote.toLowerCase().includes("google review") &&
    !explicitNote.toLowerCase().includes("praised for")
  ) {
    // If it's already in the client's short format, return as-is
    const trimmed = explicitNote.trim();
    if (trimmed.toLowerCase().startsWith("title is ") || trimmed.toLowerCase().startsWith("clear")) {
      return trimmed;
    }
    // Otherwise, return the explicit note (already validated from client data)
    return trimmed;
  }

  // 2. Synthesize from RERA / litigation fields in client format
  const hasLitigation = Boolean(
    row.land_litigation === true ||
      row.land_litigation === "true" ||
    row.land_litigation === "Yes" ||
    String(row.landLitigationStatus).toLowerCase().includes("active")
  );

  if (hasLitigation) {
    return "Title is disputed — active land litigation recorded.";
  }

  return "Title is clear — no encumbrances or litigation found.";
}

/**
 * Resolves Google Review Summary strictly separate from legal audit.
 */
export function resolveGoogleReviewSummary(row: any): string {
  if (!row) return "No resident review summary available.";
  const summary =
    row.google_review_summary ||
    row.googleReviewSummary ||
    row.reviewSummary ||
    row.residentSummary;

  if (summary && typeof summary === "string" && summary.trim() !== "") {
    return summary.trim();
  }

  const rating = row.google_rating ?? row.googleRating;
  if (rating != null && Number(rating) > 0) {
    return `Consolidated resident feedback reflects a ${rating} ★ rating across construction craftsmanship, layout efficiency, and clubhouse amenities.`;
  }

  return "Verified project profile with active buyer sentiment tracking.";
}

export interface TimelineReliabilityResult {
  variance: number | null;
  ratioDisplay: string;
  statusDisplay: string;
  fullDisplay: string;
}

export function parseDateToTime(dateStr: any): number | null {
  if (!dateStr) return null;
  const str = String(dateStr).trim();
  if (
    !str ||
    str.toLowerCase() === "n/a" ||
    str.toLowerCase() === "tbd" ||
    str.toLowerCase() === "null" ||
    str.toLowerCase() === "undefined"
  ) {
    return null;
  }

  const parsed = Date.parse(str);
  if (!isNaN(parsed)) return parsed;

  const yearMatch = str.match(/(\d{4})/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];
    const lower = str.toLowerCase();
    let monthIndex = 0;
    for (let i = 0; i < months.length; i++) {
      if (lower.includes(months[i])) {
        monthIndex = i;
        break;
      }
    }
    return new Date(year, monthIndex, 1).getTime();
  }
  return null;
}

/**
 * Calculates Timeline Reliability using the client's documented formula:
 * timeline_reliability = construction_progress / ((TODAY() - start_date) / (possession_date - start_date))
 *
 * Client spec: "Number between 0 to 100"
 *
 * This divides construction_progress (0–100) by time_fraction (0–1),
 * producing a number in the 0–100+ range.
 * When a project is on track, timeline_reliability ≈ construction_progress.
 */
export function calculateTimelineReliability(
  rawRatioOrVariance: any,
  progressVal: any,
  startDateStr?: any,
  posDateStr?: any
): TimelineReliabilityResult {
  // 1. If explicit ratio or ratio string is passed in raw data (e.g. "67", "67 (Behind)", "113 (Ahead)", 98, "On Track")
  if (
    rawRatioOrVariance != null &&
    rawRatioOrVariance !== "" &&
    rawRatioOrVariance !== "N/A"
  ) {
    if (typeof rawRatioOrVariance === "string") {
      const trimmed = rawRatioOrVariance.trim();
      if (trimmed.includes("(") && trimmed.includes(")")) {
        const parts = trimmed.split("(");
        const ratioPart = parts[0].trim();
        const statusPart = parts[1].replace(")", "").trim();
        const parsedRatio = parseFloat(ratioPart);
        const status = statusPart.toLowerCase().includes("behind")
          ? "Behind Schedule"
          : statusPart.toLowerCase().includes("ahead")
          ? "Ahead of Schedule"
          : "On Track";
        return {
          variance: Number.isFinite(parsedRatio) ? parsedRatio : 100,
          ratioDisplay: Number.isFinite(parsedRatio) ? String(Math.round(parsedRatio)) : ratioPart,
          statusDisplay: status,
          fullDisplay: `${Number.isFinite(parsedRatio) ? String(Math.round(parsedRatio)) : ratioPart} (${status})`,
        };
      }
      if (
        trimmed.toLowerCase() === "on track" ||
        trimmed.toLowerCase() === "ahead" ||
        trimmed.toLowerCase() === "behind"
      ) {
        const status =
          trimmed.toLowerCase() === "ahead"
            ? "Ahead of Schedule"
            : trimmed.toLowerCase() === "behind"
            ? "Behind Schedule"
            : "On Track";
        return {
          variance: 100,
          ratioDisplay: "100",
          statusDisplay: status,
          fullDisplay: `100 (${status})`,
        };
      }
      const parsed = parseFloat(trimmed);
      if (Number.isFinite(parsed)) {
        return formatTimelineReliability(parsed, parsed);
      }
    } else if (
      typeof rawRatioOrVariance === "number" &&
      Number.isFinite(rawRatioOrVariance)
    ) {
      return formatTimelineReliability(rawRatioOrVariance, rawRatioOrVariance);
    }
  }

  // 2. Compute via documented formula:
  const progressNum =
    typeof progressVal === "number"
      ? progressVal
      : parseFiniteNumber(progressVal) ?? 0;

  const startTime = parseDateToTime(startDateStr);
  const posTime = parseDateToTime(posDateStr);
  const nowTime = Date.now();

  if (startTime && posTime && posTime > startTime) {
    const totalDuration = posTime - startTime;
    const elapsedDuration = nowTime - startTime;

    // If project has not started yet or is pre-launch
    if (elapsedDuration <= 0) {
      return {
        variance: 0,
        ratioDisplay: "0",
        statusDisplay: "Pre-Launch",
        fullDisplay: "0 (Pre-Launch)",
      };
    }

    const progressPercent =
      progressNum <= 1 && progressNum > 0 ? progressNum * 100 : progressNum;

    // Client formula: construction_progress / ((TODAY() - start_date) / (possession_date - start_date))
    // = progressPercent / timeFraction, where timeFraction is 0–1
    const timeFraction = Math.min(1.0, Math.max(0.001, elapsedDuration / totalDuration));
    const timelineReliability = progressPercent / timeFraction;

    // If progress is 0% but start date was recent (under 10% elapsed)
    if (progressPercent === 0 && timeFraction <= 0.10) {
      return {
        variance: 0,
        ratioDisplay: "0",
        statusDisplay: "Pre-Launch",
        fullDisplay: "0 (Pre-Launch)",
      };
    }

    return formatTimelineReliability(timelineReliability, progressPercent);
  }

  // 3. Fallback when insufficient dates are present — use progress as timeline_reliability
  if (Number.isFinite(progressNum) && progressNum > 0) {
    return formatTimelineReliability(progressNum, progressNum);
  }

  return {
    variance: 0,
    ratioDisplay: "0",
    statusDisplay: "Data Insufficient",
    fullDisplay: "0 (Data Insufficient)",
  };
}

/**
 * Formats timeline reliability in the client's 0–100 scale.
 * When timeline_reliability ≈ construction_progress, the project is on track.
 * timeline_reliability > construction_progress → ahead of schedule.
 * timeline_reliability < construction_progress → behind schedule (time elapsed faster than progress).
 */
function formatTimelineReliability(timelineReliability: number, progressPercent: number): TimelineReliabilityResult {
  const rounded = Math.round(timelineReliability * 100) / 100;
  
  // If ratio is negative or progress is 0, handle pre-launch state cleanly
  if (rounded < 0 || (progressPercent === 0 && rounded <= 0)) {
    return {
      variance: 0,
      ratioDisplay: "0",
      statusDisplay: "Pre-Launch",
      fullDisplay: "0 (Pre-Launch)",
    };
  }

  const displayVal = Math.max(0, Math.round(rounded));

  let status = "On Track";
  // Determine status based on the 0-100+ scale
  // If ratio >= 110 -> Ahead
  // If ratio 90-110 -> On Track
  // If ratio < 90 -> Behind
  if (rounded >= 110) {
    status = "Ahead of Schedule";
  } else if (rounded < 90 && progressPercent > 0) {
    status = "Behind Schedule";
  } else {
    status = "On Track";
  }

  return {
    variance: displayVal,
    ratioDisplay: String(displayVal),
    statusDisplay: status,
    fullDisplay: `${displayVal} (${status})`,
  };
}

export function formatUnitTypes(types: any): string {
  if (!types) return "Not specified";
  if (Array.isArray(types)) {
    const valid = types.filter(
      (t) =>
        t &&
        String(t).trim() !== "" &&
        String(t).trim().toLowerCase() !== "undefined" &&
        String(t).trim().toLowerCase() !== "null"
    );
    return valid.length > 0 ? valid.join(", ") : "Not specified";
  }
  const str = String(types).trim();
  if (
    str === "" ||
    str.toLowerCase() === "undefined" ||
    str.toLowerCase() === "null"
  ) {
    return "Not specified";
  }
  return str;
}

export function formatUnitTypesArray(types: any): string[] {
  if (!types) return ["Not specified"];
  if (Array.isArray(types)) {
    const valid = types
      .map((t) => String(t).trim())
      .filter(
        (t) =>
          t !== "" &&
          t.toLowerCase() !== "undefined" &&
          t.toLowerCase() !== "null"
      );
    return valid.length > 0 ? valid : ["Not specified"];
  }
  if (typeof types === "string") {
    const parts = types
      .split(/[,/|]+/)
      .map((s) => s.trim())
      .filter(
        (s) =>
          s !== "" &&
          s.toLowerCase() !== "undefined" &&
          s.toLowerCase() !== "null"
      );
    return parts.length > 0 ? parts : ["Not specified"];
  }
  return ["Not specified"];
}

export function formatPriceLakhs(lakhs: number): string {
  if (!lakhs || !Number.isFinite(lakhs)) return "N/A";
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return `₹${cr.toFixed(2)} Cr`;
  }
  return `₹${lakhs.toFixed(1)} Lakhs`;
}

function calculateYearsToPossession(
  possessionDateStr: string | null | undefined
): string {
  if (!possessionDateStr) return "N/A";
  try {
    const targetDate = new Date(
      possessionDateStr.includes("-")
        ? possessionDateStr
        : Date.parse(possessionDateStr)
    );
    if (isNaN(targetDate.getTime())) {
      const match = possessionDateStr.match(/(\d{4})/);
      if (match) {
        const targetYear = parseInt(match[1], 10);
        const currentYear = new Date().getFullYear();
        const diff = Math.max(0, targetYear - currentYear);
        return diff > 0 ? `${diff} Years` : "Ready / Immediate";
      }
      return possessionDateStr;
    }
    const now = new Date();
    const diffMonths =
      (targetDate.getFullYear() - now.getFullYear()) * 12 +
      (targetDate.getMonth() - now.getMonth());
    if (diffMonths <= 0) return "Ready / Immediate";
    const years = (diffMonths / 12).toFixed(1);
    return `${years} Years`;
  } catch {
    return "N/A";
  }
}

export function mapToWhitelistedProjectCard(row: any): WhitelistedProjectCard {
  if (!row) {
    return {
      id: "",
      projectName: "Unknown Project",
      builderName: "Unknown Builder",
      locality: "Bangalore",
      taluk: "N/A",
      area: "Bangalore",
      reraStatus: "RERA Pending",
      priceRange: "Price on Request",
      pricePerSqft: "N/A",
      unitTypes: ["Not specified"],
      possessionDate: "TBD",
      constructionProgress: 0,
      landArea: "N/A",
      totalUnits: "N/A",
      commuteScore: 8.5,
      builderGrade: "Unrated",
      builderGradeDisplay: "Unrated",
      googleRating: 4.2,
      heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600",
      rank: 1,
    };
  }

  let minLakhs = Number(row.min_price_lakhs ?? row.minPriceLakhs ?? 0);
  if (!minLakhs && (row.min_price || row.minPrice)) {
    const rawVal = Number(row.min_price || row.minPrice);
    minLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  let maxLakhs = Number(row.max_price_lakhs ?? row.maxPriceLakhs ?? 0);
  if (!maxLakhs && (row.max_price || row.maxPrice)) {
    const rawVal = Number(row.max_price || row.maxPrice);
    maxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  if (!maxLakhs && minLakhs) maxLakhs = minLakhs;

  const minStr = minLakhs > 0 ? formatPriceLakhs(minLakhs) : "";
  const maxStr = maxLakhs > 0 ? formatPriceLakhs(maxLakhs) : "";
  const priceRangeStr =
    row.price_range ||
    row.priceRange ||
    row.price ||
    (minLakhs > 0
      ? minStr === maxStr
        ? minStr
        : `${minStr} - ${maxStr}`
      : "Price on Request");

  const pricePerSqftVal = Number(row.price_per_sqft || row.pricePerSqft || 0);
  const pricePerSqftStr =
    pricePerSqftVal > 0
      ? `₹${pricePerSqftVal.toLocaleString("en-IN")}/sqft`
      : typeof row.pricePerSqft === "string"
      ? row.pricePerSqft
      : "N/A";

  const totalUnitsNum = Number(row.total_units || row.totalUnits || 0);
  const totalUnitsStr =
    totalUnitsNum > 0
      ? `${totalUnitsNum.toLocaleString("en-IN")} Units`
      : row.totalUnits
      ? String(row.totalUnits)
      : "N/A";

  const rawCommute = row.commute_score ?? row.commuteScore;
  const commute10 =
    rawCommute != null
      ? Math.min(
          10,
          Math.max(
            0,
            Math.round(
              (Number(rawCommute) > 10
                ? Number(rawCommute) / 10
                : Number(rawCommute)) * 10
            ) / 10
          )
        )
      : 8.8;

  const reraNum = row.rera_number || row.reraNumber || "RERA Pending";
  const builderStr =
    row.builder_name ||
    row.builderName ||
    row.developer ||
    row.builder ||
    "Promoter Verified";

  const locationInfo = resolveTalukAndArea(row);
  const progressVal =
    row.construction_progress ?? row.constructionProgress ?? row.progress ?? 0;
  const posDate =
    row.possession_date || row.possessionDate || row.possession || "TBD";

  const landAreaInfo = formatLandArea(
    row.land_area_acres ?? row.landAreaAcres ?? row.totalAcres ?? row.land_area,
    row.land_area_sqm ?? row.landAreaSqm
  );

  const unitTypesArr = formatUnitTypesArray(
    row.unit_types ?? row.unitTypes ?? row.configurations
  );
  const heroImg =
    row.hero_image ||
    row.heroImage ||
    row.image ||
    (Array.isArray(row.images) && row.images[0]) ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600";

  const builderGrade = resolveBuilderGrade(row);

  return {
    id: String(row.id || ""),
    projectName: row.name || row.projectName || "Project",
    builderName: builderStr,
    locality: locationInfo.locality,
    taluk: locationInfo.taluk,
    area: locationInfo.areaDisplay,
    reraStatus: reraNum,
    priceRange: priceRangeStr,
    pricePerSqft: pricePerSqftStr,
    unitTypes: unitTypesArr,
    possessionDate: posDate,
    constructionProgress: Number(progressVal) <= 1 && Number(progressVal) > 0 ? Number(progressVal) * 100 : Number(progressVal),
    landArea: landAreaInfo.acresDisplay,
    totalUnits: totalUnitsStr,
    commuteScore: commute10,
    builderGrade,
    builderGradeDisplay: formatBuilderGradeDisplay(builderGrade),
    googleRating:
      row.google_rating != null || row.googleRating != null
        ? Number(row.google_rating ?? row.googleRating)
        : 4.2,
    heroImage: heroImg,
    rank: row.rank || 1,
  };
}

export function mapToWhitelistedProjectOverview(
  row: any
): WhitelistedProjectOverview {
  if (!row) {
    return {
      id: "",
      projectName: "Unknown Project",
      reraNumber: "RERA Pending",
      builderName: "Unknown Builder",
      locality: "Bangalore",
      taluk: "N/A",
      area: "Bangalore",
      projectStartDate: "N/A",
      possessionDate: "TBD",
      constructionProgress: 0,
      totalUnits: "N/A",
      landAreaAcres: "N/A",
      landAreaSqm: "N/A",
      yearsToPossession: "TBD",
      timelineReliabilityRatio: "N/A",
      timelineReliabilityStatus: "N/A",
      timelineReliabilityDisplay: "N/A",
      unitTypes: ["Not specified"],
      minPrice: "N/A",
      maxPrice: "N/A",
      pricePerSqft: "N/A",
      unitDensity: "N/A",
      nearestOfficeHub: "IT Hub",
      distanceToHubKm: "N/A",
      commuteScore: 8.5,
      builderGrade: "Unrated",
      builderGradeDisplay: "Unrated",
      googleRating: 4.2,
      googleReviewSummary: "No resident review summary available.",
      verificationTitleAuditNote: "No title audit notes recorded.",
      complaintsCount: 0,
      landLitigationStatus: "100% Clean Title Deed (Zero Litigation)",
      heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    };
  }

  let minLakhs = Number(row.min_price_lakhs ?? row.minPriceLakhs ?? 0);
  if (!minLakhs && (row.min_price || row.minPrice)) {
    const rawVal = Number(row.min_price || row.minPrice);
    minLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  let maxLakhs = Number(row.max_price_lakhs ?? row.maxPriceLakhs ?? 0);
  if (!maxLakhs && (row.max_price || row.maxPrice)) {
    const rawVal = Number(row.max_price || row.maxPrice);
    maxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  if (!maxLakhs && minLakhs) maxLakhs = minLakhs;

  const minStr =
    minLakhs > 0
      ? formatPriceLakhs(minLakhs)
      : row.minPrice || "Price on Request";
  const maxStr =
    maxLakhs > 0
      ? formatPriceLakhs(maxLakhs)
      : row.maxPrice || "Price on Request";

  const pricePerSqftVal = Number(row.price_per_sqft || row.pricePerSqft || 0);
  const pricePerSqftStr =
    pricePerSqftVal > 0
      ? `₹${pricePerSqftVal.toLocaleString("en-IN")}/sqft`
      : typeof row.pricePerSqft === "string"
      ? row.pricePerSqft
      : "N/A";

  const totalUnitsNum = Number(row.total_units || row.totalUnits || 0);
  const totalUnitsVal =
    totalUnitsNum > 0
      ? `${totalUnitsNum.toLocaleString("en-IN")} Units`
      : row.totalUnits
      ? String(row.totalUnits)
      : "N/A";

  const rawCommute = row.commute_score ?? row.commuteScore;
  const commute10 =
    rawCommute != null
      ? Math.min(
          10,
          Math.max(
            0,
            Math.round(
              (Number(rawCommute) > 10
                ? Number(rawCommute) / 10
                : Number(rawCommute)) * 10
            ) / 10
          )
        )
      : 8.8;

  const reraNum = row.rera_number || row.reraNumber || "RERA Pending";
  const builderStr =
    row.builder_name ||
    row.builderName ||
    row.developer ||
    row.builder ||
    "Promoter Verified";

  const locationInfo = resolveTalukAndArea(row);
  const progressVal = Number(
    row.construction_progress ?? row.constructionProgress ?? row.progress ?? 0
  );
  const posDate =
    row.possession_date || row.possessionDate || row.possession || "TBD";
  const startDate = row.project_start_date || row.projectStartDate || null;

  const landAreaInfo = formatLandArea(
    row.land_area_acres ?? row.landAreaAcres ?? row.totalAcres ?? row.land_area,
    row.land_area_sqm ?? row.landAreaSqm
  );

  const unitTypesArr = formatUnitTypesArray(
    row.unit_types ?? row.unitTypes ?? row.configurations
  );
  const heroImg =
    row.hero_image ||
    row.heroImage ||
    row.image ||
    (Array.isArray(row.images) && row.images[0]) ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800";

  const imagesArr =
    Array.isArray(row.images) && row.images.length > 0
      ? row.images
      : [heroImg];

  const complaintsCountVal =
    row.complaints_count != null
      ? Number(row.complaints_count)
      : row.activeComplaintsNum != null
      ? Number(row.activeComplaintsNum)
      : row.complaints != null
      ? Number(row.complaints)
      : 0;

  const hasLitigation = Boolean(
    row.land_litigation === true ||
      row.land_litigation === "true" ||
      row.litigation === true ||
      (typeof row.land_litigation === "string" &&
        row.land_litigation.toLowerCase().includes("active")) ||
      (Array.isArray(row.cons) &&
        row.cons.some((c: string) =>
          typeof c === "string" && c.toLowerCase().includes("litigation")
        ))
  );

  const litigationStatus = hasLitigation
    ? "⚠️ Active Litigation Under Review"
    : row.landLitigationStatus || "100% Clean Title Deed (Zero Litigation)";

  const yearsToPoss = calculateYearsToPossession(posDate);

  const timelineRel = calculateTimelineReliability(
    row.timeline_reliability_ratio ?? row.timelineReliabilityRatio,
    progressVal,
    startDate,
    posDate
  );

  const densityInfo = calculateUnitDensity(
    row.total_units ?? row.totalUnits,
    landAreaInfo.acresNum,
    row.unit_density_per_acre ?? row.densityText
  );

  const hubInfo = resolveDistanceToHub(row);
  const builderGrade = resolveBuilderGrade(row);
  const titleAuditNote = resolveTitleAuditNote(row);
  const reviewSummary = resolveGoogleReviewSummary(row);

  // Normalize numeric pricing
  let normMinLakhs = Number(row.min_price_lakhs ?? row.minPriceLakhs ?? 0);
  if (!normMinLakhs && (row.min_price || row.minPrice)) {
    const rawVal = Number(row.min_price || row.minPrice);
    normMinLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  let normMaxLakhs = Number(row.max_price_lakhs ?? row.maxPriceLakhs ?? 0);
  if (!normMaxLakhs && (row.max_price || row.maxPrice)) {
    const rawVal = Number(row.max_price || row.maxPrice);
    normMaxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  if (!normMaxLakhs && normMinLakhs) normMaxLakhs = normMinLakhs;
  
  const priceStatus: "Available" | "On Request" = (normMinLakhs > 0) ? "Available" : "On Request";
  
  const pricePerSqftNum = (row.price_per_sqft || row.pricePerSqft) ? 
    (typeof (row.price_per_sqft || row.pricePerSqft) === "number" ? 
       (row.price_per_sqft || row.pricePerSqft) : 
       Number(String(row.price_per_sqft || row.pricePerSqft).replace(/[^0-9.]/g, ""))) : null;

  return {
    id: String(row.id || ""),
    projectName: row.name || row.projectName || "Project",
    reraNumber: reraNum,
    builderName: builderStr,
    locality: locationInfo.locality,
    taluk: locationInfo.taluk,
    area: locationInfo.areaDisplay,
    projectStartDate: startDate || "N/A",
    possessionDate: posDate,
    constructionProgress: Number(progressVal) <= 1 && Number(progressVal) > 0 ? Number(progressVal) * 100 : Number(progressVal),
    totalUnits: totalUnitsVal,
    landAreaAcres: landAreaInfo.acresDisplay,
    landAreaSqm: landAreaInfo.sqmDisplay,
    yearsToPossession: yearsToPoss,
    timelineReliabilityRatio: timelineRel.ratioDisplay,
    timelineReliabilityStatus: timelineRel.statusDisplay,
    timelineReliabilityDisplay: timelineRel.fullDisplay,
    unitTypes: unitTypesArr,
    minPrice: minStr,
    maxPrice: maxStr,
    pricePerSqft: pricePerSqftStr,
    unitDensity: densityInfo.densityDisplay,
    nearestOfficeHub: hubInfo.hubName,
    distanceToHubKm: hubInfo.distanceDisplay,
    commuteScore: commute10,
    builderGrade,
    builderGradeDisplay: formatBuilderGradeDisplay(builderGrade),
    googleRating:
      row.google_rating != null || row.googleRating != null
        ? Number(row.google_rating ?? row.googleRating)
        : 4.2,
    googleReviewSummary: reviewSummary,
    verificationTitleAuditNote: titleAuditNote,
    complaintsCount: complaintsCountVal,
    landLitigationStatus: litigationStatus,
    heroImage: heroImg,
    images: imagesArr,
    minPriceLakhs: normMinLakhs > 0 ? normMinLakhs : null,
    maxPriceLakhs: normMaxLakhs > 0 ? normMaxLakhs : null,
    pricePerSqftNum: pricePerSqftNum && !isNaN(pricePerSqftNum) && pricePerSqftNum > 0 ? pricePerSqftNum : null,
    priceStatus,
  };
}

export function mapToSupabasePayload(fullProp: any): Record<string, any> {
  const nameStr =
    fullProp.name ||
    fullProp.propertyName ||
    fullProp.title ||
    "Untitled Project";
  const statusVal =
    fullProp.status === "archived"
      ? "archived"
      : fullProp.status === "draft"
      ? "draft"
      : "published";

  let minLakhs = Number(fullProp.minPriceLakhs ?? 0);
  if (!minLakhs && fullProp.minPrice) {
    const raw = Number(fullProp.minPrice);
    minLakhs = raw > 10000 ? raw / 100000 : raw;
  }
  let maxLakhs = Number(fullProp.maxPriceLakhs ?? 0);
  if (!maxLakhs && fullProp.maxPrice) {
    const raw = Number(fullProp.maxPrice);
    maxLakhs = raw > 10000 ? raw / 100000 : raw;
  }

  const pricePerSqFtNum = fullProp.pricePerSqft
    ? typeof fullProp.pricePerSqft === "number"
      ? fullProp.pricePerSqft
      : Number(String(fullProp.pricePerSqft).replace(/[^0-9.]/g, ""))
    : null;

  const totalUnitsNum = fullProp.totalUnits
    ? typeof fullProp.totalUnits === "number"
      ? fullProp.totalUnits
      : Number(String(fullProp.totalUnits).replace(/[^0-9]/g, ""))
    : null;

  const priceRangeVal =
    fullProp.priceRange ||
    fullProp.price ||
    (minLakhs > 0
      ? minLakhs === maxLakhs
        ? formatPriceLakhs(minLakhs)
        : `${formatPriceLakhs(minLakhs)} - ${formatPriceLakhs(maxLakhs)}`
      : null);

  const amenitiesArr = Array.isArray(fullProp.amenities)
    ? fullProp.amenities
    : [];
  const prosArr = Array.isArray(fullProp.pros) ? fullProp.pros : [];
  const consArr = Array.isArray(fullProp.cons) ? fullProp.cons : [];

  const locStr =
    fullProp.location ||
    fullProp.locality ||
    (fullProp.landmark
      ? `${fullProp.landmark}, ${fullProp.locality || ""}`
      : null) ||
    fullProp.city ||
    null;

  const payload: Record<string, any> = {
    name: nameStr,
    rera_number: fullProp.reraNumber || fullProp.rera_number || null,
    builder_id: fullProp.builderId || fullProp.builder_id || null,
    city: fullProp.city || null,
    taluk: fullProp.taluk || fullProp.taluk_name || null,
    location: locStr,
    status: statusVal,
    project_start_date: fullProp.projectStartDate || fullProp.project_start_date || null,
    possession_date: fullProp.possessionDate || fullProp.possession_date || null,
    construction_progress:
      fullProp.completionPercentage != null ||
      fullProp.constructionProgress != null
        ? Number(fullProp.completionPercentage ?? fullProp.constructionProgress)
        : null,
    min_price_lakhs: minLakhs > 0 ? minLakhs : null,
    max_price_lakhs: maxLakhs > 0 ? maxLakhs : null,
    price_per_sqft: pricePerSqFtNum > 0 ? pricePerSqFtNum : null,
    price_range: priceRangeVal,
    total_units: totalUnitsNum > 0 ? totalUnitsNum : null,
    commute_score:
      fullProp.commuteScore != null ? Number(fullProp.commuteScore) : null,
    builder_grade: fullProp.builderGrade || null,
    google_rating: fullProp.googleRating ? Number(fullProp.googleRating) : null,
    reviews_count: fullProp.reviewsCount ? Number(fullProp.reviewsCount) : null,
    complaints_count:
      fullProp.complaintsCount != null
        ? Number(fullProp.complaintsCount)
        : null,
    cribr_score:
      fullProp.score != null || fullProp.cribrScore != null
        ? Number(fullProp.score ?? fullProp.cribrScore)
        : null,
    ai_verdict: fullProp.aiVerdict || fullProp.ai_verdict || null,
    verification_title_audit_note:
      fullProp.verificationTitleAuditNote ||
      fullProp.verification_title_audit_note ||
      null,
    google_review_summary:
      fullProp.googleReviewSummary || fullProp.google_review_summary || null,
    amenities: amenitiesArr,
    pros: prosArr,
    cons: consArr,
  };

  return payload;
}

export const mapFormToSupabaseProject = mapToSupabasePayload;

export function mapToWhitelistedProject(p: any): WhitelistedProject {
  if (!p) {
    return {
      id: "",
      projectName: "Unknown Project",
      builder: "Promoter Verified",
      locality: "Bangalore",
      taluk: "N/A",
      area: "Bangalore",
      reraNumber: "RERA Pending",
      projectStartDate: "N/A",
      possessionDate: "TBD",
      constructionProgress: 0,
      landAreaSqm: "N/A",
      totalUnits: "N/A",
      complaints: "0",
      landLitigation: "100% Clean Title Deed (Zero Litigation)",
      verificationTitleAuditNote: "No title audit notes recorded.",
      unitTypes: "Not specified",
      minPrice: "Price on Request",
      maxPrice: "Price on Request",
      pricePerSqft: "N/A",
      landAreaAcres: "N/A",
      unitDensity: "N/A",
      yearsToPossession: "TBD",
      timelineReliabilityRatio: "N/A",
      timelineReliabilityDisplay: "N/A",
      nearestOfficeHub: "IT Corridor",
      distanceToHub: "N/A",
      commuteScoreDisplay: "8.5/10",
      builderGrade: "Unrated",
      builderGradeDisplay: "Unrated",
      builderReliability: null,
      googleRating: "4.2 ★",
      googleReviewSummary: "No resident review summary available.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
      minPriceLakhs: null,
      maxPriceLakhs: null,
      pricePerSqftNum: null,
      priceStatus: "On Request",
    };
  }

  let minLakhs = Number(p.min_price_lakhs ?? p.minPriceLakhs ?? 0);
  if (!minLakhs && (p.min_price || p.minPrice || p.price_min)) {
    const rawVal = Number(p.min_price || p.minPrice || p.price_min);
    minLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  let maxLakhs = Number(p.max_price_lakhs ?? p.maxPriceLakhs ?? 0);
  if (!maxLakhs && (p.max_price || p.maxPrice || p.price_max)) {
    const rawVal = Number(p.max_price || p.maxPrice || p.price_max);
    maxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  if (!maxLakhs && minLakhs) maxLakhs = minLakhs;

  const pricePerSqftVal = Number(p.price_per_sqft || p.pricePerSqft || p.price_per_sft || 0);
  const pricePerSqftStr =
    pricePerSqftVal > 0
      ? `₹${pricePerSqftVal.toLocaleString("en-IN")} / sq ft`
      : typeof p.pricePerSqft === "string"
      ? p.pricePerSqft
      : "N/A";

  const totalUnitsNum = Number(p.total_units || p.totalUnits || 0);
  const totalUnitsVal =
    totalUnitsNum > 0
      ? `${totalUnitsNum.toLocaleString("en-IN")} Units`
      : p.totalUnits
      ? String(p.totalUnits)
      : "N/A";

  let ratingVal = p.google_rating != null ? p.google_rating : (p.googleRating != null ? p.googleRating : (p.google_reviews_score != null ? p.google_reviews_score : null));
  let ratingStr = ratingVal != null ? String(ratingVal) : "N/A";
  if (ratingStr !== "N/A" && !ratingStr.includes("★")) {
    ratingStr = `${ratingStr} ★`;
  }

  const builderStr =
    p.builder_name ||
    p.builderName ||
    p.developer ||
    p.builder ||
    "Promoter Verified";

  const locationInfo = resolveTalukAndArea(p);

  const rawCommute = p.commute_score != null ? p.commute_score : (p.commuteScore != null ? p.commuteScore : null);
  const commuteStr =
    rawCommute != null
      ? `${Math.round((Number(rawCommute) <= 1 ? Number(rawCommute) * 10 : (Number(rawCommute) > 10 ? Number(rawCommute) / 10 : Number(rawCommute))) * 10) / 10}/10`
      : "N/A";

  const heroImg =
    p.hero_image ||
    p.heroImage ||
    p.image ||
    (Array.isArray(p.images) && p.images[0]) ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800";

  const landAreaInfo = formatLandArea(
    p.land_area_acres ?? p.landAreaAcres ?? p.totalAcres ?? p.land_area,
    p.land_area_sqm ?? p.landAreaSqm
  );

  const unitTypesStr = formatUnitTypes(
    p.unit_types ?? p.unitTypes ?? p.configurations
  );

  const complaintsStr =
    p.complaints_count != null
      ? String(p.complaints_count)
      : p.complaints_on_project != null
      ? String(p.complaints_on_project)
      : p.complaintsCount != null
      ? String(p.complaintsCount)
      : p.activeComplaintsNum != null
      ? String(p.activeComplaintsNum)
      : p.complaints != null
      ? String(p.complaints)
      : "0";

  const hasLitigation = Boolean(
    p.land_litigation === true ||
      p.land_litigation === "true" ||
      p.land_litigations > 0 ||
      p.land_litigations === "1" ||
      p.litigation === true ||
      (typeof p.land_litigation === "string" &&
        p.land_litigation.toLowerCase().includes("active")) ||
      (Array.isArray(p.cons) &&
        p.cons.some((c: string) =>
          typeof c === "string" && c.toLowerCase().includes("litigation")
        ))
  );

  const litigationStr = hasLitigation
    ? "⚠️ Active Litigation Under Review"
    : p.landLitigationStatus ||
      (p.landLitigation
        ? String(p.landLitigation)
        : "100% Clean Title Deed (Zero Litigation)");

  const progressVal = Number(
    p.construction_progress ?? p.constructionProgress ?? p.progress ?? 0
  );
  const posDate =
    p.possession_date || p.possessionDate || p.possession || "TBD";
  const startDate = p.project_start_date || p.projectStartDate || p.start_date || null;

  const yearsToPoss = calculateYearsToPossession(posDate);

  const timelineRel = calculateTimelineReliability(
    p.timeline_reliability_ratio ?? p.timelineReliabilityRatio ?? p.timeline_reliability,
    progressVal,
    startDate,
    posDate
  );

  const densityInfo = calculateUnitDensity(
    p.total_units ?? p.totalUnits,
    landAreaInfo.acresNum,
    p.unit_density_per_acre ?? p.density ?? p.densityText
  );

  const hubInfo = resolveDistanceToHub(p);
  const builderGrade = resolveBuilderGrade(p);
  const titleAuditNote = p.property_title_summary || p.verification_title_audit_note || resolveTitleAuditNote(p);
  const reviewSummary = p.google_review_summary || resolveGoogleReviewSummary(p);

  const resolvedProjectName = p.name || p.projectName || p.project_name || p.rera_project_name || "Project";
  const cleanId = String(p.id || p.slug || "");

  return {
    id: cleanId,
    name: resolvedProjectName,
    projectName: resolvedProjectName,
    builder: builderStr,
    builder_name: builderStr,
    builderName: builderStr,
    slug: p.slug || cleanId.replace(/^proj-/, ""),
    locality: locationInfo.locality,
    taluk: locationInfo.taluk,
    area: locationInfo.areaDisplay,
    reraNumber: p.rera_number || p.reraNumber || p["RERA registration number"] || p.rera_registration_number || "RERA Pending",
    projectStartDate: startDate || "N/A",
    possessionDate: posDate,
    constructionProgress: Number(progressVal) <= 1 && Number(progressVal) > 0 ? Number(progressVal) * 100 : Number(progressVal),
    landAreaSqm: landAreaInfo.sqmDisplay,
    landAreaAcres: landAreaInfo.acresDisplay,
    totalUnits: totalUnitsVal,
    complaints: complaintsStr,
    landLitigation: litigationStr,
    verificationTitleAuditNote: titleAuditNote,
    unitTypes: unitTypesStr,
    minPrice:
      minLakhs > 0 ? formatPriceLakhs(minLakhs) : p.minPrice || "Price on Request",
    maxPrice:
      maxLakhs > 0 ? formatPriceLakhs(maxLakhs) : p.maxPrice || "Price on Request",
    pricePerSqft: pricePerSqftStr,
    unitDensity: densityInfo.densityDisplay,
    yearsToPossession: yearsToPoss,
    timelineReliabilityRatio: timelineRel.ratioDisplay,
    timelineReliabilityDisplay: timelineRel.fullDisplay,
    nearestOfficeHub: hubInfo.hubName,
    distanceToHub: hubInfo.distanceDisplay,
    commuteScoreDisplay: commuteStr,
    builderGrade,
    builderGradeDisplay: formatBuilderGradeDisplay(builderGrade),
    builderReliability: resolveBuilderReliability(p),
    googleRating: ratingStr,
    googleReviewSummary: reviewSummary,
    minPriceLakhs: minLakhs > 0 ? minLakhs : null,
    maxPriceLakhs: maxLakhs > 0 ? maxLakhs : null,
    pricePerSqftNum: pricePerSqftVal > 0 ? pricePerSqftVal : null,
    priceStatus: (minLakhs > 0 || pricePerSqftVal > 0) ? "Available" : "On Request",
    image: heroImg,
    images:
      Array.isArray(p.images) && p.images.length > 0 ? p.images : [heroImg],
  };
}

/**
 * Normalizes strings by converting to lowercase and stripping non-alphanumeric characters.
 */
export function normalizeAlphanumeric(str: string): string {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Normalizes strings by converting to lowercase, replacing non-alphanumerics with hyphens.
 */
export function normalizeSlug(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Cleans a slug key for robust lookup.
 */
export function cleanSlugKey(key: string): string {
  return (key || "")
    .toLowerCase()
    .replace(/^proj-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Synchronous property lookup against an in-memory/passed list of properties.
 */
export function findMatchingProperty(slugOrId: string, customList?: any[]): any | null {
  if (!slugOrId) return null;

  let decoded = slugOrId;
  try {
    decoded = decodeURIComponent(slugOrId);
  } catch {
    decoded = slugOrId;
  }

  const raw = decoded.toLowerCase().trim();
  const rawClean = cleanSlugKey(raw);
  const normalizedRaw = normalizeSlug(raw);
  const normalizedRawClean = normalizeSlug(rawClean);

  const combined = customList || [];

  const seen = new Set<string>();
  const allProperties: any[] = [];
  for (const p of combined) {
    if (!p) continue;
    const key = String(p.id || p.name || p.projectName || "");
    if (!seen.has(key)) {
      seen.add(key);
      allProperties.push(p);
    }
  }

  // 1. Strict Exact ID Match (with or without 'proj-' prefix)
  for (const p of allProperties) {
    const pId = String(p.id || "").toLowerCase().trim();
    const pIdClean = cleanSlugKey(pId);
    if (pId === raw || pIdClean === rawClean || pId === `proj-${rawClean}`) {
      return p;
    }
  }

  // 2. Strict Exact Slug Match
  for (const p of allProperties) {
    const pSlug = String(p.slug || "").toLowerCase().trim();
    const pSlugClean = cleanSlugKey(pSlug);
    if (pSlug && (pSlug === raw || pSlugClean === rawClean || pSlug === normalizedRawClean)) {
      return p;
    }
  }

  // 3. Strict Exact Normalized Name Slug Match
  for (const p of allProperties) {
    const pName = String(p.name || p.projectName || "").toLowerCase().trim();
    const pNameSlug = normalizeSlug(pName);
    if (pNameSlug === normalizedRaw || pNameSlug === normalizedRawClean) {
      return p;
    }
  }

  // 4. Strict Exact Case-Insensitive Name Match
  for (const p of allProperties) {
    const pName = String(p.name || p.projectName || "").toLowerCase().trim();
    if (pName === raw || pName === decoded.trim().toLowerCase()) {
      return p;
    }
  }

  // 5. Strict Exact RERA Match (if identifier is a RERA number)
  for (const p of allProperties) {
    const pRera = String(p.reraNumber || p.rera_number || "").toLowerCase().trim();
    if (
      pRera &&
      pRera.length > 5 &&
      !pRera.includes("pending") &&
      !pRera.includes("not captured") &&
      (pRera === raw || pRera === decoded.trim().toLowerCase())
    ) {
      return p;
    }
  }

  return null;
}

/**
 * Async lookup with fallback to live database (Supabase / local DB).
 * Uses strict exact matching against Supabase before resolving.
 */
export async function getPropertyAsync(slugOrId: string): Promise<any | null> {
  const syncMatch = findMatchingProperty(slugOrId);
  if (syncMatch) return syncMatch;

  try {
    const { supabase, isRealSupabaseConfigured } = await import("./supabase");
    if (isRealSupabaseConfigured && supabase) {
      const clean = cleanSlugKey(slugOrId);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .or(`id.eq.${slugOrId},id.eq.proj-${clean},name.ilike.${slugOrId},rera_number.eq.${slugOrId}`)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    }

    const { cribrProperties } = await import("./supabase");
    const liveProperties = await cribrProperties.getProperties();
    return findMatchingProperty(slugOrId, liveProperties);
  } catch (err) {
    console.warn("Async property lookup error:", err);
    return null;
  }
}

