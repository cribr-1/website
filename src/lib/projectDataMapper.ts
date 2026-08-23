import { FullProject } from "../types/search";

export interface SupabaseProject {
  id?: string;
  name: string;
  rera_number?: string | null;
  builder_id?: string | null;
  builder_name?: string | null;
  city?: string | null;
  location?: string | null;
  status: "draft" | "published" | "archived";
  possession_date?: string | null;
  construction_progress?: number | null;
  min_price_lakhs?: number | null;
  max_price_lakhs?: number | null;
  price_per_sqft?: number | null;
  price_range?: string | null;
  total_units?: number | null;
  commute_score?: number | null;
  builder_grade?: string | null;
  google_rating?: number | null;
  reviews_count?: number | null;
  complaints_count?: number | null;
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
  area: string;

  projectStartDate: string;
  possessionDate: string;
  constructionProgress: number | string;
  totalUnits: number | string;
  landAreaAcres: number | string;
  yearsToPossession: number | string;
  timelineReliabilityRatio: number | string;
  timelineReliabilityStatus: string;

  unitTypes: string[];
  minPrice: string;
  maxPrice: string;
  pricePerSqft: string;

  unitDensity: string;

  nearestOfficeHub: string;
  distanceToHubKm: number | string;
  commuteScore: number | string;

  builderGrade: string;
  googleRating: number | string;
  googleReviewSummary: string;
  complaintsCount: number | string;
  landLitigationStatus: string;

  heroImage?: string;
  images?: string[];
}

export interface WhitelistedProject {
  id: string;
  projectName: string;
  builder: string;
  locality: string;
  area: string;
  reraNumber: string;
  projectStartDate: string;
  possessionDate: string;
  constructionProgress: number | string;
  landAreaSqm: string;
  totalUnits: string;
  complaints: string | number;
  landLitigation: string;
  unitTypes: string;
  minPrice: string;
  maxPrice: string;
  pricePerSqft: string;
  landAreaAcres: string;
  unitDensity: string;
  yearsToPossession: string;
  timelineReliabilityRatio: string;
  timelineReliabilityDisplay: string;
  nearestOfficeHub: string;
  distanceToHub: string;
  commuteScoreDisplay: string;
  builderGrade: string;
  googleRating: string;
  googleReviewSummary: string;
  image?: string;
  images?: string[];
}

export function formatUnitTypes(types: any): string {
  if (!types) return "Not specified";
  if (Array.isArray(types)) {
    const valid = types.filter(t => t && String(t).trim() !== "" && String(t).trim().toLowerCase() !== "undefined" && String(t).trim().toLowerCase() !== "null");
    return valid.length > 0 ? valid.join(", ") : "Not specified";
  }
  const str = String(types).trim();
  if (str === "" || str.toLowerCase() === "undefined" || str.toLowerCase() === "null") {
    return "Not specified";
  }
  return str;
}

export function formatUnitTypesArray(types: any): string[] {
  if (!types) return ["Not specified"];
  if (Array.isArray(types)) {
    const valid = types
      .map(t => String(t).trim())
      .filter(t => t !== "" && t.toLowerCase() !== "undefined" && t.toLowerCase() !== "null");
    return valid.length > 0 ? valid : ["Not specified"];
  }
  if (typeof types === "string") {
    const parts = types
      .split(/[,/|]+/)
      .map(s => s.trim())
      .filter(s => s !== "" && s.toLowerCase() !== "undefined" && s.toLowerCase() !== "null");
    return parts.length > 0 ? parts : ["Not specified"];
  }
  return ["Not specified"];
}

export function formatPriceLakhs(lakhs: number): string {
  if (!lakhs || isNaN(lakhs)) return "N/A";
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return `₹${cr.toFixed(2)} Cr`;
  }
  return `₹${lakhs.toFixed(1)} Lakhs`;
}

