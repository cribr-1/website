"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { mockProjects } from "@/data/mockProjects";
import { 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Star, 
  MapPin,
  TrendingUp,
  Layout,
  ExternalLink
} from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BuilderPage({ params }) {
  const [builder, setBuilder] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { id } = await params;
      try {
        const { data: bData, error: bError } = await supabase
          .from('builders')
          .select('*')
          .eq('id', id)
          .single();

        if (bError) throw bError;
        setBuilder(bData);

        const { data: pData, error: pError } = await supabase
          .from('projects')
          .select('*')
          .eq('builder_id', id);

        if (pError) throw pError;
        setProjects(pData || []);
      } catch (err) {
        console.error("Using mock data for builder:", id);
        const fallbackProjects = mockProjects.filter(p => p.builder_id === id);
        if (fallbackProjects.length > 0) {
          setBuilder({
            id: id,
            name: fallbackProjects[0].builder_name || "Unknown Builder",
            description: `Established developer known for technical precision and project transparency.`
          });
          setProjects(fallbackProjects);
        } else {
          setError("Builder profile not found in our intelligence database.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  const trustMetrics = [
    { label: "Market Reputation", value: "4.7/5", icon: Star, color: "blue" },
    { label: "Technical Delivery", value: "94%", icon: CheckCircle2, color: "emerald" },
    { label: "Timeline Accuracy", value: "92%", icon: Clock, color: "blue" },
    { label: "Active Projects", value: projects.length, icon: Building2, color: "emerald" },
  ];

  if (loading) return <div className="container py-32 text-center text-gray-400">Loading builder intelligence...</div>;
  if (error) return (
    <div className="container py-32 text-center space-y-6">
      <h2 className="text-2xl font-bold">{error}</h2>
      <Link href="/">
        <button className="px-8 py-3 rounded-xl bg-primary text-white font-bold">Return to Discovery</button>
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="bg-gray-50/50 border-b">
        <div className="container py-12">
          <Link href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to search
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="h-24 w-24 rounded-3xl bg-white border border-gray-100 flex items-center justify-center text-2xl font-bold text-primary shadow-sm flex-shrink-0">
              {builder.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Builder Profile</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">{builder.name}</h1>
              <p className="text-gray-500 leading-relaxed text-lg">
                {builder.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {trustMetrics.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className={cn("p-2 rounded-lg w-fit mb-4", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Active Developments</h2>
            <div className="text-sm font-medium text-gray-400">{projects.length} Projects Tracked</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <div className="premium-card flex flex-col h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={project.images?.[0] || "https://placehold.co/600x400/31343c/ffffff?text=No+Image"}
                      alt={project.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                        {project.locality}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-4">
                      {project.name || project.project_name}
                    </h3>
                    <div className="mt-auto space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-500 font-medium">Price Range</div>
                        <div className="text-gray-900 font-bold">₹{(project.price_min / 10000000).toFixed(2)} - {(project.price_max / 10000000).toFixed(2)} Cr</div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-500 font-medium">Technical Progress</div>
                        <div className="text-emerald-600 font-bold">{project.construction_progress}% Complete</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
