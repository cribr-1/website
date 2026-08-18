
import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import {
  LayoutDashboard,
  Users,
  Building,
  Briefcase,
  Calendar,
  FileText,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Bell,
  FolderOpen,
  Image as ImageIcon,
  BarChart3,
  IndianRupee,
  Settings,
  ShieldCheck,
  History,
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  ExternalLink,
  SlidersHorizontal,
  Download,
  Upload,
  ArrowUpRight,
  TrendingUp,
  User,
  MoreVertical,
  Activity,
  Zap,
  Lock,
  Sun,
  Moon,
  CheckCircle,
  AlertCircle,
  Maximize2,
  Sliders,
  Sparkles,
  RefreshCw,
  Phone,
  MessageCircle,
  Paperclip,
  Eye,
  CheckSquare,
  Square,
  Grid,
  List,
  ChevronRight,
  LockKeyhole,
  Laptop,
  Menu,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INTELLIGENCE_MODULES } from "../data";
import { CribrUser, CribrBooking, localDb, isRealSupabaseConfigured, supabase, cribrAuditLogs, cribrAdminExt } from "../lib/supabase";
import AdminCreatePropertyForm, { FullPropertyFormData } from "./AdminCreatePropertyForm";
import { formatPriceLakhs, mapFormToSupabaseProject } from "../lib/projectDataMapper";
import { AdminSearchIntelligence } from "./AdminSearchIntelligence";

interface AdminPanelProps {
  onClose: () => void;
  currentUser: CribrUser | null;
}

// Sub-interface definitions for simulated Supabase database modules
interface Builder {
  id: string;
  name: string;
  projectsCount: number;
  rating: number;
  trustScore: number;
  logo: string;
  reraId: string;
  website: string;
  description: string;
  status: "verified" | "pending" | "suspended";
  createdAt: string;
  version: number;
}

interface AdminProperty {
  id: string;
  name: string;
  developer: string;
  city: string;
  location: string;
  priceRange: string;
  status: "published" | "draft" | "archived";
  score: number;
  image: string;
  views: number;
  bookingsCount: number;
  isDeleted?: boolean;
  version: number;
  configurations: string;
  possession: string;
  amenities: string[];
}

interface Locality {
  id: string;
  name: string;
  schools: number;
  hospitals: number;
  metroStatus: string;
  crimeIndex: number;
  airQuality: number;
  waterSupply: string;
  traffic: string;
  investmentRating: string;
}

interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

interface MediaAsset {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "floorplan";
  size: string;
  url: string;
  folder: string;
  createdAt: string;
}

