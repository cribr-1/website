"use client";

import { useEffect, useState } from 'react';
import { getRecommendations } from '@/lib/recommendationEngine';
import { CheckCircle2, AlertTriangle, Home, MapPin, ArrowLeft, Info, Wallet, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ResultsPage() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchResults() {
      const savedAnswers = localStorage.getItem("cribr_answers");
      const answers = savedAnswers ? JSON.parse(savedAnswers) : { budget: "premium", purpose: "live", commute: "moderate" };
      const results = await getRecommendations(answers);
      setRecommendations(results);
      setLoading(false);
    }
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center space-y-6 font-sans text-slate-900">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-medium tracking-tight">Curating live matches</h2>
          <p className="text-sm text-slate-500">Retrieving real-time listings from Supabase...</p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center space-y-4 font-sans text-slate-900">
        <p className="text-lg text-slate-500">Failed to retrieve matches. Please try again.</p>
        <Link href="/" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">
          Go back
        </Link>
      </div>
    );
  }

  const { hero, alternative, valuePick } = recommendations;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans pb-32">
      
      {/* Ultra Minimal Header */}
      <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl tracking-tight flex items-center gap-2 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Cribr
          </Link>
          <div className="text-sm font-medium text-slate-500">
            Your Curated Matches
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12 space-y-20">
        
        {/* HERO RECOMMENDATION (Dominant) */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-5xl font-medium tracking-tight">
              Here is your best match.
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl">
              Based on your priorities, this property offers the strongest alignment with your needs.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-1/2 relative h-80 lg:h-auto bg-slate-100">
                <Image 
                  src={hero.image} 
                  alt={hero.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-semibold shadow-sm inline-block">
                    #1 {hero.badge}
                  </span>
                </div>
              </div>

              {/* Data & Reasoning Section */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
                <div className="mb-2">
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">{hero.builder}</div>
                  <h2 className="text-3xl font-medium text-slate-900">{hero.name}</h2>
                </div>
                
                <div className="flex items-center text-slate-500 gap-4 mb-8 text-sm font-medium">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {hero.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><Home className="w-4 h-4" /> {hero.configuration}</span>
                </div>

                <div className="text-2xl font-medium text-slate-900 mb-8 border-b border-slate-100 pb-8">
                  {hero.price} <span className="text-base text-slate-400 font-normal">({hero.readiness})</span>
                </div>

                {/* The "Why" - Core Trust Mechanism */}
                <div className="flex-grow space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-widest mb-3">Why we picked this</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {hero.reasoning.summary}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" /> Pros
                      </h4>
                      <ul className="space-y-2">
                        {hero.reasoning.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-slate-400" /> Cons
                      </h4>
                      <ul className="space-y-2">
                        {hero.reasoning.compromises.map((c, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <button className="mt-10 w-full bg-slate-900 text-white font-medium py-4 rounded-xl hover:bg-slate-800 transition-colors">
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ALTERNATIVES (Secondary) */}
        <section className="space-y-8 pt-8 border-t border-slate-200">
          <div className="space-y-2">
            <h3 className="text-2xl font-medium tracking-tight">
              Other strong considerations
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {[alternative, valuePick].map((item, idx) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col h-full hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                    #{idx + 2} {item.badge}
                  </span>
                </div>
                
                <h4 className="text-xl font-medium text-slate-900 mb-1">{item.name}</h4>
                <div className="text-sm text-slate-500 mb-6">{item.location} • {item.price}</div>
                
                <div className="flex-grow mb-6">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.reasoning.summary}
                  </p>
                </div>

                <div className="space-y-3 mb-6 pt-6 border-t border-slate-100">
                  <div className="text-sm font-medium text-slate-900 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400"/> {item.reasoning.strengths[0]}</div>
                  <div className="text-sm font-medium text-slate-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-slate-400"/> {item.reasoning.compromises[0]}</div>
                </div>

                <button className="w-full py-3 text-sm font-medium text-slate-900 bg-slate-50 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* INLINE COMPARISON */}
        <section className="space-y-8 pt-12 border-t border-slate-200">
          <div className="space-y-2">
            <h3 className="text-2xl font-medium tracking-tight">
              How they compare
            </h3>
            <p className="text-slate-500">A quick breakdown of the tradeoffs.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-6 border-b border-slate-200 bg-slate-50 w-1/4"></th>
                  <th className="p-6 border-b border-slate-200 font-medium text-slate-900 w-1/4">
                    <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">#1 Best Match</span>
                    {hero.name}
                  </th>
                  <th className="p-6 border-b border-slate-200 font-medium text-slate-900 w-1/4">
                    <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">#2 Alternative</span>
                    {alternative.name}
                  </th>
                  <th className="p-6 border-b border-slate-200 font-medium text-slate-900 w-1/4">
                    <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">#3 Value Pick</span>
                    {valuePick.name}
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                
                {/* Comparison Rows */}
                {[
                  { label: "Best For", icon: Info, key: "idealUser", nested: true },
                  { label: "Builder Trust", icon: ShieldCheck, key: "trust", score: true },
                  { label: "Commute", icon: MapPin, key: "commute", score: true },
                  { label: "Lifestyle", icon: Zap, key: "lifestyle", score: true },
                  { label: "Value", icon: Wallet, key: "valueForMoney", score: true },
                  { label: "Downsides", icon: AlertTriangle, key: "compromises", array: true }
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-6 border-b border-slate-100 font-medium text-slate-700 flex items-center gap-2">
                      <row.icon className="w-4 h-4 text-slate-400" /> {row.label}
                    </td>
                    {[hero, alternative, valuePick].map((project, pIdx) => (
                      <td key={pIdx} className="p-6 border-b border-slate-100 text-slate-600 align-top">
                        {row.nested ? project.reasoning[row.key] : 
                         row.score ? <span className="font-medium text-slate-900">{project.scores[row.key]}/10</span> :
                         row.array ? project.reasoning[row.key][0] : 
                         project[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
