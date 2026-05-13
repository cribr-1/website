"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, ArrowRight, TrendingUp, Building2 } from "lucide-react";
import Link from "next/link";

const BUILDERS = [
  { 
    id: "prestige", 
    name: "Prestige Group", 
    reputation: 9.4, 
    delivered: 185, 
    projects: 12, 
    quality: "High", 
    delay: "None",
    focus: "Luxury & Large Scale"
  },
  { 
    id: "sobha", 
    name: "Sobha Limited", 
    reputation: 9.1, 
    delivered: 142, 
    projects: 8, 
    quality: "Exceptional", 
    delay: "Minimal",
    focus: "Construction Detail"
  },
  { 
    id: "brigade", 
    name: "Brigade Group", 
    reputation: 8.9, 
    delivered: 168, 
    projects: 15, 
    quality: "Reliable", 
    delay: "Minor",
    focus: "Integrated Townships"
  },
  { 
    id: "godrej", 
    name: "Godrej Properties", 
    reputation: 8.7, 
    delivered: 92, 
    projects: 10, 
    quality: "Modern", 
    delay: "Minor",
    focus: "Brand Trust & ESG"
  },
  { 
    id: "total-environment", 
    name: "Total Environment", 
    reputation: 9.2, 
    delivered: 45, 
    projects: 5, 
    quality: "Premium Bespoke", 
    delay: "Moderate",
    focus: "Architectural Art"
  }
];

export default function BuildersPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <section className="pt-20 pb-16 bg-gray-50/50 border-b border-gray-100">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-6">
              <ShieldCheck className="h-3 w-3" />
              <span>Builder Verification</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Research Builders.</h1>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Transparent analysis of delivery history, construction quality, and project reliability metrics for Bangalore's top developers.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BUILDERS.map((builder, i) => (
            <Link 
              key={builder.id} 
              href={`/builders/${builder.id}`}
              className="p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center font-bold text-primary border border-gray-100 group-hover:bg-primary/5 transition-colors">
                  {builder.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{builder.name}</h3>
                  <div className="flex items-center text-amber-500 text-xs font-bold mt-1">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    {builder.reputation} Reputation Score
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-gray-50">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivered</div>
                  <div className="text-lg font-bold text-gray-900">{builder.delivered}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delay Track</div>
                  <div className="text-lg font-bold text-emerald-600">{builder.delay}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Focus: {builder.focus}</span>
                <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="container max-w-4xl mx-auto px-6 pt-10">
        <div className="p-10 rounded-3xl bg-gray-900 text-white relative overflow-hidden">
           <div className="relative z-10">
              <h4 className="text-xl font-bold mb-4">How we score builders</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Our reputation score is calculated using an independent weighted average of RERA compliance (30%), construction quality audits (30%), delay records (20%), and secondary market demand (20%).
              </p>
              <button className="text-sm font-bold text-primary flex items-center hover:underline">
                View scoring methodology <ArrowRight className="h-4 w-4 ml-2" />
              </button>
           </div>
           <Building2 className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5" />
        </div>
      </section>
    </div>
  );
}
