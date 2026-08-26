import React from "react";
import { ChevronRight } from "lucide-react";

interface FollowUpChipsProps {
  chips: string[];
  onSelectChip: (chip: string) => void;
  title?: string;
}

export const FollowUpChips: React.FC<FollowUpChipsProps> = ({
  chips,
  onSelectChip,
  title = "Follow-up chips",
}) => {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="space-y-2 pt-2">
      <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400 block">
        {title}
      </span>

      <div className="space-y-2">
        {chips.map((chipText, index) => (
          <button
            key={index}
            onClick={() => onSelectChip(chipText)}
            className="w-full bg-[#F8F8F6] dark:bg-neutral-800/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium text-neutral-800 dark:text-neutral-200 transition-all duration-150 cursor-pointer text-left active:scale-[0.99]"
          >
            <span className="truncate pr-2">{chipText}</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default FollowUpChips;
