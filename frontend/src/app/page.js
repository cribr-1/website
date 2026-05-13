"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Zap, BarChart3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  "2BHK under 1 Cr in Whitefield",
  "Luxury apartments in Sarjapur",
  "Projects near upcoming metro",
  "Family-friendly projects in North Bangalore"
];

const TRENDING_AREAS = [
  { name: "Whitefield", growth: "+12%", type: "IT Hub", color: "blue" },
  { name: "Sarjapur", growth: "+8%", type: "Residential", color: "emerald" },
  { name: "Hebbal", growth: "+15%", type: "Premium", color: "blue" },
  { name: "HSR Layout", growth: "+6%", type: "Startup Hub", color: "emerald" },
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
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-32 px-4 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6"
          >
            Find the right property <br />
            <span className="text-primary">with real insights.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Understand projects beyond marketing. Get deep insights into premium developments with unbiased intelligence and technical research.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSearch}
            className="relative max-w-3xl mx-auto mb-8"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for projects, builders, or locations..."
                className="w-full h-16 pl-16 pr-6 rounded-2xl border-2 border-gray-100 bg-white shadow-xl shadow-gray-200/50 outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-3 bottom-3 px-6 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Search
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-sm font-medium text-gray-400 mr-2">Try:</span>
            {SUGGESTIONS.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(suggestion);
                  router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                }}
                className="px-4 py-1.5 rounded-full bg-white border border-gray-100 text-sm text-gray-600 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats / Trending Section */}
      <section className="container py-24 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <BarChart3 className="h-6 w-6" />
              <h3 className="font-bold text-lg">Market Intelligence</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Real-time pricing trends and rental yields for every major locality. Make data-backed decisions.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
              <h3 className="font-bold text-lg">Builder Verification</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Transparent builder reputation scores based on delivery history, quality, and RERA compliance.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-blue-600">
              <Zap className="h-6 w-6" />
              <h3 className="font-bold text-lg">AI Comparison</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Side-by-side technical comparison of projects using AI to highlight the best value for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Areas */}
      <section className="w-full bg-gray-50 py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Intelligence by Locality</h2>
              <p className="text-gray-600 mt-2">Discover micro-markets, lifestyle corridors, and growth trends.</p>
            </div>
            <Link href="/localities" className="text-primary font-medium hover:underline">View all areas →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRENDING_AREAS.map((area, i) => (
              <Link
                key={i}
                href={`/localities/${area.name}`}
                className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg bg-${area.color}-50 text-${area.color}-600`}>
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    {area.type}
                  </span>
                </div>
                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{area.name}</h4>
                <p className="text-sm text-gray-500 mt-1">Market growth: {area.growth}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="container py-24 text-center">
        <div className="p-12 rounded-3xl bg-gray-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Make a smarter property decision.</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">
              Our AI analyzes over 500+ projects and 50+ data points per project to simplify your property search and technical research.
            </p>
            <button className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              Explore Intelligence Dashboard
            </button>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </section>
    </div>
  );
}
