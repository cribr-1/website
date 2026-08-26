import React from "react";
import { Check, AlertTriangle, Tag, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export type StatusBadgeVariant =
  | "safe"
  | "delayed"
  | "fairPrice"
  | "tier1"
  | "ready"
  | "warning"
  | string;

interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  text?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = "safe",
  text,
  className = "",
}) => {
  const normalizedVariant = (variant || "safe").toLowerCase();

  if (normalizedVariant === "safe" || normalizedVariant.includes("safe")) {
    return (
      <span
        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/80 text-xs font-semibold tracking-tight shrink-0 ${className}`}
      >
        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
        <span>{text || "Safe to buy"}</span>
      </span>
    );
  }

  if (normalizedVariant === "delayed" || normalizedVariant.includes("delay")) {
    return (
      <span
        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/80 text-xs font-semibold tracking-tight shrink-0 ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 stroke-[2.5]" />
        <span>{text || "Delayed ~6 months"}</span>
      </span>
    );
  }

  if (
    normalizedVariant === "fairprice" ||
    normalizedVariant.includes("fair") ||
    normalizedVariant.includes("price")
  ) {
    return (
      <span
        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-sky-300 border border-blue-300/80 dark:border-blue-800/80 text-xs font-semibold tracking-tight shrink-0 ${className}`}
      >
        <span className="text-blue-600 dark:text-sky-400 font-bold text-xs">₹</span>
        <span>{text || "Fairly priced"}</span>
      </span>
    );
  }

  if (normalizedVariant === "ready" || normalizedVariant.includes("ready")) {
    return (
      <span
        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-300/80 dark:border-teal-800/80 text-xs font-semibold tracking-tight shrink-0 ${className}`}
      >
        <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 stroke-[2.5]" />
        <span>{text || "Ready possession"}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/80 dark:border-neutral-700 text-xs font-semibold tracking-tight shrink-0 ${className}`}
    >
      <span>{text || variant}</span>
    </span>
  );
};

export default StatusBadge;
