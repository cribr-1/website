import React from "react";
import { TimelineItem } from "../../types/search";
import { CheckCircle2, Clock, CircleDot } from "lucide-react";

interface TimelineViewProps {
  items: TimelineItem[];
  progressPercent: number;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ items, progressPercent }) => {
  return (
    <div className="space-y-4">
      {/* Overall Progress Meter */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Overall Physical Construction Progress
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {items.map((item, idx) => {
          const isDone = item.status === "completed";
          const isCurrent = item.status === "in_progress";

          return (
            <div key={idx} className="relative flex items-start gap-3 text-xs">
              {/* Status Dot */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 border-2 ${
                  isDone
                    ? "border-emerald-500 text-emerald-500"
                    : isCurrent
                    ? "border-blue-500 text-blue-500 animate-pulse"
                    : "border-slate-300 dark:border-slate-600 text-slate-400"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : isCurrent ? (
                  <CircleDot className="w-3 h-3 text-blue-500" />
                ) : (
                  <Clock className="w-3 h-3 text-slate-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {item.phase}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    ({item.date})
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
