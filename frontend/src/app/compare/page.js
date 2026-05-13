"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { mockProjects } from "@/data/mockProjects";
import AiCompareSummary from "@/components/AiCompareSummary";
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Info,
  Star,
  BarChart3,
  ExternalLink,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading comparison dashboard...</div>}>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ids = searchParams.get("ids")?.split(",") || [];

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (ids.length === 0 || (ids.length === 1 && ids[0] === "")) {
        setLoading(false);
        setProjects([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*, builders(name)')
          .in('id', ids);

        if (error) throw error;

        if (data && data.length > 0) {
          setProjects(data);
        } else {
          const mockFiltered = mockProjects.filter(p => ids.includes(p.id));
          setProjects(mockFiltered);
        }
      } catch (error) {
        console.error(error);
        const mockFiltered = mockProjects.filter(p => ids.includes(p.id));
        setProjects(mockFiltered);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [searchParams]);

  const formatPrice = (price) => {
    return (price / 10000000).toFixed(2) + " Cr";
  };

  const handleRemove = (id) => {
    const newIds = ids.filter(i => i !== id);
    if (newIds.length === 0) {
      router.push('/');
    } else {
      router.push(`/compare?ids=${newIds.join(",")}`);
    }
  };

  if (ids.length === 0 || (ids.length === 1 && ids[0] === "")) {
    return (
      <div className="container py-32 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="p-4 rounded-full bg-gray-50 text-gray-400 w-fit mx-auto">
            <BarChart3 className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold">Comparison Dashboard</h2>
          <p className="text-gray-500">Select at least two projects from the search results to begin your side-by-side technical analysis.</p>
          <Link href="/">
            <button className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Discover Projects
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Header */}
      <div className="border-b bg-gray-50/50">
        <div className="container py-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to research
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Technical Comparison</h1>
            <p className="text-gray-500 mt-2">Side-by-side analysis of {projects.length} selected developments.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push('/')}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold hover:bg-gray-50 transition-all flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Share Report
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-12">
        {/* AI Comparison Summary */}
        {!loading && projects.length > 0 && <AiCompareSummary projects={projects} />}

        {loading ? (
          <div className="py-20 text-center text-gray-400">Analyzing project data...</div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/40">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-8 text-left text-xs font-bold uppercase tracking-widest text-gray-400 min-w-[200px]">Analysis Param</th>
                  {projects.map(project => (
                    <th key={project.id} className="p-8 min-w-[300px] border-l border-gray-100 relative group">
                      <div className="space-y-4">
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-gray-100">
                          <img
                            src={project.images?.[0] || "https://placehold.co/600x400/31343c/ffffff?text=No+Image"}
                            className="object-cover w-full h-full"
                          />
                          <button 
                            onClick={() => handleRemove(project.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-gray-900 leading-tight mb-1">{project.name || project.project_name}</h3>
                          <p className="text-xs text-gray-400 font-medium italic">By {project.builders?.name || project.builder_name}</p>
                        </div>
                        <Link href={`/projects/${project.id}`} className="flex items-center text-xs font-bold text-primary hover:underline">
                          View details <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "Price Range", key: "price", format: (p) => `₹${formatPrice(p.price_min)} - ${formatPrice(p.price_max)}`, highlight: true },
                  { label: "Locality", key: "locality" },
                  { label: "Unit Types", key: "unit_types", format: (p) => p.unit_types?.join(", ") },
                  { label: "Price per sft", key: "price_per_sft", format: (p) => `₹${p.price_per_sft}` },
                  {
                    label: "Google Review", key: "google_reviews_score", format: (p) => (
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        {p.google_reviews_score}
                      </div>
                    )
                  },
                  {
                    label: "Commute Score", key: "commute_score", format: (p) => (
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{p.commute_score}/10</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${p.commute_score * 10}%` }}></div>
                        </div>
                      </div>
                    )
                  },
                  {
                    label: "Progress", key: "construction_progress", format: (p) => (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold">{p.construction_progress}% Complete</span>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${p.construction_progress}%` }}></div>
                        </div>
                      </div>
                    )
                  },
                  { label: "Total Units", key: "total_units" },
                  {
                    label: "RERA Certified", key: "rera_number", format: (p) => (
                      <CheckCircle2 className={cn("h-5 w-5", p.rera_number ? "text-emerald-500" : "text-gray-200")} />
                    )
                  },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="p-8 text-sm font-semibold text-gray-500 flex items-center group-hover:text-gray-900 transition-colors">
                      {row.label}
                      <Info className="h-3 w-3 ml-2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    {projects.map(project => (
                      <td key={project.id} className={cn("p-8 text-sm border-l border-gray-100", row.highlight ? "font-bold text-gray-900" : "text-gray-600")}>
                        {row.format ? row.format(project) : (project[row.key] || "N/A")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    <div className="container mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Research Synthesis</h2>
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 space-y-6">
            <p className="text-gray-700 font-medium leading-relaxed">
              Based on your selection, these projects represent varying levels of infrastructure proximity and builder stability. We recommend prioritizing projects with higher commute scores if daily lifestyle convenience is your primary decision factor.
            </p>
            <div className="flex items-center space-x-3 text-xs font-bold text-blue-600 uppercase tracking-widest">
              <CheckCircle2 className="h-4 w-4" />
              <span>Data accurate as of Q1 2026</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Need deeper data?</h2>
          <div className="p-8 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
            <p className="text-gray-600 leading-relaxed">
              Our technical analysts can provide a detailed breakdown of builder history, project risks, and micro-market volatility for your selected properties.
            </p>
            <button className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Request Full Technical Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
