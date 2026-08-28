import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Mic,
  MapPin,
  TrendingUp,
  Heart,
  Calendar,
  ArrowLeft,
  Building2,
  Sparkles,
  ShieldCheck,
  Trash2,
  Clock,
  ChevronRight,
  X,
  Activity,
  CheckCircle2,
  Home as HomeIcon,
  User,
  Bell,
  MessageSquare,
  Building,
  DollarSign,
  Key,
  Compass,
  ArrowUpRight,
  Filter,
  Check,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PremiumProperty, PropertyReport, SavedHome } from "../types";
import { usePropertySearch } from "../hooks/usePropertySearch";
import { CribrUser } from "../lib/supabase";
import CribrIntelligenceReport from "./CribrIntelligenceReport";
import PropertyIntelligenceDetailsModal from "./PropertyIntelligenceDetailsModal";
import CribrMobileChat from "./CribrMobileChat";
import { showToast } from "./CribrToast";
import { mapToWhitelistedProject } from "../lib/projectDataMapper";
import ResultContextAIAssistant from "./Search/ResultContextAIAssistant";
import { Star, Navigation, ArrowRight, Scale } from "lucide-react";

interface CribrMobileHomeProps {
  currentUser: CribrUser | null;
  savedHomes: SavedHome[];
  onSaveHome: (property: PremiumProperty) => void;
  onRemoveSaved: (id: string) => void;
  onSignInClick: () => void;
  onOpenDashboard: () => void;
  recentSearches: string[];
  setRecentSearches: React.Dispatch<React.SetStateAction<string[]>>;
  activeReport: PropertyReport | null;
  setActiveReport: React.Dispatch<React.SetStateAction<PropertyReport | null>>;
  isReportLoading: boolean;
  setIsReportLoading: React.Dispatch<React.SetStateAction<boolean>>;
  compareList?: string[];
  onToggleCompareSelect?: (p: any) => void;
  onQuerySubmit: (query: string) => Promise<void>;
  onBookVisit?: (property: PremiumProperty) => void;
  handleSaveCurrentReport: () => void;
  onDownloadReport: () => void;
  onScheduleCallback: (type: string) => void;
  onUnlockPremium: () => void;
  onSelectProperty?: (property: any) => void;
}

const QUICK_SEARCH_CHIPS = [
  { label: "Best Luxury Projects", query: "Best luxury projects in India", emoji: "🏢" },
  { label: "Under ₹80L", query: "Best projects below 80 lakhs", emoji: "💰" },
  { label: "Safe Projects", query: "Safest projects with 100% RERA compliance", emoji: "🟢" },
  { label: "Near Metro", query: "Projects near Metro line", emoji: "🚇" },
  { label: "Family Friendly", query: "Family friendly gated communities", emoji: "🏫" },
  { label: "Low Density", query: "Lowest density residential projects", emoji: "🌳" },
  { label: "High Appreciation", query: "Projects with highest appreciation potential", emoji: "📈" }
];

const TRENDING_SEARCHES = [
  { text: "Best societies in Whitefield", query: "Best societies in Whitefield" },
  { text: "Safest builders with low risk", query: "Safest builders in India" },
  { text: "Upcoming possession 2026", query: "Upcoming possession projects 2026" },
  { text: "Lowest maintenance projects", query: "Lowest maintenance projects" }
];

const CATEGORIES = [
  { name: "Luxury", icon: "👑", desc: "Top 1% Residences", query: "Best luxury properties" },
  { name: "Affordable", icon: "🏷️", desc: "High Value Homes", query: "Best affordable properties" },
  { name: "Ready to Move", icon: "🔑", desc: "Instant Possession", query: "Ready to move properties" },
  { name: "Investment", icon: "📈", desc: "High ROI Assets", query: "High appreciation investment properties" },
  { name: "Villa", icon: "🏡", desc: "Private Estates", query: "Luxury villa projects" },
  { name: "Apartments", icon: "🏢", desc: "Gated Enclaves", query: "Top apartment complexes" }
];

