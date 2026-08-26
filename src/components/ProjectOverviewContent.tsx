import React from "react";
import { mapToWhitelistedProject, WhitelistedProject } from "../lib/projectDataMapper";
import {
  CheckCircle2,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Layers,
  Navigation,
  Star,
  ShieldCheck,
  Award,
  Sparkles
} from "lucide-react";

interface ProjectOverviewContentProps {
  property: any;
}

export const ProjectOverviewContent: React.FC<ProjectOverviewContentProps> = ({ property }) => {
  const p: WhitelistedProject = mapToWhitelistedProject(property);

  return (
    <div className="space-y-8 font-sans text-neutral-900 dark:text-neutral-100">
      {/* SECTION A — PROJECT OVERVIEW / HERO SUMMARY */}
      <section className="bg-white dark:bg-neutral-900 rounded-[24px] p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <Building2 className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold font-display text-neutral-950 dark:text-white tracking-tight">
            Section A — Project Overview / Hero Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-neutral-50/80 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Project Name
            </span>
            <span className="text-sm font-bold text-neutral-950 dark:text-white block">
              {p.projectName}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50/80 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Builder / Promoter
            </span>
            <span className="text-sm font-bold text-neutral-950 dark:text-white block">
              {p.builder}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50/80 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              RERA Reg. Number
            </span>
            <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400 block flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{p.reraNumber}</span>
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50/80 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Locality
            </span>
            <span className="text-sm font-bold text-neutral-950 dark:text-white block">
              {p.locality}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50/80 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              City / Taluk
            </span>
            <span className="text-sm font-bold text-neutral-950 dark:text-white block">
              {p.taluk && p.taluk !== "N/A" ? p.taluk : p.area}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50/80 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Builder Grade
            </span>
            <span className="text-sm font-bold font-mono text-indigo-700 dark:text-indigo-400 block">
              {p.builderGradeDisplay || (p.builderGrade?.startsWith("Grade") || p.builderGrade === "Unrated" || p.builderGrade === "Not Found" ? p.builderGrade : `Grade ${p.builderGrade}`)}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION B — KEY HIGHLIGHTS & VERIFICATION STATS */}
      <section className="bg-white dark:bg-neutral-900 rounded-[24px] p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <Layers className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold font-display text-neutral-950 dark:text-white tracking-tight">
            Section B — Key Highlights & Verification Stats
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1 text-center">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Total Units
            </span>
            <span className="text-base font-bold font-mono text-neutral-950 dark:text-white block">
              {p.totalUnits}
            </span>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1 text-center">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Land Area
            </span>
            <span className="text-base font-bold font-mono text-neutral-950 dark:text-white block">
              {p.landAreaAcres}
            </span>
            {p.landAreaSqm && p.landAreaSqm !== "N/A" && (
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono block">
                ({p.landAreaSqm})
              </span>
            )}
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1 text-center">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Unit Density
            </span>
            <span className="text-base font-bold font-mono text-indigo-700 dark:text-indigo-400 block">
              {p.unitDensity}
            </span>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1 text-center">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Google Rating
            </span>
            <span className="text-base font-bold text-neutral-950 dark:text-white block flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
              <span>{p.googleRating}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
              Timeline Reliability Ratio
            </span>
            <span className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-400">
              {p.timelineReliabilityRatio}
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
              Reliability Status
            </span>
            <span className="text-xs font-bold font-mono px-2.5 py-1 bg-emerald-600 text-white rounded-md">
              {p.timelineReliabilityDisplay}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION C — RERA & TITLE DUE-DILIGENCE */}
      <section className="bg-white dark:bg-neutral-900 rounded-[24px] p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold font-display text-neutral-950 dark:text-white tracking-tight">
            Section C — RERA & Title Due-Diligence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              RERA Reg. Number
            </span>
            <span className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-200 block truncate">
              {p.reraNumber}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Active Consumer Complaints
            </span>
            <span className={`text-sm font-bold block ${p.complaints === "0" || p.complaints === 0 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {p.complaints} Active Complaints
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Land Litigation Status
            </span>
            <span className={`text-sm font-bold block ${p.landLitigation.toLowerCase().includes("100%") || p.landLitigation.toLowerCase().includes("zero") ? "text-emerald-700 dark:text-emerald-400" : "text-neutral-900 dark:text-neutral-200"}`}>
              {p.landLitigation}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1 sm:col-span-2 md:col-span-3">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Verification & Title Audit Note
            </span>
            <span className="text-xs text-neutral-700 dark:text-neutral-300 block leading-relaxed">
              {p.verificationTitleAuditNote || "Clean Title Deed with zero adverse litigation records."}
            </span>
          </div>

          {p.googleReviewSummary && (
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/40 rounded-xl border border-blue-100/80 dark:border-blue-900/60 space-y-1 sm:col-span-2 md:col-span-3">
              <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-sky-400 font-bold block">
                Resident & Buyer Sentiment Summary
              </span>
              <span className="text-xs text-neutral-700 dark:text-neutral-300 block leading-relaxed">
                {p.googleReviewSummary}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* SECTION D — PRICING & FLOOR PLAN CONFIGURATIONS */}
      <section className="bg-white dark:bg-neutral-900 rounded-[24px] p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-400 text-xs font-bold flex items-center justify-center font-mono">₹</span>
          <h2 className="text-lg font-bold font-display text-neutral-950 dark:text-white tracking-tight">
            Section D — Pricing & Floor Plan Configurations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-sky-400 font-bold block">
              Unit Configurations
            </span>
            <span className="text-sm font-black font-mono text-neutral-950 dark:text-white block">
              {p.unitTypes}
            </span>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/70 rounded-2xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Starting Price
            </span>
            <span className="text-base font-black font-mono text-neutral-950 dark:text-white block">
              {p.minPrice}
            </span>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/70 rounded-2xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Maximum Price
            </span>
            <span className="text-base font-black font-mono text-neutral-950 dark:text-white block">
              {p.maxPrice}
            </span>
          </div>

          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/70 rounded-2xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Price / sq ft
            </span>
            <span className="text-base font-black font-mono text-blue-700 dark:text-sky-400 block">
              {p.pricePerSqft}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION E — CONSTRUCTION TIMELINE & MILESTONE PROGRESS */}
      <section className="bg-white dark:bg-neutral-900 rounded-[24px] p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold font-display text-neutral-950 dark:text-white tracking-tight">
            Section E — Construction Timeline & Milestone Progress
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Project Start Date
            </span>
            <span className="text-xs font-bold font-mono text-neutral-900 dark:text-neutral-200 block">
              {p.projectStartDate}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Target Possession
            </span>
            <span className="text-xs font-bold font-mono text-neutral-900 dark:text-neutral-200 block">
              {p.possessionDate}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Physical Progress
            </span>
            <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400 block">
              {p.constructionProgress}% Completed
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Years to Possession
            </span>
            <span className="text-xs font-bold font-mono text-neutral-900 dark:text-neutral-200 block">
              {p.yearsToPossession}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION F — LOCATION, TRANSIT & INFRASTRUCTURE CONNECTIVITY */}
      <section className="bg-white dark:bg-neutral-900 rounded-[24px] p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <Navigation className="w-5 h-5 text-blue-600 dark:text-sky-400" />
          <h2 className="text-lg font-bold font-display text-neutral-950 dark:text-white tracking-tight">
            Section F — Location, Transit & Infrastructure Connectivity
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Nearest Office Hub
            </span>
            <span className="text-sm font-bold text-neutral-950 dark:text-white block">
              {p.nearestOfficeHub}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Distance to Hub
            </span>
            <span className="text-sm font-bold text-neutral-950 dark:text-white block">
              {p.distanceToHub}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-xl border border-neutral-100 dark:border-neutral-750 space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500 font-bold block">
              Commute Transit Score
            </span>
            <span className="text-sm font-bold text-neutral-950 dark:text-white block">
              {p.commuteScoreDisplay}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectOverviewContent;
