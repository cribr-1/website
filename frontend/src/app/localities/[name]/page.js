import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { mockProjects } from "@/data/mockProjects";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Car,
  Droplets,
  Zap,
  Building2,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default async function LocalityPage({ params }) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);

  let projects = [];
  let error = null;

  try {
    const { data, error: dbError } = await supabase
      .from('projects')
      .select('*, builders(name)')
      .ilike('locality', `%${name}%`);

    if (dbError) throw dbError;

    if (data && data.length > 0) {
      projects = data;
    } else {
      projects = mockProjects.filter(p => p.locality.toLowerCase().includes(name.toLowerCase()));
    }
  } catch (err) {
    projects = mockProjects.filter(p => p.locality.toLowerCase().includes(name.toLowerCase()));
  }

  const localityMetrics = {
    livabilityScore: 8.4,
    connectivityScore: 7.8,
    rentalDemand: "Very High",
    appreciationPotential: "12% YoY",
    trafficLevel: "High",
    waterRisk: "Low",
    safetyScore: 9.2
  };

  const formatPrice = (price) => {
    return (price / 10000000).toFixed(2) + " Cr";
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Hero Header */}
      <div className="bg-gray-50 border-b">
        <div className="container py-16">
          <Link href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to discovery
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest">
                <MapPin className="h-4 w-4" />
                <span>Locality Intelligence Report</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">{name}</h1>
              <p className="text-gray-500 max-w-xl leading-relaxed text-lg">
                Comprehensive market intelligence and project analytics for the {name} corridor.
              </p>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Trend</div>
                <div className="text-sm font-bold text-gray-900">High Appreciation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        {/* Intelligence Grid */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Market Metrics</h2>
            <div className="text-xs font-bold text-gray-400 flex items-center">
              <Info className="h-3.5 w-3.5 mr-1.5" />
              Data updated for Q1 2026
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Livability", value: `${localityMetrics.livabilityScore}/10`, icon: Building2, color: "blue" },
              { label: "Connectivity", value: `${localityMetrics.connectivityScore}/10`, icon: Zap, color: "blue" },
              { label: "Rental Demand", value: localityMetrics.rentalDemand, icon: TrendingUp, color: "emerald" },
              { label: "Appreciation", value: localityMetrics.appreciationPotential, icon: ShieldCheck, color: "emerald" },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={cn("p-3 rounded-xl w-fit mb-4", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Secondary Insights */}
        <section className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Area Characteristics</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Traffic Level", value: localityMetrics.trafficLevel, icon: Car },
                { label: "Safety Score", value: `${localityMetrics.safetyScore}/10`, icon: ShieldCheck },
                { label: "Water Risk", value: localityMetrics.waterRisk, icon: Droplets },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-gray-50/30 px-6">
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">AI Market Outlook</h2>
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden h-full">
              <p className="text-gray-700 leading-relaxed font-medium relative z-10">
                {name} continues to be a top-performing micro-market in Bangalore. Our analysis suggests that the upcoming infrastructure projects and proximity to IT corridors make it a "Strong Buy" for long-term appreciation. End-users should focus on gated communities within 2km of the upcoming metro station.
              </p>
              <div className="absolute -bottom-6 -right-6 opacity-5">
                <TrendingUp className="h-32 w-32 text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* Projects in Locality */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Active Developments</h2>
              <p className="text-gray-500 mt-2">Browse the most researched projects in {name}</p>
            </div>
            <Link href={`/search?q=${name}`} className="text-sm font-bold text-primary flex items-center hover:underline">
              View all results <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400">
              No active projects found in our current intelligence database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="group">
                  <div className="premium-card h-full flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={project.images?.[0] || "https://placehold.co/600x400/31343c/ffffff?text=No+Image"}
                        alt={project.name || project.project_name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                          {project.name || project.project_name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 font-medium italic mb-4">
                        By {project.builders?.name || project.builder_name}
                      </p>
                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{formatPrice(project.price_min)} - {formatPrice(project.price_max)}
                        </div>
                        <div className="flex items-center text-amber-500 text-sm font-bold">
                          <TrendingUp className="h-3.5 w-3.5 mr-1" />
                          {project.construction_progress}%
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
