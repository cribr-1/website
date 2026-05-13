"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  CheckCircle2, 
  Info, 
  Star, 
  ChevronRight, 
  ArrowRight,
  Compass,
  MapPin,
  Clock,
  ExternalLink,
  Copy
} from "lucide-react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { mockProjects } from "@/data/mockProjects";

const SUGGESTIONS = [
  "2BHK under 1 Cr in Whitefield",
  "Family-friendly apartments near metro",
  "Projects with low density",
  "Premium apartments with pool"
];

const TRENDING_SEARCHES = [
  "2BHK in Whitefield",
  "Projects near metro",
  "Prestige projects",
  "Villas under 3 Cr"
];

const WHY_CARDS = [
  {
    title: "Real Property Insights",
    desc: "Understand projects beyond marketing brochures with unbiased data points.",
    icon: BarChart3,
    color: "blue"
  },
  {
    title: "AI-Powered Comparison",
    desc: "Compare properties intelligently across pricing, location, amenities, and trust.",
    icon: Zap,
    color: "emerald"
  },
  {
    title: "Transparent Research",
    desc: "Get honest analysis about builders, connectivity, density, and long-term value.",
    icon: ShieldCheck,
    color: "blue"
  }
];

const LOCALITY_DATA = [
  { name: "Whitefield", price: "₹9,500/sft", demand: "High", connectivity: "Metro Q2", growth: "+12%", score: 8.8 },
  { name: "Sarjapur", price: "₹7,200/sft", demand: "Very High", connectivity: "Road Only", growth: "+8%", score: 8.2 },
  { name: "HSR Layout", price: "₹12,000/sft", demand: "Medium", connectivity: "Metro Active", growth: "+6%", score: 9.2 },
  { name: "Electronic City", price: "₹6,500/sft", demand: "High", connectivity: "Metro Q4", growth: "+15%", score: 7.9 },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 2. Hero Section */}
      <section className="relative w-full pt-32 pb-48 overflow-hidden">
        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8"
          >
            <Compass className="h-3 w-3" />
            <span>Property Research Experience</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]"
          >
            Find the right property <br />
            <span className="text-gray-400">with real insights.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium"
          >
            Search, compare, and understand projects using AI-powered property intelligence.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="relative max-w-3xl mx-auto mb-10"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-300 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="e.g. '2BHK under 1 Cr in Whitefield'"
                className="w-full h-20 pl-16 pr-6 rounded-[2rem] border-2 border-gray-100 bg-white shadow-2xl shadow-gray-200/40 outline-none focus:border-primary/20 focus:ring-8 focus:ring-primary/5 transition-all text-xl font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-4 top-4 bottom-4 px-8 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all"
              >
                Search
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest mr-2">Suggestions</span>
            {TRENDING_SEARCHES.map((tag, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="px-5 py-2 rounded-full bg-white border border-gray-100 text-sm font-bold text-gray-500 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Hero Visual Mockups (Floating UI) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none z-0">
           <div className="absolute top-[20%] left-[10%] w-64 h-80 rounded-3xl bg-gray-900"></div>
           <div className="absolute bottom-[20%] right-[10%] w-80 h-64 rounded-3xl bg-gray-900"></div>
           <div className="absolute top-[10%] right-[20%] w-48 h-48 rounded-full bg-primary"></div>
        </div>
      </section>

      {/* 3. "Why Cribr?" Section */}
      <section className="container py-32 border-t border-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {WHY_CARDS.map((card, i) => (
            <div key={i} className="space-y-6 group">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-1 group-hover:shadow-lg",
                card.color === "blue" ? "bg-blue-50 text-blue-600 shadow-blue-100" : "bg-emerald-50 text-emerald-600 shadow-emerald-100"
              )}>
                <card.icon className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Smart Search Demo Section */}
      <section className="w-full bg-gray-50/50 py-32 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">Intelligence understood.</h2>
                <p className="text-lg text-gray-500 font-medium">Cribr interprets natural language search to find properties that match your lifestyle needs, not just keywords.</p>
              </div>
              
              <div className="space-y-4">
                {SUGGESTIONS.map((s, i) => (
                  <div key={i} className="flex items-center space-x-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm cursor-default hover:border-primary/20 transition-all group">
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary/5 text-gray-400 group-hover:text-primary transition-colors">
                      <Search className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-gray-600">{s}</span>
                    <ArrowRight className="h-4 w-4 ml-auto text-gray-200 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Result Preview</div>
                      <div className="text-sm font-bold">2 Active Matches Found</div>
                   </div>
                   <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-100"></div>
                      <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200"></div>
                   </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50 space-y-3">
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      <Zap className="h-3 w-3" />
                      <span>Intelligence Summary</span>
                    </div>
                    <p className="text-xs font-medium text-blue-800 leading-relaxed">
                      "Found 2 projects in Whitefield with <span className="font-bold">low density</span> and <span className="font-bold">metro connectivity</span>. Prestige Fontaine Bleau matches your budget and lifestyle preferences."
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-2xl border border-gray-100 space-y-4">
                    <div className="aspect-video rounded-xl bg-gray-100 overflow-hidden"></div>
                    <div className="space-y-1">
                       <div className="font-bold text-sm">Prestige Fontaine Bleau</div>
                       <div className="text-xs text-gray-400">Whitefield, Bangalore</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 blur-[80px] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Research Picks */}
      <section className="container py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Popular Research Picks</h2>
            <p className="text-lg text-gray-500 font-medium">Verified technical profiles of projects currently being analyzed by the community.</p>
          </div>
          <Link href="/search" className="text-sm font-bold text-primary flex items-center hover:underline group">
            Explore all intelligence <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockProjects.slice(0, 3).map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="premium-card flex flex-col group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={project.images[0]} 
                  alt={project.project_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-primary shadow-sm uppercase tracking-widest border border-gray-100">
                    {project.google_reviews_score * 2} Trust Score
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors">{project.project_name}</h3>
                    <p className="text-xs text-gray-400 font-medium italic">By {project.builder_name}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                   <div className="flex items-center space-x-1.5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Info className="h-3 w-3" />
                      <span>Intelligence Snippet</span>
                   </div>
                   <p className="text-xs text-gray-600 leading-relaxed font-medium line-clamp-2 italic">
                     "{project.trade_offs[0]}"
                   </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="text-lg font-bold text-gray-900">₹{(project.price_min / 10000000).toFixed(1)} - {(project.price_max / 10000000).toFixed(1)} Cr</div>
                  <div className="p-2 rounded-lg border border-gray-100 group-hover:border-primary/20 group-hover:text-primary transition-all shadow-sm">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Compare Properties Section */}
      <section className="w-full bg-gray-900 text-white py-32 overflow-hidden relative">
         <div className="container relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-8">
               <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    <Zap className="h-3 w-3 text-primary" />
                    <span>Decision Support</span>
                  </div>
                  <h2 className="text-5xl font-bold tracking-tight">Compare properties <br /> side-by-side.</h2>
                  <p className="text-xl text-gray-400 font-medium leading-relaxed">
                    Understand pricing, connectivity, amenities, trust, and trade-offs instantly with our side-by-side technical comparison engine.
                  </p>
               </div>
               
               <div className="space-y-4 pt-8">
                  {[
                    "Technical trade-off analysis",
                    "Connectivity score breakdown",
                    "Builder reputation comparison",
                    "Price-per-sft volatility index"
                  ].map((t, i) => (
                    <div key={i} className="flex items-center space-x-4">
                       <CheckCircle2 className="h-5 w-5 text-primary" />
                       <span className="font-bold text-gray-300">{t}</span>
                    </div>
                  ))}
               </div>
               
               <Link href="/compare">
                 <button className="mt-12 px-10 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40">
                   Start Comparison
                 </button>
               </Link>
             </div>

             <div className="relative">
                <div className="aspect-square rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm p-1">
                   <div className="w-full h-full rounded-[2.8rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-10 space-y-8">
                      <div className="flex justify-between items-center border-b border-white/5 pb-8">
                         <div className="h-12 w-32 rounded-xl bg-white/10"></div>
                         <div className="h-12 w-32 rounded-xl bg-white/10"></div>
                      </div>
                      <div className="space-y-6">
                         {[1, 2, 3, 4].map(i => (
                           <div key={i} className="flex justify-between items-center">
                              <div className="h-4 w-24 bg-white/5 rounded-full"></div>
                              <div className="h-4 w-16 bg-white/10 rounded-full"></div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="absolute -bottom-10 -left-10 p-8 rounded-3xl bg-primary text-white shadow-3xl">
                   <div className="text-4xl font-bold italic underline decoration-white/20">98%</div>
                   <div className="text-xs font-bold uppercase tracking-widest mt-2">Analysis Accuracy</div>
                </div>
             </div>
           </div>
         </div>
         {/* Background glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      </section>

      {/* 7. Area Intelligence Section */}
      <section className="container py-32">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl font-bold tracking-tight">Explore Bangalore by locality.</h2>
          <p className="text-lg text-gray-500 font-medium">Deep-dive into micro-markets with data-driven transparency reports.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LOCALITY_DATA.map((area, i) => (
            <Link key={i} href={`/localities/${area.name}`} className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-primary/5 text-gray-400 group-hover:text-primary transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{area.score}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Livability</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{area.name}</h3>
              <div className="space-y-4 mt-8 pt-8 border-t border-gray-50">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Avg Price</span>
                    <span className="text-gray-900 font-bold">{area.price}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Metro</span>
                    <span className="text-emerald-600 font-bold">{area.connectivity}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Growth</span>
                    <span className="text-blue-600 font-bold">{area.growth}</span>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. Builder Trust Section */}
      <section className="w-full bg-gray-50/50 py-32">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Research builders before you decide.</h2>
              <p className="text-lg text-gray-500 font-medium">Independent analysis of delivery history, construction quality, and project transparency.</p>
            </div>
            <Link href="/builders" className="text-sm font-bold text-primary flex items-center hover:underline">View all builders <ChevronRight className="h-4 w-4 ml-1" /></Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Prestige Group", score: 9.4, delivered: 185, delay: "None" },
              { name: "Sobha Limited", score: 9.1, delivered: 142, delay: "Minimal" },
              { name: "Brigade Group", score: 8.9, delivered: 168, delay: "Minor" },
            ].map((b, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center space-x-6 mb-10">
                   <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center text-xl font-bold text-primary border border-gray-100">
                     {b.name.substring(0, 2).toUpperCase()}
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-gray-900">{b.name}</h4>
                      <div className="flex items-center text-amber-500 mt-1">
                        <Star className="h-3.5 w-3.5 fill-current mr-1" />
                        <span className="text-sm font-bold">{b.score} Reputation</span>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-10 border-t border-gray-50">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivered</div>
                      <div className="text-lg font-bold text-gray-900">{b.delivered}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delay Record</div>
                      <div className="text-lg font-bold text-emerald-600">{b.delay}</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. AI Research Section */}
      <section className="container py-32 text-center border-b border-gray-50">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
             <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mx-auto w-fit">
                Intelligent Discovery
             </div>
             <h2 className="text-4xl font-bold tracking-tight text-gray-900">AI-powered property understanding.</h2>
             <p className="text-lg text-gray-500 font-medium">Get simplified explanations of complex real estate data points instantly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
             {[
               { title: "Project Summaries", desc: "Instantly understand project USPs and technical specifications." },
               { title: "Comparison Insights", desc: "Discover which property offers the best value for your specific lifestyle." },
               { title: "Locality Analysis", desc: "Understand infrastructure milestones and growth stability." },
               { title: "Trade-off Explanations", desc: "Clear breakdowns of technical risks and property compromises." },
             ].map((item, i) => (
               <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-white space-y-3">
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 10. Testimonials / User Quotes */}
      <section className="container py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { quote: "Cribr helped us compare projects without relying only on broker opinions.", user: "Priya S., Home Buyer" },
            { quote: "The technical trade-offs were eye-opening. We finally understood the real value of the property.", user: "Rahul M., Researcher" },
            { quote: "Independent builder reputation metrics changed our decision entirely. Highly recommended.", user: "Vikram K., First-time Buyer" },
          ].map((t, i) => (
            <div key={i} className="space-y-6">
              <div className="p-8 rounded-3xl bg-gray-50/50 border border-gray-100 italic text-gray-600 font-medium leading-relaxed relative">
                <span className="absolute top-4 left-4 text-4xl text-gray-100 font-serif leading-none">“</span>
                "{t.quote}"
              </div>
              <div className="flex items-center space-x-3 px-4">
                 <div className="h-8 w-8 rounded-full bg-gray-100"></div>
                 <div className="text-xs font-bold text-gray-900 uppercase tracking-widest">{t.user}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Final Discovery Section */}
      <section className="container pb-32 pt-12 text-center">
        <div className="p-12 md:p-24 rounded-[4rem] bg-gray-900 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to find the truth?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all shadow-xl">
                 Start Researching
               </button>
               <button className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                 Browse Localities
               </button>
            </div>
          </div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
        </div>
      </section>
    </div>
  );
}
