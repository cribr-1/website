import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Database, ShieldCheck, MapPin, Award, CheckCircle2 } from "lucide-react";

interface SearchLoadingAnimationProps {
  onComplete?: () => void;
}

const LOADING_STEPS = [
  { text: "Understanding your question...", icon: Sparkles, color: "text-blue-500" },
  { text: "Searching projects...", icon: Database, color: "text-indigo-500" },
  { text: "Comparing builders...", icon: ShieldCheck, color: "text-emerald-500" },
  { text: "Calculating commute scores...", icon: MapPin, color: "text-amber-500" },
  { text: "Ranking results...", icon: Award, color: "text-purple-500" },
];

export const SearchLoadingAnimation: React.FC<SearchLoadingAnimationProps> = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600); // Step every 600ms for smooth, responsive experience

    return () => clearInterval(interval);
  }, []);

  const StepIcon = LOADING_STEPS[currentStep].icon;

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6 flex flex-col items-center justify-center text-center space-y-6">
      {/* Central Pulsing Icon */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl w-24 h-24 -ml-4 -mt-4"
        />
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center relative z-10">
          <motion.div
            key={currentStep}
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
            transition={{ duration: 0.3 }}
          >
            <StepIcon className={`w-8 h-8 ${LOADING_STEPS[currentStep].color}`} />
          </motion.div>
        </div>
      </div>

      {/* Step Text Header */}
      <div className="h-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h3
            key={currentStep}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2"
          >
            {LOADING_STEPS[currentStep].text}
          </motion.h3>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full"
          initial={{ width: "10%" }}
          animate={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step checklist preview */}
      <div className="w-full space-y-2 pt-2">
        {LOADING_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center justify-between text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
                isCurrent
                  ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200/50 dark:border-blue-800/50"
                  : isDone
                  ? "text-slate-500 dark:text-slate-400 opacity-75"
                  : "text-slate-400 dark:text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isCurrent ? "bg-blue-500 animate-pulse" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                )}
                <span>{step.text}</span>
              </div>
              <span className="font-mono text-[10px]">
                {isDone ? "Done" : isCurrent ? "Processing..." : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
