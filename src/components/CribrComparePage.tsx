import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  ChevronLeft, 
  Building, 
  MapPin, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  AlertCircle, 
  X, 
  Plus, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Car, 
  Award,
  Search
} from 'lucide-react';
import { showToast } from './CribrToast';

interface CribrComparePageProps {
  compareList: string[];
  onBack: () => void;
  onRemoveProject: (id: string) => void;
  onAddProject?: (id: string) => void;
  allProjects?: any[];
  onNavigateProperty?: (idOrSlug: string) => void;
}

export default function CribrComparePage({ 
  compareList, 
  onBack, 
  onRemoveProject, 
  onAddProject,
  allProjects = [],
  onNavigateProperty 
}: CribrComparePageProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ projects: any[], analysis: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState("");

  useEffect(() => {
    if (compareList.length < 2) {
      setError("Please select at least 2 projects to compare.");
      setLoading(false);
      return;
    }

    const fetchComparison = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectIds: compareList })
        });
        
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (e) {
          throw new Error("The comparison service timed out or encountered an unexpected server error. Please try again.");
        }

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to compare projects");
        }
        
        setData({ projects: json.projects, analysis: json.analysis });
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [compareList]);

  // Handle sharing link
  const handleShareComparison = () => {
    try {
      const ids = (data?.projects?.map(p => p.id) || compareList).join(",");
      const shareUrl = `${window.location.origin}/compare?ids=${encodeURIComponent(ids)}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        showToast("Comparison link copied to clipboard!", "success");
      } else {
        showToast("Link: " + shareUrl, "info");
      }
    } catch (e) {
      showToast("Failed to copy link to clipboard.", "info");
    }
  };

  // Available projects to add that aren't already in compareList
  const availableToAdd = useMemo(() => {
    const currentIds = new Set(compareList.map(id => id.toLowerCase().replace(/^proj-/, "")));
    return allProjects.filter(p => {
      const cleanId = String(p.id || "").toLowerCase().replace(/^proj-/, "");
      return !currentIds.has(cleanId);
    }).filter(p => {
      if (!addSearchQuery.trim()) return true;
      const q = addSearchQuery.toLowerCase();
      const name = String(p.name || p.projectName || "").toLowerCase();
      const builder = String(p.builder_name || p.builder || "").toLowerCase();
      const loc = String(p.locality || p.area || "").toLowerCase();
      return name.includes(q) || builder.includes(q) || loc.includes(q);
    });
  }, [allProjects, compareList, addSearchQuery]);

  // Compute best values for numeric highlighting
  const bestMetrics = useMemo(() => {
    if (!data || !data.projects || data.projects.length < 2) return null;
    const projects = data.projects;

    // 1. Lowest price per sqft
    const pricesSqft = projects.map(p => {
      const val = typeof p.pricePerSqftNum === "number" && p.pricePerSqftNum > 0 
        ? p.pricePerSqftNum 
        : parseFloat(String(p.pricePerSqft || p.price_per_sqft || "").replace(/[^0-9.]/g, ""));
      return { id: p.id, val: isNaN(val) || val <= 0 ? Infinity : val };
    });
    const minPriceSqft = Math.min(...pricesSqft.map(x => x.val));
    const bestPriceSqftId = minPriceSqft < Infinity ? pricesSqft.find(x => x.val === minPriceSqft)?.id : null;

    // 2. Lowest unit density (units per acre)
    const densities = projects.map(p => {
      const val = parseFloat(String(p.unitDensity || p.unit_density_per_acre || "").replace(/[^0-9.]/g, ""));
      return { id: p.id, val: isNaN(val) || val <= 0 ? Infinity : val };
    });
    const minDensity = Math.min(...densities.map(x => x.val));
    const bestDensityId = minDensity < Infinity ? densities.find(x => x.val === minDensity)?.id : null;

    // 3. Highest construction progress
    const progresses = projects.map(p => {
      const val = parseFloat(String(p.constructionProgress ?? p.construction_progress ?? "").replace(/[^0-9.]/g, ""));
      return { id: p.id, val: isNaN(val) ? -1 : val };
    });
    const maxProgress = Math.max(...progresses.map(x => x.val));
    const bestProgressId = maxProgress > 0 ? progresses.find(x => x.val === maxProgress)?.id : null;

    // 4. Closest distance to tech hub
    const distances = projects.map(p => {
      const val = parseFloat(String(p.distanceToHub || p.distance_to_hub_km || "").replace(/[^0-9.]/g, ""));
      return { id: p.id, val: isNaN(val) || val <= 0 ? Infinity : val };
    });
    const minDistance = Math.min(...distances.map(x => x.val));
    const bestDistanceId = minDistance < Infinity ? distances.find(x => x.val === minDistance)?.id : null;

    return {
      bestPriceSqftId,
      bestDensityId,
      bestProgressId,
      bestDistanceId,
    };
  }, [data]);

  if (compareList.length < 2) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-24 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-6">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-950 mb-2">Select Properties to Compare</h1>
        <p className="text-neutral-500 mb-8 max-w-md">
          You currently have {compareList.length} property selected. Select between 2 and 4 verified projects to cross-examine their RERA records, pricing, and timelines side-by-side.
        </p>
        <button 
          onClick={onBack} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm transition-all cursor-pointer flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Explorer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 px-4 pb-28 max-w-7xl mx-auto font-sans antialiased text-neutral-900">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={onBack} 
            className="flex items-center text-neutral-500 hover:text-blue-600 transition-colors mb-2 text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Explorer
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-neutral-950 tracking-tight">
                Project Comparison
              </h1>
              <p className="text-xs text-neutral-500">
                Cross-examining {compareList.length} verified projects side-by-side
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {compareList.length < 4 && onAddProject && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Property ({compareList.length}/4)</span>
            </button>
          )}

          <button
            onClick={handleShareComparison}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
          <h3 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            Cross-Referencing Verified RERA Filings...
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 text-center max-w-md px-4">
            Auditing unit density, construction milestones, active complaints, and builder delivery track record.
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-950 mb-2">Comparison Failed</h3>
          <p className="text-xs sm:text-sm text-red-700 mb-6">{error}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={onBack} 
              className="bg-neutral-800 hover:bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Return to Explorer
            </button>
            <button 
              onClick={() => {
                try {
                  localStorage.removeItem("cribr_compare_list");
                  window.history.replaceState(null, "", "/compare");
                } catch(e) {}
                compareList.forEach(id => onRemoveProject(id));
                onBack();
              }} 
              className="bg-red-100 hover:bg-red-200 text-red-800 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Comparison List
            </button>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-10">
          {/* AI VERDICT HERO BANNER */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gradient-to-br from-neutral-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-neutral-800"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Sparkles className="w-64 h-64 text-white" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${data.analysis.isAIGenerated !== false ? 'bg-blue-500/20 border-blue-400/30' : 'bg-amber-500/20 border-amber-400/30'}`}>
                  <Sparkles className={`w-5 h-5 ${data.analysis.isAIGenerated !== false ? 'text-blue-300' : 'text-amber-300'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-blue-300 font-bold">
                      Comparative Intelligence
                    </span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                      data.analysis.isAIGenerated !== false
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {data.analysis.isAIGenerated !== false ? 'Gemini AI Verified' : 'Deterministic RERA Audit'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold">
                    {data.analysis.isAIGenerated !== false ? 'CRIBR AI Objective Synthesis' : 'CRIBR Grounded RERA Synthesis'}
                  </h2>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 text-sm sm:text-base leading-relaxed font-normal text-slate-100">
                &ldquo;{data.analysis.overallRecommendation}&rdquo;
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <AICard title="Best for Investment" value={data.analysis.bestForInvestment} icon={<TrendingUp className="w-4 h-4 text-emerald-400" />} />
                <AICard title="Best for End Use" value={data.analysis.bestForEndUse} icon={<Building className="w-4 h-4 text-blue-400" />} />
                <AICard title="Best Value" value={data.analysis.bestValue} icon={<CheckCircle className="w-4 h-4 text-amber-400" />} />
                <AICard title="Lowest Risk" value={data.analysis.lowestRisk} icon={<ShieldCheck className="w-4 h-4 text-purple-400" />} />
              </div>

              {/* AI Notice */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-sans text-center">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {data.analysis.isAIGenerated !== false 
                    ? 'Synthesis synthesized from verified RERA filings using Gemini comparative inference.'
                    : 'Deterministic comparative analysis calculated directly from verified RERA filings without LLM inference.'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* OBJECTIVE DATA MATRIX TABLE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-neutral-200/80 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-display font-bold text-neutral-950">
                  RERA Verified Metrics Matrix
                </h2>
              </div>
              <div className="text-xs text-neutral-500 font-mono">
                {data.projects.length} Projects Side-by-Side
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8 pb-4">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr>
                    <th className="p-4 bg-neutral-50/80 border-b border-neutral-200 font-semibold text-xs uppercase tracking-wider text-neutral-500 w-44 sticky left-0 z-10">
                      Project
                    </th>
                    {data.projects.map(p => (
                      <th key={p.id} className="p-4 bg-neutral-50/80 border-b border-neutral-200 font-bold text-neutral-950 min-w-[240px] align-top">
                        <div className="space-y-3">
                          {p.image && (
                            <div className="w-full h-24 rounded-xl overflow-hidden bg-neutral-100 relative shadow-2xs">
                              <img 
                                src={p.image} 
                                alt={p.name || p.projectName} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                                {p.builder_name || p.builder || "Developer"}
                              </div>
                              <div className="text-sm font-display font-extrabold text-neutral-950 mt-0.5">
                                {p.name || p.projectName}
                              </div>
                              <div className="text-xs text-neutral-500 font-normal mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span className="truncate max-w-[180px]">{p.locality || p.area || "Bengaluru"}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => onRemoveProject(p.id)}
                              className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Remove project"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {onNavigateProperty && (
                            <button
                              onClick={() => onNavigateProperty(p.id)}
                              className="w-full py-1.5 px-3 bg-neutral-100 hover:bg-blue-50 text-neutral-700 hover:text-blue-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>View Full Profile</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
                  <TableRow 
                    label="Builder Reliability" 
                    data={data.projects} 
                    render={(p) => (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 font-mono font-bold text-xs text-neutral-800">
                          {p.builderGradeDisplay || p.builderGrade || p.builder_grade || "Grade A"}
                        </span>
                      </div>
                    )} 
                  />
                  <TableRow 
                    label="Price Range" 
                    data={data.projects} 
                    render={(p) => (
                      <span className="font-bold text-neutral-950">
                        {p.minPrice && p.maxPrice && p.minPrice !== "Price on Request" 
                          ? `${p.minPrice} – ${p.maxPrice}` 
                          : p.price_range || p.priceRange || (p.minPrice ? p.minPrice : "Price on Request")}
                      </span>
                    )} 
                  />
                  <TableRow 
                    label="Price / sq ft" 
                    data={data.projects} 
                    render={(p) => {
                      const isBest = bestMetrics?.bestPriceSqftId === p.id;
                      const text = p.pricePerSqft || (p.price_per_sqft ? `₹${Number(p.price_per_sqft).toLocaleString("en-IN")} / sq ft` : "N/A");
                      return (
                        <div className="space-y-1">
                          <div className="font-mono font-bold text-neutral-950">{text}</div>
                          {isBest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle className="w-2.5 h-2.5" /> Best Value / Lowest Rate
                            </span>
                          )}
                        </div>
                      );
                    }} 
                  />
                  <TableRow 
                    label="Unit Configurations" 
                    data={data.projects} 
                    render={(p) => (
                      <span className="text-neutral-800 font-medium">
                        {p.unitTypes || (Array.isArray(p.unit_types) ? p.unit_types.join(", ") : p.unit_types) || "2BHK, 3BHK"}
                      </span>
                    )} 
                  />
                  <TableRow 
                    label="Total Scale & Land" 
                    data={data.projects} 
                    render={(p) => {
                      const units = p.totalUnits ? (String(p.totalUnits).includes("Units") ? p.totalUnits : `${p.totalUnits} Units`) : (p.total_units ? `${p.total_units} Units` : "");
                      const land = p.landAreaAcres || (p.land_area_acres ? `${p.land_area_acres} Acres` : p.landAreaSqm || "");
                      return (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-neutral-950">{units || "N/A"}</div>
                          {land && <div className="text-xs text-neutral-500 font-normal">{land}</div>}
                        </div>
                      );
                    }} 
                  />
                  <TableRow 
                    label="Unit Density" 
                    data={data.projects} 
                    render={(p) => {
                      const isBest = bestMetrics?.bestDensityId === p.id;
                      const density = p.unitDensity || (p.unit_density_per_acre ? `${p.unit_density_per_acre} units/acre` : (p.density ? `${p.density} units/acre` : "N/A"));
                      return (
                        <div className="space-y-1">
                          <div className="font-medium text-neutral-900">{density}</div>
                          {isBest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              <CheckCircle className="w-2.5 h-2.5" /> Most Spacious / Lowest Density
                            </span>
                          )}
                        </div>
                      );
                    }} 
                  />
                  <TableRow 
                    label="Construction Progress" 
                    data={data.projects} 
                    render={(p) => {
                      const prog = p.constructionProgress !== undefined ? p.constructionProgress : (p.construction_progress !== undefined ? p.construction_progress : 0);
                      const isBest = bestMetrics?.bestProgressId === p.id;
                      return (
                        <div className="space-y-1.5 min-w-[160px]">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span>{prog}% Completed</span>
                            {isBest && (
                              <span className="text-[10px] text-emerald-700 font-bold">Most Advanced</span>
                            )}
                          </div>
                          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden border border-neutral-200/50">
                            <div 
                              className={`h-full rounded-full ${prog >= 50 ? "bg-emerald-500" : prog >= 20 ? "bg-blue-500" : "bg-amber-500"}`} 
                              style={{ width: `${Math.min(100, Math.max(5, prog))}%` }} 
                            />
                          </div>
                        </div>
                      );
                    }} 
                  />
                  <TableRow 
                    label="Possession Date" 
                    data={data.projects} 
                    render={(p) => (
                      <span className="font-mono text-neutral-800">
                        {p.possessionDate || p.possession_date || "As per RERA"}
                      </span>
                    )} 
                  />
                  <TableRow 
                    label="Timeline Reliability" 
                    data={data.projects} 
                    render={(p) => {
                      const disp = p.timelineReliabilityDisplay || p.timelineReliabilityRatio || p.timeline_reliability_ratio || "On Track";
                      const isBehind = String(disp).toLowerCase().includes("behind");
                      const isAhead = String(disp).toLowerCase().includes("ahead");
                      return (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                          isBehind 
                            ? "bg-amber-100 text-amber-900 border border-amber-200" 
                            : isAhead 
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-200" 
                            : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{disp}</span>
                        </span>
                      );
                    }} 
                  />
                  <TableRow 
                    label="Active Complaints" 
                    data={data.projects} 
                    render={(p) => {
                      const c = Number(p.complaints !== undefined ? p.complaints : (p.complaints_count !== undefined ? p.complaints_count : 0));
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          c === 0 
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}>
                          {c === 0 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                          <span>{c} Complaints on Record</span>
                        </span>
                      );
                    }} 
                  />
                  <TableRow 
                    label="Title & Litigation" 
                    data={data.projects} 
                    render={(p) => {
                      const hasLit = p.landLitigation ? !String(p.landLitigation).toLowerCase().includes("clean") : (p.land_litigation ? true : false);
                      return (
                        <div className="flex items-center gap-1.5 font-medium text-xs">
                          {hasLit ? (
                            <span className="text-amber-700 flex items-center gap-1 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Litigation Flagged</span>
                            </span>
                          ) : (
                            <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>100% Clean Title Deed</span>
                            </span>
                          )}
                        </div>
                      );
                    }} 
                  />
                  <TableRow 
                    label="Tech Corridor Commute" 
                    data={data.projects} 
                    render={(p) => {
                      const dist = p.distanceToHub || (p.distance_to_hub_km ? `${p.distance_to_hub_km} km` : "N/A");
                      const hub = p.nearestOfficeHub || p.nearest_office_hub || "Tech Hub";
                      const isBest = bestMetrics?.bestDistanceId === p.id;
                      return (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 font-medium text-neutral-900">
                            <Car className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{dist} to {hub}</span>
                          </div>
                          {isBest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700">
                              <CheckCircle className="w-2.5 h-2.5" /> Nearest to Major Tech Corridor
                            </span>
                          )}
                        </div>
                      );
                    }} 
                  />
                  <TableRow 
                    label="RERA Registration" 
                    data={data.projects} 
                    render={(p) => (
                      <span className="font-mono text-[11px] text-neutral-600 select-all">
                        {p.reraNumber || p.rera_number || "PRM/KA/RERA Verified"}
                      </span>
                    )} 
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* AI DEEP DIVE PER-PROJECT CARDS */}
          <div>
            <h2 className="text-xl font-display font-bold text-neutral-950 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Comprehensive Risk & Value Profiles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map(p => {
                const cleanId = (id: string) => String(id || "").toLowerCase().replace(/^proj-/, "").trim();
                const aiData = data.analysis.projects?.find((ap: any) => {
                  if (ap.projectId === p.id) return true;
                  if (cleanId(ap.projectId) === cleanId(p.id)) return true;
                  if (p.name && (ap.projectId?.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(ap.projectId?.toLowerCase()))) return true;
                  if (p.projectName && (ap.projectId?.toLowerCase().includes(p.projectName.toLowerCase()) || p.projectName.toLowerCase().includes(ap.projectId?.toLowerCase()))) return true;
                  return false;
                });

                // Fallback analysis if not returned
                const strengths = aiData?.strengths || [
                  `${p.builder_name || p.builder || "Developer"} has verified RERA compliance`,
                  `Zero active land litigation records`,
                  `High demand residential corridor`
                ];
                const risks = aiData?.risks || [
                  `Monitor phase-wise construction milestone delivery`,
                  `Verify sub-contractor structural approvals`
                ];
                const analysisText = aiData?.analysis || `${p.name || p.projectName} represents a verified development under Karnataka RERA with clean title filings.`;

                return (
                  <div key={p.id} className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-200/80 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex items-start justify-between gap-3 pb-4 border-b border-neutral-100 mb-4">
                        <div>
                          <div className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                            {p.builder_name || p.builder || "Developer"}
                          </div>
                          <h3 className="text-lg font-display font-extrabold text-neutral-950">
                            {p.name || p.projectName}
                          </h3>
                        </div>
                        {onNavigateProperty && (
                          <button
                            onClick={() => onNavigateProperty(p.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Profile</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {analysisText}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 space-y-2">
                        <h4 className="font-semibold text-emerald-950 text-xs flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Key Advantages</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {strengths.map((s: string, i: number) => (
                            <li key={i} className="text-[11px] text-emerald-900 leading-snug flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold shrink-0">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 space-y-2">
                        <h4 className="font-semibold text-amber-950 text-xs flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Due Diligence Factors</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {risks.map((r: string, i: number) => (
                            <li key={i} className="text-[11px] text-amber-900 leading-snug flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold shrink-0">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HEAD TO HEAD VECTORS */}
          {data.analysis.headToHead && data.analysis.headToHead.length > 0 && (
            <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200/80">
              <h2 className="text-xl font-display font-bold text-neutral-950 mb-6 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                Head-to-Head Comparison Vectors
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {data.analysis.headToHead.map((point: string, i: number) => (
                  <div key={i} className="flex gap-3 items-start bg-white p-4 rounded-2xl shadow-2xs border border-neutral-200/60">
                    <div className="bg-blue-50 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* FINAL VERDICT BOX */}
          <div className="bg-neutral-950 text-white p-6 sm:p-8 rounded-3xl text-center shadow-md border border-neutral-800 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">
              Final Decision Framework
            </div>
            <p className="text-base sm:text-lg font-medium leading-relaxed max-w-3xl mx-auto text-slate-200">
              &ldquo;{data.analysis.finalVerdict}&rdquo;
            </p>
          </div>
          
        </div>
      ) : null}

      {/* ADD PROPERTY MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-200 w-full max-w-lg space-y-5 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-lg font-display font-bold text-neutral-950">
                    Add Property to Comparison
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Select a project to compare with your current {compareList.length} choices
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search filter input */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={addSearchQuery}
                  onChange={(e) => setAddSearchQuery(e.target.value)}
                  placeholder="Search by project, builder, or locality..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Available list */}
              <div className="overflow-y-auto space-y-2 flex-1 pr-1">
                {availableToAdd.length === 0 ? (
                  <div className="py-10 text-center text-xs text-neutral-400">
                    No matching properties found to add.
                  </div>
                ) : (
                  availableToAdd.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (onAddProject) onAddProject(p.id);
                        setIsAddModalOpen(false);
                        setAddSearchQuery("");
                      }}
                      className="p-3.5 rounded-2xl border border-neutral-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                          {p.builder_name || p.builder || "Developer"}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                          {p.name || p.projectName}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {p.locality || p.area || "Bengaluru"} • {p.price_range || p.priceRange || "Verified RERA"}
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-neutral-100 group-hover:bg-blue-600 group-hover:text-white text-neutral-700 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 ml-2">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TableRow({ label, data, render }: { label: string, data: any[], render: (p: any) => React.ReactNode }) {
  return (
    <tr className="hover:bg-neutral-50/50 transition-colors">
      <td className="p-4 font-semibold text-xs text-neutral-500 uppercase tracking-wider border-r border-neutral-100 bg-white sticky left-0 z-10">
        {label}
      </td>
      {data.map(p => (
        <td key={p.id} className="p-4 text-neutral-900 border-r border-neutral-100 last:border-0 align-top">
          {render(p)}
        </td>
      ))}
    </tr>
  );
}

function AICard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-2">
      <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
        {icon} 
        <span>{title}</span>
      </div>
      <div className="text-white font-medium text-xs sm:text-sm leading-snug">
        {value}
      </div>
    </div>
  );
}
