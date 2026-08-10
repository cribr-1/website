import React from "react";
import { SearchResponse, FullProject } from "../../types/search";
import { ProjectRow } from "./ProjectRow";
import { FollowUpChip } from "../Common/FollowUpChip";
import { MapView } from "../Map/MapView";
import { BuilderProfileView } from "../Builder/BuilderProfileView";
import { LocalityAnalysisView } from "../Locality/LocalityAnalysisView";
import { ComparisonView } from "../Compare/ComparisonView";
import { Sparkles, LayoutList, Map, ArrowLeft, ShieldCheck } from "lucide-react";

interface ResultCardProps {
  response: SearchResponse;
  viewMode: "list" | "map";
  onToggleViewMode: (mode: "list" | "map") => void;
  onSelectProject: (project: FullProject) => void;
  onFollowUp: (query: string) => void;
  onBackToSearch: () => void;
  selectedForCompare: string[];
  onToggleCompareSelect: (project: FullProject) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  response,
  viewMode,
  onToggleViewMode,
  onSelectProject,
  onFollowUp,
  onBackToSearch,
  selectedForCompare,
  onToggleCompareSelect,
}) => {
  // Render specialized response types if applicable
  if (response.type === "builder" && response.builderProfile) {
    return (
      <BuilderProfileView
        builder={response.builderProfile}
        projects={response.projects}
        onBack={onBackToSearch}
        onSelectProject={onSelectProject}
        onFollowUp={onFollowUp}
      />
    );
  }

  if (response.type === "locality" && response.localityAnalysis) {
    return (
      <LocalityAnalysisView
        locality={response.localityAnalysis}
        projects={response.projects}
        onBack={onBackToSearch}
        onSelectProject={onSelectProject}
        onFollowUp={onFollowUp}
      />
    );
  }

  if (response.type === "comparison" && response.projects) {
    return (
      <ComparisonView
        comparison={response.comparison}
        projects={response.projects}
        onBack={onBackToSearch}
        onSelectProject={onSelectProject}
      />
    );
  }

  const projects = response.projects || [];

  return (
    <div className="w-full space-y-6">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToSearch}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>New Query</span>
        </button>

        {/* View Switcher */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() => onToggleViewMode("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === "list"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>

          <button
            onClick={() => onToggleViewMode("map")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              viewMode === "map"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* AI Summary Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>AI Intelligence Insights</span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          {response.title}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {response.summary}
        </p>
      </div>

      {/* Main Results Body */}
      {viewMode === "map" ? (
        <MapView projects={projects} onSelectProject={onSelectProject} />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
            <span>Ranked Results ({projects.length})</span>
            <span className="text-[10px] text-slate-500 font-normal">
              Check boxes to compare side-by-side
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
              No projects matched your exact filters. Try clearing budget or location filters.
            </div>
          ) : (
            projects.map((proj) => (
              <ProjectRow
                key={proj.id}
                project={proj}
                onClick={() => onSelectProject(proj)}
                isCompareSelected={selectedForCompare.includes(proj.id)}
                onToggleCompare={onToggleCompareSelect}
              />
            ))
          )}
        </div>
      )}

      {/* Follow-up Chips */}
      {response.followUpChips && response.followUpChips.length > 0 && (
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Suggested Follow-ups
          </span>
          <div className="flex flex-wrap gap-2">
            {response.followUpChips.map((chip, idx) => (
              <FollowUpChip key={idx} label={chip} onClick={() => onFollowUp(chip)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;

