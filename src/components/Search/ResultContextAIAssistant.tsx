import React, { useState } from "react";
import { Sparkles, Bot, Send, ShieldCheck, Scale, Building2, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { queryResultsAssistant } from "../../lib/aiSearchPipeline";

interface ResultContextAIAssistantProps {
  searchQuery: string;
  activeFilters?: any;
  currentProjects: any[];
  onSelectProperty?: (property: any) => void;
}

function ResultContextAIAssistant({
  searchQuery,
  activeFilters = {},
  currentProjects,
  onSelectProperty
}: ResultContextAIAssistantProps) {
  const [userQuestion, setUserQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const quickChips = [
    { label: "Which project offers better value?", icon: Scale, key: "value" },
    { label: "Which builder is more reliable?", icon: Building2, key: "builder" },
    { label: "Which project is safest & litigation-free?", icon: ShieldCheck, key: "safety" },
    { label: "Compare commute distance to tech hubs", icon: MapPin, key: "commute" },
    { label: "Explain main differences between matches", icon: Sparkles, key: "diff" }
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim() || loading || currentProjects.length === 0) return;
    setLoading(true);
    setUserQuestion(questionText);
    try {
      const res = await queryResultsAssistant(searchQuery, activeFilters, currentProjects, questionText);
      setAnswer(res.answer);
    } catch {
      setAnswer("Failed to generate response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentProjects || currentProjects.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-gradient-to-br from-blue-900/5 via-neutral-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/30 font-sans relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Result-Set AI Assistant
              <span className="text-[10px] uppercase font-mono tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                Grounded in Database
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Answering questions strictly about these {currentProjects.length} active property matches
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-neutral-400 bg-neutral-800/80 px-3 py-1.5 rounded-full border border-neutral-700/50">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Hallucination Policy</span>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="mb-6 relative z-10">
        <p className="text-xs font-semibold text-neutral-300 mb-2 uppercase tracking-wider">
          Suggested Comparison Prompts:
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
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20"
                    : "bg-neutral-800/90 text-neutral-200 border-neutral-700/70 hover:bg-neutral-700 hover:border-neutral-600"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
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
        className="flex items-center gap-2 mb-6 relative z-10"
      >
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="Ask anything about these search results (e.g. Which project is safer?)"
          className="flex-1 bg-neutral-800/90 border border-neutral-700/80 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !userQuestion.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-5 py-3 rounded-2xl flex items-center space-x-2 text-sm transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Ask AI</span>
        </button>
      </form>

      {/* Answer Output Box */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-neutral-800/60 border border-blue-500/30 rounded-2xl p-5 flex items-center space-x-3 text-sm text-blue-300"
          >
            <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
            <span>Evaluating {currentProjects.length} property records & comparing RERA filings...</span>
          </motion.div>
        )}

        {answer && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-6 relative z-10 text-neutral-200 text-sm leading-relaxed space-y-3"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
              <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Grounded Evaluation Report
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                Source: Supabase Master Registry
              </span>
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none space-y-2 whitespace-pre-wrap">
              {answer}
            </div>

            {/* Active Property Badges */}
            <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium">Grounded Matches:</span>
              {currentProjects.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProperty && onSelectProperty(p)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-blue-300 border border-neutral-700 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {p.name || p.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(ResultContextAIAssistant);
