import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useSearch } from "../../context/SearchContext";
import { SearchInput } from "./SearchInput";
import { SearchSuggestions } from "./SearchSuggestions";
import { SearchResults } from "./SearchResults";
import { ProjectDetails } from "./ProjectDetails";
import { SearchLoadingAnimation } from "./SearchLoadingAnimation";
import ResultContextAIAssistant from "./ResultContextAIAssistant";

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    pageMode,
    setPageMode,
    searchQuery,
    setSearchQuery,
    searchResponse,
    isLoading,
    selectedProject,
    setSelectedProject,
    executeSearch,
    bookmarks,
    toggleBookmark,
    selectedForCompare,
    toggleCompareSelect,
  } = useSearch();

  const handleSelectProject = (proj: any) => {
    setSelectedProject(proj);
    setPageMode(3);
    const idOrSlug = proj.id || proj.slug || (proj.name ? proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');
    if (idOrSlug) {
      navigate(`/property/${idOrSlug}`);
    }
  };

  const handleGoToLanding = () => {
    setPageMode(1);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F7] text-neutral-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* HEADER NAVBAR (Shown on State 2 Search Results) */}
      {pageMode === 2 && (
        <header className="w-full bg-[#F8F8F7]/90 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200/80 py-3.5 px-4 md:px-8">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
            {/* CRIBR Brand Logo */}
            <button
              onClick={handleGoToLanding}
              className="flex items-center space-x-2.5 cursor-pointer group text-left shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                C
              </div>
              <div>
                <span className="font-black text-lg text-neutral-900 tracking-tight block leading-none">
                  CRIBR
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                  Spatial AI
                </span>
              </div>
            </button>

            {/* Header Search Input */}
            <div className="flex-1 max-w-xl">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={executeSearch}
                isCompact={true}
              />
            </div>
          </div>
        </header>
      )}

      {/* MAIN CONTAINER (Centered max width 1400px) */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <SearchLoadingAnimation />
            </motion.div>
          ) : (
            <>
              {/* STATE 1: LANDING VIEW */}
              {pageMode === 1 && (
                <motion.div
                  key="state-1-landing"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="pt-6 md:pt-12 flex justify-center"
                >
                  <div className="w-full max-w-3xl bg-white border border-neutral-200/90 rounded-[24px] p-8 md:p-12 shadow-xl shadow-neutral-200/40 text-center space-y-8">
                    {/* CRIBR Brand Header */}
                    <div className="flex items-center justify-center space-x-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                        C
                      </div>
                      <span className="font-black text-2xl text-neutral-900 tracking-tight">
                        CRIBR
                      </span>
                    </div>

                    {/* Large Heading */}
                    <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
                      Ask anything about <br />
                      a project or locality
                    </h1>

                    {/* Search Input */}
                    <div className="pt-2">
                      <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={executeSearch}
                        placeholder="e.g. best projects in Sarjapur under ₹1Cr"
                        isCompact={false}
                      />
                    </div>

                    {/* Suggestions Section */}
                    <div className="pt-4 border-t border-neutral-100">
                      <SearchSuggestions onSelectQuery={executeSearch} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STATE 2: SEARCH RESULTS VIEW */}
              {pageMode === 2 && searchResponse && (
                <motion.div
                  key="state-2-results"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="max-w-5xl mx-auto"
                >
                  <SearchResults
                    response={searchResponse}
                    onSelectProject={handleSelectProject}
                    onFollowUp={executeSearch}
                    onBackToSearch={handleGoToLanding}
                    selectedForCompare={selectedForCompare}
                    onToggleCompareSelect={toggleCompareSelect}
                  />

                  {/* Phase 2 - Result Set Grounded AI Assistant */}
                  <ResultContextAIAssistant
                    searchQuery={searchQuery}
                    activeFilters={{}}
                    currentProjects={searchResponse?.recommendedProperties || searchResponse?.projects || []}
                    onSelectProperty={handleSelectProject}
                  />
                </motion.div>
              )}

              {/* STATE 3: PROJECT DETAILS VIEW */}
              {pageMode === 3 && selectedProject && (
                <motion.div
                  key="state-3-details"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="max-w-3xl mx-auto"
                >
                  <ProjectDetails
                    project={selectedProject}
                    onBack={() => setPageMode(2)}
                    onFollowUp={executeSearch}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={executeSearch}
                  />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SearchPage;
