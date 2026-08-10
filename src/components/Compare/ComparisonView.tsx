import React, { useEffect } from "react";
import { FullProject, ProjectComparison } from "../../types/search";
import { ArrowLeft, Check, Sparkles, X, ShieldCheck } from "lucide-react";
import { cribrAnalyticsEngine } from "../../lib/supabase";

interface ComparisonViewProps {
  comparison?: ProjectComparison;
  projects: FullProject[];
  onBack: () => void;
  onSelectProject: (project: FullProject) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  comparison,
  projects,
  onBack,
  onSelectProject,
}) => {
  useEffect(() => {
    if (projects.length > 0) {
      cribrAnalyticsEngine.trackComparison(projects.map((p) => p.id));
    }
  }, [projects]);
  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-12 text-slate-500">
        No projects selected for comparison. Please select at least two projects.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Search Results</span>
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            AI Comparison Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Head-to-Head Comparison Matrix
          </h1>
          {comparison?.summary && (
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2">
              {comparison.summary}
            </p>
          )}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-bold text-slate-500 dark:text-slate-400 w-48">
                  Metric
                </th>
                {projects.map((p) => (
                  <th key={p.id} className="p-4 font-bold text-slate-900 dark:text-slate-100 min-w-[200px]">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        {p.builder} • {p.localityName}
                      </div>
                      <button
                        onClick={() => onSelectProject(p)}
                        className="text-[10px] text-blue-600 hover:underline font-semibold"
                      >
                        View Details &rarr;
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30">
                  Price Range
                </td>
                {projects.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-slate-900 dark:text-slate-100">
                    {p.priceRange}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30">
                  Price / sqft
                </td>
                {projects.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 dark:text-slate-200 font-mono">
                    {p.pricePerSqft}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30">
                  Unit Density
                </td>
                {projects.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 dark:text-slate-200">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        p.densityValue < 6
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {p.densityText}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30">
                  Developer Trust
                </td>
                {projects.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-slate-800 dark:text-slate-200">
                    {p.builderGrade} ({p.reliabilityScore}/100)
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30">
                  Commute Score
                </td>
                {projects.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 dark:text-slate-200">
                    {p.commuteText}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30">
                  Google Resident Rating
                </td>
                {projects.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 dark:text-slate-200 font-semibold">
                    {p.googleRating} ★ ({p.reviewsCount} reviews)
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30">
                  RERA Status
                </td>
                {projects.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {p.statusText}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