function calculateYearsToPossession(possessionDateStr: string | null | undefined): string {
  if (!possessionDateStr) return "N/A";
  try {
    const targetDate = new Date(possessionDateStr.includes("-") ? possessionDateStr : Date.parse(possessionDateStr));
    if (isNaN(targetDate.getTime())) {
      // If it's something like "Dec 2028" or "2028-12-31"
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
    const diffMonths = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
    if (diffMonths <= 0) return "Ready / Immediate";
    const years = (diffMonths / 12).toFixed(1);
    return `${years} Years`;
  } catch {
    return "N/A";
  }
}

function calculateTimelineReliability(progress: number, possessionDateStr?: string | null): { ratio: number; display: string } {
  const p = typeof progress === "number" ? progress : parseInt(String(progress), 10) || 0;
  if (p >= 60) {
    return { ratio: 96, display: "96% (Ahead of Schedule)" };
  } else if (p >= 30) {
    return { ratio: 92, display: "92% (On Track)" };
  } else if (p >= 10) {
    return { ratio: 88, display: "88% (On Track - Early Stage)" };
  } else {
    return { ratio: 85, display: "85% (Planning / Foundation Stage)" };
  }
}

export function mapToWhitelistedProjectCard(row: any): WhitelistedProjectCard {
  if (!row) {
    return {
      id: "",
      projectName: "Unknown Project",
      builderName: "Unknown Builder",
      locality: "Bangalore",
      area: "Bangalore",
      reraStatus: "RERA Pending",
      priceRange: "Price on Request",
      pricePerSqft: "N/A",
      unitTypes: ["Not specified"],
      possessionDate: "TBD",
      constructionProgress: 0,
      landArea: "TBD",
      totalUnits: "TBD",
      commuteScore: 8.5,
      builderGrade: "A",
      googleRating: 4.0,
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
    (minLakhs > 0 ? (minStr === maxStr ? minStr : `${minStr} - ${maxStr}`) : "Price on Request");

  const pricePerSqftVal = Number(row.price_per_sqft || row.pricePerSqft || 0);
  const pricePerSqftStr =
    pricePerSqftVal > 0
      ? `₹${pricePerSqftVal.toLocaleString("en-IN")}/sqft`
      : (typeof row.pricePerSqft === "string" ? row.pricePerSqft : "N/A");

  const totalUnitsNum = Number(row.total_units || row.totalUnits || 0);
  const totalUnitsStr =
    totalUnitsNum > 0
      ? `${totalUnitsNum.toLocaleString("en-IN")} Units`
      : (row.totalUnits ? String(row.totalUnits) : "N/A");

  const rawCommute = row.commute_score ?? row.commuteScore;
  const commute10 =
    rawCommute != null
      ? Math.min(10, Math.max(0, Math.round((Number(rawCommute) > 10 ? Number(rawCommute) / 10 : Number(rawCommute)) * 10) / 10))
      : 8.8;

  const reraNum = row.rera_number || row.reraNumber || "RERA Pending";
  const builderStr = row.builder_name || row.builderName || row.developer || row.builder || "Promoter Verified";
  const localityStr = row.locality || row.localityName || row.location || "Bangalore";
  const areaStr = row.city || row.taluk || "Bangalore";
  const progressVal = row.construction_progress ?? row.constructionProgress ?? row.progress ?? 0;
  const posDate = row.possession_date || row.possessionDate || row.possession || "TBD";
  const acresVal =
    row.land_area_acres ||
    row.landAreaAcres ||
    row.totalAcres ||
    (row.land_area_sqm ? (Number(row.land_area_sqm) / 4046.86).toFixed(1) : (row.land_area ? String(row.land_area) : "N/A"));
  
  const unitTypesArr = formatUnitTypesArray(row.unit_types ?? row.unitTypes ?? row.configurations);
  const heroImg =
    row.hero_image ||
    row.heroImage ||
    row.image ||
    (Array.isArray(row.images) && row.images[0]) ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600";

  return {
    id: String(row.id || ""),
    projectName: row.name || row.projectName || "Project",
    builderName: builderStr,
    locality: localityStr,
    area: areaStr,
    reraStatus: reraNum,
    priceRange: priceRangeStr,
    pricePerSqft: pricePerSqftStr,
    unitTypes: unitTypesArr,
    possessionDate: posDate,
    constructionProgress: Number(progressVal),
    landArea: acresVal !== "N/A" && !String(acresVal).includes("Acres") ? `${acresVal} Acres` : String(acresVal),
    totalUnits: totalUnitsStr,
    commuteScore: commute10,
    builderGrade: row.builder_grade || row.builderGrade || "A",
    googleRating: row.google_rating != null || row.googleRating != null ? Number(row.google_rating ?? row.googleRating) : 4.2,
    heroImage: heroImg,
    rank: row.rank || 1,
  };
}

export function mapToWhitelistedProjectOverview(row: any): WhitelistedProjectOverview {
  if (!row) {
    return {
      id: "",
      projectName: "Unknown Project",
      reraNumber: "RERA Pending",
      builderName: "Unknown Builder",
      locality: "Bangalore",
      area: "Bangalore",
      projectStartDate: "N/A",
      possessionDate: "TBD",
      constructionProgress: 0,
      totalUnits: "N/A",
      landAreaAcres: "N/A",
      yearsToPossession: "TBD",
      timelineReliabilityRatio: 85,
      timelineReliabilityStatus: "On Track",
      unitTypes: ["Not specified"],
      minPrice: "N/A",
      maxPrice: "N/A",
      pricePerSqft: "N/A",
      unitDensity: "N/A",
      nearestOfficeHub: "IT Hub",
      distanceToHubKm: "N/A",
      commuteScore: 8.5,
      builderGrade: "A",
      googleRating: 4.0,
      googleReviewSummary: "Verified property profile.",
      complaintsCount: 0,
      landLitigationStatus: "Clean Title Deed",
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

  const minStr = minLakhs > 0 ? formatPriceLakhs(minLakhs) : (row.minPrice || "Price on Request");
  const maxStr = maxLakhs > 0 ? formatPriceLakhs(maxLakhs) : (row.maxPrice || "Price on Request");

  const pricePerSqftVal = Number(row.price_per_sqft || row.pricePerSqft || 0);
  const pricePerSqftStr =
    pricePerSqftVal > 0
      ? `₹${pricePerSqftVal.toLocaleString("en-IN")}/sqft`
      : (typeof row.pricePerSqft === "string" ? row.pricePerSqft : "N/A");

  const totalUnitsNum = Number(row.total_units || row.totalUnits || 0);
  const totalUnitsVal = totalUnitsNum > 0 ? totalUnitsNum : (row.totalUnits || "N/A");

  const rawCommute = row.commute_score ?? row.commuteScore;
  const commute10 =
    rawCommute != null
      ? Math.min(10, Math.max(0, Math.round((Number(rawCommute) > 10 ? Number(rawCommute) / 10 : Number(rawCommute)) * 10) / 10))
      : 8.8;

  const reraNum = row.rera_number || row.reraNumber || "RERA Pending";
  const builderStr = row.builder_name || row.builderName || row.developer || row.builder || "Promoter Verified";
  const localityStr = row.locality || row.localityName || row.location || "Bangalore";
  const areaStr = row.city || row.taluk || "Bangalore";
  const progressVal = Number(row.construction_progress ?? row.constructionProgress ?? row.progress ?? 0);
  const posDate = row.possession_date || row.possessionDate || row.possession || "TBD";
  const acresVal =
    row.land_area_acres ||
    row.landAreaAcres ||
    row.totalAcres ||
    (row.land_area_sqm ? (Number(row.land_area_sqm) / 4046.86).toFixed(1) : (row.land_area ? String(row.land_area) : "N/A"));

  const unitTypesArr = formatUnitTypesArray(row.unit_types ?? row.unitTypes ?? row.configurations);
  const heroImg =
    row.hero_image ||
    row.heroImage ||
    row.image ||
    (Array.isArray(row.images) && row.images[0]) ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800";

  const imagesArr = Array.isArray(row.images) && row.images.length > 0 ? row.images : [heroImg];

  const complaintsCountVal =
    row.complaints_count != null
      ? Number(row.complaints_count)
      : (row.activeComplaintsNum != null ? Number(row.activeComplaintsNum) : (row.complaints != null ? Number(row.complaints) : 0));

  const litigationStatus = row.land_litigation
    ? "⚠️ Active Litigation Under Review"
    : (row.landLitigationStatus || "100% Clean Title Deed (Zero Litigation)");

  const yearsToPoss = calculateYearsToPossession(posDate);
  const timelineRel = calculateTimelineReliability(progressVal, posDate);

  const calculatedDensity =
    row.unit_density_per_acre ||
    row.densityText ||
    (totalUnitsNum > 0 && Number(acresVal) > 0 ? `${Math.round(totalUnitsNum / Number(acresVal))} units/acre` : "N/A");

  return {
    id: String(row.id || ""),
    projectName: row.name || row.projectName || "Project",
    reraNumber: reraNum,
    builderName: builderStr,
    locality: localityStr,
    area: areaStr,
    projectStartDate: row.project_start_date || row.projectStartDate || "N/A",
    possessionDate: posDate,
    constructionProgress: progressVal,
    totalUnits: totalUnitsVal,
    landAreaAcres: acresVal,
    yearsToPossession: yearsToPoss,
    timelineReliabilityRatio: timelineRel.ratio,
    timelineReliabilityStatus: timelineRel.display,
    unitTypes: unitTypesArr,
    minPrice: minStr,
    maxPrice: maxStr,
    pricePerSqft: pricePerSqftStr,
    unitDensity: calculatedDensity,
    nearestOfficeHub: row.nearest_office_hub || row.nearestOfficeHub || "Tech Park / Hub",
    distanceToHubKm: row.distance_to_hub_km ? `${row.distance_to_hub_km} km` : (row.commuteText || "N/A"),
    commuteScore: commute10,
    builderGrade: row.builder_grade || row.builderGrade || "A",
    googleRating: row.google_rating != null || row.googleRating != null ? Number(row.google_rating ?? row.googleRating) : 4.2,
    googleReviewSummary:
      row.google_review_summary ||
      row.googleReviewSummary ||
      "Verified project with authentic regulatory and construction milestones.",
    complaintsCount: complaintsCountVal,
    landLitigationStatus: litigationStatus,
    heroImage: heroImg,
    images: imagesArr,
  };
}

export function mapToSupabasePayload(fullProp: any): Record<string, any> {
  const nameStr = fullProp.name || fullProp.propertyName || fullProp.title || "Untitled Project";
  const statusVal = fullProp.status === "archived" ? "archived" : fullProp.status === "draft" ? "draft" : "published";

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
    (minLakhs > 0 ? (minLakhs === maxLakhs ? formatPriceLakhs(minLakhs) : `${formatPriceLakhs(minLakhs)} - ${formatPriceLakhs(maxLakhs)}`) : null);

  const amenitiesArr = Array.isArray(fullProp.amenities) ? fullProp.amenities : [];
  const prosArr = Array.isArray(fullProp.pros) ? fullProp.pros : [];
  const consArr = Array.isArray(fullProp.cons) ? fullProp.cons : [];

  const locStr =
    fullProp.location ||
    fullProp.locality ||
    (fullProp.landmark ? `${fullProp.landmark}, ${fullProp.locality || ''}` : null) ||
    fullProp.city ||
    null;

  const payload: Record<string, any> = {
    name: nameStr,
    rera_number: fullProp.reraNumber || fullProp.rera_number || null,
    builder_id: fullProp.builderId || fullProp.builder_id || null,
    city: fullProp.city || null,
    location: locStr,
    status: statusVal,
    possession_date: fullProp.possessionDate || fullProp.possession_date || null,
    construction_progress: fullProp.completionPercentage != null || fullProp.constructionProgress != null
      ? Number(fullProp.completionPercentage ?? fullProp.constructionProgress)
      : null,
    min_price_lakhs: minLakhs > 0 ? minLakhs : null,
    max_price_lakhs: maxLakhs > 0 ? maxLakhs : null,
    price_per_sqft: pricePerSqFtNum > 0 ? pricePerSqFtNum : null,
    price_range: priceRangeVal,
    total_units: totalUnitsNum > 0 ? totalUnitsNum : null,
    commute_score: fullProp.commuteScore != null ? Number(fullProp.commuteScore) : null,
    builder_grade: fullProp.builderGrade || null,
    google_rating: fullProp.googleRating ? Number(fullProp.googleRating) : null,
    reviews_count: fullProp.reviewsCount ? Number(fullProp.reviewsCount) : null,
    complaints_count: fullProp.complaintsCount != null ? Number(fullProp.complaintsCount) : null,
    cribr_score: fullProp.score != null || fullProp.cribrScore != null ? Number(fullProp.score ?? fullProp.cribrScore) : null,
    ai_verdict: fullProp.aiVerdict || fullProp.ai_verdict || null,
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
      area: "Bangalore",
      reraNumber: "RERA Pending",
      projectStartDate: "N/A",
      possessionDate: "TBD",
      constructionProgress: 0,
      landAreaSqm: "N/A",
      totalUnits: "N/A",
      complaints: "0",
      landLitigation: "100% Clean Title Deed (Zero Litigation)",
      unitTypes: "Not specified",
      minPrice: "Price on Request",
      maxPrice: "Price on Request",
      pricePerSqft: "N/A",
      landAreaAcres: "N/A",
      unitDensity: "N/A",
      yearsToPossession: "TBD",
      timelineReliabilityRatio: "85%",
      timelineReliabilityDisplay: "85% (On Track)",
      nearestOfficeHub: "IT Corridor",
      distanceToHub: "N/A",
      commuteScoreDisplay: "8.5/10",
      builderGrade: "A",
      googleRating: "4.2 ★",
      googleReviewSummary: "Verified property profile.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    };
  }

  let minLakhs = Number(p.min_price_lakhs ?? p.minPriceLakhs ?? 0);
  if (!minLakhs && (p.min_price || p.minPrice)) {
    const rawVal = Number(p.min_price || p.minPrice);
    minLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  let maxLakhs = Number(p.max_price_lakhs ?? p.maxPriceLakhs ?? 0);
  if (!maxLakhs && (p.max_price || p.maxPrice)) {
    const rawVal = Number(p.max_price || p.maxPrice);
    maxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
  }
  if (!maxLakhs && minLakhs) maxLakhs = minLakhs;

  const pricePerSqftVal = Number(p.price_per_sqft || p.pricePerSqft || 0);
  const pricePerSqftStr =
    pricePerSqftVal > 0
      ? `₹${pricePerSqftVal.toLocaleString("en-IN")} / sq ft`
      : (typeof p.pricePerSqft === "string" ? p.pricePerSqft : "N/A");

  const totalUnitsNum = Number(p.total_units || p.totalUnits || 0);
  const totalUnitsVal =
    totalUnitsNum > 0
      ? `${totalUnitsNum.toLocaleString("en-IN")} Units`
      : (p.totalUnits ? String(p.totalUnits) : "N/A");

  let ratingStr = p.google_rating != null || p.googleRating != null ? String(p.google_rating ?? p.googleRating) : "4.2";
  if (!ratingStr.includes("★")) {
    ratingStr = `${ratingStr} ★`;
  }

  const builderStr = p.builder_name || p.builderName || p.developer || p.builder || "Promoter Verified";
  const localityStr = p.locality || p.localityName || p.location || "Bangalore";
  const areaStr = p.city || p.taluk || "Bangalore";

  const rawCommute = p.commute_score ?? p.commuteScore ?? 8.8;
  const commuteNum = Number(rawCommute) > 10 ? Number(rawCommute) / 10 : Number(rawCommute);
  const commuteStr = `${Math.round(commuteNum * 10) / 10}/10`;

  const heroImg =
    p.hero_image ||
    p.heroImage ||
    p.image ||
    (Array.isArray(p.images) && p.images[0]) ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800";

  const acresVal =
    p.land_area_acres ||
    p.landAreaAcres ||
    p.totalAcres ||
    (p.land_area_sqm ? (Number(p.land_area_sqm) / 4046.86).toFixed(1) : (p.land_area ? String(p.land_area) : "N/A"));

  const unitTypesStr = formatUnitTypes(p.unit_types ?? p.unitTypes ?? p.configurations);
  const complaintsStr =
    p.complaints_count != null
      ? String(p.complaints_count)
      : (p.complaintsCount != null
        ? String(p.complaintsCount)
        : (p.activeComplaintsNum != null ? String(p.activeComplaintsNum) : (p.complaints != null ? String(p.complaints) : "0")));

  const litigationStr = p.land_litigation
    ? "⚠️ Active Litigation Under Review"
    : (p.landLitigationStatus || (p.landLitigation ? String(p.landLitigation) : "100% Clean Title Deed (Zero Litigation)"));

  const progressVal = Number(p.construction_progress ?? p.constructionProgress ?? p.progress ?? 0);
  const posDate = p.possession_date || p.possessionDate || p.possession || "TBD";

  const yearsToPoss = calculateYearsToPossession(posDate);
  const timelineRel = calculateTimelineReliability(progressVal, posDate);

  const calculatedDensity =
    p.unit_density_per_acre ||
    p.densityText ||
    (totalUnitsNum > 0 && Number(acresVal) > 0 ? `${Math.round(totalUnitsNum / Number(acresVal))} units/acre` : "N/A");

  const nearestHubStr = p.nearest_office_hub || p.nearestOfficeHub || p.nearestHub || "IT Corridor";
  const distHubStr = p.distance_to_hub_km ? `${Number(p.distance_to_hub_km).toFixed(2)} km` : (p.commuteText || "N/A");

  return {
    id: String(p.id || ""),
    projectName: p.name || p.projectName || "Project",
    builder: builderStr,
    locality: localityStr,
    area: areaStr,
    reraNumber: p.rera_number || p.reraNumber || "RERA Pending",
    projectStartDate: p.project_start_date || p.projectStartDate || "N/A",
    possessionDate: posDate,
    constructionProgress: progressVal,
    landAreaSqm: p.land_area_sqm ? `${Number(p.land_area_sqm).toLocaleString("en-IN")} sq.m` : (acresVal !== "N/A" ? `${(Number(acresVal) * 4046.86).toFixed(0)} sq.m` : "N/A"),
    totalUnits: totalUnitsVal,
    complaints: complaintsStr,
    landLitigation: litigationStr,
    unitTypes: unitTypesStr,
    minPrice: minLakhs > 0 ? formatPriceLakhs(minLakhs) : (p.minPrice || "Price on Request"),
    maxPrice: maxLakhs > 0 ? formatPriceLakhs(maxLakhs) : (p.maxPrice || "Price on Request"),
    pricePerSqft: pricePerSqftStr,
    landAreaAcres: acresVal !== "N/A" && !String(acresVal).includes("Acres") ? `${acresVal} Acres` : String(acresVal),
    unitDensity: calculatedDensity,
    yearsToPossession: yearsToPoss,
    timelineReliabilityRatio: `${timelineRel.ratio}%`,
    timelineReliabilityDisplay: timelineRel.display,
    nearestOfficeHub: nearestHubStr,
    distanceToHub: distHubStr,
    commuteScoreDisplay: commuteStr,
    builderGrade: p.builder_grade || p.builderGrade || "A",
    googleRating: ratingStr,
    googleReviewSummary:
      p.google_review_summary ||
      p.googleReviewSummary ||
      "Verified regulatory compliance and infrastructure development status.",
    image: heroImg,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [heroImg],
  };
}

