/**
 * ProjectService - Centralized database access layer for real estate projects
 * Encapsulates Supabase client queries for backend routes with fallback to MASTER_PROJECTS.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SERVER_CONFIG } from "../config";

export class ProjectService {
  private client: SupabaseClient | null = null;

  constructor() {
    const { URL, ANON_KEY } = SERVER_CONFIG.SUPABASE;
    if (URL && ANON_KEY && URL !== "placeholder") {
      try {
        this.client = createClient(URL, ANON_KEY);
      } catch (err) {
        console.warn("[ProjectService] Failed to initialize Supabase client:", err);
      }
    }
  }

  public isConfigured(): boolean {
    return !!this.client;
  }

  /**
   * Lookup a single project by ID, Name, or Slug strictly from Supabase
   */
  async getProjectByIdOrName(identifier: string): Promise<any | null> {
    if (!identifier) return null;
    const clean = String(identifier).trim().toLowerCase();

    if (this.client) {
      try {
        // 1. Try exact ID lookup
        const { data: byId, error: errId } = await this.client
          .from("projects")
          .select("*")
          .eq("id", identifier)
          .maybeSingle();

        if (!errId && byId) return byId;

        // 2. Try prefixed/unprefixed ID lookup
        const cleanId = clean.replace(/^proj-/, "");
        const { data: byCleanId, error: errCleanId } = await this.client
          .from("projects")
          .select("*")
          .or(`id.eq.${cleanId},id.eq.proj-${cleanId}`)
          .maybeSingle();

        if (!errCleanId && byCleanId) return byCleanId;

        // 3. Try slug lookup
        const { data: bySlug, error: errSlug } = await this.client
          .from("projects")
          .select("*")
          .or(`slug.eq.${clean},slug.eq.${cleanId},slug.eq.proj-${cleanId}`)
          .maybeSingle();

        if (!errSlug && bySlug) return bySlug;

        // 4. Try case-insensitive exact name lookup (fail safely on ambiguous substrings)
        const { data: byName, error: errName } = await this.client
          .from("projects")
          .select("*")
          .or(`name.ilike.${identifier},name.ilike.${clean},project_name.ilike.${identifier},project_name.ilike.${clean}`)
          .maybeSingle();

        if (!errName && byName) return byName;

        // 5. Try RERA number lookup
        const { data: byRera, error: errRera } = await this.client
          .from("projects")
          .select("*")
          .eq("rera_number", identifier)
          .maybeSingle();

        if (!errRera && byRera) return byRera;
      } catch (err: any) {
        console.warn("[ProjectService] DB lookup error:", err?.message || err);
      }
    }

    return null;
  }

  /**
   * Fetch all published projects strictly from Supabase
   */
  async getAllProjects(): Promise<any[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data;
        }
        if (error) {
          console.warn("[ProjectService] Fetch all projects Supabase error:", error.message);
        }
      } catch (err: any) {
        console.warn("[ProjectService] Fetch all projects exception:", err?.message || err);
      }
    }

    return [];
  }

  /**
   * Create a new project
   */
  async createProject(projectData: any): Promise<any | null> {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from("projects")
        .insert(projectData)
        .select()
        .single();
        
      if (!error && data) return data;
      if (error) console.error("[ProjectService] Create error:", error.message);
    } catch (err: any) {
      console.warn("[ProjectService] Create project exception:", err?.message || err);
    }
    return null;
  }

  /**
   * Update an existing project
   */
  async updateProject(id: string, projectData: any): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client
        .from("projects")
        .update(projectData)
        .eq("id", id);
        
      if (!error) return true;
      console.error("[ProjectService] Update error:", error.message);
    } catch (err: any) {
      console.warn("[ProjectService] Update project exception:", err?.message || err);
    }
    return false;
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client
        .from("projects")
        .delete()
        .eq("id", id);
        
      if (!error) return true;
      console.error("[ProjectService] Delete error:", error.message);
    } catch (err: any) {
      console.warn("[ProjectService] Delete project exception:", err?.message || err);
    }
    return false;
  }

  /**
   * Log unfulfilled searches to ai_reports table so admins can see what users are searching for
   */
  async logFailedSearch(query: string, intent: any): Promise<void> {
    if (!this.client || !query) return;
    try {
      const id = `failed_search_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await this.client.from("ai_reports").insert({
        id,
        query,
        report_data: { type: "failed_search", intent }
      });
    } catch (err) {
      console.warn("[ProjectService] Failed to log search:", err);
    }
  }

  /**
   * Search projects based on intent and fuzzy fallback
   */
  async searchProjects(intent: any, originalQuery: string = ""): Promise<any[]> {
    const all = await this.getAllProjects();
    const rawLocality = (intent?.locality || "").trim().toLowerCase();
    const rawBuilder = (intent?.builderName || "").trim().toLowerCase();
    const rawText = (originalQuery || "").trim().toLowerCase();
    const unitType = intent?.unitType ? String(intent.unitType).toLowerCase().replace(/\s/g, "") : null;
    const maxPrice = intent?.maxPriceINR;
    const minPrice = intent?.minPriceINR;

    let filtered = all;

    if (rawLocality) {
      const cleanLoc = rawLocality.replace(/road|junction|hub|east|west|north|south|extension/gi, "").trim() || rawLocality;
      filtered = filtered.filter(p => {
        const loc = (p.locality || p.location || p.city || "").toLowerCase();
        return loc.includes(rawLocality) || loc.includes(cleanLoc);
      });
    }

    if (rawBuilder) {
      filtered = filtered.filter(p => {
        const b = (p.builder_name || p.builder || p.developer || p.name || "").toLowerCase();
        return b.includes(rawBuilder);
      });
    }

    if (unitType) {
      filtered = filtered.filter(p => {
        const units = Array.isArray(p.unit_types) ? p.unit_types.join(" ") : String(p.unit_types || p.configurations || "");
        return units.toLowerCase().replace(/\s/g, "").includes(unitType);
      });
    }

    if (maxPrice && maxPrice > 0) {
      const maxLakhs = maxPrice / 100000;
      filtered = filtered.filter(p => {
        const rawMin = Number(p.min_price_lakhs ?? p.minPriceLakhs ?? p.min_price ?? p.minPrice ?? 0);
        const normMinLakhs = rawMin > 10000 ? rawMin / 100000 : rawMin;
        if (normMinLakhs === 0) return false; // Exclude 'Price on Request' if maxPrice is strict
        return normMinLakhs <= maxLakhs;
      });
    }

    if (minPrice && minPrice > 0) {
      const minLakhs = minPrice / 100000;
      filtered = filtered.filter(p => {
        let rawMax = Number(p.max_price_lakhs ?? p.maxPriceLakhs ?? p.max_price ?? p.maxPrice ?? 0);
        let normMaxLakhs = rawMax > 10000 ? rawMax / 100000 : rawMax;
        
        if (normMaxLakhs === 0) {
          const rawMin = Number(p.min_price_lakhs ?? p.minPriceLakhs ?? p.min_price ?? p.minPrice ?? 0);
          normMaxLakhs = rawMin > 10000 ? rawMin / 100000 : rawMin;
        }
        if (normMaxLakhs === 0) return false;
        return normMaxLakhs >= minLakhs;
      });
    }

    // If AI found NO structured intent at all, apply text search fallback
    const hasIntent = rawLocality || rawBuilder || unitType || maxPrice || minPrice;
    if (rawText && !hasIntent) {
      const words = rawText.toLowerCase().split(" ");
      filtered = all.filter(p => {
        const nameMatch = (p.name || p.projectName || "").toLowerCase();
        const builderMatch = (p.builder_name || p.builder || "").toLowerCase();
        const locMatch = (p.locality || p.location || "").toLowerCase();
        
        return words.some(w => nameMatch.includes(w) || builderMatch.includes(w) || locMatch.includes(w));
      });
    }

    return filtered;
  }
}

export const projectService = new ProjectService();
