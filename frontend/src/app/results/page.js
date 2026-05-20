"use client";

import { useEffect, useState } from 'react';
import { getRecommendations } from '@/lib/recommendationEngine';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Home, 
  MapPin, 
  ArrowLeft, 
  Info, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Star, 
  Flame, 
  Copy, 
  ExternalLink,
  Check,
  Scale,
  X,
  Heart,
  Bookmark,
  Share2,
  AlertOctagon,
  Calendar,
  Building2,
  CheckSquare,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompare, setSelectedCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [copiedRera, setCopiedRera] = useState(null);
  const [shortlisted, setShortlisted] = useState({});
  const [saved, setSaved] = useState({});
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    async function fetchResults() {
      const savedAnswers = localStorage.getItem("cribr_answers");
      const answers = savedAnswers ? JSON.parse(savedAnswers) : { budget: "premium", purpose: "live", commute: "moderate" };
      const results = await getRecommendations(answers);
      setRecommendations(results);
      setLoading(false);
    }
    fetchResults();
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-6 font-sans text-slate-100 relative overflow-hidden">
        {/* Glowing backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
            <ShieldCheck className="w-6 h-6 text-indigo-400 absolute animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">Curating Property Intelligence</h2>
            <p className="text-sm text-slate-400 max-w-sm">Parsing builder track records, RERA filings, and litigation histories in East Bangalore...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 font-sans text-slate-100">
        <AlertOctagon className="w-12 h-12 text-rose-500 animate-bounce" />
        <p className="text-lg text-slate-400">Failed to retrieve matches. Please try again.</p>
        <Link href="/" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium">
          Go back
        </Link>
      </div>
    );
  }

  const { hero, alternative, valuePick } = recommendations;
  const allMatches = [hero, alternative, valuePick].filter(Boolean);

  const handleCompareSelect = (projectId) => {
    setSelectedCompare((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 properties at a time.");
        return prev;
      }
      return [...prev, projectId];
    });
  };

  const toggleShortlist = (projectId) => {
    setShortlisted(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const toggleSave = (projectId) => {
    setSaved(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleShare = async (project) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Cribr Intelligence Profile - ${project.name}`,
          text: `Check out the property intelligence analysis of ${project.name} by ${project.builder} on Cribr.`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/results?project=${project.id}`);
        alert("Share link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyRera = (reraNum, projectId) => {
    navigator.clipboard.writeText(reraNum);
    setCopiedRera(projectId);
    setTimeout(() => setCopiedRera(null), 2000);
  };

  // Helper component to render dynamic image source with fallback
  const ImageContainer = ({ project }) => {
    const [imageError, setImageError] = useState(false);
    const hasImage = project.image && project.image !== "placeholder" && !imageError;

    if (!hasImage) {
      return (
        <div className="relative w-full h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_14px]"></div>
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-violet-500/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 space-y-1.5">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 text-indigo-400 mb-1 shadow-inner">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Cribr Index</div>
            <div className="text-xs font-semibold text-slate-200">Image Coming Soon</div>
            <div className="text-[9px] text-slate-500 max-w-[200px] mx-auto leading-relaxed truncate">
              RERA: {project.rera_number}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-200 px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider shadow-sm">
          {project.imageSource === "project" ? "Project Image" : "Locality Preview"}
        </div>
      </div>
    );
  };

  // Helper to format scores
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 6) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="font-bold text-2xl tracking-tight flex items-center gap-2 hover:text-indigo-400 transition-colors bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
            Cribr
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/50 border border-slate-800 px-3.5 py-1.5 rounded-full shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Property Intelligence Engine
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Intro Hero Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Intelligence Verified
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Your Property Truth Profile
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            We don't list properties — we profile their truth. Based on construction progress, timeline history, litigative risks, and builder track records, here is your intelligence report.
          </p>
        </div>

        {/* Side-by-side card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allMatches.map((project) => {
            const isHero = project.badge === "Best Match";
            const isAlternative = project.badge === "Alternative";
            const isValue = project.badge === "Value Pick";
            
            // Set dynamic card border glow based on tier
            let cardStyle = "border-slate-900 bg-slate-900/30 hover:border-slate-800";
            let badgeBg = "bg-slate-800 text-slate-400 border-slate-700";
            
            if (isHero) {
              cardStyle = "border-indigo-500/50 bg-slate-900/50 hover:border-indigo-400 shadow-lg shadow-indigo-500/5";
              badgeBg = "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300 border-indigo-500/30";
            } else if (isValue) {
              cardStyle = "border-emerald-500/30 bg-slate-900/30 hover:border-emerald-400 shadow-sm shadow-emerald-500/5";
              badgeBg = "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
            }

            return (
              <div 
                key={project.id} 
                className={`relative flex flex-col rounded-3xl border overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 ${cardStyle}`}
              >
                {/* Image & Main Badge */}
                <div className="relative group">
                  <ImageContainer project={project} />
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${badgeBg}`}>
                      {project.badge}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow space-y-6">
                  
                  {/* Top info and Title */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[200px]">{project.builder}</span>
                      {/* RERA small pill */}
                      <span className="text-[9px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">RERA Registered</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white leading-snug line-clamp-1">{project.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  </div>

                  {/* PROPRIETARY TRUTH SCORE BADGE */}
                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-900 flex items-center justify-between shadow-inner">
                    <div className="space-y-1">
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
                        Cribr Truth Index <Info className="w-3 h-3 cursor-help text-slate-600" title="Based on builder credibility, timeline compliance, ratings, and active litigation." />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-white">{project.truthScore.score}</span>
                        <span className="text-slate-500 text-xs font-semibold">/100</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider border shadow-sm ${
                        project.truthScore.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        project.truthScore.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {project.truthScore.label}
                      </span>
                    </div>
                  </div>

                  {/* Price & Configuration block */}
                  <div className="border-t border-slate-900/80 pt-4 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-slate-400">Budget Range</span>
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 capitalize">{project.budgetCategory}</span>
                    </div>
                    <div className="text-lg font-extrabold text-white">{project.price}</div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5 text-slate-600" /> {project.unit_types}</span>
                      <span className="font-semibold text-slate-300">{project.readiness}</span>
                    </div>
                  </div>

                  {/* KEY TECHNICAL METRICS GRID */}
                  <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-950/40 p-3 rounded-2xl border border-slate-900/60 shadow-inner">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <div>
                        <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Google Review</div>
                        <div className="font-semibold text-slate-300">{project.google_reviews_score.toFixed(1)} / 5.0</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <div>
                        <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Density</div>
                        <div className="font-semibold text-slate-300">{project.density} Units/Ac</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <div>
                        <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Commute Score</div>
                        <div className="font-semibold text-slate-300">{Math.round(project.commute_score * 10)}/10</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <div>
                        <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Builder Rel.</div>
                        <div className="font-semibold text-slate-300">{Math.round(project.builder_reliability * 100)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />
                      <div>
                        <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Possession</div>
                        <div className="font-semibold text-slate-300 truncate max-w-[100px]">{project.possession_date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <div>
                        <div className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">Distance to Hub</div>
                        <div className="font-semibold text-slate-300">{project.distance_from_nearest_office_hub} km</div>
                      </div>
                    </div>
                  </div>

                  {/* PRICE & PROJECT PROGRESS INFO */}
                  <div className="space-y-3 bg-slate-950/20 p-4.5 rounded-2xl border border-slate-900/40">
                    <div className="flex justify-between text-xs font-medium text-slate-400">
                      <span>Rate per Sqft</span>
                      <span className="font-bold text-slate-200">₹{project.price_per_sft.toLocaleString('en-IN')} / sqft</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-400">
                      <span>Total Land Area</span>
                      <span className="font-bold text-slate-200">{project.land_area_acres} Acres</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-400">
                      <span>Total Project Units</span>
                      <span className="font-bold text-slate-200">{project.total_units.toLocaleString('en-IN')} Units</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Construction Progress</span>
                        <span className="text-indigo-400">{project.construction_progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/40 shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                          style={{ width: `${project.construction_progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* COMPLIANCE / TRUTH CHECK */}
                  <div className="space-y-2 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-900 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold text-[9px] uppercase tracking-widest">Litigation Status</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        project.land_litigations === 0 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                      }`}>
                        {project.land_litigations === 0 ? 'Clear Title' : `${project.land_litigations} Active Case`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold text-[9px] uppercase tracking-widest">Project Complaints</span>
                      <span className={`font-semibold ${project.complaints === 0 ? 'text-slate-300' : 'text-amber-400'}`}>
                        {project.complaints} complaints
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold text-[9px] uppercase tracking-widest">Builder Complaints</span>
                      <span className={`font-semibold ${project.complaints_on_builder === 0 ? 'text-slate-300' : 'text-amber-400'}`}>
                        {project.complaints_on_builder} complaints
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-900 pt-2 text-[10px]">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">RERA ID</span>
                      <button 
                        onClick={() => copyRera(project.rera_number, project.id)}
                        className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors font-mono tracking-tighter truncate max-w-[140px]"
                      >
                        {copiedRera === project.id ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[9px] font-semibold"><Check className="w-3 h-3" /> Copied</span>
                        ) : (
                          <>
                            {project.rera_number.substring(0, 15)}...
                            <Copy className="w-3 h-3 cursor-pointer" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Strengths & Downsides Summary */}
                  <div className="flex-grow space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Key Strengths</div>
                      <ul className="space-y-1">
                        {project.insights.strengths.slice(0, 2).map((s, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700 mt-1.5 shrink-0"></span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Compromises</div>
                      <ul className="space-y-1">
                        {project.insights.downsides.slice(0, 2).map((c, i) => (
                          <li key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700 mt-1.5 shrink-0"></span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ACTION ROW */}
                  <div className="flex items-center justify-between border-t border-slate-900/80 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={selectedCompare.includes(project.id)}
                        onChange={() => handleCompareSelect(project.id)}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500/50 w-4 h-4 cursor-pointer focus:ring-offset-slate-950" 
                      />
                      <span className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors">
                        <Scale className="w-3.5 h-3.5 text-slate-500" /> Compare
                      </span>
                    </label>

                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => toggleShortlist(project.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          shortlisted[project.id] ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                        }`}
                        title="Shortlist"
                      >
                        <Heart className="w-4 h-4" fill={shortlisted[project.id] ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => toggleSave(project.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          saved[project.id] ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                        }`}
                        title="Save Truth Report"
                      >
                        <Bookmark className="w-4 h-4" fill={saved[project.id] ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => handleShare(project)}
                        className="p-2 rounded-xl border bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800 transition-all"
                        title="Share Report"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* PRIMARY CTA */}
                  <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 hover:shadow-indigo-500/20">
                    <Eye className="w-4 h-4" /> View Full Analysis
                  </button>

                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Compare Panel */}
        {selectedCompare.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-full px-6 py-4 flex items-center justify-between border border-slate-800 shadow-xl ring-2 ring-indigo-500/20">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {selectedCompare.length}
                </div>
                <span className="font-semibold text-slate-200">Properties Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedCompare([])}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setShowCompareModal(true)}
                  disabled={selectedCompare.length < 1}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Scale className="w-4 h-4" /> Compare Side-by-Side
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Side-by-Side Comparison Table Modal */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Scale className="w-6 h-6 text-indigo-400" /> Compare Properties
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">Side-by-side technical and risk analysis profile</p>
                </div>
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="p-2.5 rounded-xl border border-slate-850 bg-slate-950/30 text-slate-400 hover:text-slate-200 hover:border-slate-850 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content Table */}
              <div className="flex-grow overflow-x-auto p-6">
                <table className="w-full border-collapse border-slate-800 min-w-[700px] text-left">
                  <thead>
                    <tr>
                      <th className="p-4 border-b border-slate-800 bg-slate-950/30 w-1/4 rounded-tl-2xl"></th>
                      {allMatches
                        .filter(p => selectedCompare.includes(p.id))
                        .map((project, i) => (
                          <th key={project.id} className={`p-4 border-b border-slate-800 text-slate-100 w-1/4 bg-slate-950/20 ${i === selectedCompare.length - 1 ? 'rounded-tr-2xl' : ''}`}>
                            <div className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest mb-1">{project.badge}</div>
                            <div className="font-bold text-base text-white">{project.name}</div>
                            <div className="text-xs text-slate-500 font-medium truncate">{project.builder}</div>
                          </th>
                        ))}
                    </tr>
                  </thead>
                  
                  <tbody className="text-xs">
                    
                    {/* Basic Info Header Row */}
                    <tr>
                      <td colSpan={selectedCompare.length + 1} className="p-3 bg-slate-950/45 text-indigo-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-800">
                        General Profile
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Locality & Area</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-medium">{p.location}</td>
                      ))}
                    </tr>
                    
                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Price Range</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-white font-extrabold text-sm">{p.price}</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Price per Sqft</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-semibold">₹{p.price_per_sft.toLocaleString('en-IN')} / sqft</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Configurations</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-medium">{p.unit_types}</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Construction State</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-medium">
                          <div className="space-y-1">
                            <div>{p.readiness} ({p.construction_progress}%)</div>
                            <div className="w-28 h-1 bg-slate-950 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${p.construction_progress}%` }}></div>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Possession Date</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-medium">{p.possession_date}</td>
                      ))}
                    </tr>

                    {/* Proprietary scores Header Row */}
                    <tr>
                      <td colSpan={selectedCompare.length + 1} className="p-3 bg-slate-950/45 text-indigo-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-800">
                        Cribr Truth & Risk Scores
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Cribr Truth Index</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black">{p.truthScore.score}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                              p.truthScore.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              p.truthScore.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {p.truthScore.label}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Builder Reliability</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-semibold">{Math.round(p.builder_reliability * 100)}% reliability</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Timeline Reliability</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-semibold">{Math.round(p.timeline_reliability * 100)}% accuracy</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Litigation Status</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 font-semibold">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.land_litigations === 0 ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                          }`}>
                            {p.land_litigations === 0 ? 'Clear Title' : `${p.land_litigations} Litigation Case`}
                          </span>
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Project / Builder Complaints</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-medium">
                          Proj: <span className="font-semibold text-slate-100">{p.complaints}</span> | Builder: <span className="font-semibold text-slate-100">{p.complaints_on_builder}</span>
                        </td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">RERA Registration</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-300 font-mono text-[10px]">{p.rera_number}</td>
                      ))}
                    </tr>

                    {/* Technical metrics Header Row */}
                    <tr>
                      <td colSpan={selectedCompare.length + 1} className="p-3 bg-slate-950/45 text-indigo-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-800">
                        Technical Specs & Parameters
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Google Review Score</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-semibold">⭐ {p.google_reviews_score.toFixed(1)} / 5.0</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Density (Units/Acre)</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-semibold">{p.density} units / acre</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Commute Score</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-semibold">{Math.round(p.commute_score * 10)} / 10</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Distance to Office Hub</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-medium">{p.distance_from_nearest_office_hub} km</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-800/40">
                      <td className="p-4 font-bold text-slate-400">Total Units</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map(p => (
                        <td key={p.id} className="p-4 text-slate-200 font-medium">{p.total_units.toLocaleString('en-IN')} units</td>
                      ))}
                    </tr>

                    <tr className="hover:bg-slate-800/20 border-b border-slate-850">
                      <td className="p-4 font-bold text-slate-400 rounded-bl-2xl">Land Area</td>
                      {allMatches.filter(p => selectedCompare.includes(p.id)).map((p, i) => (
                        <td key={p.id} className={`p-4 text-slate-200 font-medium ${i === selectedCompare.length - 1 ? 'rounded-br-2xl' : ''}`}>{p.land_area_acres} Acres</td>
                      ))}
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-950/20 flex items-center justify-end">
                <button 
                  onClick={() => setShowCompareModal(false)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-md"
                >
                  Close Comparison
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Traditional Comparison Section */}
        <section className="space-y-6 pt-12 border-t border-slate-900">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Side-by-Side Tradeoffs
            </h3>
            <p className="text-slate-400 text-sm">A quick comparative breakdown of match rankings and user criteria alignment.</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-x-auto shadow-inner backdrop-blur-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-5 border-b border-slate-900 bg-slate-950/30 w-1/4"></th>
                  {allMatches.map((project) => (
                    <th key={project.id} className="p-5 border-b border-slate-900 font-bold text-slate-100 w-1/4">
                      <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-0.5">{project.badge}</span>
                      {project.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  { label: "Best For", icon: Info, key: "idealUser", nested: true },
                  { label: "Truth Score", icon: ShieldCheck, key: "truthScore", nested: true, truth: true },
                  { label: "Commute", icon: MapPin, key: "commute", score: true },
                  { label: "Lifestyle Value", icon: Zap, key: "lifestyle", score: true },
                  { label: "Pricing Value", icon: Wallet, key: "valueForMoney", score: true },
                  { label: "Ideal Target Profile", icon: UserCheck, key: "summary", nested: true, summary: true }
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-slate-900/20 transition-colors border-b border-slate-900/60">
                    <td className="p-5 font-bold text-slate-400 flex items-center gap-2">
                      <row.icon className="w-4 h-4 text-slate-500" /> {row.label}
                    </td>
                    {allMatches.map((project) => (
                      <td key={project.id} className="p-5 text-slate-300 align-middle">
                        {row.score ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{project.scores[row.key]} / 10</span>
                            <div className="w-16 h-1 bg-slate-950 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${project.scores[row.key] * 10}%` }}></div>
                            </div>
                          </div>
                        ) : row.truth ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                            project.truthScore.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            project.truthScore.color === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {project.truthScore.score} / {project.truthScore.label}
                          </span>
                        ) : row.nested ? (
                          row.summary ? project.reasoning.summary : project.reasoning[row.key]
                        ) : (
                          project[row.key]
                        )}
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
