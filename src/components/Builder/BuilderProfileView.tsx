import React from "react";
import { BuilderProfile, FullProject } from "../../types/search";
import { ArrowLeft, Award, Building, CheckCircle, ShieldCheck, AlertTriangle } from "lucide-react";
import { ProjectRow } from "../Results/ProjectRow";

interface BuilderProfileViewProps {
  builder: BuilderProfile;
  projects?: FullProject[];
  onBack: () => void;
  onSelectProject: (project: FullProject) => void;
  onFollowUp: (query: string) => void;
}

export const BuilderProfileView: React.FC<BuilderProfileViewProps> = ({
  builder,
  projects = [],
  onBack,
  onSelectProject,
  onFollowUp,
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
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              {builder.grade} Developer
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              {builder.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Est. {builder.establishedYear} • HQ: {builder.headquarters}
            </p>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {builder.reliabilityScore}/100
            </div>
            <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              CRIBR Trust Score
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {builder.summary}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500">Delivered Projects</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {builder.totalProjectsDelivered} Projects
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500">Ongoing Projects</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {builder.ongoingProjectsCount} Active
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-500">Complaint Resolution</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {builder.complaintResolutionRate}
            </div>
          </div>
        </div>

        {/* Projects List */}
        {projects.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Active Projects by {builder.name}
            </h3>
            <div className="space-y-3">
              {projects.map((p) => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  onClick={() => onSelectProject(p)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
