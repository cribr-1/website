// Search Analytics & Demand Intelligence Engine for CRIBR
import { cribrAnalyticsEngine } from "./supabase";
import {
  trackSearchSubmitted,
  trackPropertyOpened,
  trackCompareClicked,
  trackEnquirySubmitted
} from "./gtag";

export interface SearchIntent {
  location?: string;
  locality?: string;
  city?: string;
  builder?: string;
  unitTypes?: string[];
  minBudgetLakhs?: number;
  maxBudgetLakhs?: number;
  budgetRange?: "Under ₹1 Cr" | "₹1–2 Cr" | "₹2–3 Cr" | "₹3–5 Cr" | "₹5 Cr+";
  possessionPreference?: string;
  reraPreference?: boolean;
}

export interface SearchRecord {
  id: string;
  query: string;
  normalizedQuery: string;
  userId?: string;
  sessionId: string;
  intent: SearchIntent;
  resultsCount: number;
  timestamp: number; // epoch ms
  projectViews: { projectId: string; name?: string; timestamp: number }[];
  compares: { projectIds: string[]; timestamp: number }[];
  enquiries: { projectId?: string; name?: string; timestamp: number }[];
}

const STORAGE_KEY = "cribr_search_records_v1";

// Simple Session Identifier
export function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem("cribr_session_id");
    if (!sid) {
      sid = `sess_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      sessionStorage.setItem("cribr_session_id", sid);
    }
    return sid;
  } catch {
    return `sess_${Date.now()}`;
  }
}

// Intent Parsing Engine
export function extractSearchIntent(query: string): SearchIntent {
  const q = query.toLowerCase();
  const intent: SearchIntent = {};

  // 1. Unit Types
  const unitMatches: string[] = [];
  if (q.includes("2 bhk") || q.includes("2bhk") || q.includes("2 bedroom")) unitMatches.push("2 BHK");
  if (q.includes("3 bhk") || q.includes("3bhk") || q.includes("3 bedroom")) unitMatches.push("3 BHK");
  if (q.includes("4 bhk") || q.includes("4bhk") || q.includes("4 bedroom")) unitMatches.push("4 BHK");
  if (q.includes("villa") || q.includes("independent house")) unitMatches.push("Villa");
  if (q.includes("plot") || q.includes("land")) unitMatches.push("Plot");
  if (unitMatches.length > 0) {
    intent.unitTypes = unitMatches;
  }

  // 2. Budget Extraction
  const crMatch = q.match(/(under|below|less than|around|upto|up to)?\s*(₹|rs\.?|inr)?\s*(\d+(\.\d+)?)\s*(cr|crore|crores)/i);
  const lakhMatch = q.match(/(under|below|less than|around|upto|up to)?\s*(₹|rs\.?|inr)?\s*(\d+)\s*(l|lakh|lakhs)/i);

  let maxBudgetLakhs: number | undefined;

  if (crMatch) {
    const val = parseFloat(crMatch[3]);
    if (!isNaN(val)) maxBudgetLakhs = val * 100;
  } else if (lakhMatch) {
    const val = parseInt(lakhMatch[3], 10);
    if (!isNaN(val)) maxBudgetLakhs = val;
  }

  if (maxBudgetLakhs !== undefined) {
    intent.maxBudgetLakhs = maxBudgetLakhs;
    if (maxBudgetLakhs < 100) intent.budgetRange = "Under ₹1 Cr";
    else if (maxBudgetLakhs <= 200) intent.budgetRange = "₹1–2 Cr";
    else if (maxBudgetLakhs <= 300) intent.budgetRange = "₹2–3 Cr";
    else if (maxBudgetLakhs <= 500) intent.budgetRange = "₹3–5 Cr";
    else intent.budgetRange = "₹5 Cr+";
  }

  // 3. City & Locality
  const localities = [
    { name: "Whitefield", city: "Bangalore" },
    { name: "Sarjapur Road", city: "Bangalore" },
    { name: "Electronic City", city: "Bangalore" },
    { name: "Hebbal", city: "Bangalore" },
    { name: "Golf Course Road", city: "Gurugram" },
    { name: "Sector 106", city: "Gurugram" },
    { name: "Worli", city: "Mumbai" },
    { name: "Powai", city: "Mumbai" },
  ];

  for (const loc of localities) {
    if (q.includes(loc.name.toLowerCase())) {
      intent.locality = loc.name;
      intent.city = loc.city;
      intent.location = `${loc.name}, ${loc.city}`;
      break;
    }
  }

  if (!intent.city) {
    if (q.includes("bangalore") || q.includes("bengaluru")) intent.city = "Bangalore";
    else if (q.includes("gurugram") || q.includes("gurgaon")) intent.city = "Gurugram";
    else if (q.includes("mumbai")) intent.city = "Mumbai";
  }

  // 4. Builder
  const builders = ["Prestige", "Sobha", "Godrej", "DLF", "Lodha", "Total Environment"];
  for (const b of builders) {
    if (q.includes(b.toLowerCase())) {
      intent.builder = b;
      break;
    }
  }

  // 5. Possession
  if (q.includes("ready to move") || q.includes("ready")) {
    intent.possessionPreference = "Ready to Move";
  } else if (q.includes("2027") || q.includes("2028") || q.includes("2029")) {
    const year = q.match(/202[6-9]/)?.[0];
    intent.possessionPreference = year ? `Before ${year}` : "Under Construction";
  }

  return intent;
}

// Generate Realistic Seed Records if empty
function generateSeedRecords(): SearchRecord[] {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const sampleQueries = [
    {
      query: "3 BHK under ₹2 Cr Whitefield",
      count: 482,
      unique: 380,
      results: 18,
      views: 290,
      enquiries: 38,
      city: "Bangalore",
      locality: "Whitefield",
      builder: "Prestige",
      units: ["3 BHK"],
      budgetRange: "₹1–2 Cr" as const
    },
    {
      query: "Flats near Sarjapur Road",
      count: 391,
      unique: 295,
      results: 14,
      views: 210,
      enquiries: 27,
      city: "Bangalore",
      locality: "Sarjapur Road",
      builder: "Sobha",
      units: ["2 BHK", "3 BHK"],
      budgetRange: "₹1–2 Cr" as const
    },
    {
      query: "2 BHK under ₹1.5 Cr",
      count: 327,
      unique: 260,
      results: 22,
      views: 185,
      enquiries: 21,
      city: "Bangalore",
      units: ["2 BHK"],
      budgetRange: "₹1–2 Cr" as const
    },
    {
      query: "Projects near Bangalore",
      count: 289,
      unique: 210,
      results: 35,
      views: 160,
      enquiries: 18,
      city: "Bangalore",
      units: ["3 BHK"],
      budgetRange: "₹2–3 Cr" as const
    },
    {
      query: "Prestige projects",
      count: 214,
      unique: 175,
      results: 8,
      views: 145,
      enquiries: 19,
      city: "Bangalore",
      builder: "Prestige",
      units: ["3 BHK", "4 BHK"],
      budgetRange: "₹2–3 Cr" as const
    },
    {
      query: "DLF Camellias Golf Course Road",
      count: 198,
      unique: 140,
      results: 3,
      views: 180,
      enquiries: 24,
      city: "Gurugram",
      locality: "Golf Course Road",
      builder: "DLF",
      units: ["4 BHK"],
      budgetRange: "₹5 Cr+" as const
    },
    {
      query: "3 BHK under ₹80L in Whitefield",
      count: 74,
      unique: 62,
      results: 0,
      views: 0,
      enquiries: 0,
      city: "Bangalore",
      locality: "Whitefield",
      units: ["3 BHK"],
      budgetRange: "Under ₹1 Cr" as const
    },
    {
      query: "Villa under ₹1 Cr near Sarjapur",
      count: 52,
      unique: 45,
      results: 0,
      views: 0,
      enquiries: 0,
      city: "Bangalore",
      locality: "Sarjapur Road",
      units: ["Villa"],
      budgetRange: "Under ₹1 Cr" as const
    },
    {
      query: "Lodha Park Worli 4 BHK",
      count: 165,
      unique: 130,
      results: 5,
      views: 120,
      enquiries: 15,
      city: "Mumbai",
      locality: "Worli",
      builder: "Lodha",
      units: ["4 BHK"],
      budgetRange: "₹5 Cr+" as const
    }
  ];

  const records: SearchRecord[] = [];

  sampleQueries.forEach((sq, idx) => {
    // Generate multiple discrete timestamps over past 30 days
    for (let i = 0; i < Math.min(sq.count, 25); i++) {
      const timeOffset = Math.floor(Math.random() * 28 * DAY);
      const timestamp = now - timeOffset;
      const norm = sq.query.toLowerCase().trim();
      
      const record: SearchRecord = {
        id: `sr_${idx}_${i}_${timestamp}`,
        query: sq.query,
        normalizedQuery: norm,
        sessionId: `sess_seed_${idx}_${i % 10}`,
        intent: {
          city: sq.city,
          locality: sq.locality,
          builder: sq.builder,
          unitTypes: sq.units,
          budgetRange: sq.budgetRange,
        },
        resultsCount: sq.results,
        timestamp,
        projectViews: sq.results > 0 && (i % 2 === 0) ? [{ projectId: "prestige-kingston", name: "Prestige Kingston", timestamp: timestamp + 5000 }] : [],
        compares: (i % 5 === 0) ? [{ projectIds: ["prestige-kingston", "sobha-royal-pavilion"], timestamp: timestamp + 12000 }] : [],
        enquiries: sq.enquiries > 0 && (i % 4 === 0) ? [{ projectId: "prestige-kingston", name: "Prestige Kingston", timestamp: timestamp + 25000 }] : [],
      };

      records.push(record);
    }
  });

  return records;
}

// Load All Search Records
export function getSearchRecords(): SearchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to read search records from localStorage:", e);
  }

  return [];
}

// Save Records Array
function saveSearchRecords(records: SearchRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent("cribr-search-analytics-updated"));
  } catch (e) {
    console.error("Failed to save search records:", e);
  }
}

// Track New Search Execution on Main Website
export function trackSearchExecution(
  query: string,
  resultsCount: number,
  userId?: string
): SearchRecord {
  if (!query || !query.trim()) {
    throw new Error("Invalid query");
  }

  const normalized = query.toLowerCase().trim();
  const records = getSearchRecords();
  const sessionId = getOrCreateSessionId();
  const intent = extractSearchIntent(query);

  const newRecord: SearchRecord = {
    id: `sr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    query,
    normalizedQuery: normalized,
    userId,
    sessionId,
    intent,
    resultsCount,
    timestamp: Date.now(),
    projectViews: [],
    compares: [],
    enquiries: [],
  };

  records.unshift(newRecord);
  saveSearchRecords(records.slice(0, 5000));

  // Production Telemetry & Supabase Cloud Ingestion
  cribrAnalyticsEngine.trackSearchQuery(query, resultsCount, intent, sessionId);
  trackSearchSubmitted(query, resultsCount, intent);

  return newRecord;
}

