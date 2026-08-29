import { FullProject } from "./types/search";

// Production canonical dataset is stored in Supabase.
// Zero hardcoded/mock project data in production runtime.
export const MASTER_PROJECTS: FullProject[] = [];

export function getFeaturedProperties(): FullProject[] {
  return MASTER_PROJECTS;
}

export const FEATURED_PROPERTIES: FullProject[] = MASTER_PROJECTS;
export const INTELLIGENCE_REPORTS: any[] = [];
export const PREMIUM_PROPERTIES: any[] = MASTER_PROJECTS;
export const INTELLIGENCE_MODULES = PREMIUM_PROPERTIES;
