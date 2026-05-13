import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { mockProjects } from "@/data/mockProjects";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Award, 
  Timer, 
  HardHat, 
  Star, 
  MapPin,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function BuilderPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let builder = null;
  let projects = [];
  let error = null;

  try {
    const { data: builderData, error: builderError } = await supabase
      .from('builders')
      .select('*')
      .eq('id', id)
      .single();

    if (builderError) throw builderError;
    builder = builderData;

    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('builder_id', id);

    if (projectsError) throw projectsError;
    projects = projectsData;

  } catch (err) {
    const fallbackProjects = mockProjects.filter(p => p.builder_id === id);
    if (fallbackProjects.length > 0) {
      builder = {
        id: id,
        name: fallbackProjects[0].builder_name || "Unknown Builder",
        description: `Premium real estate developer with a focus on quality, transparency, and architectural innovation in Bangalore.`
      };
      projects = fallbackProjects;
    } else {
      error = "Builder not found";
    }
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
        <Link href="/" className="inline-block mt-6 text-primary hover:underline">Return to Discovery</Link>
      </div>
    );
  }

  const trustMetrics = [
    { label: "Reputation Score", value: "4.8/5", icon: ShieldCheck, color: "blue" },
    { label: "Projects Delivered", value: "32", icon: Award, color: "emerald" },
    { label: "On-Time Delivery", value: "94%", icon: Timer, color: "blue" },
    { label: "Construction Quality", value: "A+", icon: HardHat, color: "emerald" },
  ];

  const formatPrice = (price) => {
    return (price / 10000000).toFixed(2) + " Cr";
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Builder Header */}
      <div className="bg-gray-50 border-b">
        <div className="container py-16">
          <Link href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to search
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-primary/20">
              {builder.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{builder.name}</h1>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Premium Verified
                </span>
              </div>
              <p className="text-gray-500 max-w-2xl leading-relaxed text-lg italic">
                {builder.description || "A legacy of trust and excellence in urban living."}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                Contact Developer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        {/* Trust Metrics Grid */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Intelligence Dashboard</h2>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <Info className="h-3.5 w-3.5 mr-1.5" />
              Verified by RERA & Market Analytics
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustMetrics.map((stat, i) => (
              <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <div className={cn("p-3 rounded-xl w-fit", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Builder Projects */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Project Portfolio</h2>
              <p className="text-gray-500 mt-2">Active and upcoming developments by {builder.name}</p>
            </div>
            <div className="text-sm font-bold text-primary">
              {projects.length} Total Projects
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-medium">
              No active projects found for this builder in our database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                  <div className="premium-card flex flex-col h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={project.images?.[0] || "https://placehold.co/600x400/31343c/ffffff?text=No+Image"}
                        alt={project.name || project.project_name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-primary">
                          {project.locality}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                        {project.name || project.project_name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
                        {project.locality}, Bangalore
                      </div>
                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{formatPrice(project.price_min)} - {formatPrice(project.price_max)}
                        </div>
                        <div className="flex items-center text-amber-500 text-sm font-bold">
                          <Star className="h-4 w-4 fill-current mr-1" />
                          {project.google_reviews_score}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
