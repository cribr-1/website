import React from "react";
import { Sparkles } from "lucide-react";

interface FollowUpChipProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export const FollowUpChip: React.FC<FollowUpChipProps> = ({
  label,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-800 rounded-xl text-xs font-medium transition-all shadow-2xs group cursor-pointer ${className}`}
    >
      <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
      <span>{label}</span>
    </button>
  );
};
