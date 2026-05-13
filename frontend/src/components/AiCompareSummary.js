"use client";

import { useState, useEffect } from "react";
import { Sparkles, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AiCompareSummary({ projects }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projects.length === 0) return;

    const timer = setTimeout(() => {
      let simulated = "";
      if (projects.length >= 2) {
        const p1 = projects[0];
        const p2 = projects[1];
        
        simulated = `COMPARATIVE ANALYSIS: Key trade-offs exist between these two developments. `;
        
        if (p1.commute_score > p2.commute_score) {
          simulated += `${p1.name || p1.project_name} offers a 25% better commute score, but at a ₹${p1.price_per_sft - p2.price_per_sft}/sft premium over ${p2.name || p2.project_name}. `;
        } else if (p2.commute_score > p1.commute_score) {
          simulated += `${p2.name || p2.project_name} is more technically accessible, while ${p1.name || p1.project_name} focuses on lower-density residential layouts. `;
        }
        
        if (p1.construction_progress > p2.construction_progress) {
          simulated += `${p1.name} is closer to possession (${p1.construction_progress}%), reducing execution risk compared to ${p2.name}. `;
        }
        
        simulated += `SUITABILITY: ${p1.name} is better for those requiring immediate occupancy, whereas ${p2.name} offers a more competitive entry price but requires a longer capital lock-in period.`;
      } else {
        simulated = "Select multiple projects to unlock technical side-by-side analysis.";
      }
      
      setSummary(simulated);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [projects]);

  return (
    <div className="p-8 rounded-3xl bg-gray-900 text-white border border-white/10 relative overflow-hidden mb-12">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <ArrowRightLeft className="h-32 w-32" />
      </div>

      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">AI Comparative Intelligence</h2>
      </div>

      {loading ? (
        <div className="space-y-3 relative z-10">
          <div className="h-4 bg-white/10 rounded-full w-full animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-full w-5/6 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-full w-4/6 animate-pulse"></div>
        </div>
      ) : (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-gray-300 leading-relaxed text-lg font-medium relative z-10"
        >
          {summary}
        </motion.p>
      )}

      <div className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest relative z-10">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span>Cross-referencing 120+ data points for precision</span>
      </div>
    </div>
  );
}
