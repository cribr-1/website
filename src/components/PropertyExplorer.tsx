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
import { PropertyCard } from "./PropertyCard";

interface PropertyExplorerProps {
  onAnalyze: (query: string) => void;
  onSelectProperty?: (property: any) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  compareList: string[];
  onToggleCompareSelect: (property: any) => void;
}

export default function PropertyExplorer({
  onAnalyze,
  onSelectProperty,
  searchQuery,
  onClearSearch,
  compareList,
  onToggleCompareSelect
}: PropertyExplorerProps) {
  const {
    projects,
    filteredProjects: filteredProperties,
    isLoading,
    isSearching,
    error,
    refresh: refreshProperties,
    selectedCategory,
    setSelectedCategory,
    isSuggestionMode,
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
              Verified Property
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

        {/* Property Cards Grid or Empty Search State */}
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
        ) : (
          <>
            {/* AI Searching indicator */}
            {isSearching && searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 flex items-center justify-center gap-3 py-4"
              >
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-blue-600">
                  AI is analyzing your query...
                </span>
              </motion.div>
            )}

            {/* If a search query is active and returns 0 matching results */}
            {searchQuery && filteredProperties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-[24px] border border-neutral-200/80 p-12 text-center space-y-4 shadow-xs max-w-xl mx-auto my-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto border border-neutral-200">
                  <Building className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-neutral-950">
                    No matching projects found
                  </h3>
                  <p className="text-sm text-neutral-500 max-w-sm mx-auto font-normal leading-relaxed">
                    No verified projects match "{searchQuery}". Try searching for another locality or builder.
                  </p>
                </div>
                {onClearSearch && (
                  <button
                    onClick={onClearSearch}
                    className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center space-x-2"
                  >
                    <span>View all projects</span>
                  </button>
                )}
              </motion.div>
            ) : (
              /* Show only genuine matching filtered results */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, idx) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    idx={idx}
                    onAnalyze={onAnalyze}
                    onSelectProperty={onSelectProperty}
                    isCompareSelected={compareList.includes(property.id)}
                    onToggleCompare={onToggleCompareSelect}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Phase 2 - Result Set Grounded AI Assistant */}
        {filteredProperties.length > 0 && (
          <ResultContextAIAssistant
            searchQuery={searchQuery || ""}
            activeFilters={{ category: selectedCategory }}
            currentProjects={filteredProperties}
            onSelectProperty={onSelectProperty}
            compareList={compareList}
            onToggleCompareSelect={onToggleCompareSelect}
          />
        )}
      </div>
    </section>
  );
}


