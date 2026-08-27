import React from "react";
import { FullProject } from "../../types/search";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { StatsGrid } from "./StatsGrid";
import { RecommendationCard } from "./RecommendationCard";
import { FollowUpChips } from "./FollowUpChips";
import { SearchInput } from "./SearchInput";

interface ProjectDetailsProps {
  project: FullProject;
  onBack: () => void;
  onFollowUp: (query: string) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSearch?: (q: string) => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onBack,
  onFollowUp,
  searchQuery = "",
  setSearchQuery = () => {},
  onSearch = () => {},
}) => {
  const followUpChips = [
    `Compare with Sobha Neopolis`,
    `Is ₹95L fair for a 3BHK here?`,
    `Other low density projects in Sarjapur`,
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fadeIn">
      {/* Top Bar: Brand Logo + Back to list */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex items-center text-xl font-black tracking-tight text-neutral-900">
          <span>crib</span>
          <span className="text-blue-600">r</span>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to list</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="w-full">
        <SearchInput
          value={searchQuery || project.name}
          onChange={setSearchQuery}
          onSearch={onSearch}
          isCompact={true}
        />
      </div>

      {/* Main Project Card Container */}
      <div className="bg-white border border-neutral-200/90 rounded-[20px] p-5 md:p-6 shadow-xs space-y-5">
        {/* Title & Builder/Location/RERA Info */}
        <div className="space-y-1.5 pb-2">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
            {project.name}
          </h1>

          <div className="text-xs text-neutral-500 font-normal">
            {project.builder} · {project.location} · RERA:{" "}
            {project.reraNumber || "PRM/KA/1251/308"}
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <StatusBadge variant="safe" text="Safe to buy" />
            <StatusBadge variant="delayed" text="Delayed ~6 months" />
            <StatusBadge variant="fairPrice" text="Fairly priced" />
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-1" />

        {/* Statistics Grid */}
        <StatsGrid project={project} />

        {/* Propsoch / AI Note */}
        <RecommendationCard
          quote={
            project.aiVerdict ||
            "Good for end-use buyers. Locality has seen steady appreciation. Delay of ~6 months from original date."
          }
          builderGrade={project.builderGrade || "A"}
          reliabilityScore={project.reliabilityScore || 82}
        />

        {/* Follow-up Chips */}
        <FollowUpChips chips={followUpChips} onSelectChip={onFollowUp} />
      </div>
    </div>
  );
};

export default ProjectDetails;
