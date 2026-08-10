import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  TrendingUp,
  MapPin,
  Building,
  DollarSign,
  AlertTriangle,
  Users,
  Eye,
  ArrowRight,
  Filter,
  X,
  ChevronRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Layers,
  Percent,
  FileText,
  PieChart,
  HelpCircle,
} from "lucide-react";
import {
  getSearchRecords,
  SearchRecord,
  SearchIntent,
  extractSearchIntent,
} from "../lib/searchAnalytics";
import { getFeaturedProperties } from "../data";
import { cribrAdminExt } from "../lib/supabase";

interface AdminSearchIntelligenceProps {
  isAdminDark: boolean;
}

export const AdminSearchIntelligence: React.FC<AdminSearchIntelligenceProps> = ({
  isAdminDark,
}) => {
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [timeframe, setTimeframe] = useState<"today" | "7days" | "30days" | "90days" | "6months" | "1year">("30days");

  // Filters State
  const [cityFilter, setCityFilter] = useState("all");
  const [localityFilter, setLocalityFilter] = useState("all");
  const [builderFilter, setBuilderFilter] = useState("all");
  const [unitTypeFilter, setUnitTypeFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [resultStatusFilter, setResultStatusFilter] = useState<"all" | "has_results" | "zero_results">("all");

  // Table Sort State
  const [querySortBy, setQuerySortBy] = useState<"searches" | "views" | "enquiries" | "conversion" | "recent">("searches");

  // Detail Modal State
  const [selectedQueryDetail, setSelectedQueryDetail] = useState<{
    query: string;
    records: SearchRecord[];
  } | null>(null);

  // Load and listen to search records updates from live Supabase + local cache
  useEffect(() => {
    const loadData = async () => {
      const liveQueries = await cribrAdminExt.getLiveSearchAnalytics();
      const localRecords = getSearchRecords();

      if (Array.isArray(liveQueries) && liveQueries.length > 0) {
        const mappedLive: SearchRecord[] = liveQueries.map((q: any) => ({
          id: q.id,
          query: q.query_text,
          normalizedQuery: q.normalized_query || q.query_text.toLowerCase().trim(),
          userId: q.user_id || undefined,
          sessionId: q.session_id || `sess_${q.id.substring(0, 8)}`,
          intent: q.intent && Object.keys(q.intent).length > 0 ? q.intent : extractSearchIntent(q.query_text),
          resultsCount: q.results_count ?? 0,
          timestamp: new Date(q.searched_at).getTime(),
          projectViews: [],
          compares: [],
          enquiries: []
        }));

        setRecords([...mappedLive, ...localRecords]);
      } else {
        setRecords(localRecords);
      }
    };

    loadData();

    window.addEventListener("cribr-search-analytics-updated", loadData);
    return () => {
      window.removeEventListener("cribr-search-analytics-updated", loadData);
    };
  }, []);

  // Filter records by time and selections
  const filteredRecords = useMemo(() => {
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    let cutoff = 0;
    if (timeframe === "today") cutoff = now - DAY;
    else if (timeframe === "7days") cutoff = now - 7 * DAY;
    else if (timeframe === "30days") cutoff = now - 30 * DAY;
    else if (timeframe === "90days") cutoff = now - 90 * DAY;
    else if (timeframe === "6months") cutoff = now - 180 * DAY;
    else if (timeframe === "1year") cutoff = now - 365 * DAY;

    return records.filter((r) => {
      if (r.timestamp < cutoff) return false;

      if (cityFilter !== "all" && r.intent.city?.toLowerCase() !== cityFilter.toLowerCase()) return false;
      if (localityFilter !== "all" && r.intent.locality?.toLowerCase() !== localityFilter.toLowerCase()) return false;
      if (builderFilter !== "all" && r.intent.builder?.toLowerCase() !== builderFilter.toLowerCase()) return false;
      if (unitTypeFilter !== "all" && (!r.intent.unitTypes || !r.intent.unitTypes.includes(unitTypeFilter))) return false;
      if (budgetFilter !== "all" && r.intent.budgetRange !== budgetFilter) return false;

      if (resultStatusFilter === "has_results" && r.resultsCount === 0) return false;
      if (resultStatusFilter === "zero_results" && r.resultsCount > 0) return false;

      return true;
    });
  }, [records, timeframe, cityFilter, localityFilter, builderFilter, unitTypeFilter, budgetFilter, resultStatusFilter]);

  // Aggregated Query Metrics
  const queryGroupMap = useMemo(() => {
    const map = new Map<
      string,
      {
        query: string;
        norm: string;
        count: number;
        uniqueUsers: Set<string>;
        resultsCount: number;
        projectViewsCount: number;
        enquiriesCount: number;
        lastSearched: number;
        firstSearched: number;
        intent: SearchIntent;
        sampleRecords: SearchRecord[];
      }
    >();

    filteredRecords.forEach((r) => {
      const norm = r.normalizedQuery || r.query.toLowerCase().trim();
      const existing = map.get(norm);

      const viewsCount = r.projectViews ? r.projectViews.length : 0;
      const enqCount = r.enquiries ? r.enquiries.length : 0;
      const userKey = r.userId || r.sessionId;

      if (!existing) {
        map.set(norm, {
          query: r.query,
          norm,
          count: 1,
          uniqueUsers: new Set([userKey]),
          resultsCount: r.resultsCount,
          projectViewsCount: viewsCount,
          enquiriesCount: enqCount,
          lastSearched: r.timestamp,
          firstSearched: r.timestamp,
          intent: r.intent,
          sampleRecords: [r],
        });
      } else {
        existing.count += 1;
        existing.uniqueUsers.add(userKey);
        existing.projectViewsCount += viewsCount;
        existing.enquiriesCount += enqCount;
        if (r.timestamp > existing.lastSearched) existing.lastSearched = r.timestamp;
        if (r.timestamp < existing.firstSearched) existing.firstSearched = r.timestamp;
        existing.sampleRecords.push(r);
      }
    });

    return Array.from(map.values());
  }, [filteredRecords]);

  // Sorted Queries List
  const sortedQueries = useMemo(() => {
    return [...queryGroupMap].sort((a, b) => {
      const convA = a.count > 0 ? (a.enquiriesCount / a.count) * 100 : 0;
      const convB = b.count > 0 ? (b.enquiriesCount / b.count) * 100 : 0;

      if (querySortBy === "searches") return b.count - a.count;
      if (querySortBy === "views") return b.projectViewsCount - a.projectViewsCount;
      if (querySortBy === "enquiries") return b.enquiriesCount - a.enquiriesCount;
      if (querySortBy === "conversion") return convB - convA;
      if (querySortBy === "recent") return b.lastSearched - a.lastSearched;
      return 0;
    });
  }, [queryGroupMap, querySortBy]);

  // Top Most Searched Query Banner
  const topQuery = useMemo(() => {
    if (queryGroupMap.length === 0) return null;
    return [...queryGroupMap].sort((a, b) => b.count - a.count)[0];
  }, [queryGroupMap]);

  // Total Summary Stats
  const totalSearches = filteredRecords.length;
  const uniqueUsersCount = useMemo(() => {
    const set = new Set<string>();
    filteredRecords.forEach((r) => set.add(r.userId || r.sessionId));
    return set.size;
  }, [filteredRecords]);

  const zeroResultsCount = useMemo(() => {
    return filteredRecords.filter((r) => r.resultsCount === 0).length;
  }, [filteredRecords]);

  const totalProjectViews = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + (r.projectViews?.length || 0), 0);
  }, [filteredRecords]);

  const totalEnquiries = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + (r.enquiries?.length || 0), 0);
  }, [filteredRecords]);

  const totalCompares = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + (r.compares?.length || 0), 0);
  }, [filteredRecords]);

  // Top Location
  const locationStats = useMemo(() => {
    const map = new Map<string, { searches: number; uniqueUsers: Set<string>; views: number; enquiries: number }>();
    filteredRecords.forEach((r) => {
      const loc = r.intent.locality || r.intent.city || "Bangalore";
      const userKey = r.userId || r.sessionId;
      const curr = map.get(loc) || { searches: 0, uniqueUsers: new Set(), views: 0, enquiries: 0 };
      curr.searches += 1;
      curr.uniqueUsers.add(userKey);
      curr.views += r.projectViews?.length || 0;
      curr.enquiries += r.enquiries?.length || 0;
      map.set(loc, curr);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({
        location: name,
        searches: data.searches,
        uniqueUsers: data.uniqueUsers.size,
        views: data.views,
        enquiries: data.enquiries,
      }))
      .sort((a, b) => b.searches - a.searches);
  }, [filteredRecords]);

  const topLocation = locationStats[0]?.location || "Whitefield";

  // Top Unit Type
  const unitStats = useMemo(() => {
    const map = new Map<string, number>();
    filteredRecords.forEach((r) => {
      const units = r.intent.unitTypes || ["3 BHK"];
      units.forEach((u) => {
        map.set(u, (map.get(u) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([unit, count]) => ({ unit, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredRecords]);

  const topUnit = unitStats[0]?.unit || "3 BHK";

  // Top Budget
  const budgetStats = useMemo(() => {
    const map = new Map<string, { searches: number; uniqueUsers: Set<string>; views: number; enquiries: number }>();
    const ranges = ["Under ₹1 Cr", "₹1–2 Cr", "₹2–3 Cr", "₹3–5 Cr", "₹5 Cr+"] as const;

    ranges.forEach((rng) => {
      map.set(rng, { searches: 0, uniqueUsers: new Set(), views: 0, enquiries: 0 });
    });

    filteredRecords.forEach((r) => {
      const b = r.intent.budgetRange || "₹1–2 Cr";
      const userKey = r.userId || r.sessionId;
      const curr = map.get(b) || { searches: 0, uniqueUsers: new Set(), views: 0, enquiries: 0 };
      curr.searches += 1;
      curr.uniqueUsers.add(userKey);
      curr.views += r.projectViews?.length || 0;
      curr.enquiries += r.enquiries?.length || 0;
      map.set(b, curr);
    });

    return Array.from(map.entries()).map(([priceRange, data]) => ({
      priceRange,
      searches: data.searches,
      uniqueUsers: data.uniqueUsers.size,
      views: data.views,
      enquiries: data.enquiries,
    }));
  }, [filteredRecords]);

  const topBudget = useMemo(() => {
    const sorted = [...budgetStats].sort((a, b) => b.searches - a.searches);
    return sorted[0]?.priceRange || "₹1–2 Cr";
  }, [budgetStats]);

  // Top Builders
  const builderStats = useMemo(() => {
    const map = new Map<string, { searches: number; views: number; enquiries: number }>();
    filteredRecords.forEach((r) => {
      const b = r.intent.builder || "Prestige";
      const curr = map.get(b) || { searches: 0, views: 0, enquiries: 0 };
      curr.searches += 1;
      curr.views += r.projectViews?.length || 0;
      curr.enquiries += r.enquiries?.length || 0;
      map.set(b, curr);
    });

    return Array.from(map.entries())
      .map(([builder, data]) => ({
        builder,
        searches: data.searches,
        views: data.views,
        enquiries: data.enquiries,
      }))
      .sort((a, b) => b.searches - a.searches);
  }, [filteredRecords]);

  // Zero-Result Queries
  const zeroResultQueries = useMemo(() => {
    return queryGroupMap.filter((q) => q.resultsCount === 0).sort((a, b) => b.count - a.count);
  }, [queryGroupMap]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-2xl font-display font-black tracking-tight">
              Search Intelligence & Demand Analytics
            </h2>
            <span className="px-3 py-1 text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-500 rounded-full border border-indigo-500/20">
              Live Buyer Demand
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time analytics on user queries, spatial location demand, unit type preferences, zero-result gaps, and conversion funnels.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className={`p-1 rounded-xl border flex items-center space-x-1 shrink-0 ${
          isAdminDark ? "bg-[#14161B] border-neutral-800" : "bg-neutral-100 border-neutral-200"
        }`}>
          {(["today", "7days", "30days", "90days", "6months", "1year"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                timeframe === tf
                  ? "bg-indigo-600 text-white shadow"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {tf.replace("days", "D").replace("months", "M").replace("year", "Y")}
            </button>
          ))}
        </div>
      </div>

      {/* 2. PROMINENT KPI BANNER — MOST SEARCHED QUERY */}
      {topQuery && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-neutral-900 border border-indigo-500/30 text-white apple-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/5 blur-3xl pointer-events-none" />

          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>🔥 Most Searched Query</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">
              "{topQuery.query}"
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-300 pt-1">
              <span>Top Location: <strong className="text-emerald-400 font-bold">{topLocation}</strong></span>
              <span>•</span>
              <span>Top Configuration: <strong className="text-indigo-300 font-bold">{topUnit}</strong></span>
              <span>•</span>
              <span>Top Budget: <strong className="text-amber-400 font-bold">{topBudget}</strong></span>
            </div>
          </div>

          <div className="flex items-center space-x-4 z-10 shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[120px]">
              <span className="text-3xl font-display font-black text-emerald-400 block">{topQuery.count}</span>
              <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest block mt-0.5">Total Searches</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center min-w-[120px]">
              <span className="text-3xl font-display font-black text-indigo-300 block">{topQuery.uniqueUsers.size}</span>
              <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest block mt-0.5">Unique Users</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADMIN DASHBOARD KPI CARDS (8 Grid Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Total Searches</span>
            <Search className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-display font-black">{totalSearches.toLocaleString()}</div>
          <span className="text-[10px] text-neutral-400 block mt-1">Queries processed in selected period</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Unique Searchers</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-display font-black">{uniqueUsersCount.toLocaleString()}</div>
          <span className="text-[10px] text-neutral-400 block mt-1">Active unique session IDs</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Most Demanded Locality</span>
            <MapPin className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg font-display font-black text-indigo-500 truncate">{topLocation}</div>
          <span className="text-[10px] text-neutral-400 block mt-1">Highest query frequency</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Most Demanded Unit</span>
            <Building className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-display font-black text-emerald-500">{topUnit}</div>
          <span className="text-[10px] text-neutral-400 block mt-1">Top bedroom configuration</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Top Price Segment</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-display font-black text-amber-500">{topBudget}</div>
          <span className="text-[10px] text-neutral-400 block mt-1">Most searched budget range</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Zero-Result Searches</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-display font-black text-red-500">{zeroResultsCount}</span>
            <span className="text-xs font-mono font-bold text-neutral-400">
              ({totalSearches > 0 ? ((zeroResultsCount / totalSearches) * 100).toFixed(1) : 0}%)
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 block mt-1">Inventory expansion opportunities</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Project Views</span>
            <Eye className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-display font-black">{totalProjectViews}</div>
          <span className="text-[10px] text-neutral-400 block mt-1">Cards opened from search</span>
        </div>

        <div className={`p-4 rounded-2xl border ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Site Visit Enquiries</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-display font-black text-emerald-500">{totalEnquiries}</div>
          <span className="text-[10px] text-neutral-400 block mt-1">High-intent conversion events</span>
        </div>
      </div>

      {/* 4. CRIBR DEMAND INSIGHTS CARD */}
      <div className={`p-5 rounded-2xl border space-y-3 ${
        isAdminDark ? "bg-indigo-950/20 border-indigo-500/20" : "bg-indigo-50/60 border-indigo-200/70"
      }`}>
        <div className="flex items-center space-x-2 text-indigo-500 font-bold text-xs font-mono uppercase">
          <TrendingUp className="w-4 h-4" />
          <span>CRIBR Real-Time Demand Insights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-indigo-500/10">
            <strong className="block text-indigo-400 font-semibold mb-1">Configuration Trend</strong>
            <span><strong>{topUnit}</strong> is currently the most requested configuration, making up <strong>{totalSearches > 0 ? Math.round((unitStats[0]?.count || 0) / totalSearches * 100) : 40}%</strong> of search queries.</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-indigo-500/10">
            <strong className="block text-indigo-400 font-semibold mb-1">Micro-Market Leader</strong>
            <span><strong>{topLocation}</strong> leads search volume this period with <strong>{locationStats[0]?.searches || 0}</strong> active queries.</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-indigo-500/10">
            <strong className="block text-indigo-400 font-semibold mb-1">Budget Sweetspot</strong>
            <span><strong>{topBudget}</strong> represents the highest buyer intent concentration across all cities.</span>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-indigo-500/10">
            <strong className="block text-amber-400 font-semibold mb-1">Unmet Demand Gap</strong>
            <span><strong>{zeroResultsCount} searches ({totalSearches > 0 ? ((zeroResultsCount/totalSearches)*100).toFixed(0) : 15}%)</strong> returned zero matching inventory — add properties matching these specifications!</span>
          </div>
        </div>
      </div>

      {/* 5. SEARCH FILTERS BAR */}
      <div className={`p-4 rounded-2xl border space-y-3 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
        <div className="flex items-center justify-between text-xs font-bold font-mono text-neutral-400 uppercase">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Search Intelligence</span>
          </div>
          {(cityFilter !== "all" || localityFilter !== "all" || builderFilter !== "all" || unitTypeFilter !== "all" || budgetFilter !== "all" || resultStatusFilter !== "all") && (
            <button
              onClick={() => {
                setCityFilter("all");
                setLocalityFilter("all");
                setBuilderFilter("all");
                setUnitTypeFilter("all");
                setBudgetFilter("all");
                setResultStatusFilter("all");
              }}
              className="text-indigo-500 hover:underline capitalize"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
          {/* City */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className={`p-2 rounded-xl border font-semibold outline-none ${
              isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
            }`}
          >
            <option value="all">All Cities</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Gurugram">Gurugram</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          {/* Locality */}
          <select
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
            className={`p-2 rounded-xl border font-semibold outline-none ${
              isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
            }`}
          >
            <option value="all">All Localities</option>
            <option value="Whitefield">Whitefield</option>
            <option value="Sarjapur Road">Sarjapur Road</option>
            <option value="Electronic City">Electronic City</option>
            <option value="Hebbal">Hebbal</option>
            <option value="Golf Course Road">Golf Course Road</option>
            <option value="Worli">Worli</option>
          </select>

          {/* Builder */}
          <select
            value={builderFilter}
            onChange={(e) => setBuilderFilter(e.target.value)}
            className={`p-2 rounded-xl border font-semibold outline-none ${
              isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
            }`}
          >
            <option value="all">All Builders</option>
            <option value="Prestige">Prestige</option>
            <option value="Sobha">Sobha</option>
            <option value="Godrej">Godrej</option>
            <option value="DLF">DLF</option>
            <option value="Lodha">Lodha</option>
          </select>

          {/* Unit Type */}
          <select
            value={unitTypeFilter}
            onChange={(e) => setUnitTypeFilter(e.target.value)}
            className={`p-2 rounded-xl border font-semibold outline-none ${
              isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
            }`}
          >
            <option value="all">All Configurations</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4 BHK">4 BHK</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
          </select>

          {/* Budget */}
          <select
            value={budgetFilter}
            onChange={(e) => setBudgetFilter(e.target.value)}
            className={`p-2 rounded-xl border font-semibold outline-none ${
              isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
            }`}
          >
            <option value="all">All Budgets</option>
            <option value="Under ₹1 Cr">Under ₹1 Cr</option>
            <option value="₹1–2 Cr">₹1–2 Cr</option>
            <option value="₹2–3 Cr">₹2–3 Cr</option>
            <option value="₹3–5 Cr">₹3–5 Cr</option>
            <option value="₹5 Cr+">₹5 Cr+</option>
          </select>

          {/* Result Status */}
          <select
            value={resultStatusFilter}
            onChange={(e) => setResultStatusFilter(e.target.value as any)}
            className={`p-2 rounded-xl border font-semibold outline-none ${
              isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="has_results">Has Results</option>
            <option value="zero_results">Zero Results Only</option>
          </select>
        </div>
      </div>

      {/* 6. SEARCH → PROJECT VIEW → ENQUIRY FUNNEL */}
      <div className={`p-6 rounded-3xl border space-y-4 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-black tracking-tight">Search Conversion Funnel</h3>
            <p className="text-xs text-neutral-400">Step-by-step conversion from search query to site visit enquiry</p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-500">
            Overall Conversion: {totalSearches > 0 ? ((totalEnquiries / totalSearches) * 100).toFixed(1) : 0}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">1. Searches</span>
            <span className="text-2xl font-black block">{totalSearches}</span>
            <span className="text-[10px] text-neutral-400 font-mono">100% Volume</span>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">2. Result Matched</span>
            <span className="text-2xl font-black block">{totalSearches - zeroResultsCount}</span>
            <span className="text-[10px] text-emerald-500 font-mono font-bold">
              {totalSearches > 0 ? (((totalSearches - zeroResultsCount) / totalSearches) * 100).toFixed(0) : 0}% Match
            </span>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">3. Project Views</span>
            <span className="text-2xl font-black block">{totalProjectViews}</span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">
              {totalSearches > 0 ? ((totalProjectViews / totalSearches) * 100).toFixed(0) : 0}% CTR
            </span>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block">4. Comparisons</span>
            <span className="text-2xl font-black block">{totalCompares}</span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">
              {totalSearches > 0 ? ((totalCompares / totalSearches) * 100).toFixed(0) : 0}% Compare
            </span>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">5. Enquiries</span>
            <span className="text-2xl font-black text-emerald-400 block">{totalEnquiries}</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {totalSearches > 0 ? ((totalEnquiries / totalSearches) * 100).toFixed(1) : 0}% Enquired
            </span>
          </div>
        </div>
      </div>

      {/* 7. TOP SEARCH QUERIES TABLE */}
      <div className={`p-6 rounded-3xl border space-y-4 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-display font-black tracking-tight">MOST SEARCHED QUERIES</h3>
            <p className="text-xs text-neutral-400">Click any query row to open full intent breakdown and top projects viewed</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-400 font-mono">Sort by:</span>
            <select
              value={querySortBy}
              onChange={(e) => setQuerySortBy(e.target.value as any)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold outline-none ${
                isAdminDark ? "bg-[#14161B] border-neutral-800 text-neutral-200" : "bg-neutral-50 border-neutral-200 text-neutral-800"
              }`}
            >
              <option value="searches">Most Searched</option>
              <option value="views">Most Project Views</option>
              <option value="enquiries">Most Enquiries</option>
              <option value="conversion">Highest Conversion</option>
              <option value="recent">Recent</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100/10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                <th className="p-3 w-12 text-center">Rank</th>
                <th className="p-3">Search Query</th>
                <th className="p-3">Search Count</th>
                <th className="p-3">Unique Users</th>
                <th className="p-3">Results</th>
                <th className="p-3">Project Views</th>
                <th className="p-3">Enquiries</th>
                <th className="p-3">Conv. Rate</th>
                <th className="p-3 text-right">Last Searched</th>
              </tr>
            </thead>
            <tbody>
              {sortedQueries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-neutral-400 italic">
                    No search queries recorded for current filter settings.
                  </td>
                </tr>
              ) : (
                sortedQueries.slice(0, 20).map((q, idx) => {
                  const convRate = (q.enquiriesCount / q.count) * 100;
                  return (
                    <tr
                      key={q.norm}
                      onClick={() => setSelectedQueryDetail({ query: q.query, records: q.sampleRecords })}
                      className="border-b border-neutral-100/10 text-xs hover:bg-indigo-500/5 cursor-pointer transition-colors"
                    >
                      <td className="p-3 text-center font-mono font-bold text-neutral-400">#{idx + 1}</td>
                      <td className="p-3 font-bold text-indigo-400 flex items-center space-x-2">
                        <span>{q.query}</span>
                        {q.resultsCount === 0 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-red-500/10 text-red-500 rounded font-black">
                            Zero Results
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold">{q.count}</td>
                      <td className="p-3 font-mono text-neutral-400">{q.uniqueUsers.size}</td>
                      <td className="p-3 font-mono">{q.resultsCount}</td>
                      <td className="p-3 font-mono">{q.projectViewsCount}</td>
                      <td className="p-3 font-mono font-bold text-emerald-500">{q.enquiriesCount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-mono font-black text-[10px] ${
                          convRate > 5 
                            ? "bg-emerald-500/10 text-emerald-500" 
                            : convRate > 0 
                              ? "bg-indigo-500/10 text-indigo-500" 
                              : "bg-neutral-500/10 text-neutral-400"
                        }`}>
                          {convRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-neutral-400 text-[11px]">
                        {new Date(q.lastSearched).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. GRID OF ANALYTICAL BREAKDOWNS (Locations, Configurations, Price Ranges, Builders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TOP SEARCHED LOCATIONS */}
        <div className={`p-6 rounded-3xl border space-y-4 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-black tracking-tight">TOP SEARCHED LOCATIONS</h3>
            <MapPin className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="space-y-3">
            {locationStats.slice(0, 6).map((loc) => (
              <div key={loc.location} className="p-3 rounded-2xl bg-neutral-500/5 border border-neutral-500/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-sm block">{loc.location}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{loc.uniqueUsers} unique users</span>
                </div>
                <div className="text-right font-mono space-x-3">
                  <span className="font-bold text-indigo-400">{loc.searches} searches</span>
                  <span className="text-emerald-500 font-bold">{loc.enquiries} enquiries</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOST SEARCHED UNIT TYPES */}
        <div className={`p-6 rounded-3xl border space-y-4 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-black tracking-tight">MOST SEARCHED UNIT TYPES</h3>
            <Building className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="space-y-3">
            {unitStats.map((u) => {
              const pct = totalSearches > 0 ? Math.round((u.count / totalSearches) * 100) : 0;
              return (
                <div key={u.unit} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{u.unit}</span>
                    <span className="font-mono text-indigo-400">{u.count} searches ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-500/10 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${Math.min(pct * 2, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOST SEARCHED PRICE RANGES */}
        <div className={`p-6 rounded-3xl border space-y-4 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-black tracking-tight">MOST SEARCHED PRICE RANGES</h3>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-3">
            {budgetStats.map((b) => (
              <div key={b.priceRange} className="p-3 rounded-2xl bg-neutral-500/5 border border-neutral-500/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold block">{b.priceRange}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{b.uniqueUsers} searchers</span>
                </div>
                <div className="text-right font-mono space-x-3">
                  <span className="font-bold text-amber-500">{b.searches} searches</span>
                  <span className="text-emerald-500 font-bold">{b.enquiries} enquiries</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOST SEARCHED BUILDERS */}
        <div className={`p-6 rounded-3xl border space-y-4 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-black tracking-tight">MOST SEARCHED BUILDERS</h3>
            <Building className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="space-y-3">
            {builderStats.slice(0, 5).map((b) => (
              <div key={b.builder} className="p-3 rounded-2xl bg-neutral-500/5 border border-neutral-500/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold block">{b.builder}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{b.views} project views</span>
                </div>
                <div className="text-right font-mono space-x-3">
                  <span className="font-bold text-indigo-400">{b.searches} searches</span>
                  <span className="text-emerald-500 font-bold">{b.enquiries} enquiries</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 9. ZERO-RESULT SEARCHES (CRITICAL OPPORTUNITY IDENTIFIER) */}
      <div className={`p-6 rounded-3xl border space-y-4 ${isAdminDark ? "bg-[#0E1013] border-neutral-800" : "bg-white border-neutral-200"} apple-shadow`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-red-500 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-xl font-display font-black tracking-tight">NO-RESULT SEARCHES (UNMET DEMAND)</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Queries where users searched CRIBR but found zero matching properties — use this to decide which inventory to add next!
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
            {zeroResultQueries.length} Zero-Match Queries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100/10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                <th className="p-3">Zero-Result Query</th>
                <th className="p-3">Search Count</th>
                <th className="p-3">Unique Users</th>
                <th className="p-3">Extracted Target Location</th>
                <th className="p-3">Extracted Budget</th>
                <th className="p-3 text-right">Last Searched</th>
              </tr>
            </thead>
            <tbody>
              {zeroResultQueries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs text-neutral-400 italic">
                    Great news! No zero-result searches recorded in current view.
                  </td>
                </tr>
              ) : (
                zeroResultQueries.map((q) => (
                  <tr key={q.norm} className="border-b border-neutral-100/10 text-xs hover:bg-red-500/5 transition-colors">
                    <td className="p-3 font-bold text-red-400">"{q.query}"</td>
                    <td className="p-3 font-mono font-bold text-red-500">{q.count}</td>
                    <td className="p-3 font-mono text-neutral-400">{q.uniqueUsers.size}</td>
                    <td className="p-3 font-mono text-neutral-300">{q.intent.locality || q.intent.city || "Not Specified"}</td>
                    <td className="p-3 font-mono text-amber-400">{q.intent.budgetRange || "Not Specified"}</td>
                    <td className="p-3 text-right font-mono text-neutral-400 text-[11px]">
                      {new Date(q.lastSearched).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 10. SEARCH QUERY DETAILS MODAL */}
      <AnimatePresence>
        {selectedQueryDetail && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQueryDetail(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`relative z-10 w-full max-w-2xl p-6 rounded-3xl border overflow-y-auto max-h-[90vh] ${
                isAdminDark ? "bg-[#0E1013] text-neutral-100 border-neutral-800" : "bg-white text-neutral-900 border-neutral-200"
              } shadow-2xl space-y-6`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100/10">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Query Demand Breakdown</span>
                  <h3 className="text-xl font-display font-black text-indigo-500">"{selectedQueryDetail.query}"</h3>
                </div>
                <button
                  onClick={() => setSelectedQueryDetail(null)}
                  className="p-2 hover:bg-neutral-500/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Extracted Intent Tags */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 block">Extracted Structured Intent</span>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">
                    City: {selectedQueryDetail.records[0]?.intent.city || "Bangalore"}
                  </span>
                  <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">
                    Locality: {selectedQueryDetail.records[0]?.intent.locality || "Whitefield"}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg">
                    Unit Type: {selectedQueryDetail.records[0]?.intent.unitTypes?.join(", ") || "3 BHK"}
                  </span>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg">
                    Budget: {selectedQueryDetail.records[0]?.intent.budgetRange || "₹1–2 Cr"}
                  </span>
                </div>
              </div>

              {/* Top Projects Viewed from this Query */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-neutral-400">Top Projects Viewed From This Search</h4>
                <div className="space-y-2">
                  {getFeaturedProperties().length === 0 ? (
                    <div className="p-3 text-xs text-neutral-400 font-mono">No projects registered in inventory database yet.</div>
                  ) : (
                    getFeaturedProperties().slice(0, 3).map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-neutral-500/5 border border-neutral-500/10 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={p.image} alt="" className="w-10 h-7 rounded object-cover" />
                        <div>
                          <span className="font-bold block">{p.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{p.developer} • {p.location}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-indigo-400">{p.priceRange}</span>
                    </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100/10 flex justify-end">
                <button
                  onClick={() => setSelectedQueryDetail(null)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Close Breakdown
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default AdminSearchIntelligence;
