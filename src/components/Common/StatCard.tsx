import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between space-y-2 transition-all hover:border-slate-300 dark:hover:border-slate-600 ${className}`}
    >
      <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {icon && <span className="text-blue-500 dark:text-blue-400">{icon}</span>}
      </div>

      <div>
        <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </div>
        {subtext && (
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};
