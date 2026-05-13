"use client";

import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 container max-w-4xl mx-auto px-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-8 border border-gray-100">
           <Bookmark className="h-8 w-8 text-gray-300" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Your Research Library.</h1>
        <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-md mx-auto mb-12">
          Save projects, localities, and technical reports here to compare them later and build your property profile.
        </p>
        
        <div className="p-10 rounded-[3rem] border-2 border-dashed border-gray-100 bg-gray-50/30">
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">No research saved yet</p>
           <Link href="/">
             <button className="px-8 py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all flex items-center mx-auto">
               Explore Properties <ArrowRight className="h-4 w-4 ml-2" />
             </button>
           </Link>
        </div>
      </section>
    </div>
  );
}