const SAMPLE_QUICK_PROMPTS = [
  "Is Prestige Elysian safe?",
  "Best projects below ₹1Cr",
  "Lowest density projects",
  "Compare Sobha vs Prestige"
];

const AI_SUGGESTED_QUESTIONS = [
  "Is Prestige worth buying?",
  "Compare Prestige vs Sobha",
  "Projects with better appreciation",
  "Lowest density nearby"
];

const STATUS_MESSAGES = [
  "Ingesting RERA filings...",
  "Querying state land registries...",
  "Scanning judicial court databases...",
  "Evaluating developer solvency...",
  "Running structural safety model...",
  "Generating Cribr score..."
];

export default function CribrMobileHome({
  currentUser,
  savedHomes,
  onSaveHome,
  onRemoveSaved,
  onSignInClick,
  onOpenDashboard,
  recentSearches,
  setRecentSearches,
  activeReport,
  setActiveReport,
  isReportLoading,
  setIsReportLoading,
  compareList = [],
  onToggleCompareSelect,
  onQuerySubmit,
  onBookVisit,
  handleSaveCurrentReport,
  onDownloadReport,
  onScheduleCallback,
  onUnlockPremium,
  onSelectProperty
}: CribrMobileHomeProps) {
  const [activeTab, setActiveTab] = useState<"home" | "search" | "saved" | "chat" | "profile">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingActive, setIsSearchingActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [statusIndex, setStatusIndex] = useState(0);
  const [selectedPropertyModal, setSelectedPropertyModal] = useState<any | null>(null);

  // Shared property loading, search, and filtering hook
  const {
    projects: propertiesList,
    filteredProjects: filteredRankedProperties,
    isLoading: propertiesLoading,
    isSearching,
    error: propertiesError,
    refresh: refreshProperties,
    selectedCategory,
    setSelectedCategory,
    isSuggestionMode,
  } = usePropertySearch(searchQuery);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Monitor scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Status message cycler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReportLoading) {
      setStatusIndex(0);
      interval = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isReportLoading]);

  // Voice Search Simulation Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (voiceActive) {
      setVoiceText("Listening...");
      const mockPhrases = [
        "Is Prestige Elysian safe?",
        "Compare Sobha vs Prestige",
        "Best projects below 1 crore",
        "Lowest density projects in Bangalore"
      ];
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];

      timer = setTimeout(() => {
        setVoiceText(`"${randomPhrase}"`);
        setTimeout(() => {
          setVoiceActive(false);
          setSearchQuery(randomPhrase);
          handleExecuteQuery(randomPhrase);
        }, 1200);
      }, 1800);
    }
    return () => clearTimeout(timer);
  }, [voiceActive]);

  // Execute query handler
  const handleExecuteQuery = async (queryStr: string) => {
    if (!queryStr.trim()) return;
    setSearchQuery(queryStr);
    setIsSearchingActive(true); // Keep search UI open to show results
    setActiveTab("home"); // ensure we are on home tab
    // We don't need onQuerySubmit here since mobile handles search internally now via ResultContextAIAssistant
  };

  // Search filtering is handled by the usePropertySearch hook above.
  // filteredRankedProperties is already computed and ready to render.


  return (
    <div className="min-h-screen bg-[#FAFAFC] text-neutral-900 font-sans antialiased pb-28 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 px-5 py-3.5 flex items-center justify-between transition-all duration-200 ${
          scrolled || isSearchingActive
            ? "bg-white/90 backdrop-blur-xl border-b border-neutral-200/50 shadow-2xs"
            : "bg-white/70 backdrop-blur-md border-b border-transparent"
        }`}
      >
        {/* Left: CRIBR Logo */}
        <div
          onClick={() => {
            setActiveTab("home");
            setIsSearchingActive(false);
            setActiveReport(null);
          }}
          className="flex items-center space-x-2 cursor-pointer active:scale-95 transition-transform"
        >
          <span className="font-display font-black text-xl tracking-tight text-neutral-950">
            CRIBR
          </span>
        </div>

        {/* Right: Notification & Profile */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => showToast("All 14 RERA registries are updated live.", "info")}
            className="w-10 h-10 rounded-full bg-neutral-100/80 border border-neutral-200/50 flex items-center justify-center text-neutral-700 active:scale-95 transition-all relative"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
          </button>

          <button
            onClick={() => {
              if (currentUser) {
                onOpenDashboard();
              } else {
                onSignInClick();
              }
            }}
            className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200/80 flex items-center justify-center bg-neutral-100 active:scale-95 transition-all shadow-2xs"
            aria-label="Profile"
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-neutral-600" />
            )}
          </button>
        </div>
      </header>

      {/* Spacer for sticky header */}
      <div className="h-16" />

      {/* 2. MAIN CONTENT AREA */}
      <main className="px-5 pt-3">
        <AnimatePresence mode="wait">
          {/* SEARCH ACTIVE VIEW OVERLAY */}
          {isSearchingActive ? (
            <motion.div
              key="active-search-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 pb-12"
            >
              {/* TOP FIXED SEARCH BOX */}
              <div className="sticky top-18 z-30 pt-1 bg-[#FAFAFC]">
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-blue-600">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleExecuteQuery(searchQuery);
                      }
                    }}
                    placeholder="Ask anything about any project..."
                    className="w-full h-14 pl-12 pr-24 bg-white rounded-[24px] border border-blue-500/50 ring-4 ring-blue-500/10 text-base font-medium text-neutral-950 placeholder-neutral-400 focus:outline-none shadow-sm"
                    autoFocus
                  />
                  <div className="absolute right-3 flex items-center space-x-1.5">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleExecuteQuery(searchQuery || "Prestige Elysian")}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-full transition-all active:scale-95 shadow-2xs"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 px-1">
                  <span className="text-[11px] font-mono text-neutral-400 font-medium">
                    {filteredRankedProperties.length} Information Results Found
                  </span>
                  <button
                    onClick={() => setIsSearchingActive(false)}
                    className="text-xs text-blue-600 font-semibold"
                  >
                    Close Search
                  </button>
                </div>
              </div>

              {/* RANKED RESULTS LIST */}
              <div className="space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-1">
                  Ranked Information Matrix
                </div>

                {filteredRankedProperties.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layoutId={`property-card-${item.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedPropertyModal(item);
                    }}
                    className="bg-white rounded-[24px] p-4 border border-neutral-200/70 shadow-xs flex items-center gap-3.5 cursor-pointer hover:border-blue-300 transition-all relative overflow-hidden"
                  >
                    {/* Left Image Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 relative">
                      {/* Rank Badge safely nested inside image thumbnail */}
                      <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-neutral-950/90 backdrop-blur-xs text-white font-mono font-black text-[9px] rounded-md shadow-2xs">
                        #{idx + 1}
                      </div>
                      <motion.img
                        layoutId={`property-img-${item.id}`}
                        src={item.image}
                        alt={item.projectName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between items-start">
                        {onToggleCompareSelect && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCompareSelect(item);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                              compareList.includes(item.id) 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                                : "bg-black/40 text-white/90 hover:bg-black/60"
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono font-bold text-white bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-md">
                        {item.minPrice}
                      </div>
                    </div>

                    {/* Content Center */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold rounded-md border border-emerald-200/50 flex items-center shrink-0">
                          <Check className="w-2.5 h-2.5 mr-0.5 text-emerald-600" /> Verified
                        </span>
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-mono font-bold rounded-md border border-blue-200/50 shrink-0 truncate max-w-[110px]">
                          {item.possessionDate}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-neutral-950 truncate tracking-tight">
                        {item.projectName}
                      </h4>
                      <p className="text-xs text-neutral-500 truncate font-medium">
                        {item.builder} • {item.locality}
                      </p>
                      <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed font-normal">
                        {item.googleReviewSummary}
                      </p>
                    </div>

                    {/* Score Right */}
                    <div className="flex flex-col items-end justify-between shrink-0 self-stretch py-0.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 border border-blue-200/60 flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-mono font-black text-blue-700 leading-none">
                          {item.timelineReliabilityRatio}
                        </span>
                        <span className="text-[7px] font-mono uppercase text-blue-500 font-semibold mt-0.5">
                          Score
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 mt-2" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI RESULT CONTEXT ASSISTANT */}
              {searchQuery && filteredRankedProperties.length > 0 && (
                <div className="pt-2">
                  <ResultContextAIAssistant
                    searchQuery={searchQuery}
                    activeFilters={{ category: selectedCategory }}
                    currentProjects={filteredRankedProperties}
                    onSelectProperty={onSelectProperty}
                  />
                </div>
              )}

              {/* BELOW RESULTS: AI SUGGESTED QUESTIONS */}
              <div className="pt-4 space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-1 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Suggested Inquiries</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {AI_SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleExecuteQuery(q)}
                      className="p-3.5 bg-white border border-neutral-200/70 hover:border-blue-300 rounded-2xl text-left text-xs font-semibold text-neutral-800 flex items-center justify-between active:scale-[0.98] transition-all shadow-2xs"
                    >
                      <span>{q}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : activeTab === "home" ? (
            <motion.div
              key="home-tab-main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10 pb-12"
            >
              {/* 3. HERO SECTION */}
              <section className="pt-2 pb-4 space-y-6">
                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="text-4xl sm:text-5xl font-display font-black tracking-tight text-neutral-950 leading-[1.08]"
                  >
                    Find the right property
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-sm sm:text-base text-neutral-500 font-normal leading-relaxed"
                  >
                    Get instant legal, pricing, construction and risk information before visiting.
                  </motion.p>
                </div>

                {/* LARGE SEARCH BOX */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="space-y-3"
                >
                  <div
                    onClick={() => setIsSearchingActive(true)}
                    className="relative flex items-center bg-white rounded-[24px] border border-neutral-200/90 shadow-sm p-2 pl-4 cursor-pointer hover:border-blue-400 active:scale-[0.99] transition-all group"
                  >
                    <Search className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors mr-3 shrink-0" />
                    <span className="w-full text-base font-normal text-neutral-400 truncate">
                      Ask anything...
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVoiceActive(true);
                      }}
                      className="p-2.5 rounded-2xl bg-neutral-100 text-neutral-600 hover:bg-blue-50 hover:text-blue-600 transition-all mr-1"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchingActive(true);
                      }}
                      className="px-4 py-2.5 bg-neutral-950 hover:bg-blue-600 text-white text-xs font-semibold rounded-2xl flex items-center space-x-1 transition-colors shadow-2xs shrink-0"
                    >
                      <span>Search</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* EXAMPLES UNDERNEATH INPUT */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 px-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold mr-1">
                      Try asking:
                    </span>
                    {SAMPLE_QUICK_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleExecuteQuery(prompt)}
                        className="text-xs text-neutral-600 hover:text-blue-600 bg-neutral-100/70 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-neutral-200/40 font-medium transition-colors cursor-pointer"
                      >
                        • {prompt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* 4. QUICK SEARCH CHIPS */}
              <section className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-1">
                  Quick Search Vectors
                </div>

                <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none scroll-smooth">
                  {QUICK_SEARCH_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExecuteQuery(chip.query)}
                      className="flex-shrink-0 px-4 py-2.5 bg-white border border-neutral-200/70 hover:border-blue-300 rounded-2xl text-xs font-semibold text-neutral-800 flex items-center space-x-2 shadow-2xs active:scale-95 transition-all cursor-pointer"
                    >
                      <span>{chip.emoji}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* ACTIVE REPORT DISPLAY (IF OPENED) */}
              {activeReport && (
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase font-black tracking-widest">
                      ACTIVE VERIFICATION REPORT
                    </span>
                    <button
                      onClick={() => setActiveReport(null)}
                      className="p-1.5 bg-neutral-100 text-neutral-500 rounded-full hover:bg-neutral-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <CribrIntelligenceReport
                    report={activeReport}
                    onSaveCurrent={handleSaveCurrentReport}
                    isSaved={savedHomes.some((h) => h.propertyName === activeReport.propertyOrQueryName)}
                    isLoading={isReportLoading}
                    onBookVisit={onBookVisit}
                    onDownloadReport={onDownloadReport}
                    onScheduleCallback={onScheduleCallback}
                    onUnlockPremium={onUnlockPremium}
                  />
                </section>
              )}

              {/* 5. ALL FEATURED PROPERTY CARDS */}
              <section className="space-y-4">
                <div className="flex items-end justify-between px-1">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-bold">
                      Verified Audits
                    </div>
                    <h3 className="text-xl font-bold font-display text-neutral-950 tracking-tight">
                      All Properties ({propertiesList.length})
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono font-medium">
                    100% RERA Verified
                  </span>
                </div>

                {/* Vertical Stack of All Property Cards */}
                <div className="space-y-4">
                  {propertiesList.length === 0 ? (
                    <div className="bg-white rounded-[24px] border border-neutral-200/80 p-8 text-center space-y-4 shadow-xs">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-display font-bold text-neutral-950">
                          No Properties Available
                        </h4>
                        <p className="text-xs text-neutral-500 max-w-xs mx-auto font-normal leading-relaxed">
                          Properties added from the Admin Panel will appear here.
                        </p>
                      </div>
                      <button
                        onClick={refreshProperties}
                        className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center space-x-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* AI Searching indicator */}
                      {isSearching && searchQuery && (
                        <div className="flex items-center justify-center gap-2 py-4">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-medium text-blue-600">
                            AI is analyzing your query...
                          </span>
                        </div>
                      )}

                      {/* If a search query is active and returns 0 matching results */}
                      {searchQuery && filteredRankedProperties.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-2xl border border-neutral-200/80 p-6 text-center space-y-3 shadow-2xs"
                        >
                          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto border border-neutral-200">
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-base font-display font-bold text-neutral-900">
                              No matching projects found
                            </h4>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                              No verified projects match "{searchQuery}".
                            </p>
                          </div>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="px-4 py-2 bg-neutral-950 text-white text-xs font-semibold rounded-xl shadow-xs"
                          >
                            View all properties
                          </button>
                        </motion.div>
                      ) : (
                        filteredRankedProperties.map((prop, idx) => {
                          const p = prop;
                          return (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (onSelectProperty) {
                              onSelectProperty(prop);
                            } else {
                              window.history.pushState(null, "", `/property/${p.id}`);
                              window.dispatchEvent(new Event("popstate"));
                            }
                          }}
                          className="w-full bg-white rounded-[24px] border border-neutral-200/80 overflow-hidden shadow-xs cursor-pointer group hover:border-blue-400 active:scale-[0.99] transition-all duration-150"
                        >
                          {/* Large Hero Image */}
                          <div className="h-[190px] w-full relative overflow-hidden bg-neutral-100">
                            <img
                              src={p.image}
                              alt={p.projectName}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                            {/* Top Badges */}
                            <div className="absolute top-3 inset-x-3.5 flex items-center justify-between">
                              <div className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-mono font-bold rounded-full flex items-center space-x-1 shadow-xs">
                                <Check className="w-3 h-3 text-white" />
                                <span>RERA Registered ✓</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                {onToggleCompareSelect && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleCompareSelect(p);
                                    }}
                                    className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-xs ${
                                      compareList.includes(p.id) 
                                        ? "bg-blue-600 text-white shadow-blue-900/20 border border-blue-500" 
                                        : "bg-neutral-900/90 text-white/90 border border-neutral-700/60"
                                    }`}
                                  >
                                    <Scale className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <div className="px-2.5 py-1 bg-neutral-900/90 text-amber-300 border border-neutral-700/60 text-[10px] font-mono font-bold rounded-full flex items-center space-x-1 shadow-xs">
                                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                                  <span>{p.googleRating}</span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Overlay Title on Image */}
                            <div className="absolute bottom-3 inset-x-3.5 text-white space-y-0.5">
                              <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wider block">
                                {p.builder}
                              </span>
                              <h4 className="text-lg font-bold font-display tracking-tight leading-snug">
                                {p.projectName}
                              </h4>
                              <p className="text-xs text-neutral-300 font-normal">
                                {p.locality}, {p.area}
                              </p>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-4 space-y-3 bg-white">
                            {/* Price & Rate */}
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                                  Price Range
                                </span>
                                <span className="text-sm font-bold text-neutral-950 font-mono">
                                  {p.minPrice} – {p.maxPrice}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                                  Rate / sq ft
                                </span>
                                <span className="text-xs font-bold font-mono text-blue-700 block">
                                  {p.pricePerSqft}
                                </span>
                              </div>
                            </div>

                            {/* Unit Configurations & Possession */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                                <span className="text-[9px] font-mono uppercase text-neutral-400 font-semibold block">Possession</span>
                                <span className="font-bold font-mono text-neutral-900 text-[11px]">{p.possessionDate}</span>
                              </div>
                              <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                                <span className="text-[9px] font-mono uppercase text-neutral-400 font-semibold block">Construction</span>
                                <span className="font-bold font-mono text-emerald-700 text-[11px]">{p.constructionProgress}% Completed</span>
                              </div>
                            </div>

                            {/* Scale & Units */}
                            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono bg-neutral-50/60 p-2 rounded-lg border border-neutral-100 text-center">
                              <div>
                                <span className="text-[8px] text-neutral-400 uppercase font-semibold block">Scale</span>
                                <span className="font-bold text-neutral-900">{p.landAreaAcres}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-neutral-400 uppercase font-semibold block">Units</span>
                                <span className="font-bold text-neutral-900">{p.totalUnits}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-neutral-400 uppercase font-semibold block">Grade</span>
                                <span className="font-bold text-indigo-700">Grade {p.builderGrade}</span>
                              </div>
                            </div>

                            {/* Action CTA */}
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onSelectProperty) {
                                    onSelectProperty(prop);
                                  } else {
                                    window.history.pushState(null, "", `/property/${p.id}`);
                                    window.dispatchEvent(new Event("popstate"));
                                  }
                                }}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-mono tracking-wide flex items-center justify-center space-x-1.5 transition-all shadow-xs active:scale-98 cursor-pointer"
                              >
                                <span>View Project Overview</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>
              </section>

              {/* 6. TRENDING SEARCHES */}
              <section className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-1">
                  Trending Inquiries
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TRENDING_SEARCHES.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleExecuteQuery(item.query)}
                      className="p-4 bg-white rounded-[20px] border border-neutral-200/70 shadow-2xs hover:border-blue-300 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          🔥
                        </div>
                        <span className="text-xs font-bold text-neutral-900">
                          {item.text}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. EXPLORE BY CATEGORY */}
              <section className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-1">
                  Explore by Category
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat, idx) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <motion.div
                        key={idx}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory(isSelected ? "All" : cat.name);
                          // Scroll up to show results if not already at top
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`p-4 rounded-[24px] border shadow-2xs flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer transition-all ${
                          isSelected 
                            ? "bg-blue-50/50 border-blue-500" 
                            : "bg-white border-neutral-200/70 hover:border-blue-300"
                        }`}
                      >
                        <div className="text-3xl mb-0.5">{cat.icon}</div>
                        <h5 className="text-sm font-bold text-neutral-950 tracking-tight">
                          {cat.name}
                        </h5>
                        <span className="text-[10px] text-neutral-500 font-mono font-normal">
                          {cat.desc}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          ) : activeTab === "search" ? (
            <motion.div
              key="search-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pb-12"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-neutral-950 tracking-tight">
                  Search & Verification
                </h2>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                  Search across state RERA registers, municipal sanctions, and court databases.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleExecuteQuery(searchQuery);
                    }
                  }}
                  placeholder="Search any property, builder, or city..."
                  className="w-full h-14 pl-12 pr-12 bg-white rounded-[24px] border border-neutral-200 focus:border-blue-600 text-sm font-medium focus:outline-none shadow-2xs"
                />
                <button
                  onClick={() => setVoiceActive(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-600 bg-blue-50 rounded-xl"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              {/* Suggested Questions */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  Suggested AI Prompts
                </div>
                <div className="space-y-2">
                  {SAMPLE_QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleExecuteQuery(prompt)}
                      className="w-full p-3.5 bg-white border border-neutral-200/70 hover:border-blue-300 rounded-2xl text-left text-xs font-semibold text-neutral-900 flex items-center justify-between active:scale-[0.98] transition-all"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : activeTab === "saved" ? (
            <motion.div
              key="saved-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pb-12"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-display text-neutral-950 tracking-tight">
                  Saved Library
                </h2>
                <p className="text-xs text-neutral-500 font-normal">
                  Your saved property audits and intelligence reports.
                </p>
              </div>

              {savedHomes.length > 0 ? (
                <div className="space-y-3">
                  {savedHomes.map((home) => (
                    <div
                      key={home.id}
                      className="p-4 bg-white rounded-[24px] border border-neutral-200/70 shadow-2xs space-y-3 relative"
                    >
                      <button
                        onClick={() => onRemoveSaved(home.id)}
                        className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-red-500 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-1 pr-8">
                        <span className="text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md font-bold">
                          {home.city}
                        </span>
                        <h3 className="text-base font-bold text-neutral-950">{home.propertyName}</h3>
                        <p className="text-xs text-neutral-400 font-medium">by {home.developer}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                        <span className="text-xs font-mono font-bold text-emerald-600">
                          {home.overallScore}% AI Score
                        </span>
                        <button
                          onClick={() => handleExecuteQuery(home.propertyName)}
                          className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>View Audit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-white rounded-[24px] border border-neutral-200/70 text-neutral-400 space-y-3 shadow-2xs">
                  <Heart className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="text-xs font-medium text-neutral-600">No saved properties yet.</p>
                  <button
                    onClick={() => setActiveTab("home")}
                    className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-semibold"
                  >
                    Explore Properties
                  </button>
                </div>
              )}
            </motion.div>
          ) : activeTab === "chat" ? (
            <div className="fixed inset-0 z-50 bg-[#FAFAFC]">
              <CribrMobileChat
                currentUser={currentUser}
                savedHomes={savedHomes}
                onSaveHome={onSaveHome}
                onRemoveSaved={onRemoveSaved}
                onBookVisit={onBookVisit}
                onBackToHome={() => {
                  setActiveTab("home");
                }}
                initialQuery={searchQuery}
              />
            </div>
          ) : (
            <motion.div
              key="profile-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 pb-12"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-bold font-display text-neutral-950 tracking-tight">
                  Account Profile
                </h2>
                <p className="text-xs text-neutral-500 font-normal">
                  Manage your verification alerts and settings.
                </p>
              </div>

              {currentUser ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-[24px] border border-neutral-200/70 shadow-2xs flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.fullName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 text-lg">
                          {currentUser.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-950">{currentUser.fullName}</h3>
                      <p className="text-xs text-neutral-400 font-mono">{currentUser.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenDashboard}
                    className="w-full py-3.5 bg-neutral-950 text-white rounded-[20px] font-semibold text-xs shadow-2xs"
                  >
                    Open Account Dashboard
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-[24px] border border-neutral-200/70 text-neutral-400 space-y-4 shadow-2xs">
                  <User className="w-10 h-10 text-neutral-300 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950">Sign in to CRIBR</h4>
                    <p className="text-xs text-neutral-500 font-normal mt-1">
                      Save favorite properties, access RERA updates, and request expert consultations.
                    </p>
                  </div>
                  <button
                    onClick={onSignInClick}
                    className="w-full py-3 bg-blue-600 text-white rounded-[20px] font-semibold text-xs shadow-2xs"
                  >
                    Sign In Now
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 8. FLOATING GLASS BOTTOM NAVIGATION */}
      <nav className="fixed bottom-5 left-4 right-4 z-40 bg-white/85 backdrop-blur-xl border border-neutral-200/60 rounded-full h-16 shadow-lg px-6 flex items-center justify-between">
        {[
          { id: "home", label: "Home", icon: HomeIcon },
          { id: "search", label: "Search", icon: Search },
          { id: "chat", label: "AI Chat", icon: MessageSquare },
          { id: "saved", label: "Saved", icon: Heart },
          { id: "profile", label: "Profile", icon: User }
        ].map((tab) => {
          const isActive = activeTab === tab.id && !isSearchingActive;
          const isChat = tab.id === "chat";
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setIsSearchingActive(false);
                setActiveTab(tab.id as any);
                if (tab.id === "search") {
                  setIsSearchingActive(true);
                }
              }}
              className="flex flex-col items-center justify-center relative focus:outline-none"
            >
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? isChat
                      ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs"
                      : "bg-neutral-950 text-white"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <IconComponent className="w-4.5 h-4.5" />
              </div>
              <span
                className={`text-[9px] font-mono font-bold mt-0.5 ${
                  isActive ? "text-neutral-950" : "text-neutral-400"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* VOICE MODAL */}
      <AnimatePresence>
        {voiceActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FAFAFC]/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6"
          >
            <div className="max-w-xs space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                <Mic className="w-8 h-8 relative z-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-950">AI Voice Assistant</h3>
                <p className="text-xs text-neutral-500">Ask anything about any project or builder...</p>
              </div>

              <div className="p-4 bg-white border border-neutral-200/80 rounded-2xl w-full shadow-2xs min-h-16 flex items-center justify-center">
                <p className="text-sm font-semibold text-blue-600 italic">
                  {voiceText}
                </p>
              </div>

              <button
                onClick={() => setVoiceActive(false)}
                className="px-5 py-2 bg-neutral-950 text-white rounded-full text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {isReportLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FAFAFC]/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6"
          >
            <div className="max-w-xs space-y-6 flex flex-col items-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-neutral-200/60" />
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-indigo-600 animate-spin" />
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-neutral-950">CRIBR AI Synthesis</h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={statusIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs font-mono font-medium text-neutral-500"
                  >
                    {STATUS_MESSAGES[statusIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROPERTY INTELLIGENCE DETAILS MODAL */}
      <PropertyIntelligenceDetailsModal
        property={selectedPropertyModal}
        isOpen={!!selectedPropertyModal}
        onClose={() => setSelectedPropertyModal(null)}
        onAskAI={(query) => {
          setSelectedPropertyModal(null);
          handleExecuteQuery(query);
        }}
        onSaveProperty={(prop) => {
          const isAlreadySaved = savedHomes.some((h) => h.id === prop.id);
          if (isAlreadySaved) {
            onRemoveSaved(prop.id);
            showToast(`Removed ${prop.name} from saved properties`, "info");
          } else {
            onSaveHome(prop);
            showToast(`Saved ${prop.name} to your collection`, "success");
          }
        }}
        isSaved={savedHomes.some((h) => h.id === selectedPropertyModal?.id)}
        onSelectRelatedProperty={(relProp) => {
          setSelectedPropertyModal(relProp);
        }}
      />
    </div>
  );
}
