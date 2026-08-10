import React from "react";
import { Sparkles, AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";

interface AiInsightCardProps {
  type: "positive" | "warning" | "neutral" | "investment";
  title: string;
  description: string;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ type, title, description }) => {
  const styles = {
    positive: {
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      border: "border-emerald-200/80 dark:border-emerald-800/50",
      text: "text-emerald-900 dark:text-emerald-200",
      icon: ShieldCheck,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      badge: "AI Positive Insight",
    },
    warning: {
      bg: "bg-amber-50/80 dark:bg-amber-950/30",
      border: "border-amber-200/80 dark:border-amber-800/50",
      text: "text-amber-900 dark:text-amber-200",
      icon: AlertTriangle,
      iconColor: "text-amber-600 dark:text-amber-400",
      badge: "AI Warning Alert",
    },
    investment: {
      bg: "bg-blue-50/80 dark:bg-blue-950/30",
      border: "border-blue-200/80 dark:border-blue-800/50",
      text: "text-blue-900 dark:text-blue-200",
      icon: TrendingUp,
      iconColor: "text-blue-600 dark:text-blue-400",
      badge: "AI Investment Outlook",
    },
    neutral: {
      bg: "bg-slate-50 dark:bg-slate-800/40",
      border: "border-slate-200 dark:border-slate-700",
      text: "text-slate-800 dark:text-slate-200",
      icon: Sparkles,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      badge: "AI Market Note",
    },
  }[type];

  const IconComponent = styles.icon;

  return (
    <div className={`p-4 rounded-xl border ${styles.bg} ${styles.border} transition-all space-y-1.5`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${styles.bg} border ${styles.border} ${styles.iconColor}`}>
          {styles.badge}
        </span>
        <IconComponent className={`w-4 h-4 ${styles.iconColor}`} />
      </div>
      <h4 className={`text-sm font-bold ${styles.text}`}>{title}</h4>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
