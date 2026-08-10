import React from "react";
import { CheckCircle2, AlertTriangle, DollarSign, ShieldCheck, Award } from "lucide-react";

export type StatusBadgeVariant = "safe" | "delayed" | "fairPrice" | "tier1" | "ready" | "custom";

interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  text: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = "safe",
  text,
  icon,
  className = "",
}) => {
  const getStyles = () => {
    switch (variant) {
      case "safe":
      case "ready":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
        };
      case "delayed":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
        };
      case "fairPrice":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-400",
          icon: <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
        };
      case "tier1":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-400",
          icon: <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
        };
      case "custom":
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",
          icon: icon || <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />,
        };
    }
  };

  const style = getStyles();

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${style.bg} ${className}`}
    >
      {icon || style.icon}
      <span>{text}</span>
    </span>
  );
};
