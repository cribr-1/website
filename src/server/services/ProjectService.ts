/**
 * ProjectService - Centralized database access layer for real estate projects
 * Encapsulates Supabase client queries for backend routes with fallback to MASTER_PROJECTS.
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { SERVER_CONFIG } from "../config";
import { MASTER_PROJECTS } from "../../data";

export class ProjectService {
  private client: SupabaseClient | null = null;

  constructor() {
    const { URL, ANON_KEY } = SERVER_CONFIG.SUPABASE;
    if (URL && ANON_KEY && URL !== "placeholder" && !URL.includes("nasccqkadwmfcajgecfs")) {
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
   * Lookup a single project by ID, Name, or Slug
   */
  async getProjectByIdOrName(identifier: string): Promise<any | null> {
    if (!identifier) return null;
    const clean = String(identifier).trim().toLowerCase();

    if (this.client) {
      try {
        // First try exact ID lookup
        const { data: byId, error: errId } = await this.client
          .from("projects")
          .select("*")
          .eq("id", identifier)
          .maybeSingle();

        if (!errId && byId) return byId;

        // Fallback: try case-insensitive name lookup
        const { data: byName, error: errName } = await this.client
          .from("projects")
          .select("*")
          .ilike("name", identifier)
          .maybeSingle();

        if (!errName && byName) return byName;
      } catch (err: any) {
        console.warn("[ProjectService] DB lookup error:", err?.message || err);
      }
    }

    // Master projects in-memory fallback - STRICT EXACT MATCHING ONLY
    const found = MASTER_PROJECTS.find(
      p =>
        p.id.toLowerCase() === clean ||
        p.id.toLowerCase().replace(/^proj-/, "") === clean.replace(/^proj-/, "") ||
        (p.slug && (p.slug.toLowerCase() === clean || p.slug.toLowerCase().replace(/^proj-/, "") === clean.replace(/^proj-/, ""))) ||
        p.name.toLowerCase() === clean ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === clean.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    );

    return found || null;
  }

  /**
   * Fetch all published projects
   */
  async getAllProjects(): Promise<any[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err: any) {
        console.warn("[ProjectService] Fetch all projects error:", err?.message || err);
      }
    }

    return MASTER_PROJECTS;
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
        const minL = Number(p.min_price_lakhs || (p.min_price ? (p.min_price > 10000 ? p.min_price / 100000 : p.min_price) : 0));
        return minL === 0 || minL <= maxLakhs;
      });
    }

    if (minPrice && minPrice > 0) {
      const minLakhs = minPrice / 100000;
      filtered = filtered.filter(p => {
        const maxL = Number(p.max_price_lakhs || (p.max_price ? (p.max_price > 10000 ? p.max_price / 100000 : p.max_price) : 0));
        return maxL === 0 || maxL >= minLakhs;
      });
    }

    if (rawText && filtered.length === all.length) {
      // Fuzzy keyword match using word boundaries and proper stopwords
      const stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'in', 'at', 'near', 'under', 'for', 'with', 'about', 'of', 'to', 'bhk', 'cr', 'lakhs', 'crore', 'lakh'];
      const terms = rawText.split(/\s+/)
        .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .filter(t => t.length > 1 && !stopwords.includes(t));

      if (terms.length > 0) {
        filtered = all.filter(p => {
          const fullStr = `${p.name} ${p.builder_name || p.builder} ${p.locality || p.location} ${p.city || ''} ${p.rera_number || ''}`.toLowerCase();
          // Use word boundary regex to avoid partial matches (e.g. "and" matching "Chandapura")
          return terms.some(t => {
            try {
              return new RegExp(`\\b${t}\\b`).test(fullStr);
            } catch {
              return fullStr.includes(t);
            }
          });
        });
      }
      
      // If the keyword search filtered out everything (e.g. for purely semantic questions like "Safety ratings"), 
      // return all projects instead of an empty array so the AI assistant can analyze them.
      if (filtered.length === 0) {
        filtered = all;
      }
    }

    return filtered;
  }
}

export const projectService = new ProjectService();
