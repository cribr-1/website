import React, { useState } from "react";
import { Sparkles, Bot, Send, ShieldCheck, Building2, Calendar, FileText, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { queryProjectAI } from "../../lib/aiSearchPipeline";

interface ProjectAIAssistantProps {
  project: any;
}

export default function ProjectAIAssistant({ project }: ProjectAIAssistantProps) {
  const [userQuestion, setUserQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const quickChips = [
    { label: "Explain this project", icon: Sparkles, key: "overview" },
    { label: "Explain the builder & reliability", icon: Building2, key: "builder" },
    { label: "Explain RERA & legal risk", icon: ShieldCheck, key: "rera" },
    { label: "Explain construction progress & timeline", icon: Calendar, key: "progress" },
    { label: "Summarize pros & cons", icon: FileText, key: "proscons" },
    { label: "Should I invest?", icon: TrendingUp, key: "invest" }
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || loading || !project) return;
    setLoading(true);
    setUserQuestion(questionText);
    try {
      const res = await queryProjectAI(project, questionText);
      setAnswer(res.answer);
    } catch {
      setAnswer("Failed to generate project intelligence. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-md font-sans text-neutral-900 dark:text-neutral-100 mt-8 relative overflow-hidden transition-colors duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-sky-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              Project Advisor
              <span className="text-[10px] uppercase font-mono tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-semibold">
                Grounded Facts
              </span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Ask deep questions about <strong className="text-neutral-800 dark:text-neutral-200">{project.name || project.projectName || project.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>RERA Verified Dataset</span>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
          Quick Analysis Prompts:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip) => {
            const Icon = chip.icon;
            const isSelected = activeChip === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => {
                  setActiveChip(chip.key);
                  handleAsk(chip.label);
                }}
                disabled={loading}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500 shadow-sm"
                    : "bg-neutral-100/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-750 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Question Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(userQuestion);
        }}
        className="flex items-center gap-2 mb-4"
      >
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder={`Ask anything about ${project.name || 'this project'} (e.g. Is the possession timeline realistic?)`}
          className="flex-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !userQuestion.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-2.5 rounded-2xl flex items-center space-x-1.5 text-sm transition-colors cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Ask</span>
        </button>
      </form>

      {/* Answer Output */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center space-x-3 text-xs text-blue-900 dark:text-sky-300 font-medium"
          >
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-sky-400" />
            <span>Analyzing RERA compliance, builder track record, and unit density for {project.name}...</span>
          </motion.div>
        )}

        {answer && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-850 border border-neutral-200/90 dark:border-neutral-750 text-neutral-900 dark:text-neutral-100 rounded-2xl p-5 text-sm leading-relaxed space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2.5 mb-2">
              <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Verified Analysis
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                {project.name} Factsheet
              </span>
            </div>

            <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none text-neutral-800 dark:text-neutral-200 space-y-2 whitespace-pre-wrap">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
