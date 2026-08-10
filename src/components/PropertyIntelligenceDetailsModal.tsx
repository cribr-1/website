import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle2,
  MapPin,
  Building2,
  X,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PremiumProperty, SavedHome } from "../types";
import { showToast } from "./CribrToast";
import { mapToWhitelistedProject } from "../lib/projectDataMapper";
import ProjectOverviewContent from "./ProjectOverviewContent";
import ProjectAIAssistant from "./Project/ProjectAIAssistant";

interface PropertyIntelligenceDetailsModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
  savedHomes?: SavedHome[];
  onSaveHome?: (property: PremiumProperty) => void;
  onRemoveSaved?: (id: string) => void;
  onSaveProperty?: (property: any) => void;
  isSaved?: boolean;
  onAskAI?: (query: string) => void;
  onBookVisit?: (property: PremiumProperty) => void;
  onCompare?: (property: PremiumProperty) => void;
  onSelectRelatedProperty?: (property: any) => void;
}

export default function PropertyIntelligenceDetailsModal({
  property,
  isOpen,
  onClose,
  savedHomes = [],
  onSaveHome,
  onRemoveSaved,
  onSaveProperty,
  isSaved = false
}: PropertyIntelligenceDetailsModalProps) {
  if (!isOpen || !property) return null;

  const p = mapToWhitelistedProject(property);

  const isSavedComputed =
    isSaved ||
    savedHomes.some(
      (h) =>
        h.propertyName?.toLowerCase() === (p.projectName || "").toLowerCase() ||
        h.id === p.id
    );

  const handleToggleSave = () => {
    if (onSaveProperty) {
      onSaveProperty(property);
    } else if (isSavedComputed && onRemoveSaved && property) {
      onRemoveSaved(p.id);
      showToast(`Removed ${p.projectName} from saved properties`, "info");
    } else if (onSaveHome && property) {
      onSaveHome(property as PremiumProperty);
      showToast(`Saved ${p.projectName} to collection`, "success");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(`Share link copied for ${p.projectName}`, "info");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-[#FAFAFC] w-full max-w-4xl rounded-[28px] overflow-hidden shadow-2xl border border-neutral-200/80 my-auto relative flex flex-col max-h-[92vh]"
        >
          {/* Modal Sticky Header Bar */}
          <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between shrink-0">
            <button
              onClick={onClose}
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

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
            {/* Hero Image Banner */}
            <div className="relative h-64 sm:h-80 w-full rounded-[24px] overflow-hidden bg-neutral-900 group">
              <img
                src={p.image}
                alt={p.projectName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Badges on Hero */}
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

              {/* Hero Footer Info */}
              <div className="absolute bottom-4 inset-x-4 text-white space-y-1">
                <div className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
                  {p.builder}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight leading-snug">
                  {p.projectName}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{p.locality}, {p.area}</span>
                </p>
              </div>
            </div>

            {/* Whitelisted Sections A through F */}
            <ProjectOverviewContent property={property} />

            {/* Phase 3 - Per-Project AI Deep Intelligence Assistant */}
            <ProjectAIAssistant project={property} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
