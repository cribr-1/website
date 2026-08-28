import { createClient } from "@supabase/supabase-js";
import { mapToWhitelistedProject } from "./projectDataMapper";
import { MASTER_PROJECTS } from "../data";

// Retrieve Supabase environment variables safely across browser and Node.js
const metaEnv = typeof import.meta !== "undefined" && (import.meta as any)?.env ? (import.meta as any).env : {};
const procEnv = typeof process !== "undefined" && process.env ? process.env : {};
const rawSupabaseUrl = metaEnv.VITE_SUPABASE_URL || metaEnv.NEXT_PUBLIC_SUPABASE_URL || procEnv.VITE_SUPABASE_URL || procEnv.NEXT_PUBLIC_SUPABASE_URL || "https://nasccqkadwmfcajgecfs.supabase.co";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || procEnv.VITE_SUPABASE_ANON_KEY || procEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_z98MxzP9Yw3ePFmdVPrDpA_Y8boqwV0";

// Smart URL resolver: supports either complete URLs or raw project subdomains (e.g., 'nasccqkadwmfcajgecfs')
const supabaseUrl = rawSupabaseUrl && !rawSupabaseUrl.startsWith("http")
  ? `https://${rawSupabaseUrl.trim()}.supabase.co`
  : rawSupabaseUrl;

export const isRealSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder";

// Initialize the Supabase Client
export const supabase = isRealSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  : null;

