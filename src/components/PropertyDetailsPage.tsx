
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  MapPin,
  Building2,
  AlertTriangle,
  Search,
  Star
} from "lucide-react";
import { motion } from "motion/react";
import { PremiumProperty, SavedHome } from "../types";
import { showToast } from "./CribrToast";
import { getFeaturedProperties } from "../data";
import { mapToWhitelistedProject } from "../lib/projectDataMapper";
import ProjectOverviewContent from "./ProjectOverviewContent";
import ProjectAIAssistant from "./Project/ProjectAIAssistant";

interface PropertyDetailsPageProps {
  propertyIdOrSlug: string;
  onBack: () => void;
  onNavigateProperty: (slug: string) => void;
  savedHomes?: SavedHome[];
  onSaveHome?: (property: PremiumProperty) => void;
  onRemoveSaved?: (id: string) => void;
  onSaveProperty?: (property: any) => void;
  isSaved?: boolean;
  onAskAI?: (query: string) => void;
  onBookVisit?: (property: PremiumProperty) => void;
  onCompare?: (property: PremiumProperty) => void;
}

export default function PropertyDetailsPage({
  propertyIdOrSlug,
  onBack,
  onNavigateProperty,
  savedHomes = [],
  onSaveHome,
  onRemoveSaved,
  onSaveProperty,
  isSaved = false
}: PropertyDetailsPageProps) {
  // Find matching property dynamically
  const allProperties = getFeaturedProperties();
  const normalizedSlug = propertyIdOrSlug.toLowerCase().trim();
  const cleanSlug = normalizedSlug.replace(/^proj-/, "");
  const rawProperty =
    allProperties.find(
      (p) =>
        p.id.toLowerCase() === normalizedSlug ||
        p.id.toLowerCase() === cleanSlug ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedSlug ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanSlug ||
        p.name.toLowerCase() === normalizedSlug.replace(/-/g, " ")
    ) || allProperties[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [propertyIdOrSlug]);

  if (!rawProperty) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] font-sans text-neutral-900 flex flex-col justify-between">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="font-display font-black text-lg text-neutral-950">
            CRIBR
          </span>
        </header>

        <main className="max-w-xl mx-auto px-6 py-16 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-black text-neutral-950 tracking-tight">
              Property Not Found
            </h1>
            <p className="text-sm text-neutral-500 font-normal">
              This property is unavailable or has been removed.
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-neutral-950 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </button>
        </main>
      </div>
    );
  }

  const p = mapToWhitelistedProject(rawProperty);

  const isSavedComputed =
    isSaved ||
    savedHomes.some(
      (h) =>
        h.propertyName?.toLowerCase() === (p.projectName || "").toLowerCase() ||
        h.id === p.id
    );

  const handleToggleSave = () => {
    if (onSaveProperty) {
      onSaveProperty(rawProperty);
    } else if (onSaveHome) {
      onSaveHome(rawProperty as PremiumProperty);
    } else if (isSavedComputed && onRemoveSaved) {
      onRemoveSaved(p.id);
      showToast(`Removed ${p.projectName} from saved properties`, "info");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Share link copied for ${p.projectName}`, "info");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans antialiased text-neutral-900 pb-28">
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-950 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              isSavedComputed
                ? "bg-red-600 text-white border-red-500"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200"
            }`}
            title="Save Property"
          >
            <Heart className={`w-4 h-4 ${isSavedComputed ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition-all cursor-pointer"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Image Banner */}
        <div className="relative h-64 sm:h-96 w-full rounded-[28px] overflow-hidden bg-neutral-900 shadow-lg">
          <img
            src={p.image}
            alt={p.projectName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Top Overlay Badges */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-mono font-bold shadow-xs flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>RERA Registered ✓</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-neutral-900/90 text-amber-300 text-xs font-mono font-bold border border-neutral-700/60 shadow-xs flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Google {p.googleRating}</span>
            </span>
          </div>

          {/* Bottom Overlay Title Info */}
          <div className="absolute bottom-5 inset-x-5 text-white space-y-1">
            <div className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
              {p.builder}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight leading-snug">
              {p.projectName}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>{p.locality}, {p.area}</span>
            </p>
          </div>
        </div>

        {/* Whitelisted Sections A through F */}
        <ProjectOverviewContent property={rawProperty} />

        {/* Phase 3 - Per-Project AI Deep Intelligence Assistant */}
        <ProjectAIAssistant project={rawProperty} />
      </main>
    </div>
  );
}
