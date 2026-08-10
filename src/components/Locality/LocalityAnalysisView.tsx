import React from "react";
import { LocalityAnalysis, FullProject } from "../../types/search";
import { ArrowLeft, MapPin, TrendingUp, Sparkles, Building2, Train } from "lucide-react";
import { ProjectRow } from "../Results/ProjectRow";

interface LocalityAnalysisViewProps {
  locality: LocalityAnalysis;
  projects?: FullProject[];
  onBack: () => void;
  onSelectProject: (project: FullProject) => void;
  onFollowUp: (query: string) => void;
}

export const LocalityAnalysisView: React.FC<LocalityAnalysisViewProps> = ({
  locality,
  projects = [],
  onBack,
  onSelectProject,
}) => {
  return (
    <div className="w-full space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Search Results</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
              <MapPin className="w-3.5 h-3.5" />
              Locality Intelligence • {locality.city}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              {locality.localityName} Corridor
            </h1>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {locality.avgPricePerSqft}
            </div>
            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              {locality.priceGrowthYoy}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {locality.summary}
        </p>

        {/* Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500">Liveability Score</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {locality.liveabilityScore} / 10
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500">Connectivity Score</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {locality.connectivityScore} / 10
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500">Active RERA Projects</div>
            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {locality.totalActiveProjects} Projects
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500">Primary Builders</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
              {locality.topBuilders.join(", ")}
            </div>
          </div>
        </div>

        {/* Key Infrastructure */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Key Infrastructure Anchors
          </h4>
          <div className="flex flex-wrap gap-2">
            {locality.keyInfrastructure.map((infra, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
              >
                <Train className="w-3.5 h-3.5 text-blue-500" />
                {infra}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Projects */}
        {projects.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Top Ranked Projects in {locality.localityName}
            </h3>
            <div className="space-y-3">
              {projects.map((p) => (
                <ProjectRow key={p.id} project={p} onClick={() => onSelectProject(p)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
