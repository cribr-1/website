import React from "react";
import { SearchResponse, FullProject } from "../../types/search";
import { ProjectRow } from "./ProjectRow";
import { FollowUpChips } from "./FollowUpChips";
import { Sparkles, ArrowLeft } from "lucide-react";

interface SearchResultsProps {
  response: SearchResponse;
  onSelectProject: (project: FullProject) => void;
  onFollowUp: (query: string) => void;
  onBackToSearch: () => void;
  selectedForCompare?: string[];
  onToggleCompareSelect?: (project: FullProject) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  response,
  onSelectProject,
  onFollowUp,
  onBackToSearch,
  selectedForCompare,
  onToggleCompareSelect,
}) => {
  const projects = response.projects || [];
  const defaultFollowUps = [
    "Compare density vs Prestige Elm Park",
    "Which projects have ready possession?",
    "Show RERA clearance certificates",
    "What is the 5-year appreciation forecast?",
  ];

  const followUpList =
    response.followUpChips && response.followUpChips.length > 0
      ? response.followUpChips
      : defaultFollowUps;

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Back / Breadcrumb Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToSearch}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-600 hover:text-blue-600 transition-colors py-1.5 px-3 rounded-full bg-white border border-neutral-200/80 cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Search</span>
        </button>

        <span className="text-xs font-mono font-bold text-neutral-400">
          {projects.length} Projects Verified
        </span>
      </div>

      {/* Title & Subtitle Banner */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 md:p-8 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          <span>CRIBR AI Real Estate Information</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
          {response.title || "Lowest density — Sarjapur Road"}
        </h2>

        <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-normal">
          {response.summary ||
            "Fewer units/acre = more open space, less congestion"}
        </p>
      </div>

      {/* Color Legend Bar */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-neutral-500 uppercase tracking-wider font-mono">
          Indicator Legend:
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="font-semibold text-neutral-700">
              Low Density / Safe to Buy (&lt; 6 units/acre)
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100" />
            <span className="font-semibold text-neutral-700">
              Medium Density / Fair Price (6 - 10 units/acre)
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
            <span className="font-semibold text-neutral-700">
              Delayed / High Density (&gt; 10 units/acre)
            </span>
          </div>
        </div>
      </div>

      {/* Ranked List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
          <span>Ranked Results</span>
          <span>Click any project for full report</span>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 text-neutral-500 text-sm">
            No projects matched your exact criteria. Try adjusting location or budget filters.
          </div>
        ) : (
          projects.map((proj) => (
            <ProjectRow
              key={proj.id}
              project={proj}
              onClick={() => onSelectProject(proj)}
              isCompareSelected={selectedForCompare?.includes(proj.id)}
              onToggleCompare={onToggleCompareSelect}
            />
          ))
        )}
      </div>

      {/* Follow-up Chips */}
      <FollowUpChips chips={followUpList} onSelectChip={onFollowUp} />
    </div>
  );
};

export default SearchResults;
