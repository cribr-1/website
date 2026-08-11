/**
 * ProjectService - Centralized database access layer for real estate projects
 * Encapsulates Supabase client queries for backend routes.
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
   * Lookup a single project by ID or Exact Name
   */
  async getProjectByIdOrName(identifier: string): Promise<any | null> {
    if (!this.client || !identifier) return null;

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

    return null;
  }

  /**
   * Fetch all published projects
   */
  async getAllProjects(): Promise<any[]> {
    if (!this.client) return [];

    try {
      const { data, error } = await this.client
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err: any) {
      console.warn("[ProjectService] Fetch all projects error:", err?.message || err);
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
   * Search projects based on intent and fuzzy fallback
   */
  async searchProjects(intent: any, originalQuery: string = ""): Promise<any[]> {
    if (!this.client) return [];

    const hasIntentFilters = intent.locality || intent.builderName || intent.maxPriceINR || intent.minPriceINR || intent.minBuilderGrade || intent.unitType;

    if (hasIntentFilters) {
      try {
        let dbQuery = this.client.from("projects").select("*");

        if (intent.locality) {
          dbQuery = dbQuery.ilike("locality", `%${intent.locality}%`);
        }
        if (intent.builderName) {
          dbQuery = dbQuery.ilike("builder_name", `%${intent.builderName}%`);
        }
        if (intent.maxPriceINR && intent.maxPriceINR > 0) {
          dbQuery = dbQuery.lte("min_price", intent.maxPriceINR);
        }
        if (intent.minPriceINR && intent.minPriceINR > 0) {
          dbQuery = dbQuery.gte("max_price", intent.minPriceINR);
        }

        const { data, error } = await dbQuery.limit(50);

        if (!error && data) {
          let filtered = data;
          if (intent.unitType && filtered.length > 0) {
            filtered = filtered.filter((p: any) => {
              if (Array.isArray(p.unit_types)) {
                return p.unit_types.some((u: string) => u.toLowerCase().replace(/\s/g, '').includes(intent.unitType!.toLowerCase().replace(/\s/g, '')));
              }
              if (typeof p.unit_types === "string") {
                return p.unit_types.toLowerCase().replace(/\s/g, '').includes(intent.unitType!.toLowerCase().replace(/\s/g, ''));
              }
              return true;
            });
          }

          if (filtered.length > 0) {
            return filtered;
          }
        }
      } catch (err) {
        console.error("[ProjectService] Intent query exception:", err);
      }
    }

    const rawText = originalQuery.trim();
    if (rawText) {
      try {
        const { data: nameHits } = await this.client.from("projects").select("*").ilike("name", `%${rawText}%`).limit(10);
        const { data: builderHits } = await this.client.from("projects").select("*").ilike("builder_name", `%${rawText}%`).limit(10);
        const { data: localityHits } = await this.client.from("projects").select("*").ilike("locality", `%${rawText}%`).limit(10);
        const { data: reraHits } = await this.client.from("projects").select("*").ilike("rera_number", `%${rawText}%`).limit(10);

        const seen = new Set<string>();
        const combined: any[] = [];
        for (const row of [...(nameHits || []), ...(builderHits || []), ...(localityHits || []), ...(reraHits || [])]) {
          if (!seen.has(row.id)) {
            seen.add(row.id);
            combined.push(row);
          }
        }

        if (combined.length > 0) {
          return combined;
        }
      } catch (err) {
        console.error("[ProjectService] Fuzzy search exception:", err);
      }
      
      // If a search was attempted but nothing was found, explicitly return empty array.
      // Do NOT fall back to returning all projects, otherwise the frontend won't know it was a 0-result search.
      return [];
    }

    if (hasIntentFilters) {
      return [];
    }

    // Only return all projects if there was absolutely no search criteria provided
    const { data: allProjects } = await this.client.from("projects").select("*").limit(16);
    return allProjects || [];
  }
}

export const projectService = new ProjectService();
