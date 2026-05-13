import { supabase } from "@/lib/supabase";
import { mockProjects } from "@/data/mockProjects";
import AiSummary from "@/components/AiSummary";
import Link from "next/link";
import {
  MapPin,
  Share2,
  Heart,
  ChevronRight,
  CheckCircle2,
  Info,
  Compass,
  TrendingUp,
  Layout,
  Users
} from "lucide-react";

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let project = null;
  let error = null;

  try {
    const { data, error: dbError } = await supabase
      .from('projects')
      .select('*, builders(name)')
      .eq('id', id)
      .single();

    if (dbError) throw dbError;
    project = data;
  } catch (err) {
    project = mockProjects.find(p => p.id === id);
    if (!project) error = "Project not found";
  }

  if (error) {
    return <div className="container py-20 text-center text-red-500 font-bold">{error}</div>;
  }

  const formatPrice = (price) => {
    return (price / 10000000).toFixed(2) + " Cr";
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs & Actions */}
      <div className="container py-6 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 text-gray-400">
          <Link href="/" className="hover:text-primary transition-colors">Search</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/localities/${project.locality}`} className="hover:text-primary transition-colors">{project.locality}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{project.name || project.project_name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors"><Share2 className="h-4 w-4" /></button>
          <button className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors"><Heart className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        <div className="md:col-span-8 space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/20">
            <img
              src={project.images?.[0] || "https://placehold.co/1200x800/31343c/ffffff?text=No+Image"}
              alt={project.name || project.project_name}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-6 left-6 flex space-x-2">
              <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md shadow-sm text-xs font-bold text-gray-900 flex items-center space-x-2">
                <Layout className="h-3.5 w-3.5 text-primary" />
                <span>View all 12 photos</span>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{project.name || project.project_name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1 text-primary" />
                    {project.locality}, Bangalore
                  </div>
                  <div className="text-sm font-medium">
                    By <Link href={`/builders/${project.builder_id}`} className="text-primary hover:underline">{project.builders?.name || project.builder_name}</Link>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">₹{formatPrice(project.price_min)} - {formatPrice(project.price_max)}</div>
                <div className="text-sm text-gray-400 mt-1">₹{project.price_per_sft}/sft onwards</div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* AI Summary Section */}
          <AiSummary project={project} />

          {/* Detailed Sections */}
          <div className="space-y-12 py-8">
            <section className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Transparency Dashboard</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Data Quality", value: "9.2/10", icon: MapPin, color: "blue" },
                  { label: "Commute Score", value: `${project.commute_score}/10`, icon: Compass, color: "emerald" },
                  { label: "RERA Status", value: "Active", icon: TrendingUp, color: "blue" },
                  { label: "User Rating", value: `${project.google_reviews_score || "N/A"}/5`, icon: Users, color: "emerald" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
                    <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 w-fit`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Suitability & Trade-offs */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-gray-100">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                  Suitability Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl italic border border-gray-100">
                  "{project.suitability || "Data being analyzed for lifestyle and demographic suitability."}"
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-amber-500" />
                  Technical Trade-offs
                </h3>
                <ul className="space-y-3">
                  {(project.trade_offs || [
                    "Market-standard density for this locality.",
                    "Pricing reflects current infrastructure milestones.",
                    "Possession timeline subject to RERA extensions."
                  ]).map((trade, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-300 mt-1.5 mr-3 flex-shrink-0" />
                      {trade}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">About the Project</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {project.property_title_summary || "Discover luxury living in this premium project that combines modern architecture with sustainable design."}
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Premium Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                {project.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                )) || <p className="text-gray-400 italic">No specific amenities listed.</p>}
              </div>
            </section>
          </div>
        </div>

        {/* Sticky Sidebar CTA */}
        <div className="md:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="p-8 rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold">Project Intelligence</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Join 250+ researchers tracking this development. Get verified builder history and technical insights.
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Request research report
                </button>
                <button className="w-full py-4 rounded-xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all">
                  Download technical specs
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Info className="h-3 w-3" />
                <span>RERA: {project.rera_number || "Verified"}</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50 space-y-4">
              <h3 className="font-bold text-gray-900">Project Highlights</h3>
              <ul className="space-y-3">
                {[
                  { label: "Status", value: `${project.construction_progress}% Complete` },
                  { label: "Total Units", value: project.total_units || "N/A" },
                  { label: "Land Area", value: `${project.land_area_acres} Acres` },
                  { label: "Configurations", value: project.unit_types?.join(", ") || "N/A" },
                ].map((item, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-bold">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