// User session and profile interfaces
export interface CribrUser {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CribrBooking {
  id: string;
  userId: string;
  propertyId: string;
  propertyName: string;
  builderName: string;
  location: string;
  visitDate: string;
  visitTime: string; // "morning" | "afternoon" | "evening"
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
}

export interface CribrSavedProperty {
  id: string;
  userId: string;
  propertyId: string;
  propertyName: string;
  developer: string;
  city: string;
  overallScore: number;
  savedAt: string;
}

export interface CribrNotificationPref {
  propertyName: string;
  reraProgress: boolean;
  priceDrops: boolean;
  legalUpdates: boolean;
  noiseFluctuation: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
}

// Simulated Local Storage fallback cache for offline-first resilience
class CribrLocalDatabase {
  getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Local database cache failure", e);
    }
  }

  getBookings(): CribrBooking[] {
    return this.getStorageItem<CribrBooking[]>("cribr_sim_bookings", []);
  }

  saveBookings(bookings: CribrBooking[]): void {
    this.setStorageItem("cribr_sim_bookings", bookings);
  }

  getUsers(): CribrUser[] {
    return this.getStorageItem<CribrUser[]>("cribr_sim_users", []);
  }

  saveUsers(users: CribrUser[]): void {
    this.setStorageItem("cribr_sim_users", users);
  }

  getActiveSession(): CribrUser | null {
    const sessionData = this.getStorageItem<any>("cribr_active_session", null);
    if (!sessionData) return null;
    
    // Enforce 24-hour session expiration for enterprise security (Section 2 - Session Expiration)
    if (sessionData.expiresAt) {
      if (new Date() > new Date(sessionData.expiresAt)) {
        console.warn("CRIBR Session has expired. Initiating automatic logout.");
        this.setActiveSession(null);
        return null;
      }
    }
    // Return standard session user
    return sessionData.user || sessionData;
  }

  setActiveSession(user: CribrUser | null): void {
    if (user) {
      // Create session payload with secure 24-hour expiration threshold (Section 2)
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);
      
      const sessionPayload = {
        user,
        expiresAt: expirationDate.toISOString()
      };
      this.setStorageItem("cribr_active_session", sessionPayload);
    } else {
      this.setStorageItem("cribr_active_session", null);
    }
    window.dispatchEvent(new Event("cribr_session_changed"));
  }

  saveCallbackRequest(req: { propertyName: string; consultationType: string }): void {
    const list = this.getStorageItem<any[]>("cribr_sim_callbacks", []);
    list.push({ ...req, id: `callback-${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() });
    this.setStorageItem("cribr_sim_callbacks", list);
  }
}

export const localDb = new CribrLocalDatabase();

// 1. AUTHENTICATION MODULE
export const cribrAuth = {
  // Setup real-time session observer
  onAuthStateChange(callback: (user: CribrUser | null) => void) {
    if (isRealSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          // Resolve full profile from public.profiles
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          const cribrUser: CribrUser = {
            id: session.user.id,
            email: session.user.email || "",
            fullName: profile?.full_name || session.user.user_metadata?.full_name || "Cribr Explorer",
            phone: profile?.phone || session.user.phone || session.user.user_metadata?.phone || "",
            avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url || "",
            createdAt: session.user.created_at
          };

          localDb.setActiveSession(cribrUser);
          callback(cribrUser);
        } else {
          localDb.setActiveSession(null);
          callback(null);
        }
      });
      return () => subscription.unsubscribe();
    }
    return () => {};
  },

  // Check if account exists
  async checkAccountExists(identifier: string): Promise<{ exists: boolean; email: string }> {
    const query = identifier.trim().toLowerCase();
    
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", query)
          .maybeSingle();

        if (!error && data) {
          return { exists: true, email: data.email };
        }
      } catch (err) {
        console.warn("Supabase profile lookup failed", err);
      }
    }

    return {
      exists: false,
      email: query
    };
  },

  // Authenticate user with password with robust input validation (Section 6)
  async signIn(email: string, password?: string): Promise<{ success: boolean; user?: CribrUser; error?: string }> {
    // 1. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitizedEmail = email ? email.trim().toLowerCase() : "";
    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      return { success: false, error: "Please enter a valid email address (e.g., name@domain.com)." };
    }

    const targetPassword = password || "CribrDefault123!";
    if (targetPassword.length < 6) {
      return { success: false, error: "Invalid password format. Minimum length is 6 characters." };
    }
    
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: sanitizedEmail,
          password: targetPassword
        });

        if (error) throw error;

        if (data?.user) {
          // Fetch full profile info
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .maybeSingle();

          const cribrUser: CribrUser = {
            id: data.user.id,
            email: data.user.email || sanitizedEmail,
            fullName: profile?.full_name || data.user.user_metadata?.full_name || "Cribr Explorer",
            phone: profile?.phone || data.user.phone || "",
            avatarUrl: profile?.avatar_url || data.user.user_metadata?.avatar_url || "",
            createdAt: data.user.created_at
          };

          localDb.setActiveSession(cribrUser);
          cribrAuditLogs.insertLog("USER_LOGIN_SUCCESS", `User ${sanitizedEmail} successfully authenticated via Supabase Auth.`);
          return { success: true, user: cribrUser };
        }
      } catch (err: any) {
        console.warn("Supabase auth failed:", err.message);
        return { success: false, error: err.message || "Invalid credentials." };
      }
    }

    return { success: false, error: "Authentication service unavailable." };
  },

  // Register new user with strict form sanitization and check constraints (Section 6)
  async signUp(params: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<{ success: boolean; user?: CribrUser; error?: string }> {
    // 1. Full name validation (alphabetic and spaces only, 2-70 chars)
    const nameTrimmed = params.fullName ? params.fullName.trim() : "";
    if (!nameTrimmed || nameTrimmed.length < 2 || nameTrimmed.length > 70) {
      return { success: false, error: "Name must be between 2 and 70 characters long." };
    }
    if (!/^[a-zA-Z\s'.]+$/.test(nameTrimmed)) {
      return { success: false, error: "Name contains unsupported special characters. Please use letters only." };
    }

    // 2. Email format validation
    const sanitizedEmail = params.email ? params.email.trim().toLowerCase() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      return { success: false, error: "Please enter a valid email address (e.g., name@domain.com)." };
    }

    // 3. Phone validation (E.164-ish regex)
    const phoneTrimmed = params.phone ? params.phone.trim() : "";
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    if (!phoneTrimmed || !phoneRegex.test(phoneTrimmed)) {
      return { success: false, error: "Please enter a valid mobile number (10-20 digits)." };
    }

    // 4. Password strength validation (min 8 chars)
    const targetPassword = params.password || "CribrDefault123!";
    if (targetPassword.length < 8) {
      return { success: false, error: "Enterprise security requires passwords to be at least 8 characters long." };
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: sanitizedEmail,
          password: targetPassword,
          options: {
            data: {
              full_name: params.fullName,
              phone: params.phone
            }
          }
        });

        if (error) throw error;

        if (data?.user) {
          // Sync profile immediately to profiles table
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              email: sanitizedEmail,
              full_name: params.fullName,
              phone: params.phone,
              avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
              updated_at: new Date().toISOString()
            });
          } catch (profileErr) {
            console.error("Profiles table insert error", profileErr);
          }

          const cribrUser: CribrUser = {
            id: data.user.id,
            email: sanitizedEmail,
            fullName: params.fullName,
            phone: params.phone,
            avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
            createdAt: data.user.created_at
          };

          localDb.setActiveSession(cribrUser);
          cribrAuditLogs.insertLog("USER_REGISTER_SUCCESS", `New user profile created for ${sanitizedEmail} via Supabase Auth.`);
          return { success: true, user: cribrUser };
        }
      } catch (err: any) {
        console.error("Supabase registration error:", err.message);
        return { success: false, error: err.message };
      }
    }

    return { success: false, error: "Authentication service unavailable." };
  },

  // Perform Social Logins
  async handleSocialLogin(provider: "google" | "apple"): Promise<CribrUser> {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } catch (err) {
        console.error("Supabase social auth failed:", err);
      }
    }

    throw new Error("Authentication service unavailable.");
  },

  // Password reset implementation
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) return { success: false, error: error.message };
      cribrAuditLogs.insertLog("USER_PASSWORD_RESET_REQUEST", `Password reset link requested for ${email}.`);
      return { success: true };
    }
    return { success: false, error: "Authentication service unavailable." };
  },

  // Sign out session
  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localDb.setActiveSession(null);
    cribrAuditLogs.insertLog("USER_LOGOUT", `User session terminated.`);
  },

  getCurrentUser(): CribrUser | null {
    return localDb.getActiveSession();
  }
};

// 2. PROJECTS & PORTFOLIO ENGINE (DATABASE-DRIVEN - CRIBR AUTHORITATIVE)
export const cribrProperties = {
  // Fetch published projects from Supabase projects table or verified master data.
  // Returns normalized WhitelistedProject[] via mapToWhitelistedProject.
  async getProperties(): Promise<any[]> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(p => mapToWhitelistedProject(p));
        }

        if (error) {
          console.warn("[cribrProperties] Supabase query error, using master projects:", error.message);
        }
      } catch (err) {
        console.warn("[cribrProperties] Failed to load projects from Supabase, using master projects:", err);
      }
    }

    return MASTER_PROJECTS.map(p => mapToWhitelistedProject(p));
  }
};

// Analytics & Enquiry Tracking Engine (Production Database Connected)
export const cribrAnalyticsEngine = {
  async trackSearchQuery(query: string, resultCount: number = 0, intent?: any, sessionId?: string): Promise<void> {
    if (!query || !query.trim()) return;
    const activeUser = cribrAuth.getCurrentUser();
    const normalized = query.toLowerCase().trim();

    if (isRealSupabaseConfigured && supabase) {
      try {
        await supabase.from("search_queries").insert({
          query_text: query.trim(),
          normalized_query: normalized,
          user_id: activeUser?.id || null,
          session_id: sessionId || null,
          intent: intent || {},
          results_count: resultCount,
          searched_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Supabase search_queries insert failed:", e);
      }
    }
  },

  async trackProjectView(projectId: string, sessionId?: string): Promise<void> {
    if (!projectId) return;
    const activeUser = cribrAuth.getCurrentUser();

    if (isRealSupabaseConfigured && supabase) {
      try {
        await supabase.from("project_views").insert({
          project_id: projectId,
          user_id: activeUser?.id || null,
          session_id: sessionId || null,
          viewed_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Supabase project_views insert failed:", e);
      }
    }
  },

  async trackComparison(projectIds: string[], sessionId?: string): Promise<void> {
    if (!projectIds || projectIds.length === 0) return;
    const activeUser = cribrAuth.getCurrentUser();

    if (isRealSupabaseConfigured && supabase) {
      try {
        await supabase.from("comparisons").insert({
          project_ids: projectIds,
          user_id: activeUser?.id || null,
          session_id: sessionId || null,
          compared_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Supabase comparisons insert failed:", e);
      }
    }
  },

  async submitEnquiry(enquiry: {
    projectId: string;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
    message?: string;
  }): Promise<{ success: boolean; error?: string }> {
    if (!enquiry.projectId) {
      return { success: false, error: "Project ID is required" };
    }
    const activeUser = cribrAuth.getCurrentUser();

    if (isRealSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("enquiries").insert({
          project_id: enquiry.projectId,
          user_id: activeUser?.id || null,
          user_name: enquiry.userName || activeUser?.fullName || "Public Lead User",
          user_email: enquiry.userEmail || activeUser?.email || null,
          user_phone: enquiry.userPhone || activeUser?.phone || null,
          message: enquiry.message || "Consultation request from CRIBR platform",
          status: "new",
          submitted_at: new Date().toISOString()
        });
        if (error) throw error;
        return { success: true };
      } catch (e: any) {
        console.warn("Supabase enquiries insert failed, fallback to local storage:", e);
      }
    }

    localDb.saveCallbackRequest({
      propertyName: enquiry.projectId,
      consultationType: enquiry.message || "General Enquiry"
    });
    return { success: true };
  }
};

// Admin Ingestion & Analytics Queries
export const cribrAdminExt = {
  async getEnquiries(): Promise<any[]> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("enquiries")
          .select("*, projects(name)")
          .order("submitted_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Failed to fetch enquiries from Supabase:", e);
      }
    }
    return localDb.getStorageItem<any[]>("cribr_sim_callbacks", []);
  },

  async updateEnquiryStatus(id: string, status: string): Promise<boolean> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("enquiries")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (!error) return true;
      } catch (e) {
        console.warn("Failed to update enquiry status:", e);
      }
    }
    return true;
  },

  async getAllBookings(): Promise<any[]> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*, profiles(full_name, email, phone)")
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Failed to fetch all bookings:", e);
      }
    }
    return localDb.getBookings();
  },

  async updateBookingStatus(id: string, status: "scheduled" | "completed" | "cancelled"): Promise<boolean> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("bookings")
          .update({ status })
          .eq("id", id);
        if (!error) return true;
      } catch (e) {
        console.warn("Failed to update booking status:", e);
      }
    }
    return cribrBookings.cancelBooking(id);
  },

  async getUsers(): Promise<any[]> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Failed to fetch profiles:", e);
      }
    }
    return localDb.getUsers();
  },

  async updateUserRole(userId: string, role: string): Promise<boolean> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ role, updated_at: new Date().toISOString() })
          .eq("id", userId);
        if (!error) return true;
      } catch (e) {
        console.warn("Failed to update user role:", e);
      }
    }
    return true;
  },

  async getLiveSearchAnalytics(): Promise<any[]> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("search_queries")
          .select("*")
          .order("searched_at", { ascending: false })
          .limit(1000);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Failed to fetch live search queries:", e);
      }
    }
    return [];
  },

  async getLiveProjectViews(): Promise<any[]> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("project_views")
          .select("*, projects(name)")
          .order("viewed_at", { ascending: false })
          .limit(1000);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Failed to fetch live project views:", e);
      }
    }
    return [];
  },

  async getLiveComparisons(): Promise<any[]> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("comparisons")
          .select("*")
          .order("compared_at", { ascending: false })
          .limit(1000);
        if (!error && data) return data;
      } catch (e) {
        console.warn("Failed to fetch live comparisons:", e);
      }
    }
    return [];
  }
};

// 3. SITE VISIT BOOKINGS ENGINE
export const cribrBookings = {
  // Create site visit booking
  async createBooking(booking: {
    propertyId: string;
    propertyName: string;
    builderName: string;
    location: string;
    visitDate: string;
    visitTime: string;
  }): Promise<{ success: boolean; booking?: CribrBooking; error?: string }> {
    const activeUser = cribrAuth.getCurrentUser();
    if (!activeUser) {
      return { success: false, error: "Sign in required to schedule site bookings." };
    }

    const bookingId = `booking-${Math.random().toString(36).substr(2, 9)}`;
    const newBooking: CribrBooking = {
      id: bookingId,
      userId: activeUser.id,
      propertyId: booking.propertyId,
      propertyName: booking.propertyName,
      builderName: booking.builderName,
      location: booking.location,
      visitDate: booking.visitDate,
      visitTime: booking.visitTime,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };

    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .insert({
            user_id: activeUser.id,
            property_id: booking.propertyId,
            property_name: booking.propertyName,
            builder_name: booking.builderName,
            location: booking.location,
            visit_date: booking.visitDate,
            visit_time: booking.visitTime,
            status: "scheduled"
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          const syncedBooking: CribrBooking = {
            id: data.id,
            userId: data.user_id,
            propertyId: data.property_id,
            propertyName: data.property_name,
            builderName: data.builder_name,
            location: data.location,
            visitDate: data.visit_date,
            visitTime: data.visit_time,
            status: data.status,
            createdAt: data.created_at
          };
          return { success: true, booking: syncedBooking };
        }
      } catch (err: any) {
        console.warn("Supabase booking failed, caching locally:", err.message);
      }
    }

    // Local DB save
    const bookings = localDb.getBookings();
    localDb.saveBookings([newBooking, ...bookings]);
    return { success: true, booking: newBooking };
  },

  // Retrieve site visits for logged-in user
  async getBookings(): Promise<CribrBooking[]> {
    const activeUser = cribrAuth.getCurrentUser();
    if (!activeUser) return [];

    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", activeUser.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((b) => ({
            id: b.id,
            userId: b.user_id,
            propertyId: b.property_id,
            propertyName: b.property_name,
            builderName: b.builder_name,
            location: b.location,
            visitDate: b.visit_date,
            visitTime: b.visit_time,
            status: b.status,
            createdAt: b.created_at
          }));
        }
      } catch (err) {
        console.warn("Failed to retrieve Supabase bookings, reading from local DB cache:", err);
      }
    }

    const bookings = localDb.getBookings();
    return bookings.filter((b) => b.userId === activeUser.id);
  },

  // Cancel booking
  async cancelBooking(id: string): Promise<boolean> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        // Handle standard string ID (simulated) or UUID (Supabase)
        const { error } = await supabase
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.warn("Supabase cancel booking failed:", err);
      }
    }

    const bookings = localDb.getBookings();
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b));
    localDb.saveBookings(updated);
    return true;
  },

  // Reschedule booking
  async rescheduleBooking(id: string, date: string, time: string): Promise<boolean> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("bookings")
          .update({ visit_date: date, visit_time: time })
          .eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.warn("Supabase reschedule failed:", err);
      }
    }

    const bookings = localDb.getBookings();
    const updated = bookings.map((b) => (b.id === id ? { ...b, visitDate: date, visitTime: time } : b));
    localDb.saveBookings(updated);
    return true;
  }
};

// 4. SAVED PROPERTIES & FAVORITES ENGINE
export const cribrSavedProperties = {
  // Fetch favorites for logged-in user
  async getSavedHomes(): Promise<CribrSavedProperty[]> {
    const activeUser = cribrAuth.getCurrentUser();
    if (!activeUser) return [];

    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("saved_properties")
          .select("*")
          .eq("user_id", activeUser.id)
          .order("saved_at", { ascending: false });

        if (!error && data) {
          return data.map((item) => ({
            id: item.property_id, // map property_id back to standard client id
            userId: item.user_id,
            propertyId: item.property_id,
            propertyName: item.property_name,
            developer: item.developer,
            city: item.city,
            overallScore: item.overall_score,
            savedAt: item.saved_at
          }));
        }
      } catch (err) {
        console.warn("Supabase saved homes retrieve failure:", err);
      }
    }

    // fallback to local storage
    try {
      const stored = localStorage.getItem("cribr_saved_homes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Save/Unsave property toggler
  async toggleSavedHome(property: {
    id: string;
    name: string;
    developer: string;
    city: string;
    overallScore: number;
  }): Promise<{ isSaved: boolean; list: CribrSavedProperty[] }> {
    const activeUser = cribrAuth.getCurrentUser();
    if (!activeUser) {
      throw new Error("User authorization required.");
    }

    const currentSaved = await this.getSavedHomes();
    const alreadySaved = currentSaved.find((item) => item.propertyId === property.id);

    if (isRealSupabaseConfigured && supabase) {
      try {
        if (alreadySaved) {
          const { error } = await supabase
            .from("saved_properties")
            .delete()
            .eq("user_id", activeUser.id)
            .eq("property_id", property.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("saved_properties")
            .insert({
              user_id: activeUser.id,
              property_id: property.id,
              property_name: property.name,
              developer: property.developer,
              city: property.city,
              overall_score: property.overallScore
            });
          if (error) throw error;
        }
        
        const freshList = await this.getSavedHomes();
        return { isSaved: !alreadySaved, list: freshList };
      } catch (err) {
        console.warn("Supabase toggle favorite failed, falling back to offline mechanism:", err);
      }
    }

    // Local Storage operation
    let updated: CribrSavedProperty[] = [];
    if (alreadySaved) {
      updated = currentSaved.filter((item) => item.propertyId !== property.id);
    } else {
      updated = [
        {
          id: property.id,
          propertyId: property.id,
          userId: activeUser.id,
          propertyName: property.name,
          developer: property.developer,
          city: property.city,
          overallScore: property.overallScore,
          savedAt: new Date().toISOString()
        },
        ...currentSaved
      ];
    }

    localStorage.setItem("cribr_saved_homes", JSON.stringify(updated));
    return { isSaved: !alreadySaved, list: updated };
  }
};

// 5. NOTIFICATION ALERTS MODULE
export const cribrNotifications = {
  // Fetch notification preferences for a property
  async getPreferences(propertyName: string): Promise<CribrNotificationPref> {
    const activeUser = cribrAuth.getCurrentUser();
    const defaultPrefs: CribrNotificationPref = {
      propertyName,
      reraProgress: false,
      priceDrops: false,
      legalUpdates: false,
      noiseFluctuation: false,
      emailEnabled: false,
      whatsappEnabled: false
    };

    if (!activeUser) return defaultPrefs;

    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", activeUser.id)
          .eq("property_name", propertyName)
          .maybeSingle();

        if (!error && data) {
          return {
            propertyName: data.property_name,
            reraProgress: data.rera_progress,
            priceDrops: data.price_drops,
            legalUpdates: data.legal_updates,
            noiseFluctuation: data.noise_fluctuation,
            emailEnabled: data.email_enabled,
            whatsappEnabled: data.whatsapp_enabled
          };
        }
      } catch (err) {
        console.warn("Failed to fetch notification preferences from database:", err);
      }
    }

    // Local storage fallback
    const key = `cribr_sub_${propertyName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  },

  // Save notification preferences
  async savePreferences(prefs: CribrNotificationPref): Promise<boolean> {
    const activeUser = cribrAuth.getCurrentUser();
    if (!activeUser) return false;

    if (isRealSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("notifications")
          .upsert({
            user_id: activeUser.id,
            property_name: prefs.propertyName,
            rera_progress: prefs.reraProgress,
            price_drops: prefs.priceDrops,
            legal_updates: prefs.legalUpdates,
            noise_fluctuation: prefs.noiseFluctuation,
            email_enabled: prefs.emailEnabled,
            whatsapp_enabled: prefs.whatsappEnabled,
            updated_at: new Date().toISOString()
          }, {
            onConflict: "user_id,property_name"
          });

        if (!error) return true;
        throw error;
      } catch (err) {
        console.warn("Supabase upsert alert configuration failed, utilizing local sync fallback:", err);
      }
    }

    // Caching fallback
    const key = `cribr_sub_${prefs.propertyName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    localStorage.setItem(key, JSON.stringify(prefs));
    window.dispatchEvent(new Event("storage"));
    return true;
  }
};

// 6. INTELLECTUAL CACHE / PRE-COMPUTED AI REPORTS SYNCRONIZER
export const cribrAIReports = {
  // Retrieve saved reports from the DB to avoid repetitive billing
  async getReport(query: string): Promise<any | null> {
    const key = query.toLowerCase().trim().replace(/[^a-z0-9]/g, "-");
    
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("ai_reports")
          .select("report_data")
          .eq("id", key)
          .maybeSingle();

        if (!error && data) {
          return data.report_data;
        }
      } catch (err) {
        console.warn("Supabase AI report cache load failed", err);
      }
    }
    return null;
  },

  // Save generated report to DB
  async saveReport(query: string, reportData: any): Promise<void> {
    const key = query.toLowerCase().trim().replace(/[^a-z0-9]/g, "-");

    if (isRealSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("ai_reports")
          .upsert({
            id: key,
            query: query.trim(),
            report_data: reportData,
            created_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn("Failed to cache AI report to Supabase:", err);
      }
    }
  }
};

// 7. REALTIME DATABASE PUBSUB SUBSCRIPTION
export function subscribeToRealtimeTable(table: string, callback: (payload: any) => void) {
  if (isRealSupabaseConfigured && supabase) {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: table },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
  return () => {};
}

// 8. ENTERPRISE AUDIT LOGGING SYSTEM (Section 11)
export interface CribrAuditLog {
  id?: string;
  userId?: string;
  userEmail?: string;
  action: string;
  details: string;
  ipAddress?: string;
  createdAt?: string;
}

export const cribrAuditLogs = {
  async insertLog(action: string, details: string): Promise<void> {
    const activeUser = cribrAuth.getCurrentUser();
    
    // 1. Write immediately to persistent browser cache
    try {
      const logs = localDb.getStorageItem<any[]>("cribr_local_audit_logs", []);
      const newLog = {
        id: `log-${Math.random().toString(36).substr(2, 9)}`,
        userId: activeUser?.id || "anonymous",
        userEmail: activeUser?.email || "anonymous",
        action,
        details,
        createdAt: new Date().toISOString()
      };
      localDb.setStorageItem("cribr_local_audit_logs", [newLog, ...logs].slice(0, 1000));
    } catch (e) {
      console.error("Local audit logging failed:", e);
    }

    // 2. Sync to Supabase cloud table if online
    if (isRealSupabaseConfigured && supabase) {
      try {
        await supabase.from("audit_logs").insert({
          user_id: activeUser?.id || null,
          user_email: activeUser?.email || "anonymous",
          action,
          details,
          ip_address: "Client Session"
        });
      } catch (err) {
        console.warn("Supabase cloud audit logging failed, retaining local copy:", err);
      }
    }
  },

  async getLogs(): Promise<any[]> {
    if (isRealSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase audit log query failed, displaying offline logs:", err);
      }
    }
    return localDb.getStorageItem<any[]>("cribr_local_audit_logs", []);
  }
};

// 9. CRIBR AI CHAT HISTORY SYNCHRONIZER
export const cribrChats = {
  async getSessions(): Promise<any[]> {
    const activeUser = cribrAuth.getCurrentUser();
    if (isRealSupabaseConfigured && supabase && activeUser) {
      try {
        const { data, error } = await supabase
          .from("cribr_chats")
          .select("*")
          .eq("user_id", activeUser.id)
          .order("is_pinned", { ascending: false })
          .order("updated_at", { ascending: false });

        if (!error && data) {
          return data.map(c => ({
            id: c.id,
            title: c.title,
            isPinned: c.is_pinned,
            messages: c.messages,
            createdAt: c.created_at,
            updatedAt: c.updated_at
          }));
        }
      } catch (err) {
        console.warn("Failed to load chats from Supabase. Falling back to local storage.", err);
      }
    }

    try {
      const stored = localStorage.getItem("cribr_chat_sessions");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  async saveSession(session: { id: string; title: string; isPinned: boolean; messages: any[] }): Promise<void> {
    const activeUser = cribrAuth.getCurrentUser();
    
    // Always persist to local storage first for speed/offline capability (Optimistic UI)
    try {
      const stored = localStorage.getItem("cribr_chat_sessions");
      const currentSessions = stored ? JSON.parse(stored) : [];
      const updated = currentSessions.filter((s: any) => s.id !== session.id);
      const withNew = [
        { ...session, updatedAt: new Date().toISOString() },
        ...updated
      ];
      localStorage.setItem("cribr_chat_sessions", JSON.stringify(withNew));
    } catch (e) {
      console.error("Local storage chat save failed", e);
    }

    // Persist to Supabase if logged in
    if (isRealSupabaseConfigured && supabase && activeUser) {
      try {
        await supabase
          .from("cribr_chats")
          .upsert({
            id: session.id,
            user_id: activeUser.id,
            title: session.title,
            is_pinned: session.isPinned,
            messages: session.messages,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.warn("Failed to persist chat session to Supabase cloud:", err);
      }
    }
  },

  async deleteSession(id: string): Promise<void> {
    const activeUser = cribrAuth.getCurrentUser();

    // Remove from local storage
    try {
      const stored = localStorage.getItem("cribr_chat_sessions");
      if (stored) {
        const currentSessions = JSON.parse(stored);
        const updated = currentSessions.filter((s: any) => s.id !== id);
        localStorage.setItem("cribr_chat_sessions", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Local storage delete session failed", e);
    }

    // Remove from Supabase
    if (isRealSupabaseConfigured && supabase && activeUser) {
      try {
        await supabase
          .from("cribr_chats")
          .delete()
          .eq("id", id)
          .eq("user_id", activeUser.id);
      } catch (err) {
        console.warn("Failed to delete chat session from Supabase cloud:", err);
      }
    }
  }
};

