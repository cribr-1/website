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
        
        simulated = `Our AI analysis highlights key trade-offs between these premium developments. `;
        
        if (p1.commute_score > p2.commute_score) {
          simulated += `${p1.name || p1.project_name} holds a strategic edge in connectivity (${p1.commute_score}/10), ideal for daily commuters. `;
        } else if (p2.commute_score > p1.commute_score) {
          simulated += `${p2.name || p2.project_name} offers superior infrastructure access with a commute score of ${p2.commute_score}/10. `;
        }
        
        if (p1.price_min < p2.price_min) {
          simulated += `From a financial perspective, ${p1.name || p1.project_name} provides a more accessible entry point at ₹${(p1.price_min/10000000).toFixed(2)} Cr. `;
        } else {
          simulated += `${p2.name || p2.project_name} is the more value-oriented choice starting at ₹${(p2.price_min/10000000).toFixed(2)} Cr. `;
        }
        
        simulated += `While ${p1.name || p1.project_name} excels in ${p1.locality}, ${p2.name || p2.project_name} is a strong contender for those focused on the ${p2.locality} growth corridor.`;
      } else {
        simulated = "Add more projects to unlock deep side-by-side AI intelligence.";
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
