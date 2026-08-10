import React from "react";
import { mapToWhitelistedProject } from "../lib/projectDataMapper";
import { usePropertySearch } from "../hooks/usePropertySearch";
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Building2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Share2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
  X,
  Building,
  Calendar,
  Layers,
  Map,
  Star,
  Clock,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "./CribrToast";
import ResultContextAIAssistant from "./Search/ResultContextAIAssistant";

interface PropertyExplorerProps {
  onAnalyze: (query: string) => void;
  onSelectProperty?: (property: any) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function PropertyExplorer({
  onAnalyze,
  onSelectProperty,
  searchQuery,
  onClearSearch
}: PropertyExplorerProps) {
  const {
    projects,
    filteredProjects: filteredProperties,
    isLoading,
    error,
    refresh: refreshProperties,
    selectedCategory,
    setSelectedCategory,
  } = usePropertySearch(searchQuery);

  const categories = ["All", "Luxury", "Affordable", "Ready to Move", "Investment"];

  return (
    <section
      id="explorer"
      className="py-20 md:py-32 bg-[#FAFAFC] relative font-sans text-neutral-900 selection:bg-blue-100 selection:text-blue-900 border-t border-neutral-200/50"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-neutral-950 leading-[1.15]"
            >
              Verified Property Intelligence.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-neutral-500 font-normal leading-relaxed mt-3"
            >
              Explore top-tier residential developments pre-vetted across 14 state RERA registers, title deeds, and structural safety standards.
            </motion.p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {searchQuery && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-semibold border border-blue-200 shadow-xs">
                <span>Filter: "{searchQuery}"</span>
                {onClearSearch && (
                  <button onClick={onClearSearch} className="hover:text-blue-900 transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "bg-white border border-neutral-200/80 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards Grid or Empty State */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-neutral-200/80 p-12 text-center space-y-4 shadow-xs max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold text-neutral-950">
                No Properties Available
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto font-normal leading-relaxed">
                Properties added from the Admin Panel will appear here.
              </p>
            </div>
            <button
              onClick={refreshProperties}
              className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-neutral-200/80 p-12 text-center space-y-2 max-w-md mx-auto">
            <h4 className="text-lg font-display font-bold text-neutral-950">
              No matching properties found.
            </h4>
            <p className="text-xs text-neutral-500">
              Try switching your category filter or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, idx) => (
              <PropertyCard
                key={property.id}
                property={property}
                idx={idx}
                onAnalyze={onAnalyze}
                onSelectProperty={onSelectProperty}
              />
            ))}
          </div>
        )}

        {/* Phase 2 - Result Set Grounded AI Assistant */}
        {filteredProperties.length > 0 && (
          <ResultContextAIAssistant
            searchQuery={searchQuery || ""}
            activeFilters={{ category: selectedCategory }}
            currentProjects={filteredProperties}
            onSelectProperty={onSelectProperty}
          />
        )}
      </div>
    </section>
  );
}

interface PropertyCardProps {
  key?: React.Key;
  property: any;
  idx: number;
  onAnalyze: (q: string) => void;
  onSelectProperty?: (p: any) => void;
}

function PropertyCard({ property, idx, onAnalyze, onSelectProperty }: PropertyCardProps) {
  const p = mapToWhitelistedProject(property);

  const handleOpenDetails = () => {
    if (onSelectProperty) {
      onSelectProperty(property);
    } else {
      window.history.pushState(null, "", `/property/${p.id}`);
      window.dispatchEvent(new Event("popstate"));
    }
  };

  return (
    <motion.article
      layoutId={`property-card-${p.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleOpenDetails}
      className="bg-white rounded-[24px] border border-neutral-200/80 overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Property Image & Header */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
        <motion.img
          layoutId={`property-img-${p.id}`}
          src={p.image}
          alt={p.projectName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-white" />
            <span>RERA Registered ✓</span>
          </div>

          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-neutral-900/90 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold border border-neutral-700/60 shadow-xs">
            <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>{p.googleRating}</span>
          </div>
        </div>

        {/* Image Overlay Header */}
        <div className="absolute bottom-3 inset-x-3.5 text-white space-y-0.5">
          <div className="text-[11px] font-mono font-bold text-blue-300 uppercase tracking-wider">
            {p.builder}
          </div>
          <h3 className="text-xl font-bold font-display tracking-tight leading-snug">
            {p.projectName}
          </h3>
          <p className="text-xs text-neutral-300 flex items-center space-x-1 font-normal">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{p.locality}, {p.area}</span>
          </p>
        </div>
      </div>

      {/* Property Whitelisted Details Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-neutral-900">
        <div className="space-y-3.5">
          {/* Price & Rate */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                Price Range
              </span>
              <span className="text-base font-bold font-mono text-neutral-950">
                {p.minPrice} – {p.maxPrice}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                Rate / sq ft
              </span>
              <span className="text-xs font-bold font-mono text-blue-700">
                {p.pricePerSqft}
              </span>
            </div>
          </div>

          {/* Unit Configurations */}
          <div className="flex items-center justify-between text-xs py-1 px-1 border-b border-neutral-100">
            <span className="text-neutral-500 font-medium">Unit Types</span>
            <span className="font-bold font-mono text-neutral-950">{p.unitTypes}</span>
          </div>

          {/* Possession & Progress */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">Possession</span>
              <span className="font-bold font-mono text-neutral-900 text-[11px]">{p.possessionDate}</span>
            </div>
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">Construction</span>
              <span className="font-bold font-mono text-emerald-700 text-[11px]">{p.constructionProgress}% Completed</span>
            </div>
          </div>

          {/* Scale & Location Summary */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono bg-neutral-50/60 p-2.5 rounded-xl border border-neutral-100/80 text-center">
            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-semibold block">Scale</span>
              <span className="font-bold text-neutral-900">{p.landAreaAcres}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-semibold block">Total Units</span>
              <span className="font-bold text-neutral-900">{p.totalUnits}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-semibold block">Builder Grade</span>
              <span className="font-bold text-indigo-700">Grade {p.builderGrade}</span>
            </div>
          </div>

          {/* Commute & Timeline */}
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600 px-1 pt-0.5">
            <span className="flex items-center space-x-1">
              <Navigation className="w-3 h-3 text-neutral-400" />
              <span>{p.distanceToHub} ({p.commuteScoreDisplay})</span>
            </span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold border border-emerald-200/60">
              Timeline: {p.timelineReliabilityDisplay}
            </span>
          </div>

          {/* RERA Number */}
          <div className="text-[10px] font-mono text-neutral-400 truncate px-1 pt-1 border-t border-neutral-100">
            RERA: <span className="text-neutral-600 font-semibold">{p.reraNumber}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
          <button
            onClick={() => {
              handleOpenDetails();
            }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-mono tracking-wide flex items-center justify-center space-x-2 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>View Project Overview</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.clipboard) {
                navigator.clipboard.writeText(`${window.location.origin}/property/${p.id}`);
              }
              showToast(`Link for ${p.projectName} copied`, "info");
            }}
            className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors cursor-pointer"
            title="Share Property"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
