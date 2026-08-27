import React from "react";

interface RecommendationCardProps {
  quote: string;
  builderGrade?: string;
  reliabilityScore?: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  quote,
  builderGrade = "A",
  reliabilityScore = 82,
}) => {
  return (
    <div className="space-y-1.5 my-4">
      <span className="text-xs font-normal text-neutral-500 block">
        Propsoch note
      </span>

      <div className="bg-[#F8F8F6] border-l-[3px] border-blue-600 rounded-xl p-4">
        <p className="text-sm text-neutral-800 leading-relaxed font-normal">
          "{quote}"
        </p>
      </div>

      <div className="text-xs text-neutral-400 font-normal pt-1">
        Builder grade {builderGrade} · Reliability score {reliabilityScore}%
      </div>
    </div>
  );
};

export default RecommendationCard;
