import React from "react";
import { FullProject } from "../../types/search";

interface StatsGridProps {
  project: FullProject;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ project }) => {
  const stats = [
    {
      label: "Price range",
      value: project.priceRange || "₹82L–1.1Cr",
    },
    {
      label: "Price / sqft",
      value: project.pricePerSqft || "₹7,400",
    },
    {
      label: "Possession",
      value: project.possessionDate || "Jun 2026",
    },
    {
      label: "Progress",
      value: `${project.constructionProgress ?? 74}%`,
    },
    {
      label: "Complaints",
      value: `${project.complaintsCount ?? 3}`,
    },
    {
      label: "Total units",
      value: `${project.totalUnits || "480"}`,
    },
    {
      label: "Commute score",
      value: project.commuteScore ? `${project.commuteScore}%` : "81%",
    },
    {
      label: "Google reviews",
      value: `${project.googleRating ?? "4.2"} ★`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 my-4">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="bg-[#F8F8F6] rounded-2xl p-3.5 flex flex-col justify-center space-y-1"
        >
          <span className="text-xs text-neutral-500 font-normal">
            {item.label}
          </span>
          <span className="text-base font-bold text-neutral-900 tracking-tight">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
