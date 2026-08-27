import React, { useState } from "react";
import { FullProject } from "../../types/search";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Award,
  Sparkles,
  School,
  Train,
  Hospital,
  FileText,
  Download
} from "lucide-react";
import { StatusBadge } from "../Common/StatusBadge";
import { FollowUpChip } from "../Common/FollowUpChip";
import { AiInsightCard } from "./AiInsightCard";
import { TimelineView } from "./TimelineView";
import { motion, AnimatePresence } from "motion/react";
import ProjectOverviewContent from "../ProjectOverviewContent";

interface ProjectCardProps {
  project: FullProject;
  onBack: () => void;
  onFollowUp: (query: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onBack,
  onFollowUp,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "ai" | "timeline" | "amenities" | "reviews" | "docs"
  >("overview");

  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const followUpChips = [
    `Compare ${project.name} with Sobha Neopolis`,
    `Is ${project.priceRange} fair price for ${project.localityName}?`,
    `Check developer trust rating for ${project.builder}`,
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Search Results</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(project.id)}
              className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                isBookmarked
                  ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>{isBookmarked ? "Saved" : "Save Project"}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Main Detail Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-blue-200/50 dark:border-blue-800/50">
                {project.builder} • {project.builderGrade}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium font-mono">
                RERA: {project.reraNumber}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {project.name}
            </h1>

            <div className="flex items-center space-x-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{project.location}</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2 self-start">
            <StatusBadge variant={(project.status as any) || "safe"} text={project.statusText || "Verified"} />
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Trust Score: {project.reliabilityScore}/100
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2">
          {[
            { id: "overview", label: "Overview & Stats" },
            { id: "ai", label: "AI Verdict & Insights" },
            { id: "timeline", label: "Construction Progress" },
            { id: "amenities", label: "Amenities & Locality" },
            { id: "reviews", label: "Resident Reviews" },
            { id: "docs", label: "RERA & Legal Docs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-4 text-xs font-semibold rounded-t-xl transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <ProjectOverviewContent property={project} />
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Executive Verdict Callout */}
              {project.aiVerdict && (
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>CRIBR AI Executive Verdict</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-200">
                    {project.aiVerdict}
                  </p>
                  <div className="text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
                    Investment Yield Score: <span className="text-emerald-400 font-bold">{project.investmentScore || "N/A"}/100</span> • {project.futureGrowthText}
                  </div>
                </div>
              )}

              {/* AI Insights Cards */}
              {project.aiInsights && project.aiInsights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.aiInsights.map((insight, idx) => (
                    <AiInsightCard
                      key={idx}
                      type={insight.type}
                      title={insight.title}
                      description={insight.description}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <TimelineView
                items={project.timeline}
                progressPercent={project.constructionProgress}
              />
            </motion.div>
          )}

          {activeTab === "amenities" && (
            <motion.div
              key="amenities"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Amenities Grid */}
              {project.amenities && project.amenities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Clubhouse & Lifestyle Amenities
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nearby Infrastructure */}
              {(project.schools && project.schools.length > 0 || project.metroDistance || project.hospitalDistance) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  
                  {project.schools && project.schools.length > 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2">
                        <School className="w-4 h-4 text-blue-500" /> Top Schools Nearby
                      </div>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                        {project.schools.map((s, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{s.name}</span>
                            <span className="font-mono text-slate-400">{s.distance}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.metroDistance && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2">
                        <Train className="w-4 h-4 text-emerald-500" /> Metro & Transit
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        {project.metroDistance}
                      </p>
                    </div>
                  )}

                  {project.hospitalDistance && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2">
                        <Hospital className="w-4 h-4 text-rose-500" /> Healthcare
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        {project.hospitalDistance}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {project.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {rev.author}
                      </span>
                      {rev.verifiedBuyer && (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-amber-500 font-bold">{rev.rating} ★</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{rev.comment}</p>
                  <div className="text-[10px] text-slate-400 font-mono">{rev.date}</div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "docs" && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {project.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {doc.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {doc.type} • {doc.fileSize}
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 font-medium flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Follow-up Prompts Section */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Explore Follow-up Questions
          </h4>
          <div className="flex flex-wrap gap-2">
            {followUpChips.map((chip, idx) => (
              <FollowUpChip key={idx} label={chip} onClick={() => onFollowUp(chip)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

