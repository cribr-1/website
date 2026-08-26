import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Scale, ChevronLeft, Building, MapPin, Activity, CheckCircle, AlertTriangle, TrendingUp, Sparkles, AlertCircle, X } from 'lucide-react';
import { showToast } from './CribrToast';

interface CribrComparePageProps {
  compareList: string[];
  onBack: () => void;
  onRemoveProject: (id: string) => void;
}

export default function CribrComparePage({ compareList, onBack, onRemoveProject }: CribrComparePageProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ projects: any[], analysis: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (compareList.length < 2) {
      setError("Please select at least 2 projects to compare.");
      setLoading(false);
      return;
    }

    const fetchComparison = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectIds: compareList })
        });
        
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to compare projects");
        }
        
        setData({ projects: json.projects, analysis: json.analysis });
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [compareList]);

  if (compareList.length < 2) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-24 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <Scale className="w-16 h-16 text-blue-300 mb-4" />
        <h1 className="text-2xl font-bold text-blue-950 mb-2">Not enough projects</h1>
        <p className="text-gray-600 mb-6">You need to select between 2 and 4 projects to compare.</p>
        <button onClick={onBack} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Explorer
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-950 flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-600" />
            Project Comparison
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            AI is analyzing your selected projects...
          </h3>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Cross-referencing RERA records, pricing, and builder reliability to give you the best objective comparison.
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Comparison Failed</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button onClick={onBack} className="bg-red-100 text-red-700 px-6 py-2 rounded-xl font-medium hover:bg-red-200">
            Go Back
          </button>
        </div>
      ) : data ? (
        <div className="space-y-12">
          {/* AI OVERVIEW SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-64 h-64" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-400/30">
                  <Sparkles className="w-6 h-6 text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold">CRIBR AI Verdict</h2>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 text-lg leading-relaxed font-medium">
                "{data.analysis.overallRecommendation}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AICard title="Best for Investment" value={data.analysis.bestForInvestment} icon={<TrendingUp className="w-5 h-5" />} />
                <AICard title="Best for End Use" value={data.analysis.bestForEndUse} icon={<Building className="w-5 h-5" />} />
                <AICard title="Best Value" value={data.analysis.bestValue} icon={<CheckCircle className="w-5 h-5" />} />
                <AICard title="Lowest Risk" value={data.analysis.lowestRisk} icon={<AlertTriangle className="w-5 h-5" />} />
              </div>
            </div>
          </motion.div>

          {/* OBJECTIVE DATA TABLE */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
            <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Objective Metrics
            </h2>
            
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-500 w-48 sticky left-0 z-10">Metric</th>
                  {data.projects.map(p => (
                    <th key={p.id} className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-blue-950 min-w-[250px]">
                      <div className="flex items-start justify-between">
                        <div>
                          {p.name || p.projectName}
                          <div className="text-xs font-normal text-gray-500 mt-1">{p.builder_name}</div>
                        </div>
                        <button 
                          onClick={() => onRemoveProject(p.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <TableRow label="Builder Grade" data={data.projects} render={(p) => p.builder_grade || p.builderGrade || "N/A"} />
                <TableRow label="RERA Status" data={data.projects} render={(p) => p.rera_number ? (p.rera_number.includes("Progress") ? "Pending" : "Approved") : "N/A"} />
                <TableRow label="Price Range" data={data.projects} render={(p) => p.price_range || p.priceRange || "N/A"} />
                <TableRow label="Total Units" data={data.projects} render={(p) => p.total_units || p.totalUnits || "N/A"} />
                <TableRow label="Land Area" data={data.projects} render={(p) => p.land_area_sqm ? `${p.land_area_sqm} Sqm` : (p.land_area_acres ? `${p.land_area_acres} Acres` : "N/A")} />
                <TableRow label="Unit Density" data={data.projects} render={(p) => p.unit_density_per_acre || p.unitDensity ? `${p.unit_density_per_acre || p.unitDensity} / acre` : "N/A"} />
                <TableRow label="Possession" data={data.projects} render={(p) => p.possession_date || p.possessionDate || p.possession || "N/A"} />
                <TableRow label="Timeline Reliability" data={data.projects} render={(p) => p.timeline_reliability || p.timelineReliability ? `${p.timeline_reliability || p.timelineReliability}%` : "N/A"} />
                <TableRow label="Progress" data={data.projects} render={(p) => p.construction_progress !== undefined ? `${p.construction_progress}%` : "N/A"} />
                <TableRow label="Complaints" data={data.projects} render={(p) => p.complaints_count ?? p.complaintsCount ?? "0"} />
                <TableRow label="Land Litigation" data={data.projects} render={(p) => p.land_litigation ? <span className="text-red-600 font-medium">Flagged</span> : <span className="text-green-600">Clear</span>} />
              </tbody>
            </table>
          </div>

          {/* AI DEEP DIVE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.projects.map(p => {
              const aiData = data.analysis.projects?.find((ap: any) => ap.projectId === p.id);
              if (!aiData) return null;
              
              return (
                <div key={p.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
                  <h3 className="text-xl font-bold text-blue-950 mb-4 pb-4 border-b border-gray-100">
                    {p.name || p.projectName} Analysis
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-6 flex-grow">{aiData.analysis}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Strengths</h4>
                      <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                        {aiData.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> Risks</h4>
                      <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                        {aiData.risks?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* HEAD TO HEAD */}
          {data.analysis.headToHead && data.analysis.headToHead.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-600" />
                Head-to-Head Comparison
              </h2>
              <div className="space-y-4">
                {data.analysis.headToHead.map((point: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-2xl shadow-sm border border-white">
                    <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">{i+1}</div>
                    <p className="text-gray-700 pt-1 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-blue-950 text-white p-8 rounded-3xl text-center shadow-xl">
            <h3 className="text-blue-300 font-semibold mb-2">Final Verdict</h3>
            <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-4xl mx-auto">
              "{data.analysis.finalVerdict}"
            </p>
          </div>
          
        </div>
      ) : null}
    </div>
  );
}

function TableRow({ label, data, render }: { label: string, data: any[], render: (p: any) => React.ReactNode }) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="p-4 font-medium text-gray-600 border-r border-gray-100 bg-white sticky left-0 z-10">{label}</td>
      {data.map(p => (
        <td key={p.id} className="p-4 text-gray-900 border-r border-gray-100 last:border-0 align-top">
          {render(p)}
        </td>
      ))}
    </tr>
  );
}

function AICard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-blue-200 text-sm font-medium mb-3">
        {icon} {title}
      </div>
      <div className="text-white font-medium text-sm leading-relaxed">
        {value}
      </div>
    </div>
  );
}
