import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export const LoadingSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto space-y-6 pt-4"
    >
      {/* AI Processing Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-pulse">
        
        <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            Analyzing RERA registries & calculating density metrics...
          </span>
        </div>

        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
          <div className="h-4 w-1/2 bg-neutral-100 dark:bg-neutral-800/60 rounded-md" />
        </div>

        {/* List Skeletons */}
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3.5 w-full">
                <div className="w-9 h-9 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
                <div className="space-y-2 w-full max-w-xs">
                  <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <div className="h-3 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded" />
                </div>
              </div>
              <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingSkeleton;
