import React from "react";
import { ArrowRight, Share2, MapPin, Navigation, Scale } from "lucide-react";
import { mapToWhitelistedProject } from "../lib/projectDataMapper";

interface PropertyCardProps {
  property: any;
  idx: number;
  onAnalyze?: (q: string) => void;
  onSelectProperty?: (p: any) => void;
  isCompareSelected?: boolean;
  onToggleCompare?: (p: any) => void;
}

export function PropertyCard({ 
  property, 
  idx, 
  onAnalyze, 
  onSelectProperty,
  isCompareSelected,
  onToggleCompare
}: PropertyCardProps) {
  const p = mapToWhitelistedProject(property);

  const handleOpenDetails = () => {
    if (onSelectProperty) {
      onSelectProperty(property);
    } else {
      window.history.pushState(null, "", `/property/${p.id}`);
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const showToast = (msg: string, type: string) => {
    // Basic fallback since we don't have the context here
    console.log(`[Toast ${type}]: ${msg}`);
    // If you need real toasts, pass it down or import a toast store
  };

  return (
    <article
      onClick={handleOpenDetails}
      className={`bg-white rounded-[24px] border ${isCompareSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' : 'border-neutral-200/80'} overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col group cursor-pointer`}
    >
      {/* Property Image & Header */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
        <img
          src={p.image}
          alt={p.projectName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Compare Checkbox Bubble */}
        {onToggleCompare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property);
            }}
            className={`absolute top-4 right-4 p-2 rounded-xl border backdrop-blur-md transition-all shadow-sm z-10 ${
              isCompareSelected 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-black/20 hover:bg-black/40 border-white/40 text-white'
            }`}
            title={isCompareSelected ? "Remove from Compare" : "Add to Compare"}
          >
            <Scale className="w-5 h-5" />
          </button>
        )}

        {/* Image Overlay Header */}
        <div className="absolute bottom-3 inset-x-3.5 text-white space-y-0.5">
          <div className="text-[11px] font-mono font-bold text-blue-300 uppercase tracking-wider">
            {p.builder}
          </div>
          <h3 className="text-xl font-bold font-display tracking-tight leading-snug">
            {p.projectName}
          </h3>
          <p className="text-xs text-neutral-300 flex items-center space-x-1 font-normal">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{p.locality}, {p.area}</span>
          </p>
        </div>
      </div>

      {/* Property Whitelisted Details Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-neutral-900">
        <div className="space-y-3.5">
          {/* Price & Rate */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                Price Range
              </span>
              <span className="text-base font-bold font-mono text-neutral-950">
                {p.minPrice} – {p.maxPrice}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                Rate / sq ft
              </span>
              <span className="text-xs font-bold font-mono text-blue-700">
                {p.pricePerSqft}
              </span>
            </div>
          </div>

          {/* Unit Configurations */}
          <div className="flex items-center justify-between text-xs py-1 px-1 border-b border-neutral-100">
            <span className="text-neutral-500 font-medium">Unit Types</span>
            <span className="font-bold font-mono text-neutral-950">{p.unitTypes}</span>
          </div>

          {/* Possession & Progress */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">Possession</span>
              <span className="font-bold font-mono text-neutral-900 text-[11px]">{p.possessionDate}</span>
            </div>
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold block">Construction</span>
              <span className="font-bold font-mono text-emerald-700 text-[11px]">{p.constructionProgress}% Completed</span>
            </div>
          </div>

          {/* Scale & Location Summary */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono bg-neutral-50/60 p-2.5 rounded-xl border border-neutral-100/80 text-center">
            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-semibold block">Scale</span>
              <span className="font-bold text-neutral-900">{p.landAreaAcres}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-semibold block">Total Units</span>
              <span className="font-bold text-neutral-900">{p.totalUnits}</span>
            </div>
            <div>
              <span className="text-[9px] text-neutral-400 uppercase font-semibold block">Builder Grade</span>
              <span className="font-bold text-indigo-700">Grade {p.builderGrade}</span>
            </div>
          </div>

          {/* Commute & Timeline */}
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600 px-1 pt-0.5">
            <span className="flex items-center space-x-1">
              <Navigation className="w-3 h-3 text-neutral-400" />
              <span>{p.distanceToHub} ({p.commuteScoreDisplay})</span>
            </span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold border border-emerald-200/60">
              Timeline: {p.timelineReliabilityDisplay}
            </span>
          </div>

          {/* RERA Number */}
          <div className="text-[10px] font-mono text-neutral-400 truncate px-1 pt-1 border-t border-neutral-100">
            RERA: <span className="text-neutral-600 font-semibold">{p.reraNumber}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
          <button
            onClick={() => {
              handleOpenDetails();
            }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-mono tracking-wide flex items-center justify-center space-x-2 shadow-xs hover:shadow-md active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <span>View Project Overview</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleCompare) onToggleCompare(property);
            }}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              isCompareSelected
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
            }`}
            title={isCompareSelected ? "Remove from Compare" : "Compare Property"}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.clipboard) {
                navigator.clipboard.writeText(`${window.location.origin}/property/${p.id}`);
              }
              showToast(`Link for ${p.projectName} copied`, "info");
            }}
            className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors cursor-pointer"
            title="Share Property"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
