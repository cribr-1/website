import { getFeaturedProperties } from "../data";
import { cribrProperties } from "./supabase";
import { mapToWhitelistedProject } from "./projectDataMapper";

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
 * Strips common prefixes (proj-, project-) and phase suffixes (-ph-1, -phase-1, etc.)
 */
export function cleanSlugKey(str: string): string {
  const decoded = (() => {
    try {
      return decodeURIComponent(str);
    } catch {
      return str;
    }
  })();

  return decoded
    .toLowerCase()
    .trim()
    .replace(/^proj-/, "")
    .replace(/^project-/, "")
    .replace(/-ph-\d+$/, "")
    .replace(/-phase-\d+$/, "")
    .replace(/-phase\d+$/, "")
    .replace(/ ph\.\s*\d+$/i, "")
    .replace(/ phase\s*\d+$/i, "")
    .trim();
}

/**
 * Robust property matcher.
 * Matches project by exact ID, stripped slug, name, RERA number, alphanumeric hash,
 * prefix/suffix matching, or token similarity.
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
  const clean = cleanSlugKey(raw);
  const cleanSlug = normalizeSlug(clean);

  const baseList = getFeaturedProperties();
  const combined = [...baseList, ...(customList || [])];

  // Remove duplicate entries by id/name
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

  const rawAlpha = normalizeAlphanumeric(raw);
  const cleanAlpha = normalizeAlphanumeric(clean);

  // Level 1: Exact matches (ID, normalized ID, name slug, RERA number)
  for (const p of allProperties) {
    const pId = String(p.id || "").toLowerCase();
    const pCleanId = cleanSlugKey(pId);
    const pName = String(p.name || p.projectName || "").toLowerCase();
    const pNameSlug = normalizeSlug(pName);
    const pCleanNameSlug = normalizeSlug(cleanSlugKey(pName));
    const pRera = String(p.reraNumber || p.rera_number || "").toLowerCase();

    if (
      pId === raw ||
      pId === `proj-${cleanSlug}` ||
      pId === `proj-${raw}` ||
      pCleanId === clean ||
      pCleanId === raw ||
      pCleanId === cleanSlug ||
      pNameSlug === raw ||
      pNameSlug === cleanSlug ||
      pCleanNameSlug === cleanSlug ||
      pName === raw ||
      pName === decoded ||
      (pRera && (pRera === raw || pRera === clean))
    ) {
      return p;
    }
  }

  // Level 2: Alphanumeric match (ignores hyphens, dots, spaces, case)
  for (const p of allProperties) {
    const pIdAlpha = normalizeAlphanumeric(p.id || "");
    const pCleanIdAlpha = normalizeAlphanumeric(cleanSlugKey(p.id || ""));
    const pNameAlpha = normalizeAlphanumeric(p.name || p.projectName || "");
    const pCleanNameAlpha = normalizeAlphanumeric(cleanSlugKey(p.name || p.projectName || ""));
    const pReraAlpha = normalizeAlphanumeric(p.reraNumber || p.rera_number || "");

    if (
      pIdAlpha === rawAlpha ||
      pIdAlpha === cleanAlpha ||
      pCleanIdAlpha === cleanAlpha ||
      pCleanIdAlpha === rawAlpha ||
      pNameAlpha === rawAlpha ||
      pNameAlpha === cleanAlpha ||
      pCleanNameAlpha === cleanAlpha ||
      (pReraAlpha && (pReraAlpha === rawAlpha || pReraAlpha === cleanAlpha))
    ) {
      return p;
    }
  }

  // Level 3: Prefix / StartsWith match (e.g. "proj-nambiar-district-25" -> "proj-nambiar-district-25-ph-1")
  for (const p of allProperties) {
    const pIdAlpha = normalizeAlphanumeric(p.id || "");
    const pCleanIdAlpha = normalizeAlphanumeric(cleanSlugKey(p.id || ""));
    const pNameAlpha = normalizeAlphanumeric(p.name || p.projectName || "");
    const pCleanNameAlpha = normalizeAlphanumeric(cleanSlugKey(p.name || p.projectName || ""));

    if (
      (cleanAlpha.length >= 5 && pCleanIdAlpha.startsWith(cleanAlpha)) ||
      (cleanAlpha.length >= 5 && pCleanNameAlpha.startsWith(cleanAlpha)) ||
      (rawAlpha.length >= 5 && pIdAlpha.startsWith(rawAlpha)) ||
      (rawAlpha.length >= 5 && pNameAlpha.startsWith(rawAlpha)) ||
      (cleanAlpha.length >= 5 && cleanAlpha.startsWith(pCleanIdAlpha)) ||
      (cleanAlpha.length >= 5 && cleanAlpha.startsWith(pCleanNameAlpha))
    ) {
      return p;
    }
  }

  // Level 4: Token keyword match (e.g. ["nambiar", "district", "25"])
  const tokens = clean
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !["proj", "project", "bangalore", "road"].includes(t));

  if (tokens.length > 0) {
    let bestMatch: any = null;
    let bestScore = 0;

    for (const p of allProperties) {
      const pFullStr = `${p.id || ""} ${p.name || p.projectName || ""} ${p.builder || p.developer || ""} ${p.location || p.localityName || ""}`.toLowerCase();
      let matchCount = 0;
      for (const token of tokens) {
        if (pFullStr.includes(token)) {
          matchCount++;
        }
      }
      const score = matchCount / tokens.length;
      if (score > bestScore && score >= 0.5) {
        bestScore = score;
        bestMatch = p;
      }
    }

    if (bestMatch) {
      return bestMatch;
    }
  }

  return null;
}

/**
 * Async lookup with fallback to live database (Supabase / local DB).
 */
export async function getPropertyAsync(slugOrId: string): Promise<any | null> {
  const syncMatch = findMatchingProperty(slugOrId);
  if (syncMatch) return syncMatch;

  try {
    const liveProperties = await cribrProperties.getProperties();
    return findMatchingProperty(slugOrId, liveProperties);
  } catch (err) {
    console.warn("Async property lookup error:", err);
    return null;
  }
}
