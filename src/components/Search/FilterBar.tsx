import React from "react";
import { FilterOptions } from "../../types/search";
import { Filter, SlidersHorizontal, ShieldCheck, Check, RotateCcw } from "lucide-react";

interface FilterBarProps {
  filters: FilterOptions;
  onChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
  activeCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  activeCount,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-3 px-4 sm:px-6 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Filters:</span>
            {activeCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>

          {/* Budget Filter Toggle */}
          <select
            value={filters.maxBudgetLakhs || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxBudgetLakhs: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Any Budget</option>
            <option value="80">Max ₹80 Lakhs</option>
            <option value="100">Max ₹1 Crore</option>
            <option value="150">Max ₹1.5 Crore</option>
            <option value="200">Max ₹2.0 Crore</option>
          </select>

          {/* Density Toggle */}
          <button
            onClick={() =>
              onChange({
                ...filters,
                maxDensity: filters.maxDensity === 6 ? undefined : 6,
              })
            }
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              filters.maxDensity === 6
                ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-medium"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {filters.maxDensity === 6 && <Check className="w-3 h-3 text-blue-600" />}
            Low Density (&lt;6 u/acre)
          </button>

          {/* Safe to Buy Filter */}
          <button
            onClick={() =>
              onChange({
                ...filters,
                onlySafeToBuy: !filters.onlySafeToBuy,
              })
            }
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              filters.onlySafeToBuy
                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Safe to Buy (RERA Verified)
          </button>

          {/* Ready to Move */}
          <button
            onClick={() =>
              onChange({
                ...filters,
                onlyReadyToMove: !filters.onlyReadyToMove,
              })
            }
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              filters.onlyReadyToMove
                ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-medium"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Ready to Move (OC Received)
          </button>
        </div>

        {/* Right Actions */}
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
