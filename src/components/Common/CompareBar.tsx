import React from "react";
import { FullProject } from "../../types/search";
import { SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CompareBarProps {
  selectedProjects: FullProject[];
  onCompare: () => void;
  onClear: () => void;
  onRemoveProject: (id: string) => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({
  selectedProjects,
  onCompare,
  onClear,
  onRemoveProject,
}) => {
  if (selectedProjects.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 dark:bg-slate-950/95 text-white border border-slate-700/80 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-4 max-w-xl w-[92%] backdrop-blur-md"
      >
        <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          <span>Comparing ({selectedProjects.length})</span>
        </div>

        {/* Selected Items Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none flex-1">
          {selectedProjects.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium whitespace-nowrap"
            >
              <span>{p.name.split(" ")[0]}</span>
              <button
                onClick={() => onRemoveProject(p.id)}
                className="hover:text-rose-400 p-0.5 rounded-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg"
          >
            Clear
          </button>

          <button
            onClick={onCompare}
            disabled={selectedProjects.length < 2}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg ${
              selectedProjects.length >= 2
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
