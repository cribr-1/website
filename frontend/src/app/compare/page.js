"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, CheckCircle2, AlertTriangle, ArrowRight, Home } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Mocking human insights based on technical data for the UI
function generateInsights(projectId) {
  // We mock different insights to show the comparison logic in action.
  const insightsMap = {
    "proj-1": {
      bestFor: "Families seeking immediate peace and premium lifestyle",
      commute: "Daily commute might face minor traffic, but very doable.",
      builderTrust: "Tier-1 reliability. Zero history of stalled projects.",
      lifestyle: "Quiet, green, and spacious. Away from city chaos.",
      futureGrowth: "Steady, stable growth. Not for aggressive investors.",
      downsides: "Higher entry price and maintenance costs.",
      value: "Premium price, but justified by immediate readiness and quality."
    },
    "proj-2": {
      bestFor: "Working couples wanting direct metro access and luxury",
      commute: "Extremely convenient. 2-minute walk to the nearest metro.",
      builderTrust: "Highly reputed for ultra-luxury finishes.",
      lifestyle: "Bustling, active, and highly connected.",
      futureGrowth: "High potential due to upcoming infra projects.",
      downsides: "High density area. Very crowded surroundings.",
      value: "Expensive, but saves significant daily commute time."
    }
  };

  return insightsMap[projectId] || {
    bestFor: "Budget-conscious buyers willing to wait for possession",
    commute: "Currently challenging, but infrastructure is improving.",
    builderTrust: "Growing regional player with a decent track record.",
    lifestyle: "Standard community living with essential amenities.",
    futureGrowth: "Highest appreciation potential if you hold for 5+ years.",
    downsides: "Under construction. You must wait 12-18 months.",
    value: "Excellent financial value if you have holding capacity."
  };
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">Loading insights...</div>}>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // For UI demonstration, we force the mocked IDs if none are provided
  const rawIds = searchParams.get("ids")?.split(",") || [];
  const ids = rawIds.length >= 2 ? rawIds : ["proj-1", "proj-2", "proj-3"];

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // In a real app, fetch from Supabase. We use static mocks to demonstrate the UX.
    setProjects([
      { id: "proj-1", name: "Lodha Woods", price: "₹1.8 Cr", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", ...generateInsights("proj-1") },
      { id: "proj-2", name: "Oberoi Sky City", price: "₹2.2 Cr", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", ...generateInsights("proj-2") },
      { id: "proj-3", name: "Rustomjee Summit", price: "₹1.45 Cr", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", ...generateInsights("proj-3") }
    ].filter(p => ids.includes(p.id)));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/results" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recommendations
          </Link>
          <div className="font-semibold text-xl tracking-tight text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Cribr Compare
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h1 className="text-4xl font-medium tracking-tight text-slate-900">
            Compare your top choices.
          </h1>
          <p className="text-lg text-slate-500">
            We've broken down the technical data into human insights to help you understand exactly what you are trading off.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <div key={project.id} className={cn(
              "flex flex-col bg-white rounded-[32px] overflow-hidden border shadow-[0_8px_40px_rgba(0,0,0,0.02)] transition-all",
              idx === 0 ? "border-indigo-100 ring-4 ring-indigo-50/50" : "border-slate-100"
            )}>
              {/* Project Image Header */}
              <div className="relative h-56 w-full bg-slate-100">
                <Image src={project.image} alt={project.name} fill className="object-cover" />
                {idx === 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Best Match
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-semibold text-white mb-1">{project.name}</h2>
                  <p className="text-white/90 font-medium">{project.price}</p>
                </div>
              </div>

              {/* Insights Content */}
              <div className="p-6 flex-grow space-y-8">
                
                {/* Best For */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Best Suited For</h3>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {project.bestFor}
                  </p>
                </div>

                {/* Insight Row */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Lifestyle & Vibe</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{project.lifestyle}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Daily Commute</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{project.commute}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Builder Reliability</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{project.builderTrust}</p>
                  </div>
                </div>

                {/* Tradeoffs */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h3 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> The Compromise
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                    {project.downsides}
                  </p>
                </div>
                
                {/* Value */}
                <div className="pt-2">
                  <h3 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Value Proposition
                  </h3>
                  <p className="text-sm text-emerald-700/90 font-medium leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                    {project.value}
                  </p>
                </div>

              </div>

              {/* Action */}
              <div className="p-6 pt-0 mt-auto">
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium py-3 rounded-xl transition-colors text-sm border border-slate-200">
                  View Full Report
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="pt-16 flex flex-col items-center text-center space-y-4">
          <h3 className="text-xl font-medium text-slate-900">Still not sure?</h3>
          <p className="text-slate-500 max-w-md">
            Our AI can refine these choices further based on specific questions about your routine.
          </p>
          <button className="mt-2 bg-slate-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
            Refine My Needs <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>
    </div>
  );
}
