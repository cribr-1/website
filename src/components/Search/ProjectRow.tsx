import React from "react";
import { FullProject } from "../../types/search";
import { ArrowRight, MapPin, CheckCircle2, Star, Navigation } from "lucide-react";
import { mapToWhitelistedProject } from "../../lib/projectDataMapper";

interface ProjectRowProps {
  project: FullProject;
  onClick: () => void;
  isCompareSelected?: boolean;
  onToggleCompare?: (project: FullProject) => void;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  onClick,
}) => {
  const p = mapToWhitelistedProject(project);

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-neutral-200/90 rounded-2xl p-4 md:p-5 flex flex-col gap-3.5 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all duration-200"
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-md font-mono">
              {p.builder}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/80 font-mono flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>RERA Registered ✓</span>
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">
              Grade {p.builderGrade}
            </span>
          </div>

          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
            {p.projectName}
          </h3>

          <p className="text-xs text-neutral-500 flex items-center space-x-1 font-normal">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{p.locality}, {p.area}</span>
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-lg font-black font-mono text-neutral-950">
            {p.minPrice} – {p.maxPrice}
          </div>
          <div className="text-xs font-bold font-mono text-blue-700">
            {p.pricePerSqft}
          </div>
        </div>
      </div>

      {/* Middle Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">Unit Types</span>
          <span className="font-bold text-neutral-900 font-mono text-[11px] truncate block">{p.unitTypes}</span>
        </div>
        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">Possession</span>
          <span className="font-bold text-neutral-900 font-mono text-[11px] block">{p.possessionDate}</span>
        </div>
        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">Construction</span>
          <span className="font-bold text-emerald-700 font-mono text-[11px] block">{p.constructionProgress}%</span>
        </div>
        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
          <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">Scale & Units</span>
          <span className="font-bold text-neutral-900 font-mono text-[11px] block">{p.landAreaAcres} · {p.totalUnits}</span>
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100">
        <div className="flex flex-wrap items-center gap-3 text-neutral-600 font-mono text-[11px]">
          <span className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="font-bold text-neutral-800">{p.googleRating}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Navigation className="w-3 h-3 text-neutral-400" />
            <span>{p.distanceToHub} ({p.commuteScoreDisplay})</span>
          </span>
          <span>•</span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            Timeline: {p.timelineReliabilityDisplay}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default ProjectRow;