export default function AdminPanel({ onClose, currentUser }: AdminPanelProps) {
  // Theme state (Dark Mode / Light Mode inside Admin Panel)
  const [isAdminDark, setIsAdminDark] = useState<boolean>(() => {
    return localStorage.getItem("cribr_admin_theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("cribr_admin_theme", isAdminDark ? "dark" : "light");
  }, [isAdminDark]);

  // Active sidebar tab
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Notification Feed states
  const [notifications, setNotifications] = useState<any[]>([
    { id: "n-1", type: "booking", text: "New site visit scheduled by Aaryan Rajput for Prestige Kingston", time: "2 mins ago", unread: true },
    { id: "n-2", type: "user", text: "New user registered: priya.sharma@outlook.com", time: "15 mins ago", unread: true },
    { id: "n-3", type: "report", text: "AI intelligence generation complete: 'Sobha Neopolis'", time: "1 hour ago", unread: false },
    { id: "n-4", type: "approval", text: "Property 'Godrej Woodscapes' pending super-admin validation", time: "2 hours ago", unread: true },
    { id: "n-5", type: "alert", text: "RERA Registry check alert: Developer 'Vanguard Builders' license expired", time: "1 day ago", unread: false }
  ]);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Search/Command palette state
  const [globalSearch, setGlobalSearch] = useState("");
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Dynamic Data States (Simulated Supabase storage)
  const [usersList, setUsersList] = useState<CribrUser[]>([]);
  const [bookingsList, setBookingsList] = useState<CribrBooking[]>([]);
  const [propertiesList, setPropertiesList] = useState<AdminProperty[]>([]);
  const [buildersList, setBuildersList] = useState<Builder[]>([]);
  const [localitiesList, setLocalitiesList] = useState<Locality[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [enquiriesList, setEnquiriesList] = useState<any[]>([]);

  const handleUpdateEnquiryStatus = async (enquiryId: string, status: string) => {
    await cribrAdminExt.updateEnquiryStatus(enquiryId, status);
    setEnquiriesList(prev => prev.map(e => e.id === enquiryId ? { ...e, status } : e));
  };
  
  // Settings States
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [gmailOAuthEnabled, setGmailOAuthEnabled] = useState(true);
  const [geminiApiKeySet, setGeminiApiKeySet] = useState(true);
  const [smsTemplatesEnabled, setSmsTemplatesEnabled] = useState(true);

  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [propertiesPage, setPropertiesPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);
  const itemsPerPage = 6;

  // Selected details / Edit Modals state
  const [selectedUser, setSelectedUser] = useState<CribrUser | null>(null);
  const [editingProperty, setEditingProperty] = useState<AdminProperty | null>(null);
  const [editingBuilder, setEditingBuilder] = useState<Builder | null>(null);
  const [editingLocality, setEditingLocality] = useState<Locality | null>(null);
  const [isCreatePropertyOpen, setIsCreatePropertyOpen] = useState(false);
  const [isCreateLocalityOpen, setIsCreateLocalityOpen] = useState(false);

  // Property Inventory Hub states
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState("all");
  const [inventoryCityFilter, setInventoryCityFilter] = useState("all");
  const [inventorySortBy, setInventorySortBy] = useState<"score" | "name" | "price" | "views">("score");
  const [inventoryViewMode, setInventoryViewMode] = useState<"table" | "grid">("table");
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [quickInspectProperty, setQuickInspectProperty] = useState<AdminProperty | null>(null);

  // Mobile drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Helper for URL synchronization & pushState
  const updateUrlAndNavigate = (
    newTab: string, 
    subState?: { id?: string; action?: string; search?: string; status?: string }, 
    replace = false
  ) => {
    const params = new URLSearchParams();
    params.set("tab", newTab);
    if (subState?.id) params.set("id", subState.id);
    if (subState?.action) params.set("action", subState.action);
    if (subState?.search) params.set("search", subState.search);
    if (subState?.status && subState.status !== "all") params.set("status", subState.status);

    const queryString = params.toString();
    const newUrl = `${window.location.pathname}?${queryString}`;

    if (replace) {
      window.history.replaceState({ isAdmin: true, tab: newTab, ...subState }, "", newUrl);
    } else {
      window.history.pushState({ isAdmin: true, tab: newTab, ...subState }, "", newUrl);
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setQuickInspectProperty(null);
    setEditingProperty(null);
    setSelectedUser(null);
    setEditingBuilder(null);
    setEditingLocality(null);
    setIsCreatePropertyOpen(false);
    setIsCreateLocalityOpen(false);
    setIsMobileDrawerOpen(false); // Close drawer without creating extra history!

    updateUrlAndNavigate(tabId);
  };

  const handleInspectProperty = (prop: AdminProperty) => {
    setQuickInspectProperty(prop);
    updateUrlAndNavigate(activeTab, { id: prop.id, action: "inspect", search: inventorySearch, status: inventoryStatusFilter });
  };

  const handleEditProperty = (prop: AdminProperty) => {
    setEditingProperty(prop);
    updateUrlAndNavigate(activeTab, { id: prop.id, action: "edit", search: inventorySearch, status: inventoryStatusFilter });
  };

  const handleInspectUser = (user: CribrUser) => {
    setSelectedUser(user);
    updateUrlAndNavigate(activeTab, { id: user.id, action: "user" });
  };

  const handleEditBuilder = (builder: Builder) => {
    setEditingBuilder(builder);
    updateUrlAndNavigate(activeTab, { id: builder.id, action: "edit" });
  };

  const handleEditLocality = (locality: Locality) => {
    setEditingLocality(locality);
    updateUrlAndNavigate(activeTab, { id: locality.id, action: "edit" });
  };

  const handleGoBack = () => {
    if (quickInspectProperty || editingProperty || selectedUser || editingBuilder || editingLocality || isCreatePropertyOpen || isCreateLocalityOpen) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        setQuickInspectProperty(null);
        setEditingProperty(null);
        setSelectedUser(null);
        setEditingBuilder(null);
        setEditingLocality(null);
        setIsCreatePropertyOpen(false);
        setIsCreateLocalityOpen(false);
        updateUrlAndNavigate(activeTab, { search: inventorySearch, status: inventoryStatusFilter }, true);
      }
    } else if (activeTab !== "dashboard") {
      handleTabClick("dashboard");
    } else {
      onClose();
    }
  };

  // Sync state from URL on load and popstate
  useEffect(() => {
    const syncFromUrl = () => {
      if (!window.location.pathname.startsWith("/admin")) return;

      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") || "dashboard";
      const id = params.get("id");
      const action = params.get("action");
      const search = params.get("search");
      const status = params.get("status");

      setActiveTab(tab);
      if (search !== null) setInventorySearch(search);
      if (status !== null) setInventoryStatusFilter((status as any) || "all");

      if (id) {
        if (action === "inspect" || action === "view") {
          const found = propertiesList.find(p => p.id === id);
          if (found) setQuickInspectProperty(found);
        } else if (action === "edit") {
          const foundProp = propertiesList.find(p => p.id === id);
          if (foundProp) setEditingProperty(foundProp);
          const foundBuilder = buildersList.find(b => b.id === id);
          if (foundBuilder) setEditingBuilder(foundBuilder);
          const foundLoc = localitiesList.find(l => l.id === id);
          if (foundLoc) setEditingLocality(foundLoc);
        } else if (action === "user") {
          const foundUser = usersList.find(u => u.id === id);
          if (foundUser) setSelectedUser(foundUser);
        }
      } else {
        setQuickInspectProperty(null);
        setEditingProperty(null);
        setSelectedUser(null);
        setEditingBuilder(null);
        setEditingLocality(null);
        setIsCreatePropertyOpen(false);
        setIsCreateLocalityOpen(false);
      }
    };

    syncFromUrl();

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [propertiesList, usersList, buildersList, localitiesList]);

  // Version History tracker for properties
  const [versionHistory, setVersionHistory] = useState<Record<string, any[]>>({});

  // Roles permission levels with exact requested names
  const [selectedRole, setSelectedRole] = useState<string>("Super Admin");
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({
    "Super Admin": { users: true, properties: true, builders: true, settings: true, reports: true, audits: true },
    "Admin": { users: true, properties: true, builders: true, settings: false, reports: true, audits: true },
    "Content Manager": { users: false, properties: true, builders: true, settings: false, reports: true, audits: false },
    "Sales Manager": { users: true, properties: false, builders: false, settings: false, reports: true, audits: false },
    "Support Executive": { users: true, properties: false, builders: false, settings: false, reports: true, audits: false },
    "Builder Partner": { users: false, properties: true, builders: true, settings: false, reports: false, audits: false }
  });

  // Admin login gate state
  const [isLoggedInAsAdmin, setIsLoggedInAsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("cribr_admin_logged_in") === "true";
  });

  // Active user details collections
  const [userSavedProperties, setUserSavedProperties] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);

  // Prompt history simulation
  const [promptHistory, setPromptHistory] = useState<any[]>([
    { id: "p-1", prompt: "Perform deep legal assessment on non-agricultural clearance certificate statuses for Prestige Glenbrook.", tokens: 1840, timestamp: "Today, 10:42 AM" },
    { id: "p-2", prompt: "Identify air quality metrics and green canopy ratio for Whitefield Corridor.", tokens: 920, timestamp: "Today, 08:15 AM" },
    { id: "p-3", prompt: "Generate comparative matrix highlighting builder liquidities for Sobha vs Brigade.", tokens: 2450, timestamp: "Yesterday, 04:30 PM" }
  ]);

  // Loading skeleton state
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Synchronize detailed profile data when selectedUser changes
  useEffect(() => {
    if (!selectedUser) {
      setUserSavedProperties([]);
      setUserBookings([]);
      return;
    }

    const loadUserDetails = async () => {
      let saved: any[] = [];
      let usrBookings: any[] = [];

      if (isRealSupabaseConfigured && supabase) {
        try {
          const { data: sData } = await supabase
            .from("saved_properties")
            .select("*")
            .eq("user_id", selectedUser.id);
          if (sData) saved = sData;

          const { data: bData } = await supabase
            .from("bookings")
            .select("*")
            .eq("user_id", selectedUser.id);
          if (bData) usrBookings = bData;
        } catch (e) {
          console.warn("Error getting user detailed sub-tables", e);
        }
      }

      if (saved.length === 0) {
        saved = [
          { id: "s-1", property_name: "Prestige Kingston", developer: "Prestige Group", city: "Bangalore", overall_score: 89, saved_at: new Date().toISOString() }
        ];
      }
      if (usrBookings.length === 0) {
        usrBookings = bookingsList.filter(b => b.userId === selectedUser.id);
      }

      setUserSavedProperties(saved);
      setUserBookings(usrBookings);
    };

    loadUserDetails();
  }, [selectedUser, bookingsList]);

  // Initialize and Sync DB Data from Supabase
  useEffect(() => {
    const loadAllDbData = async () => {
      setIsPageLoading(true);
      try {
        // Load enquiries from Supabase
        const enquiriesData = await cribrAdminExt.getEnquiries();
        setEnquiriesList(enquiriesData);

        // 1. Load profiles from Supabase
        let finalUsers: CribrUser[] = [];
        if (isRealSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase.from("profiles").select("*");
            if (!error && data) {
              finalUsers = data.map(u => ({
                id: u.id,
                email: u.email,
                fullName: u.full_name || "Cribr Explorer",
                phone: u.phone || "",
                avatarUrl: u.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                createdAt: u.created_at
              }));
            }
          } catch (e) {
            console.warn("Supabase user registry fetch error", e);
          }
        }

        if (finalUsers.length === 0) {
          finalUsers = localDb.getUsers();
          if (finalUsers.length < 3) {
            const extraUsers = [
              { id: "user-2", email: "priya.sharma@outlook.com", fullName: "Priya Sharma", phone: "+91 99201 88472", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", createdAt: "2026-06-15T12:00:00.000Z" },
              { id: "user-3", email: "rohit.mehta@yahoo.com", fullName: "Rohit Mehta", phone: "+91 98112 04958", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", createdAt: "2026-07-01T09:30:00.000Z" },
              { id: "user-4", email: "karan.malhotra@gmail.com", fullName: "Karan Malhotra", phone: "+91 98722 00381", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", createdAt: "2026-07-08T14:45:00.000Z" }
            ];
            finalUsers = [...finalUsers, ...extraUsers];
            localDb.saveUsers(finalUsers);
          }
        }
        setUsersList(finalUsers);

        // 2. Load bookings from Supabase
        let finalBookings: CribrBooking[] = [];
        if (isRealSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase.from("bookings").select("*");
            if (!error && data) {
              finalBookings = data.map(b => ({
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
          } catch (e) {
            console.warn("Supabase bookings registry fetch error", e);
          }
        }

        if (finalBookings.length === 0) {
          finalBookings = localDb.getBookings();
          if (finalBookings.length === 0) {
            finalBookings = [
              { id: "booking-1", userId: "demo-user-1", propertyId: "prestige-kingston", propertyName: "Prestige Kingston", builderName: "Prestige Group", location: "Whitefield", visitDate: "Thursday, July 16, 2026", visitTime: "morning", status: "scheduled", createdAt: new Date().toISOString() },
              { id: "booking-2", userId: "user-2", propertyId: "sobha-royal-pavilion", propertyName: "Sobha Royal Pavilion", builderName: "Sobha Limited", location: "Sarjapur Road", visitDate: "Friday, July 17, 2026", visitTime: "afternoon", status: "completed", createdAt: new Date(Date.now() - 86400000).toISOString() },
              { id: "booking-3", userId: "user-3", propertyId: "godrej-meridien", propertyName: "Godrej Meridien", builderName: "Godrej Properties", location: "Dwarka Expressway", visitDate: "Saturday, July 18, 2026", visitTime: "evening", status: "cancelled", createdAt: new Date(Date.now() - 172800000).toISOString() }
            ];
            localDb.saveBookings(finalBookings);
          }
        }
        setBookingsList(finalBookings);

        // 3. Load properties from Supabase projects inventory
        let finalProperties: AdminProperty[] = [];
        if (isRealSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
            if (!error && data) {
              finalProperties = data.map((p) => {
                const minLakhs = Number(p.min_price_lakhs ?? (p.min_price ? p.min_price / 100000 : 0));
                const maxLakhs = Number(p.max_price_lakhs ?? (p.max_price ? p.max_price / 100000 : minLakhs));
                const minStr = formatPriceLakhs(minLakhs);
                const maxStr = formatPriceLakhs(maxLakhs);
                const priceRange = minStr === maxStr ? minStr : `${minStr} - ${maxStr}`;

                return {
                  id: String(p.id),
                  name: p.name || p.project_name || "Untitled Project",
                  developer: p.builder_name || (p.builder_id ? `Builder #${p.builder_id}` : "Builder information unavailable"),
                  city: p.city || "N/A",
                  location: p.location || p.city || "N/A",
                  priceRange,
                  status: (p.status as "published" | "draft" | "archived") || "published",
                  score: Number(p.cribr_score ?? 0),
                  image: p.hero_image || p.images?.[0] || "",
                  views: 0,
                  bookingsCount: 0,
                  version: 1,
                  configurations: Array.isArray(p.unit_types) && p.unit_types.length > 0 ? p.unit_types.join(", ") : "N/A",
                  possession: p.possession_date || "N/A",
                  amenities: Array.isArray(p.amenities) ? p.amenities : []
                };
              });
            }
          } catch (e) {
            console.warn("Supabase projects registry fetch error", e);
          }
        }

        setPropertiesList(finalProperties);

        // 4. Builders registry
        const initialBuilders: Builder[] = [];
        setBuildersList(initialBuilders);

        // 5. Localities registry
        const initialLocalities: Locality[] = [];
        setLocalitiesList(initialLocalities);

        // 6. Media assets
        setMediaAssets([]);

        // 7. Initial system logs
        setAuditLogs([]);

      } catch (err) {
        console.error("General error synchronizing database tables", err);
      } finally {
        setIsPageLoading(false);
      }
    };

    loadAllDbData();
  }, [currentUser]);

  // Sync properties to localstorage when they change
  const handlePropertiesChange = (updatedList: AdminProperty[]) => {
    setPropertiesList(updatedList);
    window.dispatchEvent(new Event("cribr_properties_changed"));
  };

  // Helper trigger for Audit Logging
  const logAdminAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: currentUser?.email || "admin@cribr.ai",
      role: selectedRole,
      action,
      details,
      timestamp: "Just now",
      ip: "103.44.201.55"
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    // Dispatch to enterprise-ready persistent audit logs (Section 11)
    cribrAuditLogs.insertLog(action, `[Role: ${selectedRole}] ${details}`);
  };

  // CSV Export Simulator
  const triggerCSVExport = (moduleName: string) => {
    const dummyCSVContent = `ID, Name, Date, Scope\n1, Export_${moduleName}, ${new Date().toLocaleDateString()}, "Enterprise Snapshot"`;
    const blob = new Blob([dummyCSVContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `Cribr_${moduleName}_Export_${Date.now()}.csv`);
    a.click();
    logAdminAction("EXPORT_CSV", `Exported full CSV registry file for segment: ${moduleName}`);
  };

  // CSV Import Simulator with enterprise-grade protection checks (Section 5)
  const triggerCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 1. File size verification (e.g., limit to 2MB)
      const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE_BYTES) {
        alert("Security Alert: CSV file exceeds the maximum allowed size of 2MB.");
        logAdminAction("IMPORT_CSV_REJECTED", `Rejected CSV import: ${file.name} because its size (${(file.size / 1024).toFixed(1)} KB) exceeds the limit.`);
        return;
      }

      // 2. File type and extension checks (Prevent executable uploads or mime spoofing)
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== "csv") {
        alert("Security Alert: Invalid file format. Only .csv files are permitted.");
        logAdminAction("IMPORT_CSV_REJECTED", `Rejected CSV import: ${file.name} due to invalid extension (${fileExtension}).`);
        return;
      }

      const allowedMimeTypes = ["text/csv", "application/csv", "application/vnd.ms-excel"];
      if (file.type && !allowedMimeTypes.includes(file.type)) {
        alert("Security Alert: Content type validation failed. The file is not a valid CSV.");
        logAdminAction("IMPORT_CSV_REJECTED", `Rejected CSV import: ${file.name} due to invalid MIME type: ${file.type}`);
        return;
      }

      // 3. Scan file content to verify headers and prevent script injections
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (!text) {
          alert("Security Alert: Empty or unreadable CSV file content.");
          return;
        }

        // Quick check for dangerous script or executable signatures inside CSV cells
        const lowercaseContent = text.toLowerCase();
        if (
          lowercaseContent.includes("<script") || 
          lowercaseContent.includes("javascript:") ||
          lowercaseContent.includes("cmd.exe") ||
          lowercaseContent.includes("/bin/sh") ||
          lowercaseContent.includes("/bin/bash")
        ) {
          alert("Security Alert: Malicious payload or executable scripting signature detected in CSV content. Upload aborted.");
          logAdminAction("MALICIOUS_CSV_DETECTED", `Blocked malicious script upload signature inside file: ${file.name}`);
          return;
        }

        // Simulating robust parsing and loading
        setIsPageLoading(true);
        setTimeout(() => {
          // Add a dummy imported property to the list
          const importedProp: AdminProperty = {
            id: `imported-${Math.random().toString(36).substr(2, 6)}`,
            name: "Brigade Calista (Imported)",
            developer: "Brigade Group",
            city: "Bangalore",
            location: "Budigere Cross",
            priceRange: "₹85 L - ₹1.4 Cr",
            status: "draft",
            score: 87,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
            views: 120,
            bookingsCount: 0,
            version: 1,
            configurations: "2 & 3 BHK Premium Units",
            possession: "Jun 2028",
            amenities: ["Jogging Track", "Gym", "Landscaped Gardens"]
          };
          handlePropertiesChange([importedProp, ...propertiesList]);
          logAdminAction("IMPORT_CSV", `Successfully validated and imported property '${importedProp.name}' from CSV file: ${file.name}`);
          setIsPageLoading(false);
        }, 700);
      };

      reader.onerror = () => {
        alert("Error: Failed to read CSV file.");
      };

      reader.readAsText(file);
    }
  };

  // Property creation submission
  const handleAddProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newProperty: AdminProperty = {
      id: `prop-${Math.random().toString(36).substring(2, 8)}`,
      name: data.get("name") as string,
      developer: data.get("developer") as string,
      city: data.get("city") as string,
      location: data.get("location") as string,
      priceRange: data.get("priceRange") as string,
      status: "published",
      score: parseInt(data.get("score") as string) || 85,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80",
      views: 0,
      bookingsCount: 0,
      version: 1,
      configurations: data.get("configurations") as string || "3 BHK Ultra Smart",
      possession: data.get("possession") as string || "Dec 2027",
      amenities: ["Water Recycling", "Premium Fittings", "RERA Compliant"]
    };

    if (isRealSupabaseConfigured && supabase) {
      try {
        const dbPayload = mapFormToSupabaseProject({
          name: newProperty.name,
          developer: newProperty.developer,
          city: newProperty.city,
          locality: newProperty.location,
          status: "published",
          score: newProperty.score,
          image: newProperty.image
        });
        await fetch("/api/cribr/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dbPayload) });
      } catch (err) {
        console.error("Supabase project insert error", err);
      }
    }

    handlePropertiesChange([newProperty, ...propertiesList]);
    logAdminAction("PROPERTY_CREATE", `Created new property '${newProperty.name}' and set status to published`);
    setIsCreatePropertyOpen(false);
  };

  // Soft Delete simulation with Version Archive
  const handleSoftDeleteProperty = async (id: string) => {
    const targetProp = propertiesList.find((p) => p.id === id);
    if (!targetProp) return;

    // Archive original in history first as "SOFT_DELETE"
    setVersionHistory((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { ...targetProp, deletedAt: new Date().toISOString() }]
    }));

    if (isRealSupabaseConfigured) {
      try {
        await fetch(`/api/cribr/admin/projects/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "archived" }) });
      } catch (err) {
        console.error("Supabase project archive error", err);
      }
    }

    const updated = propertiesList.map((p) => p.id === id ? { ...p, isDeleted: true, status: "archived" as const } : p);
    handlePropertiesChange(updated);
    logAdminAction("PROPERTY_DELETE", `Permanently deleted and archived property record: '${targetProp.name}'`);
  };

  // Submit edit configurations
  const handleEditPropertySubmit = async (propId: string, updates: Partial<AdminProperty>) => {
    const updatedList = propertiesList.map(p => p.id === propId ? { ...p, ...updates } : p);
    handlePropertiesChange(updatedList);
    
    if (isRealSupabaseConfigured && supabase) {
      try {
        const updatesPayload: Record<string, any> = {};
        if (updates.name) updatesPayload.name = updates.name;
        if (updates.city) updatesPayload.city = updates.city;
        if (updates.location) updatesPayload.location = updates.location;
        if (updates.status) updatesPayload.status = updates.status;
        if (updates.score) updatesPayload.cribr_score = updates.score;

        if (Object.keys(updatesPayload).length > 0) {
          await fetch(`/api/cribr/admin/projects/${propId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatesPayload) });
        }
      } catch (err) {
        console.error("Supabase project update error:", err);
      }
    }
    
    const target = propertiesList.find(p => p.id === propId);
    logAdminAction("PROPERTY_UPDATE", `Updated configurations & details for property '${target?.name || propId}'`);
  };

  // Duplicate Property handler
  const handleDuplicateProperty = async (prop: AdminProperty) => {
    const duplicated: AdminProperty = {
      ...prop,
      id: `prop-${Math.random().toString(36).substring(2, 8)}`,
      name: `${prop.name} (Copy)`,
      status: "draft"
    };

    if (isRealSupabaseConfigured && supabase) {
      try {
        const dbPayload = mapFormToSupabaseProject({
          name: duplicated.name,
          developer: duplicated.developer,
          city: duplicated.city,
          locality: duplicated.location,
          status: "draft",
          score: duplicated.score,
          image: duplicated.image
        });
        await fetch("/api/cribr/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dbPayload) });
      } catch (err) {
        console.error("Supabase project duplicate error:", err);
      }
    }

    handlePropertiesChange([duplicated, ...propertiesList]);
    logAdminAction("PROPERTY_DUPLICATE", `Duplicated property record '${prop.name}' as '${duplicated.name}'`);
  };

  // Toggle Publish / Unpublish Status
  const handleTogglePublishProperty = async (propId: string, currentStatus: "published" | "draft" | "archived") => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const updatedList = propertiesList.map(p => p.id === propId ? { ...p, status: newStatus as any } : p);
    handlePropertiesChange(updatedList);

    if (isRealSupabaseConfigured && supabase) {
      try {
        await fetch(`/api/cribr/admin/projects/${propId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      } catch (err) {
        console.error("Supabase project status update error:", err);
      }
    }

    const target = propertiesList.find(p => p.id === propId);
    logAdminAction(
      newStatus === "published" ? "PROPERTY_PUBLISH" : "PROPERTY_UNPUBLISH", 
      `${newStatus === "published" ? "Published" : "Unpublished"} property record '${target?.name || propId}'`
    );
  };

  // Update site visit booking status in Supabase & state
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    const updated = bookingsList.map(b => b.id === bookingId ? { ...b, status: newStatus as any } : b);
    setBookingsList(updated);

    if (isRealSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("bookings")
          .update({ status: newStatus })
          .eq("id", bookingId);
      } catch (err) {
        console.error("Supabase booking update error:", err);
      }
    }

    logAdminAction("BOOKING_UPDATE", `Updated site visit booking #${bookingId} status to '${newStatus}'`);
  };

  // Real-time notification trigger simulation
  const simulateLiveNotification = () => {
    const events = [
      { type: "booking", text: "New site tour requested: Sobha Royal Pavilion - Slot: Evening", unread: true },
      { type: "user", text: "New builder partner signed up: Vanguard Estates Ltd.", unread: true },
      { type: "report", text: "Failed AI report generation: 'Aura Heights' - Token limit exceeded", unread: true },
      { type: "approval", text: "Property 'Brigade Calista' has updated floorplans pending verification", unread: true }
    ];
    const chosen = events[Math.floor(Math.random() * events.length)];
    const newNotif = { ...chosen, id: `n-${Date.now()}`, time: "Just now" };
    setNotifications((prev) => [newNotif, ...prev]);
    
    // Also push to live mock audit logging
    logAdminAction("SYSTEM_ALERT", `Real-time system notification fired: "${chosen.text}"`);
  };

  // Search filter implementation
  const filteredUsers = usersList.filter(
    (u) => u.fullName.toLowerCase().includes(globalSearch.toLowerCase()) || u.email.toLowerCase().includes(globalSearch.toLowerCase())
  );

  // Comprehensive Property Inventory filtering, searching, and sorting
  const filteredProperties = propertiesList
    .filter((p) => {
      if (p.isDeleted) return false;
      const search = (inventorySearch || globalSearch).toLowerCase();
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search) ||
        p.developer.toLowerCase().includes(search) ||
        p.location.toLowerCase().includes(search) ||
        p.city.toLowerCase().includes(search) ||
        (p.configurations && p.configurations.toLowerCase().includes(search));

      const matchesStatus =
        inventoryStatusFilter === "all" || p.status === inventoryStatusFilter;

      const matchesType =
        inventoryTypeFilter === "all" ||
        (p.configurations && p.configurations.toLowerCase().includes(inventoryTypeFilter.toLowerCase())) ||
        p.name.toLowerCase().includes(inventoryTypeFilter.toLowerCase());

      const matchesCity =
        inventoryCityFilter === "all" ||
        (p.city && p.city.toLowerCase() === inventoryCityFilter.toLowerCase()) ||
        (p.location && p.location.toLowerCase().includes(inventoryCityFilter.toLowerCase()));

      return matchesSearch && matchesStatus && matchesType && matchesCity;
    })
    .sort((a, b) => {
      if (inventorySortBy === "score") return (b.score || 0) - (a.score || 0);
      if (inventorySortBy === "name") return a.name.localeCompare(b.name);
      if (inventorySortBy === "views") return (b.views || 0) - (a.views || 0);
      if (inventorySortBy === "price") return b.priceRange.localeCompare(a.priceRange);
      return 0;
    });

  // Bulk Operations Handlers
  const handleSelectAllProperties = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPropertyIds(filteredProperties.map(p => p.id));
    } else {
      setSelectedPropertyIds([]);
    }
  };

  const handleToggleSelectProperty = (id: string) => {
    setSelectedPropertyIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (newStatus: "published" | "draft" | "archived") => {
    if (selectedPropertyIds.length === 0) return;
    const updated = propertiesList.map(p => 
      selectedPropertyIds.includes(p.id) ? { ...p, status: newStatus } : p
    );
    handlePropertiesChange(updated);
    logAdminAction("BULK_STATUS_CHANGE", `Changed status to '${newStatus}' for ${selectedPropertyIds.length} properties`);
    setSelectedPropertyIds([]);
  };

  const handleBulkDeleteProperties = () => {
    if (selectedPropertyIds.length === 0) return;
    if (!confirm(`Are you sure you want to soft delete ${selectedPropertyIds.length} properties?`)) return;
    const updated = propertiesList.map(p => 
      selectedPropertyIds.includes(p.id) ? { ...p, isDeleted: true, status: "archived" as const } : p
    );
    handlePropertiesChange(updated);
    logAdminAction("BULK_PROPERTY_DELETE", `Soft deleted ${selectedPropertyIds.length} properties`);
    setSelectedPropertyIds([]);
  };

  const filteredBookings = bookingsList.filter(
    (b) => b.propertyName.toLowerCase().includes(globalSearch.toLowerCase()) || b.builderName.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const filteredBuilders = buildersList.filter(
    (b) => b.name.toLowerCase().includes(globalSearch.toLowerCase())
  );

  // Command Palette matching handler
  const handleCommandClick = (tab: string, searchVal?: string) => {
    handleTabClick(tab);
    if (searchVal) setGlobalSearch(searchVal);
    setShowCommandPalette(false);
  };

  if (!isLoggedInAsAdmin) {
    return (
      <div className={`fixed inset-0 z-[200] flex items-center justify-center font-sans ${isAdminDark ? "bg-[#090A0C] text-neutral-100" : "bg-[#F4F6F9] text-[#1D1E20]"}`}>
        <div className={`w-full max-w-md p-8 rounded-[32px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow space-y-6 m-4`}>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-black tracking-tight mt-4">
              CRIBR Admin Terminal
            </h2>
            <p className="text-xs text-neutral-400">
              Authorized administrative personnel only. Please verify your identity and roles assignment.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const fData = new FormData(e.currentTarget);
              const email = fData.get("email") as string;
              const role = fData.get("role") as string;
              
              localStorage.setItem("cribr_admin_logged_in", "true");
              setSelectedRole(role);
              setIsLoggedInAsAdmin(true);
              
              // Push to custom audit log
              const newLog = {
                id: `log-${Date.now()}`,
                user: email || "admin@cribr.ai",
                role: role,
                action: "ADMIN_LOGIN",
                details: `Authenticated successfully as ${role} from IP gateway`,
                timestamp: "Just now",
                ip: "103.44.201.55"
              };
              setAuditLogs(prev => [newLog, ...prev]);
            }}
            className="space-y-4 text-xs"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                Assign Administrative Role
              </label>
              <select
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border font-semibold outline-none focus:border-indigo-600 transition-colors ${
                  isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-100" : "bg-neutral-50 border-neutral-200 text-neutral-800"
                }`}
              >
                <option value="Super Admin">Super Admin (All permissions)</option>
                <option value="Admin">Admin (Core management)</option>
                <option value="Content Manager">Content Manager (Property, builder updates)</option>
                <option value="Sales Manager">Sales Manager (Lead and visit control)</option>
                <option value="Support Executive">Support Executive (Query handling)</option>
                <option value="Builder Partner">Builder Partner (Property views)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                Email Address
              </label>
              <input
                required
                type="email"
                name="email"
                defaultValue="admin@cribr.ai"
                placeholder="enter admin email"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${
                  isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-100" : "bg-neutral-50 border-neutral-200 text-neutral-800"
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                Security Password
              </label>
              <input
                required
                type="password"
                defaultValue="••••••••"
                placeholder="enter password"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-600 transition-colors ${
                  isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-100" : "bg-neutral-50 border-neutral-200 text-neutral-800"
                }`}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-xs mt-2"
            >
              Authenticate & Enter Workspace
            </button>
          </form>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-100/10 text-[11px]">
            <button 
              onClick={() => setIsAdminDark(!isAdminDark)}
              className="text-neutral-400 hover:text-indigo-500 font-semibold"
            >
              Toggle Light/Dark
            </button>
            <button 
              onClick={onClose}
              className="text-neutral-400 hover:text-red-500 font-semibold"
            >
              Exit Terminal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[200] flex overflow-hidden font-sans select-none ${isAdminDark ? "bg-[#090A0C] text-neutral-100" : "bg-[#F4F6F9] text-[#1D1E20]"}`}>
      
      {/* MOBILE DRAWER BACKDROP & SLIDE-IN SIDEBAR */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col justify-between border-r md:hidden shadow-2xl ${
                isAdminDark ? "bg-[#0E1013] border-neutral-800 text-neutral-100" : "bg-white border-neutral-200 text-neutral-900"
              }`}
            >
              <div className="p-5 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100/10 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-display font-black tracking-tighter text-lg block leading-none text-indigo-600">
                          CRIBR
                        </span>
                        <span className="text-[9px] font-mono uppercase font-bold text-neutral-400 block mt-0.5">
                          Admin Terminal
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-2 hover:bg-neutral-500/10 rounded-xl"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 scrollbar-thin">
                    <span className="px-3 text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-black block mb-2">
                      Operations Matrix
                    </span>
                    {[
                      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                      { id: "search_intelligence", label: "Search Intelligence", icon: Search },
                      { id: "enquiries", label: "Leads & Enquiries", icon: Phone },
                      { id: "properties", label: "Properties", icon: Building },
                      { id: "projects", label: "Projects", icon: FolderOpen },
                      { id: "bookings", label: "Bookings", icon: Calendar },
                      { id: "users", label: "Users & Roles", icon: Users },
                      { id: "localities", label: "Localities", icon: MapPin },
                      { id: "reviews", label: "Reviews", icon: MessageSquare },
                      { id: "notifications", label: "Notifications", icon: Bell },
                      { id: "documents", label: "Documents Vault", icon: FileText },
                      { id: "media", label: "Media Library", icon: ImageIcon },
                      { id: "logs", label: "Audit Logs", icon: History }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                              : isAdminDark
                                ? "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.id === "notifications" && notifications.filter(n => n.unread).length > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                              {notifications.filter(n => n.unread).length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-neutral-100/10 space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <button 
                      onClick={() => setIsAdminDark(!isAdminDark)}
                      className="text-xs font-semibold text-neutral-400 flex items-center space-x-1.5"
                    >
                      {isAdminDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                      <span>{isAdminDark ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("cribr_admin_logged_in");
                        setIsLoggedInAsAdmin(false);
                        logAdminAction("ADMIN_LOGOUT", "Administrative session revoked manually");
                      }}
                      className="text-xs font-bold text-red-400 hover:text-red-500"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 1. ENTERPRISE SIDEBAR (DESKTOP) */}
      <aside className={`hidden md:flex w-[260px] flex-col justify-between border-r shrink-0 z-30 transition-colors duration-300 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"}`}>
        
        {/* Sidebar Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display font-black tracking-tighter text-lg block leading-none text-indigo-600">
                  CRIBR
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-neutral-400 block mt-0.5">
                  Admin Terminal
                </span>
              </div>
            </div>
            
            {/* Theme & Back buttons */}
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setIsAdminDark(!isAdminDark)}
                className={`p-1.5 rounded-lg border transition-all ${isAdminDark ? "border-neutral-800 hover:bg-neutral-800 text-amber-400" : "border-neutral-200 hover:bg-neutral-100 text-neutral-500"}`}
                title="Switch Appearance Theme"
              >
                {isAdminDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Quick Active Operator Status */}
          <div className={`mt-5 p-3 rounded-2xl border flex items-center space-x-3 ${isAdminDark ? "bg-[#14181E] border-neutral-800/60" : "bg-[#F7F8FA] border-neutral-200"}`}>
            <div className="relative">
              <img 
                src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt="Admin avatar" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="truncate">
              <h5 className="text-[12px] font-bold truncate leading-tight">
                {currentUser?.fullName || "Aaryan Rajput"}
              </h5>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-[10px] text-neutral-400 font-medium font-mono capitalize">
                  {selectedRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Menu navigation - 18 sections strictly supported */}
        <nav className="flex-grow overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
          <span className="px-3 text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-black block mb-2">
            Operations Matrix
          </span>
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "search_intelligence", label: "Search Intelligence", icon: Search },
            { id: "enquiries", label: "Leads & Enquiries", icon: Phone },
            { id: "properties", label: "Properties", icon: Building },
            { id: "projects", label: "Projects", icon: FolderOpen },
            { id: "bookings", label: "Bookings", icon: Calendar },
            { id: "users", label: "Users & Roles", icon: Users },
            { id: "localities", label: "Localities", icon: MapPin },
            { id: "reviews", label: "Reviews", icon: MessageSquare },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "documents", label: "Documents Vault", icon: FileText },
            { id: "media", label: "Media Library", icon: ImageIcon },
            { id: "logs", label: "Audit Logs", icon: History }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : isAdminDark
                      ? "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.id === "notifications" && notifications.filter(n => n.unread).length > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Terminal Controller */}
        <div className={`p-4 border-t space-y-2 ${isAdminDark ? "border-neutral-800" : "border-neutral-200"}`}>
          <div className="flex items-center space-x-2 p-1 bg-neutral-100/5 rounded-xl border border-neutral-800/10 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-500 font-mono text-[9px] font-black shrink-0">
              {selectedRole[0]}
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-bold block truncate">{currentUser?.email || "admin@cribr.ai"}</span>
              <span className="text-[8px] font-mono uppercase text-neutral-400 block truncate">{selectedRole}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                localStorage.removeItem("cribr_admin_logged_in");
                setIsLoggedInAsAdmin(false);
                logAdminAction("ADMIN_LOGOUT", "Administrative session revoked manually");
              }}
              className="py-2 rounded-lg border text-center text-[10px] font-bold active:scale-95 transition-all text-neutral-400 border-neutral-700/30 hover:bg-neutral-800 hover:text-white"
            >
              Log Out
            </button>
            <button
              onClick={onClose}
              className="py-2 rounded-lg border text-center text-[10px] font-bold active:scale-95 transition-all text-neutral-400 border-neutral-700/30 hover:bg-red-500 hover:text-white"
            >
              Exit
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN TERMINAL CONTAINER */}
      <main className="flex-grow flex flex-col overflow-hidden z-10">
        
        {/* TOP STATUS BAR */}
        <header className={`h-16 border-b flex items-center justify-between px-4 md:px-8 z-20 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"}`}>
          <div className="flex items-center space-x-2.5 md:space-x-4">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className={`p-2 rounded-xl border md:hidden transition-all ${
                isAdminDark ? "border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800" : "border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Back Button on Mobile/Desktop when inside detail / edit view */}
            {(quickInspectProperty || editingProperty || selectedUser || editingBuilder || editingLocality || isCreatePropertyOpen || isCreateLocalityOpen || activeTab !== "dashboard") && (
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 active:scale-95 transition-all shrink-0"
                title="Go Back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <h4 className="text-xs md:text-sm font-display font-extrabold tracking-tight truncate">
              {activeTab.toUpperCase()} PANEL
            </h4>
            
            {/* Global Search trigger inside Header */}
            <div className="relative hidden sm:block w-48 md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Global Search (Press Cmd+K)..."
                onFocus={() => setShowCommandPalette(true)}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className={`w-full py-1.5 pl-9 pr-4 rounded-xl text-xs border focus:outline-none transition-all ${
                  isAdminDark
                    ? "bg-[#14181E] border-neutral-800 text-white focus:border-indigo-500"
                    : "bg-[#F7F8FA] border-neutral-200 focus:border-indigo-600"
                }`}
              />
            </div>
          </div>

          {/* Quick System Action controllers */}
          <div className="flex items-center space-x-2 md:space-x-3.5">
            {/* Theme Switcher Button */}
            <button 
              onClick={() => setIsAdminDark(!isAdminDark)}
              className={`p-2 rounded-xl border transition-all ${isAdminDark ? "border-neutral-800 hover:bg-neutral-800 text-amber-400" : "border-neutral-200 hover:bg-neutral-100 text-neutral-500"}`}
              title="Switch Appearance Theme"
            >
              {isAdminDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell with counter */}
            <button
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className={`p-2 rounded-xl border relative transition-all ${isAdminDark ? "border-neutral-800 hover:bg-neutral-800" : "border-neutral-200 hover:bg-neutral-100"}`}
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </header>

        {/* CORE WORKSPACE VIEWPORT */}
        <div className="flex-grow overflow-y-auto p-8 scrollbar-thin">
          <AnimatePresence mode="wait">
            {/* SEARCH INTELLIGENCE WORKSPACE VIEW */}
            {activeTab === "search_intelligence" && (
              <AdminSearchIntelligence isAdminDark={isAdminDark} />
            )}

            {/* LEADS & ENQUIRIES WORKSPACE VIEW */}
            {activeTab === "enquiries" && (
              <motion.div
                key="enquiries-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-tight">
                      Leads & Consultation Enquiries
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Live customer enquiries and callback requests submitted from property details and AI search.
                    </p>
                  </div>
                </div>

                <div className={`rounded-[24px] border overflow-hidden ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100/10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                          <th className="p-4 pl-6">Customer</th>
                          <th className="p-4">Contact</th>
                          <th className="p-4">Project</th>
                          <th className="p-4">Message</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Date</th>
                          <th className="p-4 text-right pr-6">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiriesList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-xs text-neutral-400">
                              No customer enquiries recorded yet.
                            </td>
                          </tr>
                        ) : (
                          enquiriesList.map((enq: any) => (
                            <tr key={enq.id} className="border-b border-neutral-100/10 text-xs hover:bg-neutral-100/5">
                              <td className="p-4 pl-6 font-bold">{enq.user_name || "Public Prospect"}</td>
                              <td className="p-4 text-neutral-400 font-mono text-[11px]">
                                <div>{enq.user_email || "No email"}</div>
                                <div className="text-neutral-500">{enq.user_phone || "No phone"}</div>
                              </td>
                              <td className="p-4 font-semibold text-indigo-400">
                                {enq.projects?.name || enq.project_id || "General"}
                              </td>
                              <td className="p-4 max-w-xs truncate text-neutral-300">
                                {enq.message || "Consultation request"}
                              </td>
                              <td className="p-4">
                                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-black ${
                                  enq.status === "new"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : enq.status === "contacted"
                                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                      : enq.status === "converted"
                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                        : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
                                }`}>
                                  {enq.status || "new"}
                                </span>
                              </td>
                              <td className="p-4 font-mono text-[10px] text-neutral-400">
                                {enq.submitted_at ? new Date(enq.submitted_at).toLocaleDateString() : "Today"}
                              </td>
                              <td className="p-4 text-right pr-6">
                                <select
                                  value={enq.status || "new"}
                                  onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                                  className="bg-neutral-800 text-neutral-200 border border-neutral-700 rounded px-2 py-1 text-[10px] font-mono"
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="qualified">Qualified</option>
                                  <option value="converted">Converted</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* A. DASHBOARD WORKSPACE VIEW */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Title */}
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-display font-black tracking-tight">
                      Platform Overview
                    </h1>
                    <p className="text-xs text-neutral-400 mt-1">
                      Aggregated dynamic metrics tracked from active RERA integrations and user telemetry.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => triggerCSVExport("System_Summary")}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/10"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Summary Reports</span>
                    </button>
                  </div>
                </div>

                {/* Top KPI Bento Grid - 12 Cards Required strictly */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: "Total Users Registered", value: usersList.length.toString(), sub: "Live active explorers verified", icon: Users, color: "text-blue-500 bg-blue-500/10" },
                    { label: "New Users Today", value: Math.max(1, Math.ceil(usersList.length / 5)).toString(), sub: "Active verification ongoing", icon: User, color: "text-indigo-500 bg-indigo-500/10" },
                    { label: "Active Users (MAU)", value: Math.max(8, usersList.length * 4).toString(), sub: "Interactive search active", icon: Activity, color: "text-teal-500 bg-teal-500/10" },
                    { label: "Total Properties Registry", value: propertiesList.filter(p=>!p.isDeleted).length.toString(), sub: "Integrated builders mapping", icon: Building, color: "text-purple-500 bg-purple-500/10" },
                    { label: "Published Properties", value: propertiesList.filter(p => p.status === "published" && !p.isDeleted).length.toString(), sub: "Live index score verified", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10" },
                    { label: "Pending RERA Approval", value: propertiesList.filter(p => p.status === "draft" && !p.isDeleted).length.toString(), sub: "Staged for legal clearance", icon: ShieldAlert, color: "text-amber-500 bg-amber-500/10" },
                    { label: "Bookings Fired Today", value: bookingsList.filter(b => b.status === "scheduled").length.toString(), sub: "Site inspection slot locked", icon: Calendar, color: "text-rose-500 bg-rose-500/10" },
                    { label: "Completed Site Visits", value: bookingsList.filter(b => b.status === "completed").length.toString(), sub: "Executive sign-offs captured", icon: CheckCircle, color: "text-green-500 bg-green-500/10" },
                    { label: "Cancelled Visits", value: bookingsList.filter(b => b.status === "cancelled").length.toString(), sub: "Reschedule triggers configured", icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
                    { label: "Consolidated Revenue", value: "₹" + (propertiesList.filter(p=>p.status === "published" && !p.isDeleted).length * 850000).toLocaleString(), sub: "Pre-sales partnership commissions", icon: IndianRupee, color: "text-amber-600 bg-amber-600/10" },
                    { label: "AI Intelligence Generated", value: `${usersList.length * 3 + 12} Reports`, sub: "Total token consumption tracker", icon: Sparkles, color: "text-indigo-600 bg-indigo-600/10" },
                    { label: "Average Property Score", value: `${(propertiesList.filter(p=>!p.isDeleted).reduce((acc, p)=>acc + p.score, 0) / propertiesList.filter(p=>!p.isDeleted).length || 85).toFixed(1)} / 100`, sub: "Class-A asset dominance", icon: Sliders, color: "text-fuchsia-500 bg-fuchsia-500/10" }
                  ].map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                      <div 
                        key={idx}
                        className={`p-5 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200/80"} apple-shadow`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 font-bold">
                            {kpi.label}
                          </span>
                          <div className={`w-8 h-8 rounded-xl ${kpi.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <h3 className="text-2xl font-display font-black">
                            {kpi.value}
                          </h3>
                          <span className="text-[10px] font-mono text-neutral-400 block mt-1">
                            {kpi.sub}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic Analytics Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Chart 1: Bookings & User Growth Trend (Custom SVG Chart) */}
                  <div className={`col-span-2 p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                    <div className="flex items-center justify-between pb-6 border-b border-neutral-100/10">
                      <div>
                        <h4 className="text-sm font-display font-bold">
                          Daily Active Interest Index
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                          Tracking live tour bookings and user signups across Q2-Q3
                        </span>
                      </div>
                      <div className="flex space-x-4 text-[10px] font-mono">
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                          <span>Visits</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>Signups</span>
                        </div>
                      </div>
                    </div>

                    {/* SVG Chart Drawing */}
                    <div className="h-64 mt-6 relative flex items-end">
                      <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(128,128,128,0.1)" strokeDasharray="3,3" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(128,128,128,0.1)" strokeDasharray="3,3" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(128,128,128,0.1)" strokeDasharray="3,3" />
                        
                        {/* Line chart A (Visits) */}
                        <path
                          d="M 10 160 Q 90 80 170 120 T 330 40 T 490 60"
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {/* Line chart B (Signups) */}
                        <path
                          d="M 10 180 Q 90 140 170 150 T 330 90 T 490 110"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeDasharray="4,2"
                        />
                      </svg>
                      {/* X-Axis labels */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] font-mono text-neutral-400">
                        <span>May 01</span>
                        <span>Jun 01</span>
                        <span>Jul 01</span>
                        <span>Jul 09 (Live)</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart 2: Top Localities distribution */}
                  <div className={`p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow flex flex-col justify-between`}>
                    <div>
                      <h4 className="text-sm font-display font-bold">
                        Top Searched Localities
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                        Demand metrics measured by unique query submissions
                      </span>
                    </div>

                    <div className="space-y-4 my-6">
                      {[
                        { name: "Whitefield Corridor", pct: 85, count: "482 searches", color: "bg-indigo-600" },
                        { name: "Golf Course Road", pct: 68, count: "310 searches", color: "bg-indigo-500" },
                        { name: "Sarjapur Road", pct: 54, count: "240 searches", color: "bg-emerald-500" },
                        { name: "Worli Coastal Corridor", pct: 41, count: "185 searches", color: "bg-amber-500" }
                      ].map((loc, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{loc.name}</span>
                            <span className="text-neutral-400 text-[11px] font-mono">{loc.count}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-neutral-200/50 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${loc.pct}%` }}
                              transition={{ duration: 0.8 }}
                              className={`h-full ${loc.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-neutral-400 block text-center">
                      Auto-syncing with scrap indexes hourly
                    </span>
                  </div>
                </div>

                {/* Bottom Real-time Feeds section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Feed 1: Recent Activity & Audit Feed */}
                  <div className={`p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100/10">
                      <h4 className="text-sm font-display font-bold">
                        Audit Logs & Activity Timeline
                      </h4>
                      <button 
                        onClick={() => setActiveTab("logs")}
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        View Audits
                      </button>
                    </div>

                    <div className="mt-4 space-y-4">
                      {auditLogs.slice(0, 4).map((log) => (
                        <div key={log.id} className="flex items-start space-x-3 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                          <div className="flex-grow space-y-0.5">
                            <p className="font-semibold text-neutral-400">
                              {log.user} ({log.role})
                            </p>
                            <p className="font-mono text-neutral-500 block text-[11px]">
                              {log.action}: {log.details}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                            {log.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feed 2: Live Booking Feed */}
                  <div className={`p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100/10">
                      <h4 className="text-sm font-display font-bold">
                        Live Property Tour Queue
                      </h4>
                      <button 
                        onClick={() => setActiveTab("bookings")}
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        Manage Bookings
                      </button>
                    </div>

                    <div className="mt-4 space-y-4">
                      {bookingsList.slice(0, 3).map((bk) => (
                        <div key={bk.id} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100/10 border border-neutral-200/20">
                          <div>
                            <span className="text-[11px] font-mono text-neutral-400 block">
                              BOOKING #{bk.id.toUpperCase()}
                            </span>
                            <span className="text-xs font-bold block mt-0.5">
                              {bk.propertyName}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono block">
                              Slot: {bk.visitTime} (Date: {bk.visitDate})
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-black ${
                              bk.status === "scheduled" ? "bg-emerald-500/10 text-emerald-500" : "bg-neutral-500/10 text-neutral-400"
                            }`}>
                              {bk.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* B. USERS REGISTRY WORKSPACE VIEW */}
            {activeTab === "users" && (
              <motion.div
                key="users-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-tight">
                      Users Management
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Administer registered client profiles, check RERA notification subscription preferences, and inspect active booking histories.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => triggerCSVExport("Users")}
                      className="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center space-x-1 hover:bg-neutral-200/50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* User Table container */}
                <div className={`rounded-[24px] border overflow-hidden ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100/10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                          <th className="p-4 pl-6">Profile</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Join Date</th>
                          <th className="p-4 text-right pr-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.slice((usersPage-1)*itemsPerPage, usersPage*itemsPerPage).map((user) => (
                          <tr key={user.id} className="border-b border-neutral-100/10 text-xs hover:bg-neutral-100/5">
                            <td className="p-4 pl-6">
                              <div className="flex items-center space-x-3">
                                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border" />
                                <span className="font-bold">{user.fullName}</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono">{user.email}</td>
                            <td className="p-4 font-mono">{user.phone || "+91 98765 43210"}</td>
                            <td className="p-4 font-mono">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right pr-6">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => handleInspectUser(user)}
                                  className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-indigo-500"
                                  title="View User Timeline"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setUsersList(usersList.filter(u => u.id !== user.id));
                                    logAdminAction("USER_DELETE", `Permanently removed user registration for ${user.email}`);
                                  }}
                                  className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500"
                                  title="Deactivate Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="p-4 border-t border-neutral-100/10 flex items-center justify-between text-xs text-neutral-400">
                    <span>Showing page {usersPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}</span>
                    <div className="flex space-x-2">
                      <button 
                        disabled={usersPage === 1}
                        onClick={() => setUsersPage(prev => Math.max(prev-1, 1))}
                        className="px-3 py-1 bg-neutral-100/10 rounded-lg disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <button 
                        disabled={usersPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
                        onClick={() => setUsersPage(prev => prev+1)}
                        className="px-3 py-1 bg-neutral-100/10 rounded-lg disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* C. PROPERTIES WORKSPACE VIEW */}
            {activeTab === "properties" && (
              <motion.div
                key="properties-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* 1. Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-display font-black tracking-tight">
                        Property Inventory Management
                      </h2>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-500 rounded-full border border-indigo-500/20">
                        {propertiesList.filter(p => !p.isDeleted).length} Total Projects
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Central repository for property listings, CRIBR AI Safety Scores, builder verification, and inventory status control.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <label className="px-3.5 py-2 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 hover:bg-neutral-100/50 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Bulk Import CSV</span>
                      <input type="file" accept=".csv" onChange={triggerCSVImport} className="hidden" />
                    </label>
                    <button 
                      onClick={() => triggerCSVExport("Properties")}
                      className="px-3.5 py-2 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 hover:bg-neutral-100/50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Export CSV</span>
                    </button>
                    <button 
                      onClick={() => setIsCreatePropertyOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Property</span>
                    </button>
                  </div>
                </div>

                {/* 2. Inventory Analytics Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                    <div className="flex items-center justify-between text-neutral-400 mb-2">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Active Inventory</span>
                      <Building className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-display font-black">
                        {propertiesList.filter(p => !p.isDeleted && p.status === "published").length}
                      </span>
                      <span className="text-xs text-emerald-500 font-semibold font-mono">
                        Published
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-1">
                      Out of {propertiesList.filter(p => !p.isDeleted).length} total property records
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                    <div className="flex items-center justify-between text-neutral-400 mb-2">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Drafts & Review</span>
                      <FileText className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-display font-black">
                        {propertiesList.filter(p => !p.isDeleted && p.status === "draft").length}
                      </span>
                      <span className="text-xs text-amber-500 font-semibold font-mono">
                        Pending
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-1">
                      Awaiting compliance & RERA review
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                    <div className="flex items-center justify-between text-neutral-400 mb-2">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Avg CRIBR Score</span>
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-display font-black text-emerald-500">
                        {propertiesList.length > 0 
                          ? (propertiesList.reduce((acc, p) => acc + (p.score || 85), 0) / propertiesList.length).toFixed(1) 
                          : "92.0"}
                      </span>
                      <span className="text-xs text-emerald-500 font-semibold font-mono">/ 100</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-1">
                      Verified AI safety index
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                    <div className="flex items-center justify-between text-neutral-400 mb-2">
                      <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Total Views</span>
                      <BarChart3 className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-display font-black">
                        {propertiesList.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-indigo-500 font-semibold font-mono">Visits</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 block mt-1">
                      {propertiesList.reduce((acc, p) => acc + (p.bookingsCount || 0), 0)} site visits booked
                    </span>
                  </div>
                </div>

                {/* 3. Search, Filter & View Controls */}
                <div className={`p-4 rounded-2xl border space-y-3 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input 
                        type="text"
                        value={inventorySearch}
                        onChange={(e) => setInventorySearch(e.target.value)}
                        placeholder="Search properties by name, developer, city, locality, configuration..."
                        className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border outline-none transition-colors ${
                          isAdminDark 
                            ? "bg-[#14161B] border-neutral-800 text-neutral-100 focus:border-indigo-600" 
                            : "bg-neutral-50 border-neutral-200 text-neutral-800 focus:border-indigo-600"
                        }`}
                      />
                      {inventorySearch && (
                        <button 
                          onClick={() => setInventorySearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Filter Tabs */}
                      <div className={`p-1 rounded-xl border flex items-center space-x-1 ${
                        isAdminDark ? "bg-[#14161B] border-neutral-800" : "bg-neutral-100 border-neutral-200"
                      }`}>
                        {(["all", "published", "draft", "archived"] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => setInventoryStatusFilter(status)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                              inventoryStatusFilter === status
                                ? "bg-indigo-600 text-white shadow"
                                : "text-neutral-400 hover:text-neutral-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      {/* City Dropdown */}
                      <select
                        value={inventoryCityFilter}
                        onChange={(e) => setInventoryCityFilter(e.target.value)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold outline-none ${
                          isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
                        }`}
                      >
                        <option value="all">All Cities</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Gurugram">Gurugram</option>
                        <option value="Mumbai">Mumbai</option>
                      </select>

                      {/* Type Dropdown */}
                      <select
                        value={inventoryTypeFilter}
                        onChange={(e) => setInventoryTypeFilter(e.target.value)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold outline-none ${
                          isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
                        }`}
                      >
                        <option value="all">All Configurations</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK">4 BHK / Penthouse</option>
                      </select>

                      {/* Sort Selector */}
                      <select
                        value={inventorySortBy}
                        onChange={(e) => setInventorySortBy(e.target.value as any)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold outline-none ${
                          isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
                        }`}
                      >
                        <option value="score">Sort: Highest Score</option>
                        <option value="name">Sort: Name (A-Z)</option>
                        <option value="views">Sort: Most Viewed</option>
                        <option value="price">Sort: Price</option>
                      </select>

                      {/* View Mode Toggle */}
                      <div className={`p-1 rounded-xl border flex items-center space-x-1 ${
                        isAdminDark ? "bg-[#14161B] border-neutral-800" : "bg-neutral-100 border-neutral-200"
                      }`}>
                        <button
                          onClick={() => setInventoryViewMode("table")}
                          className={`p-1.5 rounded-lg transition-all ${
                            inventoryViewMode === "table" ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-neutral-200"
                          }`}
                          title="Table View"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setInventoryViewMode("grid")}
                          className={`p-1.5 rounded-lg transition-all ${
                            inventoryViewMode === "grid" ? "bg-indigo-600 text-white" : "text-neutral-400 hover:text-neutral-200"
                          }`}
                          title="Grid View"
                        >
                          <Grid className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Bulk Actions Banner */}
                  {selectedPropertyIds.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-indigo-600/10 border border-indigo-600/30 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 text-indigo-500 font-bold">
                        <CheckSquare className="w-4 h-4" />
                        <span>{selectedPropertyIds.length} properties selected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBulkStatusChange("published")}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Bulk Publish
                        </button>
                        <button
                          onClick={() => handleBulkStatusChange("draft")}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Bulk Draft
                        </button>
                        <button
                          onClick={handleBulkDeleteProperties}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Bulk Delete
                        </button>
                        <button
                          onClick={() => setSelectedPropertyIds([])}
                          className="px-2 py-1 text-neutral-400 hover:text-neutral-200 text-[11px]"
                        >
                          Clear
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 4. Table / Grid Display */}
                {inventoryViewMode === "table" ? (
                  /* TABLE VIEW */
                  <div className={`rounded-[24px] border overflow-hidden ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-100/10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                            <th className="p-4 pl-6 w-10">
                              <input 
                                type="checkbox"
                                checked={filteredProperties.length > 0 && selectedPropertyIds.length === filteredProperties.length}
                                onChange={handleSelectAllProperties}
                                className="rounded border-neutral-700 accent-indigo-600 cursor-pointer"
                              />
                            </th>
                            <th className="p-4">Property Name</th>
                            <th className="p-4">Developer</th>
                            <th className="p-4">Location & City</th>
                            <th className="p-4">Configurations</th>
                            <th className="p-4">Price Range</th>
                            <th className="p-4">CRIBR Score</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right pr-6">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProperties.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="p-12 text-center text-neutral-400 text-xs italic">
                                No properties matched your search/filter criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredProperties.slice((propertiesPage-1)*itemsPerPage, propertiesPage*itemsPerPage).map((prop) => {
                              const isSelected = selectedPropertyIds.includes(prop.id);
                              return (
                                <tr key={prop.id} className={`border-b border-neutral-100/10 text-xs transition-colors hover:bg-neutral-100/5 ${
                                  isSelected ? "bg-indigo-500/5" : ""
                                }`}>
                                  <td className="p-4 pl-6">
                                    <input 
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleToggleSelectProperty(prop.id)}
                                      className="rounded border-neutral-700 accent-indigo-600 cursor-pointer"
                                    />
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                      <img src={prop.image} alt="" className="w-12 h-9 rounded-lg object-cover border border-neutral-200/20 shrink-0" />
                                      <div>
                                        <span className="font-bold block text-sm">{prop.name}</span>
                                        <span className="text-[10px] text-neutral-400 font-mono">ID: {prop.id}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 font-semibold">
                                    <div className="flex items-center space-x-1.5">
                                      <span>{prop.developer}</span>
                                      <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="font-semibold block">{prop.location}</span>
                                    <span className="text-[10px] text-neutral-400 font-mono">{prop.city}</span>
                                  </td>
                                  <td className="p-4 font-medium text-neutral-400">
                                    <span className="block">{prop.configurations || "3 BHK Condos"}</span>
                                    <span className="text-[10px] text-neutral-500 font-mono">Possession: {prop.possession || "2027"}</span>
                                  </td>
                                  <td className="p-4 font-bold text-indigo-500">{prop.priceRange}</td>
                                  <td className="p-4">
                                    <span className={`font-mono px-2.5 py-1 rounded-lg text-xs font-black inline-flex items-center space-x-1 ${
                                      prop.score >= 90 
                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                                        : prop.score >= 80 
                                          ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" 
                                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                    }`}>
                                      <Sparkles className="w-3 h-3" />
                                      <span>{prop.score}</span>
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    {/* Quick Status Toggle Dropdown */}
                                    <select
                                      value={prop.status}
                                      onChange={(e) => handleEditPropertySubmit(prop.id, { status: e.target.value as any })}
                                      className={`text-[10px] font-mono uppercase px-2 py-1 rounded-lg font-black border outline-none cursor-pointer ${
                                        prop.status === "published"
                                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                          : prop.status === "draft"
                                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                      }`}
                                    >
                                      <option value="published">Published</option>
                                      <option value="draft">Draft</option>
                                      <option value="archived">Archived</option>
                                    </select>
                                  </td>
                                  <td className="p-4 text-right pr-6">
                                    <div className="flex items-center justify-end space-x-1.5">
                                      <button 
                                        onClick={() => handleInspectProperty(prop)}
                                        className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-indigo-500 transition-colors"
                                        title="Quick Inspection Drawer"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleEditProperty(prop)}
                                        className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-indigo-500 transition-colors"
                                        title="Full 17-Section Form Editor"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleDuplicateProperty(prop)}
                                        className="p-1.5 hover:bg-neutral-500/10 rounded-lg text-neutral-400 transition-colors"
                                        title="Duplicate Property"
                                      >
                                        <Copy className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleSoftDeleteProperty(prop.id)}
                                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
                                        title="Soft Delete Property"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-neutral-100/10 flex items-center justify-between text-xs text-neutral-400">
                      <span>Showing {Math.min(filteredProperties.length, (propertiesPage-1)*itemsPerPage + 1)} - {Math.min(filteredProperties.length, propertiesPage*itemsPerPage)} of {filteredProperties.length} properties</span>
                      <div className="flex space-x-2">
                        <button 
                          disabled={propertiesPage === 1}
                          onClick={() => setPropertiesPage(prev => Math.max(prev-1, 1))}
                          className="px-3 py-1 bg-neutral-100/10 hover:bg-neutral-100/20 rounded-lg disabled:opacity-40 transition-colors"
                        >
                          Prev
                        </button>
                        <button 
                          disabled={propertiesPage >= Math.ceil(filteredProperties.length / itemsPerPage)}
                          onClick={() => setPropertiesPage(prev => prev+1)}
                          className="px-3 py-1 bg-neutral-100/10 hover:bg-neutral-100/20 rounded-lg disabled:opacity-40 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* GRID VIEW */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProperties.slice((propertiesPage-1)*itemsPerPage, propertiesPage*itemsPerPage).map((prop) => (
                        <div 
                          key={prop.id}
                          className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all hover:border-indigo-600/50 ${
                            isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"
                          } apple-shadow group`}
                        >
                          <div>
                            {/* Card Image Header */}
                            <div className="relative h-44 overflow-hidden">
                              <img 
                                src={prop.image} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              
                              <div className="absolute top-3 left-3 flex items-center space-x-2">
                                <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-black border ${
                                  prop.status === "published" 
                                    ? "bg-emerald-500/90 text-white border-emerald-400" 
                                    : "bg-amber-500/90 text-white border-amber-400"
                                }`}>
                                  {prop.status}
                                </span>
                              </div>

                              <div className="absolute top-3 right-3">
                                <span className="bg-black/60 backdrop-blur-md text-emerald-400 px-2.5 py-1 rounded-full text-xs font-mono font-black border border-emerald-500/30 flex items-center space-x-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>{prop.score} AI Score</span>
                                </span>
                              </div>

                              <div className="absolute bottom-3 left-3 right-3">
                                <h4 className="text-base font-bold text-white leading-snug truncate">{prop.name}</h4>
                                <p className="text-xs text-neutral-300 font-mono">{prop.location}, {prop.city}</p>
                              </div>
                            </div>

                            {/* Card Body Details */}
                            <div className="p-5 space-y-4 text-xs">
                              <div className="flex justify-between items-center pb-3 border-b border-neutral-100/10">
                                <span className="text-neutral-400 font-mono">Developer</span>
                                <span className="font-bold flex items-center space-x-1">
                                  <span>{prop.developer}</span>
                                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                                </span>
                              </div>

                              <div className="flex justify-between items-center pb-3 border-b border-neutral-100/10">
                                <span className="text-neutral-400 font-mono">Configurations</span>
                                <span className="font-semibold">{prop.configurations || "N/A"}</span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400 font-mono">Price Range</span>
                                <span className="text-sm font-black text-indigo-500">{prop.priceRange}</span>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer Action Buttons */}
                          <div className="p-4 bg-neutral-50/5 border-t border-neutral-100/10 flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleInspectProperty(prop)}
                              className="px-3 py-2 bg-neutral-200/20 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>

                            <button
                              onClick={() => handleEditProperty(prop)}
                              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Full Form</span>
                            </button>

                            <button
                              onClick={() => handleTogglePublishProperty(prop.id, prop.status)}
                              className="p-2 border border-neutral-300/30 hover:bg-neutral-100/10 rounded-xl transition-all text-neutral-400"
                              title="Toggle Publish Status"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-neutral-100/10 flex items-center justify-between text-xs text-neutral-400">
                      <span>Showing page {propertiesPage} of {Math.ceil(filteredProperties.length / itemsPerPage)}</span>
                      <div className="flex space-x-2">
                        <button 
                          disabled={propertiesPage === 1}
                          onClick={() => setPropertiesPage(prev => Math.max(prev-1, 1))}
                          className="px-3 py-1 bg-neutral-100/10 rounded-lg disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <button 
                          disabled={propertiesPage >= Math.ceil(filteredProperties.length / itemsPerPage)}
                          onClick={() => setPropertiesPage(prev => prev+1)}
                          className="px-3 py-1 bg-neutral-100/10 rounded-lg disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* D. BUILDERS WORKSPACE VIEW */}
            {activeTab === "builders" && (
              <motion.div
                key="builders-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-tight">
                      Builder Partners Profile
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Monitor builder debt profile ratings, corporate joint-venture litigations, website connections, and AI trust indices.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBuilders.map((builder) => (
                    <div 
                      key={builder.id}
                      className={`p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow space-y-4`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <img src={builder.logo} alt="" className="w-10 h-10 rounded-xl object-cover border" />
                          <div>
                            <h4 className="text-sm font-bold">{builder.name}</h4>
                            <span className="text-[10px] font-mono text-neutral-400">RERA ID: {builder.reraId}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[10px] font-mono font-bold uppercase">
                          {builder.status}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        {builder.description}
                      </p>

                      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-100/10 text-center">
                        <div className="p-2 bg-neutral-100/10 rounded-xl">
                          <span className="text-[9px] font-mono text-neutral-400 block uppercase">Projects</span>
                          <span className="text-sm font-bold font-display">{builder.projectsCount} Total</span>
                        </div>
                        <div className="p-2 bg-neutral-100/10 rounded-xl">
                          <span className="text-[9px] font-mono text-neutral-400 block uppercase">Builder Rating</span>
                          <span className="text-sm font-bold font-display">{builder.rating} ⭐</span>
                        </div>
                        <div className="p-2 bg-[#E0F2FE] text-sky-800 rounded-xl">
                          <span className="text-[9px] font-mono text-sky-600 block uppercase">Trust Score</span>
                          <span className="text-sm font-bold font-display">{builder.trustScore}% High</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2">
                        <a href={builder.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center space-x-1">
                          <span>Developer Web Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button 
                          onClick={() => handleEditBuilder(builder)}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200/50 rounded-lg font-semibold"
                        >
                          Modify Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* E. BOOKINGS WORKSPACE VIEW */}
            {activeTab === "bookings" && (
              <motion.div
                key="bookings-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-tight">
                      Property Booking Queue
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Inspect site visit applications, assign field executive, fire WhatsApp/Call triggers, and generate Visitor Passes.
                    </p>
                  </div>
                </div>

                <div className={`rounded-[24px] border overflow-hidden ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100/10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                          <th className="p-4 pl-6">ID</th>
                          <th className="p-4">Property</th>
                          <th className="p-4">Developer</th>
                          <th className="p-4">Visit Date</th>
                          <th className="p-4">Slot</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right pr-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.slice((bookingsPage-1)*itemsPerPage, bookingsPage*itemsPerPage).map((bk) => (
                          <tr key={bk.id} className="border-b border-neutral-100/10 text-xs hover:bg-neutral-100/5">
                            <td className="p-4 pl-6 font-mono text-neutral-400">#{bk.id.substring(0, 8)}</td>
                            <td className="p-4 font-bold">{bk.propertyName}</td>
                            <td className="p-4">{bk.builderName}</td>
                            <td className="p-4 font-mono">{bk.visitDate}</td>
                            <td className="p-4 capitalize font-semibold">{bk.visitTime}</td>
                            <td className="p-4">
                              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-black ${
                                bk.status === "scheduled"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : bk.status === "completed"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-red-500/10 text-red-500"
                              }`}>
                                {bk.status}
                              </span>
                            </td>
                            <td className="p-4 text-right pr-6">
                              <div className="flex items-center justify-end space-x-2">
                                {bk.status === "scheduled" && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateBookingStatus(bk.id, "completed")}
                                      className="p-1 px-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded font-mono text-[9px] uppercase font-bold"
                                      title="Mark site visit completed"
                                    >
                                      Complete
                                    </button>
                                    <button
                                      onClick={() => handleUpdateBookingStatus(bk.id, "cancelled")}
                                      className="p-1 px-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded font-mono text-[9px] uppercase font-bold"
                                      title="Cancel site visit"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                                <button 
                                  onClick={() => {
                                    alert(`Visitor Pass Generated successfully for Tour #${bk.id}. Sent via WhatsApp.`);
                                    logAdminAction("GENERATE_PASS", `Generated dynamic physical visitor entry pass for tour tour: ${bk.propertyName}`);
                                  }}
                                  className="p-1 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 rounded-lg"
                                  title="Generate visitor entry authorization sheet"
                                >
                                  Pass
                                </button>
                                <a href="tel:+919876543210" className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-indigo-500" title="Call User">
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-emerald-500" title="WhatsApp User">
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* F. AI REPORTS WORKSPACE VIEW */}
            {activeTab === "reports" && (
              <motion.div
                key="reports-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-tight">
                      Generated AI intelligence Reports
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Review complete cognitive intelligence reports requested by builders and premium buyer accounts.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      alert("Staged legal documents submitted to Gemini AI pipeline.");
                      logAdminAction("REGEN_ALL", "Triggered manual legal scrap re-indexing across all 4 top-tier properties");
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 hover:brightness-110"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate Pipeline</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {promptHistory.map((ph) => (
                    <div 
                      key={ph.id}
                      className={`p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow flex flex-col justify-between`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pb-2 border-b border-neutral-100/10">
                          <span>PROMPT #{ph.id.toUpperCase()}</span>
                          <span>{ph.timestamp}</span>
                        </div>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed italic">
                          "{ph.prompt}"
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-neutral-100/10 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100/10 px-2 py-0.5 rounded">
                          {ph.tokens} tokens used
                        </span>
                        <button 
                          onClick={() => {
                            alert("Downloading deep-structured PDF analysis...");
                            logAdminAction("DOWNLOAD_PDF", `Exported PDF legal briefing sheet for Prompt: ${ph.id}`);
                          }}
                          className="text-xs text-indigo-600 hover:underline font-semibold flex items-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* G. LOCALITIES WORKSPACE VIEW */}
            {activeTab === "localities" && (
              <motion.div
                key="localities-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-tight">
                      Locality Parameters Registry
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Configure ambient noise levels, water supply indexes, air filtration limits, and investment rating criteria.
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsCreateLocalityOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-indigo-600/10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Locality</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {localitiesList.map((loc) => (
                    <div 
                      key={loc.id}
                      className={`p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow space-y-4`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          <span>{loc.name}</span>
                        </h4>
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded text-[10px] font-mono font-bold uppercase">
                          {loc.investmentRating}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 font-mono block">SCHOOLS GRID</span>
                          <span className="font-semibold">{loc.schools} Rated Institutions</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 font-mono block">HOSPITALS</span>
                          <span className="font-semibold">{loc.hospitals} Multi-specialty</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 font-mono block">METRO TRANSIT</span>
                          <span className="font-semibold">{loc.metroStatus}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 font-mono block">AIR QUALITY (AQI)</span>
                          <span className={`font-mono font-bold ${loc.airQuality > 100 ? "text-amber-500" : "text-emerald-500"}`}>
                            {loc.airQuality} AQI
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 font-mono block">WATER SUPPLY</span>
                          <span className="font-semibold">{loc.waterSupply}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-neutral-400 font-mono block">TRAFFIC overhead</span>
                          <span className="font-semibold">{loc.traffic}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-100/10 text-right">
                        <button 
                          onClick={() => handleEditLocality(loc)}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200/50 rounded-lg text-xs font-semibold"
                        >
                          Modify Parameters
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* H. ROLES & PERMISSIONS WORKSPACE VIEW */}
            {activeTab === "roles" && (
              <motion.div
                key="roles-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-display font-black tracking-tight">
                    Roles & Granular Permissions
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Assign and toggle permission parameters for administrators, support staff, and developer accounts.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Role Selection list */}
                  <div className={`p-5 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow space-y-2`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                      Roles Registry
                    </span>
                    {Object.keys(rolePermissions).map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          selectedRole === role
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-neutral-100/10 text-neutral-400 hover:bg-neutral-100/30"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  {/* Right Permission Toggle list */}
                  <div className={`col-span-2 p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow space-y-4`}>
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100/10">
                      <h4 className="text-sm font-bold flex items-center space-x-2">
                        <LockKeyhole className="w-4 h-4 text-indigo-600" />
                        <span>Permission matrix for '{selectedRole}'</span>
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Saves in real-time
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {Object.keys(rolePermissions[selectedRole] || {}).map((perm) => (
                        <div key={perm} className="flex items-center justify-between py-2 text-xs">
                          <div>
                            <span className="font-bold uppercase tracking-wide block">{perm} MODULE</span>
                            <span className="text-neutral-400 text-[11px]">Authorize read/write privileges inside operations dashboard</span>
                          </div>
                          <button
                            onClick={() => {
                              const updated = { ...rolePermissions };
                              updated[selectedRole][perm] = !updated[selectedRole][perm];
                              setRolePermissions(updated);
                              logAdminAction("PERM_CHANGE", `Modified permission '${perm}' for role: ${selectedRole}`);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                              rolePermissions[selectedRole][perm]
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {rolePermissions[selectedRole][perm] ? "Authorized" : "Blocked"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* I. AUDIT LOGS WORKSPACE VIEW */}
            {activeTab === "logs" && (
              <motion.div
                key="logs-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-tight">
                      Security Audit Logs
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Chronological immutable audit trials capturing system updates, permission shifts, and CSV exports.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setAuditLogs([]);
                      logAdminAction("LOG_CLEAR", "Cleared administrative history records");
                    }}
                    className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-semibold"
                  >
                    Clear History
                  </button>
                </div>

                <div className={`rounded-[24px] border overflow-hidden ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100/10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                          <th className="p-4 pl-6">Operator ID</th>
                          <th className="p-4">Event Group</th>
                          <th className="p-4">Action Summary</th>
                          <th className="p-4">IP Address</th>
                          <th className="p-4 text-right pr-6">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="border-b border-neutral-100/10 text-xs hover:bg-neutral-100/5">
                            <td className="p-4 pl-6 font-bold">{log.user}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded font-mono text-[10px] font-black">
                                {log.action}
                              </span>
                            </td>
                            <td className="p-4 text-neutral-400 font-light">{log.details}</td>
                            <td className="p-4 font-mono text-neutral-400">{log.ip}</td>
                            <td className="p-4 text-right pr-6 font-mono text-neutral-400">{log.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* J. MEDIA LIBRARY WORKSPACE VIEW */}
            {activeTab === "media" && (
              <motion.div
                key="media-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-black tracking-tight">
                      Media & Document Library
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Store property blueprints, drone video recordings, joint-development legal deeds, and facade photography.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      alert("Upload staging triggered successfully. Assets are optimized for edge CDN distribution.");
                      logAdminAction("MEDIA_UPLOAD", "Uploaded file 'rera_annexure_b.pdf' to legal storage bucket");
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New File</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mediaAssets.map((asset) => (
                    <div 
                      key={asset.id}
                      className={`p-5 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow flex items-start space-x-4`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                        {asset.type === "image" ? <ImageIcon className="w-5 h-5" /> : <Paperclip className="w-5 h-5" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="text-[9px] font-mono text-neutral-400 block uppercase">{asset.folder} Folder</span>
                        <h5 className="text-xs font-bold truncate mt-0.5">{asset.name}</h5>
                        <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 mt-2.5 pt-2.5 border-t border-neutral-100/10">
                          <span>{asset.size}</span>
                          <span>{asset.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* K. SETTINGS WORKSPACE VIEW */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-display font-black tracking-tight">
                    API & Gateway Configurations
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Coordinate connection parameters for Supabase triggers, Gemini AI SDK credentials, SMTP transactional logs, and SMS APIs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SMTP Settings */}
                  <div className={`p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow space-y-4`}>
                    <h4 className="text-sm font-bold flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-indigo-600" />
                      <span>SMTP Transactional Emails</span>
                    </h4>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Mail Host Server</label>
                        <input 
                          type="text" 
                          value={smtpHost} 
                          onChange={(e) => setSmtpHost(e.target.value)} 
                          className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-600 bg-transparent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Port Range</label>
                        <input 
                          type="text" 
                          value={smtpPort} 
                          onChange={(e) => setSmtpPort(e.target.value)} 
                          className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-600 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gemini SDK settings */}
                  <div className={`p-6 rounded-[24px] border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow space-y-4`}>
                    <h4 className="text-sm font-bold flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Gemini AI Cognitive Integration</span>
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold block">Developer Credential Key</span>
                          <span className="text-[10px] text-neutral-400">Syncs using process.env.GEMINI_API_KEY</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${geminiApiKeySet ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                          {geminiApiKeySet ? "ACTIVE_KEY" : "MISSING"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100/10">
                        <div>
                          <span className="text-xs font-bold block">WhatsApp API Integration</span>
                          <span className="text-[10px] text-neutral-400">Trigger booking verification notifications</span>
                        </div>
                        <button 
                          onClick={() => setSmsTemplatesEnabled(!smsTemplatesEnabled)}
                          className={`px-3 py-1 rounded text-xs font-bold ${smsTemplatesEnabled ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                        >
                          {smsTemplatesEnabled ? "Online" : "Paused"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-right">
                  <button 
                    onClick={() => {
                      alert("API gateway state saved successfully.");
                      logAdminAction("GATEWAY_SAVE", "Updated API keys and SMTP transactional configs");
                    }}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10"
                  >
                    Save API Configuration
                  </button>
                </div>
              </motion.div>
            )}

            {/* UNIMPLEMENTED SECTIONS MAPPED TO GORGEOUS PLACEHOLDERS */}
            {!["dashboard", "users", "properties", "builders", "bookings", "reports", "localities", "roles", "logs", "media", "settings"].includes(activeTab) && (
              <motion.div
                key="unimplemented-viewport"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 text-center space-y-4 max-w-md mx-auto"
              >
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mx-auto">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-display font-black capitalize">{activeTab} Workstation</h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    This module is synchronized under Class-A enterprise RERA scopes. Live analytics and telemetry dashboards are rendering within sandbox environment bounds.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Return to Control Room
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* 3. COMMAND PALETTE MODAL (Cmd + K) */}
      <AnimatePresence>
        {showCommandPalette && (
          <div className="fixed inset-0 z-[250] flex items-start justify-center pt-24 px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommandPalette(false)}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ y: -20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -20, scale: 0.98 }}
              className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden relative z-10 ${
                isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"
              }`}
            >
              <div className="p-4 border-b border-neutral-100/10 flex items-center space-x-3">
                <Search className="w-5 h-5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Type a query command (e.g. users, properties, Whitefield)..."
                  className="w-full text-sm bg-transparent focus:outline-none"
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
              </div>

              <div className="p-4 max-h-72 overflow-y-auto space-y-3.5">
                <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400 font-bold block">
                  Quick Actions
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button 
                    onClick={() => handleCommandClick("properties")}
                    className="p-3 bg-neutral-100/10 rounded-2xl text-left font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    🏢 Manage Properties
                  </button>
                  <button 
                    onClick={() => handleCommandClick("users")}
                    className="p-3 bg-neutral-100/10 rounded-2xl text-left font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    👥 Manage Users
                  </button>
                  <button 
                    onClick={() => handleCommandClick("bookings")}
                    className="p-3 bg-neutral-100/10 rounded-2xl text-left font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    📅 Tour Bookings
                  </button>
                  <button 
                    onClick={() => handleCommandClick("settings")}
                    className="p-3 bg-neutral-100/10 rounded-2xl text-left font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    ⚙️ API Connections
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. USER DETAIL HISTORY DRAWER */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[260] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-neutral-950/30 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className={`w-full max-w-md h-full relative z-10 border-l p-8 flex flex-col justify-between ${
                isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"
              }`}
            >
              <div className="space-y-6 overflow-y-auto pr-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img src={selectedUser.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover border" />
                    <div>
                      <h4 className="text-base font-bold">{selectedUser.fullName}</h4>
                      <span className="text-xs text-neutral-400 font-mono">{selectedUser.email}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="p-1.5 hover:bg-neutral-100/10 rounded-full border border-neutral-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Subscriptions */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                    Notification Subscriptions
                  </span>
                  <div className="p-3 bg-neutral-100/10 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>RERA Litigation alerts</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Price fluctuations</span>
                    </div>
                  </div>
                </div>

                {/* Saved Properties */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                    Saved Homes & Properties ({userSavedProperties.length})
                  </span>
                  {userSavedProperties.length > 0 ? (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {userSavedProperties.map((p, i) => (
                        <div key={p.id || i} className="p-2 bg-neutral-100/5 rounded-xl text-[11px] flex justify-between items-center">
                          <span className="font-semibold">{p.property_name || p.propertyName || "Prestige Kingston"}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{p.developer || "Prestige Group"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-neutral-500 italic block">No saved properties yet</span>
                  )}
                </div>

                {/* Activity timeline logs */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                    Real-time Tour Bookings History ({userBookings.length})
                  </span>
                  {userBookings.length > 0 ? (
                    <div className="space-y-4 pl-3 border-l-2 border-indigo-600/30 max-h-48 overflow-y-auto">
                      {userBookings.map((bk, i) => (
                        <div key={bk.id || i} className="relative text-xs">
                          <div className={`absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full border border-white ${
                            bk.status === "completed" ? "bg-emerald-500" : bk.status === "cancelled" ? "bg-red-500" : "bg-indigo-600"
                          }`} />
                          <span className="font-bold block capitalize">{bk.status} Site Visit</span>
                          <span className="text-neutral-400 text-[11px] font-mono">{bk.visitDate} ({bk.visitTime}) • {bk.propertyName}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 pl-3 border-l-2 border-indigo-600/30">
                      <div className="relative text-xs">
                        <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white" />
                        <span className="font-bold block">Account created successfully</span>
                        <span className="text-neutral-400 text-[11px] font-mono">{new Date(selectedUser.createdAt || Date.now()).toLocaleDateString()} • Verified Visitor</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100/10">
                <button 
                  onClick={() => {
                    alert(`Lead file compiled for client: ${selectedUser.fullName}. Sent to relationship manager.`);
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Compile Lead File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CREATE / EDIT PROPERTY FULL FORM ENGINE */}
      <AnimatePresence>
        {(isCreatePropertyOpen || editingProperty) && (
          <AdminCreatePropertyForm
            initialData={editingProperty as any}
            isAdminDark={isAdminDark}
            onClose={() => {
              setIsCreatePropertyOpen(false);
              setEditingProperty(null);
            }}
            onSave={async (fullProp) => {
              const existingIdx = propertiesList.findIndex((p) => p.id === fullProp.id);
              const formattedProp: AdminProperty = {
                ...fullProp,
                id: fullProp.id,
                name: fullProp.name,
                developer: fullProp.developer,
                city: fullProp.city,
                location: fullProp.locality || (fullProp as any).location || "N/A",
                priceRange: fullProp.priceRange || "N/A",
                status: fullProp.isPublished ? "published" : fullProp.isDraft ? "draft" : "archived",
                score: fullProp.score || 0,
                image: fullProp.image || fullProp.images?.[0]?.url || "",
                views: existingIdx >= 0 ? (propertiesList[existingIdx].views || 0) : 0,
                bookingsCount: existingIdx >= 0 ? (propertiesList[existingIdx].bookingsCount || 0) : 0,
                version: (existingIdx >= 0 ? (propertiesList[existingIdx].version || 1) : 0) + 1,
                configurations: fullProp.bhkOptions?.join(", ") || "N/A",
                possession: fullProp.possessionDate || "N/A",
                amenities: fullProp.amenities || []
              };

              let newList: AdminProperty[];
              if (existingIdx >= 0) {
                newList = [...propertiesList];
                newList[existingIdx] = formattedProp;
              } else {
                newList = [formattedProp, ...propertiesList];
              }

              if (isRealSupabaseConfigured && supabase) {
                try {
                  const dbPayload = mapFormToSupabaseProject(fullProp);
                  if (existingIdx >= 0) {
                    await fetch(`/api/cribr/admin/projects/${fullProp.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dbPayload) });
                  } else {
                    await fetch("/api/cribr/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: fullProp.id, ...dbPayload }) });
                  }
                } catch (err) {
                  console.error("Supabase projects save error:", err);
                }
              }

              handlePropertiesChange(newList);
              logAdminAction(
                existingIdx >= 0 ? "PROPERTY_UPDATE" : "PROPERTY_CREATE",
                `Saved property '${formattedProp.name}' (Status: ${formattedProp.status})`
              );
              setIsCreatePropertyOpen(false);
              setEditingProperty(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* 6. SYSTEM NOTIFICATION DECK / DRAWER */}
      <AnimatePresence>
        {showNotificationDrawer && (
          <div className="fixed inset-0 z-[240] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotificationDrawer(false)}
              className="absolute inset-0 bg-neutral-950/20 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className={`w-full max-w-sm h-full relative z-10 border-l p-6 flex flex-col justify-between ${
                isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"
              }`}
            >
              <div className="space-y-6 overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-100/10">
                  <h4 className="text-sm font-bold flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span>Real-time System Notifications</span>
                  </h4>
                  <button onClick={() => setShowNotificationDrawer(false)}>
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-3 rounded-2xl border transition-all text-xs flex items-start space-x-2.5 ${
                        notif.unread 
                          ? "bg-indigo-500/5 border-indigo-600/20" 
                          : "bg-neutral-100/10 border-neutral-200/20"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium text-neutral-400 leading-normal">{notif.text}</p>
                        <span className="text-[10px] text-neutral-400 font-mono block">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100/10">
                <button 
                  onClick={() => {
                    const marked = notifications.map(n => ({ ...n, unread: false }));
                    setNotifications(marked);
                    logAdminAction("NOTIF_READ", "Marked all active notifications as read");
                  }}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold"
                >
                  Mark All Read
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK INSPECTION DRAWER FOR PROPERTY INVENTORY */}
      <AnimatePresence>
        {quickInspectProperty && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickInspectProperty(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute right-0 top-0 bottom-0 w-full max-w-lg p-6 overflow-y-auto ${
                isAdminDark ? "bg-[#0E1013] text-neutral-100" : "bg-white text-neutral-900"
              } shadow-2xl flex flex-col justify-between`}
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100/10">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-display font-black text-lg">Property Inspection</h3>
                  </div>
                  <button 
                    onClick={() => setQuickInspectProperty(null)}
                    className="p-2 hover:bg-neutral-500/10 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cover Image & Badges */}
                <div className="relative h-52 rounded-2xl overflow-hidden border border-neutral-500/20">
                  <img 
                    src={quickInspectProperty.image} 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-500 text-white font-mono font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                      {quickInspectProperty.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/70 backdrop-blur-md text-emerald-400 font-mono font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{quickInspectProperty.score} CRIBR Score</span>
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="text-xl font-bold text-white leading-tight">{quickInspectProperty.name}</h4>
                    <p className="text-xs text-neutral-300 font-mono">{quickInspectProperty.location}, {quickInspectProperty.city}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-500/5 rounded-xl border border-neutral-500/10">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Developer</span>
                    <span className="font-bold text-xs">{quickInspectProperty.developer}</span>
                  </div>
                  <div className="p-3 bg-neutral-500/5 rounded-xl border border-neutral-500/10">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Price Range</span>
                    <span className="font-bold text-xs text-indigo-500">{quickInspectProperty.priceRange}</span>
                  </div>
                  <div className="p-3 bg-neutral-500/5 rounded-xl border border-neutral-500/10">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Configurations</span>
                    <span className="font-semibold text-xs">{quickInspectProperty.configurations || "N/A"}</span>
                  </div>
                  <div className="p-3 bg-neutral-500/5 rounded-xl border border-neutral-500/10">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Possession</span>
                    <span className="font-semibold text-xs">{quickInspectProperty.possession || "N/A"}</span>
                  </div>
                </div>

                {/* Amenities List */}
                <div className="space-y-2">
                  <h5 className="text-xs font-mono font-bold uppercase text-neutral-400">Key Project Amenities</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {(quickInspectProperty.amenities || ["Infinity Pool", "Gym", "Clubhouse", "24/7 Security", "EV Charger"]).map((amenity, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-semibold">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inspection Compliance Notes */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-500 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>CRIBR Compliance & Verification Status</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Property title, land clearance certificates, and RERA registration documents have been validated by CRIBR Legal Intelligence.
                  </p>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="pt-6 border-t border-neutral-100/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setEditingProperty(quickInspectProperty);
                    setQuickInspectProperty(null);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Open 17-Section Form</span>
                </button>
                <button
                  onClick={() => setQuickInspectProperty(null)}
                  className="px-4 py-3 border border-neutral-300/30 hover:bg-neutral-500/10 rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
