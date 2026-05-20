"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Sparkles, HelpCircle, ArrowLeft, Loader2, Wallet, Target, Users, Building2, MapPin, Briefcase, Home } from "lucide-react";

export default function HomeFinderPage() {
  const router = useRouter();
  
  // Modes: "search" | "conversational"
  const [mode, setMode] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Conversational Flow states
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    intent: "",
    budget: "",
    purpose: "",
    commute: ""
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 2) {
      if (typeof window !== "undefined") {
        // Clear old answers and set the search query
        localStorage.setItem("cribr_answers", JSON.stringify({ query: searchQuery }));
      }
      setMode("analyzing");
      setTimeout(() => {
        router.push("/results");
      }, 1500);
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
  };

  const handleNext = (key, value) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("cribr_answers", JSON.stringify(newAnswers));
    }

    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      setMode("analyzing");
      setTimeout(() => {
        router.push("/results");
      }, 1800);
    }
  };

  const handleConversationalIntentSubmit = (e) => {
    e.preventDefault();
    if (answers.intent.trim().length > 2) {
      handleNext("intent", answers.intent);
    }
  };

  const startConversationalFlow = () => {
    setStep(0);
    setAnswers({ intent: "", budget: "", purpose: "", commute: "" });
    setMode("conversational");
  };

  const SUGGESTIONS = [
    "2BHK under 1Cr",
    "Family home near metro",
    "Luxury 3BHK East Bangalore",
    "Quiet area for parents",
    "Best home for working couple"
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 selection:bg-slate-200">
      
      {/* Premium Minimal Header */}
      <header className="absolute top-0 w-full p-6 lg:p-8 flex justify-between items-center z-10">
        <div className="font-semibold text-xl tracking-tight flex items-center gap-2">
          Cribr
        </div>
        <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            
            {/* PRIMARY SEARCH INTERFACE */}
            {mode === "search" && (
              <motion.div
                key="search-mode"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-12"
              >
                <div className="space-y-4 text-center">
                  <h1 className="text-4xl lg:text-6xl font-medium tracking-tight leading-tight text-slate-900">
                    Find your home, <br />
                    with absolute clarity.
                  </h1>
                  <p className="text-lg text-slate-500 max-w-lg mx-auto">
                    Cribr understands context, builders, and transit to recommend your three perfect matching homes.
                  </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
                  <div className="relative flex items-center bg-white border border-slate-200/80 rounded-3xl p-2 shadow-lg shadow-slate-100 hover:border-slate-300 transition-all focus-within:border-slate-900 focus-within:shadow-xl focus-within:shadow-slate-200/50">
                    <Search className="w-6 h-6 text-slate-400 ml-4 shrink-0" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Ask Cribr (e.g. 2BHK near metro under 1.5Cr...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent outline-none text-lg py-4 px-3 text-slate-900 placeholder:text-slate-400 font-normal"
                    />
                    <button 
                      type="submit"
                      disabled={searchQuery.trim().length < 3}
                      className="bg-slate-900 text-white px-6 py-4 rounded-2xl hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-slate-900 transition-all font-medium flex items-center gap-2"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Suggestions */}
                <div className="space-y-3 text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Suggested Queries</div>
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                    {SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectSuggestion(sug)}
                        className="px-4 py-2 bg-white border border-slate-200/80 rounded-full text-sm font-medium text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors shadow-sm"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary conversational button */}
                <div className="pt-8 text-center border-t border-slate-100">
                  <button
                    onClick={startConversationalFlow}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 group-hover:animate-pulse" />
                    <span>Prefer a guided path? Let Cribr help you choose</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SECONDARY CONVERSATIONAL Q&A FLOW */}
            {mode === "conversational" && (
              <motion.div
                key="conversational-mode"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setMode("search")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Search</span>
                  </button>
                  <span className="text-xs font-semibold text-slate-400 tracking-wider">STEP {step + 1} OF 4</span>
                </div>

                {/* STEP 0: Location */}
                {step === 0 && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h2 className="text-3xl lg:text-5xl font-medium tracking-tight leading-tight">
                        Where do you want to live?
                      </h2>
                      <p className="text-lg text-slate-500">
                        City, neighborhood, or a specific landmark.
                      </p>
                    </div>

                    <form onSubmit={handleConversationalIntentSubmit} className="max-w-xl">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          autoFocus
                          placeholder="e.g. Whitefield, Bengaluru"
                          value={answers.intent}
                          onChange={(e) => setAnswers({ ...answers, intent: e.target.value })}
                          className="w-full bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none text-2xl lg:text-3xl py-4 text-slate-900 placeholder:text-slate-300 font-medium transition-colors"
                        />
                        <button 
                          type="submit"
                          disabled={answers.intent.trim().length < 3}
                          className="absolute right-0 bg-slate-900 text-white p-3 rounded-full hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-slate-900 transition-all shrink-0"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* STEP 1: Budget */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h2 className="text-3xl lg:text-4xl font-medium tracking-tight leading-tight">
                        What's your budget?
                      </h2>
                    </div>

                    <div className="space-y-3 max-w-lg">
                      {[
                        { value: "budget", label: "Under ₹1 Cr", icon: Wallet },
                        { value: "premium", label: "₹1 Cr - ₹1.5 Cr", icon: Target },
                        { value: "luxury", label: "Above ₹1.5 Cr", icon: Sparkles }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleNext("budget", option.value)}
                          className="w-full text-left p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-900 hover:shadow-sm transition-all duration-200 flex items-center gap-4 group"
                        >
                          <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
                            <option.icon className="w-5 h-5" />
                          </div>
                          <div className="font-medium text-lg">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Purpose */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h2 className="text-3xl lg:text-4xl font-medium tracking-tight leading-tight">
                        Are you buying to live, or to invest?
                      </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
                      {[
                        { value: "live", label: "Self Use", desc: "For me and my family", icon: Users },
                        { value: "invest", label: "Investment", desc: "For ROI and rentals", icon: Building2 }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleNext("purpose", option.value)}
                          className="text-left p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-900 hover:shadow-sm transition-all duration-200 flex flex-col gap-3 group"
                        >
                          <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
                            <option.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-lg">{option.label}</div>
                            <div className="text-slate-500 text-sm mt-0.5">{option.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Commute */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h2 className="text-3xl lg:text-4xl font-medium tracking-tight leading-tight">
                        How important is a short commute?
                      </h2>
                    </div>

                    <div className="space-y-3 max-w-lg">
                      {[
                        { value: "critical", label: "Critical", desc: "Must be near office or metro", icon: MapPin },
                        { value: "moderate", label: "Moderate", desc: "Willing to travel 30-40 mins", icon: Briefcase },
                        { value: "low", label: "Not Priority", desc: "I prioritize space and peace", icon: Home }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleNext("commute", option.value)}
                          className="w-full text-left p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-900 hover:shadow-sm transition-all duration-200 flex items-start gap-4 group"
                        >
                          <div className="text-slate-400 group-hover:text-slate-900 transition-colors mt-0.5">
                            <option.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-lg">{option.label}</div>
                            <div className="text-slate-500 text-sm mt-0.5">{option.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ANALYZING STATE */}
            {mode === "analyzing" && (
              <motion.div
                key="analyzing-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-6 text-center"
              >
                <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
                <div className="space-y-1">
                  <h2 className="text-xl font-medium tracking-tight">
                    Curating recommendations
                  </h2>
                  <p className="text-sm text-slate-500">
                    Finding the best matches for your criteria.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
