import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Search,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  HelpCircle,
  Building,
  Scale,
  Activity,
  Heart,
  Calendar,
  X,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Navigation from "./components/Navigation";
import PropertyExplorer from "./components/PropertyExplorer";
import CribrIntelligenceReport from "./components/CribrIntelligenceReport";
import SavedHomesList from "./components/SavedHomesList";
import CribrAuthModal from "./components/CribrAuthModal";
import CribrDashboardDrawer from "./components/CribrDashboardDrawer";
import AdminPanel from "./components/AdminPanel";
import CribrToastContainer, { showToast } from "./components/CribrToast";
import CribrMobileHome from "./components/CribrMobileHome";
import CribrAiSearchPage from "./components/CribrAiSearchPage";
import PropertyIntelligenceDetailsModal from "./components/PropertyIntelligenceDetailsModal";
import PropertyDetailsPage from "./components/PropertyDetailsPage";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import { SearchProvider } from "./context/SearchContext";
import CompareFloatingBar from "./components/CompareFloatingBar";
import CribrComparePage from "./components/CribrComparePage";
import { FEATURED_PROPERTIES, MASTER_PROJECTS } from "./data";
import { cribrAuth, CribrUser, localDb } from "./lib/supabase";
import { PropertyReport, PremiumProperty, SavedHome } from "./types";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [activeSection, setActiveSection] = useState("explorer");
  const [savedHomes, setSavedHomes] = useState<SavedHome[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [selectedDesktopProperty, setSelectedDesktopProperty] = useState<typeof FEATURED_PROPERTIES[0] | null>(null);

  // Router state
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      setIsAdminMode(path === "/admin" || path.startsWith("/admin"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToProperty = (propertyIdOrSlug: string) => {
    const newPath = `/property/${propertyIdOrSlug}`;
    window.history.pushState(null, "", newPath);
    setCurrentPath(newPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateHome = () => {
    window.history.pushState(null, "", "/");
    setCurrentPath("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Intelligence Report States
  const [activeReport, setActiveReport] = useState<PropertyReport | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [analyzingPropertyName, setAnalyzingPropertyName] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Auth & Premium states
  const [currentUser, setCurrentUser] = useState<CribrUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardDrawerOpen, setIsDashboardDrawerOpen] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin");
  });
  
  // Compare Feature State
  const [compareList, setCompareList] = useState<string[]>([]);

  const handleToggleCompareSelect = (property: any) => {
    setCompareList((prev) => {
      if (prev.includes(property.id)) {
        return prev.filter((id) => id !== property.id);
      }
      if (prev.length >= 4) {
        showToast("You can compare up to 4 properties.", "info");
        return prev;
      }
      return [...prev, property.id];
    });
  };

  const navigateToCompare = () => {
    const newPath = "/compare";
    window.history.pushState(null, "", newPath);
    setCurrentPath(newPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Floating Search Placeholder cycle
  const [placeholderText, setPlaceholderText] = useState("Ask CRIBR anything...");
  const placeholderCycle = [
    "Verify regulatory filings and compliance",
    "Compare organization trust ratios",
    "Analyze resident sentiment and noise levels",
    "Check structural standards and safety score",
    "Run environmental and litigation audit"
  ];
  
  const reportRef = useRef<HTMLDivElement>(null);

  // Initialize and Sync Auth Session
  useEffect(() => {
    setCurrentUser(cribrAuth.getCurrentUser());

    const handleSessionChange = () => {
      const user = cribrAuth.getCurrentUser();
      setCurrentUser(user);
    };

    window.addEventListener("cribr_session_changed", handleSessionChange);
    return () => window.removeEventListener("cribr_session_changed", handleSessionChange);
  }, []);

  // Restore queued action on successful authentication
  const handleAuthSuccess = (user: CribrUser) => {
    setCurrentUser(user);
    if (postLoginAction) {
      // Small timeout to allow auth modal to fade out first
      setTimeout(() => {
        postLoginAction();
        setPostLoginAction(null);
      }, 300);
    }
  };

  // Reusable Auth Guard Wrapper
  const executeProtectedAction = (action: () => void, description?: string) => {
    if (cribrAuth.getCurrentUser()) {
      action();
    } else {
      if (description) {
        showToast(`Sign in required to ${description}.`, "info");
      }
      setPostLoginAction(() => action);
      setIsAuthModalOpen(true);
    }
  };

  // Load Saved Homes from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cribr_saved_homes");
      if (stored) {
        setSavedHomes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved homes", e);
    }
  }, []);

  // Load Recent Searches from Local Storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cribr_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // Close recent searches dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowRecentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll section detector
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "explorer", "report-section"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section === "report-section" ? "compare" : section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated placeholder text interval
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholderCycle.length;
      setPlaceholderText(`Ask CRIBR: "${placeholderCycle[index]}"`);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Save/Bookmark Homes interaction (Protected)
  const handleSaveHome = (property: PremiumProperty) => {
    executeProtectedAction(() => {
      const alreadySaved = savedHomes.some((h) => h.id === property.id);
      if (alreadySaved) {
        const updated = savedHomes.filter((h) => h.id !== property.id);
        setSavedHomes(updated);
        localStorage.setItem("cribr_saved_homes", JSON.stringify(updated));
        showToast(`Removed "${property.name}" from saved list.`, "info");
      } else {
        const newSaved: SavedHome = {
          id: property.id,
          propertyName: property.name,
          developer: property.developer,
          city: property.location || "N/A",
          overallScore: property.score || 89,
          savedAt: new Date().toISOString()
        };
        const updated = [...savedHomes, newSaved];
        setSavedHomes(updated);
        localStorage.setItem("cribr_saved_homes", JSON.stringify(updated));
        showToast(`Saved "${property.name}" to your library.`, "success");
      }
    }, "save property listings");
  };

  // Remove saved home (Internal)
  const handleRemoveSaved = (id: string) => {
    const updated = savedHomes.filter((h) => h.id !== id);
    setSavedHomes(updated);
    localStorage.setItem("cribr_saved_homes", JSON.stringify(updated));
  };

  // Save the currently actively opened custom report (Protected)
  const handleSaveCurrentReport = () => {
    if (!activeReport) return;
    executeProtectedAction(() => {
      const id = activeReport.propertyOrQueryName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const alreadySaved = savedHomes.some((h) => h.id === id);
      if (alreadySaved) {
        handleRemoveSaved(id);
        showToast(`Removed "${activeReport.propertyOrQueryName}" from saved reports.`, "info");
      } else {
        const newSaved: SavedHome = {
          id,
          propertyName: activeReport.propertyOrQueryName,
          developer: activeReport.builderName,
          city: "Mumbai / Bangalore Corridor",
          overallScore: activeReport.overallScore,
          savedAt: new Date().toISOString()
        };
        const updated = [...savedHomes, newSaved];
        setSavedHomes(updated);
        localStorage.setItem("cribr_saved_homes", JSON.stringify(updated));
        showToast(`Saved "${activeReport.propertyOrQueryName}" report to your library.`, "success");
      }
    }, "save AI intelligence reports");
  };


  // Query Submit Handler
  const handleQuerySubmit = async (queryToSubmit: string) => {
    if (!queryToSubmit.trim()) return;
    setIsReportLoading(false);
    setShowRecentDropdown(false);

    // Save search query to recent searches list in local storage
    const trimmedQuery = queryToSubmit.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmedQuery.toLowerCase());
      const updated = [trimmedQuery, ...filtered].slice(0, 5);
      localStorage.setItem("cribr_recent_searches", JSON.stringify(updated));
      return updated;
    });

    setSearchQuery(trimmedQuery);

    // Scroll smoothly to explorer section
    setTimeout(() => {
      const target = document.getElementById("explorer");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  // Smooth Navigation Link handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "admin") {
      setIsAdminMode(true);
      window.history.pushState(null, "", "/admin");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (sectionId === "hero") {
      if (currentPath !== "/") {
        navigateHome();
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (currentPath.startsWith("/property/")) {
    const propertyIdOrSlug = currentPath.replace("/property/", "").split("/")[0] || "";
    return (
      <ErrorBoundary fallbackTitle="Unable to load project details" fallbackMessage="Failed to render property details view. Please return to the homepage or try again.">
        <PropertyDetailsPage
          propertyIdOrSlug={propertyIdOrSlug}
          onBack={navigateHome}
          onNavigateProperty={navigateToProperty}
          savedHomes={savedHomes}
          onSaveHome={handleSaveHome}
          onRemoveSaved={handleRemoveSaved}
          onAskAI={handleQuerySubmit}
          onCompare={(p) => showToast(`Added ${p.name} to comparison matrix`, "info")}
        />
        <CribrToastContainer />
      </ErrorBoundary>
    );
  }
  if (currentPath === "/compare") {
    return (
      <ErrorBoundary fallbackTitle="Compare Error" fallbackMessage="Failed to load compare view.">
        <div className="pt-24 pb-20 min-h-screen bg-cribr-bg">
          <CribrComparePage
            compareList={compareList}
            onBack={navigateHome}
            onRemoveProject={(id) => handleToggleCompareSelect({ id })}
          />
        </div>
        <CribrToastContainer />
      </ErrorBoundary>
    );
  }

  if (isAdminMode) {
    return (
      <AdminPanel 
        onClose={() => {
          window.history.pushState(null, "", "/");
          setIsAdminMode(false);
        }} 
        currentUser={currentUser} 
      />
    );
  }

  if (isMobile) {
    return (
      <>
        <CribrMobileHome
          currentUser={currentUser}
          savedHomes={savedHomes}
          onSaveHome={handleSaveHome}
          onRemoveSaved={handleRemoveSaved}
          onSignInClick={() => setIsAuthModalOpen(true)}
          onOpenDashboard={() => setIsDashboardDrawerOpen(true)}
          recentSearches={recentSearches}
          setRecentSearches={setRecentSearches}
          activeReport={activeReport}
          setActiveReport={setActiveReport}
          isReportLoading={isReportLoading}
          setIsReportLoading={setIsReportLoading}
          compareList={compareList}
          onToggleCompareSelect={handleToggleCompareSelect}
          onQuerySubmit={handleQuerySubmit}
          onSelectProperty={(prop) => navigateToProperty(prop.id)}
          onBookVisit={() => {}}
          handleSaveCurrentReport={handleSaveCurrentReport}
          onDownloadReport={() => {
            executeProtectedAction(() => {
              showToast(`Downloading verification prospectus...`, "success");
              setTimeout(() => {
                showToast("PDF report prospectus downloaded successfully.", "success");
              }, 1200);
            }, `download the verification report prospectus for "${activeReport?.propertyOrQueryName}"`);
          }}
          onScheduleCallback={(type) => {
            if (!activeReport) return;
            executeProtectedAction(() => {
              localDb.saveCallbackRequest({
                propertyName: activeReport.propertyOrQueryName,
                consultationType: type,
              });
              showToast(`Callback request queued. A legal specialist will reach out shortly.`, "success");
            }, "request an expert callback");
          }}
          onUnlockPremium={() => {
            executeProtectedAction(() => {
              showToast("Premium legal and leverage insights unlocked successfully!", "success");
            }, "unlock exclusive leverage indexes");
          }}
        />

        {/* Portals and Modals for Mobile */}
        <AnimatePresence>
          {isAuthModalOpen && (
            <CribrAuthModal
              onClose={() => {
                setIsAuthModalOpen(false);
                setPostLoginAction(null);
              }}
              onSuccess={handleAuthSuccess}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isDashboardDrawerOpen && (
            <CribrDashboardDrawer
              isOpen={isDashboardDrawerOpen}
              onClose={() => setIsDashboardDrawerOpen(false)}
              currentUser={currentUser!}
              onSignOut={async () => {
                await cribrAuth.signOut();
                setIsDashboardDrawerOpen(false);
                showToast("Signed out of your Cribr account.", "info");
              }}
              savedPropertyIds={savedHomes.map((h) => h.id)}
              onRemoveSavedProperty={(id) => {
                handleRemoveSaved(id);
                showToast("Removed saved property.", "info");
              }}
              onSelectPropertyToAnalyze={(propertyName) => {
                setIsDashboardDrawerOpen(false);
                handleQuerySubmit(propertyName);
              }}
            />
          )}
        <AnimatePresence>
          {!isAdminMode && currentPath !== "/compare" && (
            <CompareFloatingBar
              compareList={compareList}
              projectsData={MASTER_PROJECTS}
              onCompare={navigateToCompare}
              onRemove={(id) => handleToggleCompareSelect({ id })}
              onClear={() => setCompareList([])}
            />
          )}
        </AnimatePresence>

        <CribrToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-cribr-bg text-apple-text-primary font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-16">
      
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-x-0 top-0 h-[1000px] bg-[radial-gradient(#0071E3_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

      {/* Navigation */}
      <Navigation
        savedCount={savedHomes.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenDashboard={() => setIsDashboardDrawerOpen(true)}
        onSignInClick={() => setIsAuthModalOpen(true)}
      />

      {/* HERO SECTION */}
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center items-center pt-32 px-6 md:px-12 relative overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-white"
      >
        {/* Soft Ambient Light Radial Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-200/20 via-indigo-100/30 to-purple-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl text-center space-y-8 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-display font-bold tracking-tight leading-[0.95] text-neutral-950"
          >
            Know Before <br />
            <span className="text-apple-blue">You Buy.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-neutral-600 max-w-3xl mx-auto font-normal leading-relaxed tracking-tight"
          >
            CRIBR analyzes residential developments, title records, community sentiment, pricing trends, and neighborhood information so buyers can make confident decisions.
          </motion.p>

          {/* FLOATING SEARCH CAPSULE */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-6"
          >
            <div className="relative max-w-2xl mx-auto" ref={searchContainerRef}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleQuerySubmit(searchQuery);
                }}
                className="relative rounded-full bg-white/90 backdrop-blur-xl border border-neutral-200/90 p-2 pl-6 flex items-center shadow-lg shadow-neutral-200/50 z-20 hover:border-neutral-300 transition-all duration-300"
              >
                <Search className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowRecentDropdown(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholderText}
                  className="w-full text-base sm:text-lg text-neutral-900 font-normal bg-transparent focus:outline-none placeholder-neutral-400"
                />
                <button
                  type="submit"
                  className="ml-2 px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] text-white text-[14px] font-semibold rounded-full flex items-center space-x-1 shadow-md shadow-sky-500/20 active:scale-95 transition-all duration-200"
                >
                  <span>Search</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              {/* RECENT SEARCHES DROPDOWN */}
              <AnimatePresence>
                {showRecentDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white/95 backdrop-blur-3xl border border-neutral-200/70 rounded-3xl shadow-2xl p-5 z-50 text-left overflow-hidden max-h-[380px] flex flex-col"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-neutral-400">
                        Recent Searches
                      </span>
                      {recentSearches.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem("cribr_recent_searches");
                            showToast("Cleared search history.", "info");
                          }}
                          className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-red-500 font-semibold transition-colors py-1 px-2 rounded-lg hover:bg-neutral-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear All</span>
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto pt-2 space-y-1.5 scrollbar-thin">
                      {recentSearches.length > 0 ? (
                        recentSearches.map((query, index) => (
                          <div
                            key={index}
                            className="group flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50/80 cursor-pointer transition-all duration-200"
                            onClick={() => {
                              setSearchQuery(query);
                              handleQuerySubmit(query);
                            }}
                          >
                            <div className="flex items-center space-x-3 text-apple-text-primary">
                              <Clock className="w-4 h-4 text-neutral-400" />
                              <span className="text-[14.5px] font-medium leading-none">{query}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = recentSearches.filter((_, i) => i !== index);
                                setRecentSearches(updated);
                                localStorage.setItem("cribr_recent_searches", JSON.stringify(updated));
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-200/50 rounded-full text-neutral-400 hover:text-neutral-600 transition-all duration-200 animate-fade-in"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-apple-text-secondary">
                          <p className="text-sm font-light">No recent searches yet.</p>
                          <p className="text-xs text-neutral-400 mt-1">Try searching for a project or builder.</p>
                        </div>
                      )}
                    </div>

                    {/* Pre-suggested quick clicks inside dropdown */}
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-neutral-400 block mb-2">
                        Suggested Inquiries
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {["Prestige Glenbrook", "Sobha Neopolis", "Brigade Calista"].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setSearchQuery(item);
                              handleQuerySubmit(item);
                            }}
                            className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-100 hover:border-neutral-200 rounded-xl text-xs font-medium text-apple-text-secondary hover:text-apple-text-primary transition-all duration-200"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* LIVE SEARCH CHIPS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap justify-center items-center gap-3 pt-6 max-w-3xl mx-auto"
          >
            {[
              { label: "Legal Compliance", q: "Full regulatory compliance and title audit" },
              { label: "Trust Index", q: "Organization trust and track record score" },
              { label: "Resident Sentiment", q: "Resident sentiment and noise level assessment" },
              { label: "Quality Audit", q: "Structural standards and safety rating" },
              { label: "Risk Matrix", q: "Comprehensive litigation and risk audit" },
              { label: "Environmental Grid", q: "Environmental canopy and green cover analysis" }
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => {
                  setSearchQuery(chip.q);
                  handleQuerySubmit(chip.q);
                }}
                className="px-4 py-2 bg-white/70 hover:bg-white backdrop-blur-md border border-neutral-200/50 rounded-full text-[13px] text-apple-text-secondary hover:text-apple-text-primary hover:scale-105 active:scale-95 shadow-sm hover:border-neutral-300 transition-all duration-300"
              >
                {chip.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INTELLIGENCE OVERVIEW */}
      <PropertyExplorer
        onAnalyze={handleQuerySubmit}
        onSelectProperty={(p) => navigateToProperty(p.id)}
        compareList={compareList}
        onToggleCompareSelect={handleToggleCompareSelect}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
      />

      {/* FOOTER */}
      <footer className="pt-16 pb-12 border-t border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-display font-black text-xl text-apple-text-primary">
                CRIBR
              </span>
            </div>
          </div>
          <p className="text-[13px] text-apple-text-secondary font-light text-center md:text-right">
            © 2026 CRIBR Technologies Private Limited.
          </p>
        </div>
      </footer>

      {/* SAVED DRAWER MODAL */}
      <AnimatePresence>
        {isSavedDrawerOpen && (
          <SavedHomesList
            savedHomes={savedHomes}
            onRemove={handleRemoveSaved}
            onLoadReport={handleQuerySubmit}
            onClose={() => setIsSavedDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* AUTHENTICATION PORTAL MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <CribrAuthModal
            onClose={() => {
              setIsAuthModalOpen(false);
              setPostLoginAction(null);
            }}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>

      {/* USER DASHBOARD SLIDING PORTAL DRAWER */}
      <AnimatePresence>
        {isDashboardDrawerOpen && (
          <CribrDashboardDrawer
            isOpen={isDashboardDrawerOpen}
            onClose={() => setIsDashboardDrawerOpen(false)}
            currentUser={currentUser!}
            onSignOut={async () => {
              await cribrAuth.signOut();
              setIsDashboardDrawerOpen(false);
              showToast("Signed out of your Cribr account.", "info");
            }}
            savedPropertyIds={savedHomes.map((h) => h.id)}
            onRemoveSavedProperty={(id) => {
              handleRemoveSaved(id);
              showToast("Removed saved property.", "info");
            }}
            onSelectPropertyToAnalyze={(propertyName) => {
              setIsDashboardDrawerOpen(false);
              handleQuerySubmit(propertyName);
            }}
          />
        )}
      </AnimatePresence>

      {/* PROPERTY INTELLIGENCE DETAILS MODAL FOR DESKTOP */}
      <PropertyIntelligenceDetailsModal
        property={selectedDesktopProperty}
        isOpen={!!selectedDesktopProperty}
        onClose={() => setSelectedDesktopProperty(null)}
        onAskAI={(query) => {
          setSelectedDesktopProperty(null);
          handleQuerySubmit(query);
        }}
        onSaveProperty={(prop) => {
          const isAlreadySaved = savedHomes.some((h) => h.id === prop.id);
          if (isAlreadySaved) {
            handleRemoveSaved(prop.id);
            showToast(`Removed ${prop.name} from saved properties`, "info");
          } else {
            handleSaveHome(prop);
            showToast(`Saved ${prop.name} to your collection`, "success");
          }
        }}
        isSaved={savedHomes.some((h) => h.id === selectedDesktopProperty?.id)}
        onSelectRelatedProperty={(relProp) => {
          setSelectedDesktopProperty(relProp);
        }}
      />

      {/* Floating Compare Bar */}
      {!isAdminMode && currentPath !== "/compare" && (
        <CompareFloatingBar
          compareList={compareList}
          projectsData={MASTER_PROJECTS}
          onCompare={navigateToCompare}
          onRemove={(id) => handleToggleCompareSelect({ id })}
          onClear={() => setCompareList([])}
        />
      )}

      {/* TOAST SYSTEM LAUNCHER */}
      <CribrToastContainer />
    </div>
  );
}
