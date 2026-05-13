"use client";

import { motion } from "framer-motion";
import { MapPin, TrendingUp, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const LOCALITIES = [
  { name: "Whitefield", price: "₹9,500/sft", growth: "+12%", score: 8.8, type: "IT Hub", metro: "Active" },
  { name: "Sarjapur", price: "₹7,200/sft", growth: "+8%", score: 8.2, type: "Residential", metro: "Proposed" },
  { name: "HSR Layout", price: "₹12,000/sft", growth: "+6%", score: 9.2, type: "Premium", metro: "Active" },
  { name: "Hebbal", price: "₹11,500/sft", growth: "+15%", score: 8.5, type: "Infrastructure Focus", metro: "Under Construction" },
  { name: "Electronic City", price: "₹6,500/sft", growth: "+15%", score: 7.9, type: "Industrial/IT", metro: "Active" },
  { name: "Bannerghatta Road", price: "₹8,800/sft", growth: "+10%", score: 8.1, type: "Established", metro: "Active" },
];

export default function LocalitiesPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <section className="pt-20 pb-16 bg-gray-50/50 border-b border-gray-100">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-6">
              <TrendingUp className="h-3 w-3" />
              <span>Micro-Market Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Explore Bangalore.</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              In-depth transparency reports for every micro-market. Understand pricing volatility, commute scores, and upcoming infrastructure milestones.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOCALITIES.map((area, i) => (
            <Link 
              key={area.name} 
              href={`/localities/${area.name}`}
              className="p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-primary/5 text-gray-400 group-hover:text-primary transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{area.score}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Livability Score</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{area.name}</h3>
              <div className="inline-flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
                <span className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100">{area.type}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600">Metro {area.metro}</span>
              </div>

              <div className="space-y-4 pt-8 border-t border-gray-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Avg Pricing</span>
                  <span className="text-gray-900 font-bold">{area.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 font-medium">Growth Trend</span>
                  <span className="text-blue-600 font-bold">{area.growth}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
