"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Star, 
  MapPin, 
  LayoutGrid, 
  List, 
  Save, 
  Copy,
  Info
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { mockProjects } from "@/data/mockProjects";
import { parseQuery } from "@/lib/queryParser";
import { cn } from "@/lib/utils";

const FILTERS = {
  budget: ["Under 1 Cr", "1 Cr - 2 Cr", "2 Cr - 5 Cr", "Above 5 Cr"],
  bhk: ["1BHK", "2BHK", "3BHK", "4BHK+"],
  possession: ["Ready to move", "Within 1 year", "1-2 years", "2+ years"],
  amenities: ["Swimming Pool", "Gym", "Clubhouse", "Security", "Power Backup"]
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(q);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  // Filters
  const [activeFilters, setActiveFilters] = useState({
    budget: [],
    bhk: [],
    possession: [],
    amenities: []
  });

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        let dbQuery = supabase
          .from('projects')
          .select('*, builders(name)');
        
        const parsed = parseQuery(q);
        
        if (parsed.locality) dbQuery = dbQuery.ilike('locality', `%${parsed.locality}%`);
        if (parsed.bhk) dbQuery = dbQuery.contains('unit_types', [parsed.bhk]);
        if (parsed.priceMax) dbQuery = dbQuery.lte('price_max', parsed.priceMax);

        const { data, error } = await dbQuery;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setProjects(data);
        } else if (!q) {
          setProjects(mockProjects);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error(err);
        setProjects(mockProjects.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.locality.toLowerCase().includes(q.toLowerCase())));
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [q, activeFilters]);

  const toggleCompare = (id) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter(p => p !== id));
    } else if (selectedProjects.length < 3) {
      setSelectedProjects([...selectedProjects, id]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Sticky Search Header */}
      <div className="sticky top-16 z-40 w-full bg-white border-b py-4 shadow-sm">
        <div className="container flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm outline-none border-gray-200 focus:border-primary/30"
              placeholder="Search by project, builder or location..."
            />
          </div>
          <button className="h-11 px-4 rounded-xl border border-gray-200 bg-white flex items-center space-x-2 text-sm font-medium hover:bg-gray-50 transition-colors md:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="container py-8 flex space-x-8">
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Filters</h3>
            <button className="text-xs text-primary font-medium hover:underline">Reset All</button>
          </div>

          {Object.entries(FILTERS).map(([key, options]) => (
            <div key={key} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{key}</h4>
              <div className="space-y-2">
                {options.map(option => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-primary transition-colors">
                      {/* Checkbox implementation */}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Results Area */}
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{projects.length}</span> premium projects in Bangalore
            </p>
            <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
              <button className="p-1.5 rounded-md bg-white shadow-sm"><LayoutGrid className="h-4 w-4" /></button>
              <button className="p-1.5 rounded-md text-gray-500 hover:bg-white transition-all"><List className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {projects.map((project, idx) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group premium-card flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={project.images?.[0] || "https://placehold.co/600x400/31343c/ffffff?text=No+Image"} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                        {project.locality}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:text-primary transition-colors">
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
                          <Link href={`/projects/${project.id}`}>{project.name || project.project_name}</Link>
                        </h3>
                        <p className="text-xs text-gray-500 font-medium italic">By {project.builders?.name || project.builder_name}</p>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        {project.google_reviews_score}
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-400 mb-4">
                      <MapPin className="h-3 w-3 mr-1" />
                      {project.locality}, Bangalore
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 mb-4">
                      <div className="flex items-center space-x-1.5 mb-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        <Info className="h-3 w-3" />
                        <span>AI Intelligence</span>
                      </div>
                      <p className="text-xs text-blue-800/80 leading-relaxed line-clamp-2">
                        {project.property_title_summary || "High appreciation potential due to proximity to upcoming metro and IT hubs in the area."}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{(project.price_min / 10000000).toFixed(2)} - {(project.price_max / 10000000).toFixed(2)} Cr
                      </div>
                      <button 
                        onClick={() => toggleCompare(project.id)}
                        className={cn(
                          "h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 border",
                          selectedProjects.includes(project.id) 
                            ? "bg-primary text-white border-primary" 
                            : "bg-white text-gray-600 border-gray-200 hover:border-primary/30 hover:text-primary"
                        )}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{selectedProjects.includes(project.id) ? "Selected" : "Compare"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Comparison Tray */}
      <AnimatePresence>
        {selectedProjects.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
          >
            <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                  {selectedProjects.map((id, i) => (
                    <div key={id} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{selectedProjects.length} Projects Selected</h4>
                  <p className="text-[10px] text-gray-400">Ready for side-by-side analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSelectedProjects([])}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
                <Link href={`/compare?ids=${selectedProjects.join(",")}`}>
                  <button className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    Analyze Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Loading research data...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