// Track Project View Event
export function trackProjectViewEvent(projectId: string, projectName?: string): void {
  const records = getSearchRecords();
  const sessionId = getOrCreateSessionId();

  if (records.length > 0) {
    const recordIndex = records.findIndex(r => r.sessionId === sessionId);
    const targetIndex = recordIndex !== -1 ? recordIndex : 0;

    records[targetIndex].projectViews.push({
      projectId,
      name: projectName,
      timestamp: Date.now(),
    });

    saveSearchRecords(records);
  }

  // Production Telemetry & Supabase Cloud Ingestion
  cribrAnalyticsEngine.trackProjectView(projectId, sessionId);
  trackPropertyOpened(projectId, projectName);
}

// Track Project Comparison Event
export function trackProjectCompareEvent(projectIds: string[]): void {
  if (!projectIds || projectIds.length === 0) return;
  const records = getSearchRecords();
  const sessionId = getOrCreateSessionId();

  if (records.length > 0) {
    const recordIndex = records.findIndex(r => r.sessionId === sessionId);
    const targetIndex = recordIndex !== -1 ? recordIndex : 0;

    records[targetIndex].compares.push({
      projectIds,
      timestamp: Date.now(),
    });

    saveSearchRecords(records);
  }

  // Production Telemetry & Supabase Cloud Ingestion
  cribrAnalyticsEngine.trackComparison(projectIds, sessionId);
  trackCompareClicked(projectIds);
}

// Track Enquiry Event
export function trackEnquiryEvent(projectId?: string, projectName?: string): void {
  const records = getSearchRecords();
  const sessionId = getOrCreateSessionId();

  if (records.length > 0) {
    const recordIndex = records.findIndex(r => r.sessionId === sessionId);
    const targetIndex = recordIndex !== -1 ? recordIndex : 0;

    records[targetIndex].enquiries.push({
      projectId,
      name: projectName,
      timestamp: Date.now(),
    });

    saveSearchRecords(records);
  }

  // Production Telemetry & GA4 Ingestion
  if (projectId) {
    cribrAnalyticsEngine.submitEnquiry({ projectId, message: `Enquiry for ${projectName || projectId}` });
    trackEnquirySubmitted(projectId, projectName);
  }
}
