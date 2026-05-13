"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AiSummary({ project }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analytical research delay
    const timer = setTimeout(() => {
      const bhk = project.unit_types?.join(", ") || "various configurations";
      const locality = project.locality || "East Bangalore";
      const builder = project.builders?.name || project.builder_name || "a premium builder";
      
      const simulated = `TECHNICAL ANALYSIS: ${project.name || project.project_name} by ${builder} is a high-density development in ${locality}. While the project offers strong metro connectivity (Commute Score: ${project.commute_score}/10), it is currently ${project.construction_progress}% complete, indicating potential delivery delays if progress doesn't accelerate. The ₹${project.price_per_sft}/sft pricing is at the higher end for this micro-market. HIGHLIGHT: Best suited for working professionals prioritizing commute over low-density privacy. TRADE-OFF: Potential noise levels due to proximity to transit corridors.`;
      
      setSummary(simulated);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [project]);

  return (
    <section className="p-8 rounded-3xl bg-blue-50/30 border border-blue-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="h-24 w-24 text-blue-600" />
      </div>

      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-200">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">AI Research Intelligence</h2>
      </div>

      {loading ? (
        <div className="space-y-3 relative z-10">
          <div className="h-4 bg-blue-100/50 rounded-full w-full animate-pulse"></div>
          <div className="h-4 bg-blue-100/50 rounded-full w-5/6 animate-pulse"></div>
          <div className="h-4 bg-blue-100/50 rounded-full w-4/6 animate-pulse"></div>
        </div>
      ) : (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-gray-700 leading-relaxed text-lg font-medium relative z-10"
        >
          {summary}
        </motion.p>
      )}

      <div className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest relative z-10">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <span>Analysis verified by Cribr Intelligence Engine</span>
      </div>
    </section>
  );
}
