import { useState, useEffect } from "react";
import { PropertyReport, PremiumProperty } from "../types";
import {
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck,
  Hammer,
  TrendingUp,
  Leaf,
  VolumeX,
  Map,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Share2,
  Heart,
  ArrowRight,
  Bell,
  BellRing,
  Smartphone,
  Mail,
  Zap,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import NotificationPreferencesModal from "./NotificationPreferencesModal";
import ShareReportModal from "./ShareReportModal";
import { cribrNotifications } from "../lib/supabase";

interface CribrIntelligenceReportProps {
  report: PropertyReport;
  onSaveCurrent: () => void;
  isSaved: boolean;
  isLoading: boolean;
  onBookVisit?: (property: any) => void;
  onDownloadReport: () => void;
  onScheduleCallback: (type: string) => void;
  onUnlockPremium: () => void;
}

export default function CribrIntelligenceReport({
  report,
  onSaveCurrent,
  isSaved,
  isLoading,
  onBookVisit,
  onDownloadReport,
  onScheduleCallback,
  onUnlockPremium
}: CribrIntelligenceReportProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Notification states
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionPrefs, setSubscriptionPrefs] = useState<any>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync subscription preferences from Database first, fallback to LocalStorage
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const dbPrefs = await cribrNotifications.getPreferences(report.propertyOrQueryName);
        setSubscriptionPrefs(dbPrefs);
        setHasSubscription(
          dbPrefs.reraProgress || dbPrefs.priceDrops || dbPrefs.legalUpdates || dbPrefs.noiseFluctuation
        );
      } catch (err) {
        console.warn("Failed to load notifications, reading from fallback:", err);
        const key = `cribr_sub_${report.propertyOrQueryName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSubscriptionPrefs(parsed);
            setHasSubscription(
              parsed.reraProgress || parsed.priceDrops || parsed.legalUpdates || parsed.noiseFluctuation
            );
          } catch (e) {
            console.error("Failed to parse subscription prefs", e);
          }
        } else {
          setHasSubscription(false);
          setSubscriptionPrefs(null);
        }
      }
    };
    loadAlerts();
  }, [report.propertyOrQueryName]);

  const handleSubscribeUpdate = async (prefs: any) => {
    try {
      await cribrNotifications.savePreferences({
        propertyName: report.propertyOrQueryName,
        reraProgress: prefs.reraProgress,
        priceDrops: prefs.priceDrops,
        legalUpdates: prefs.legalUpdates,
        noiseFluctuation: prefs.noiseFluctuation,
        emailEnabled: prefs.emailEnabled,
        whatsappEnabled: prefs.whatsappEnabled
      });
    } catch (e) {
      console.warn("Failed to write notifications to database:", e);
    }
    const key = `cribr_sub_${report.propertyOrQueryName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    localStorage.setItem(key, JSON.stringify(prefs));
    setSubscriptionPrefs(prefs);
    setHasSubscription(
      prefs.reraProgress || prefs.priceDrops || prefs.legalUpdates || prefs.noiseFluctuation
    );
  };

  // Smoothly animate the main dial score on mount or report change
  useEffect(() => {
    setAnimatedScore(0);
    const duration = 1000;
    const start = 0;
    const end = report.overallScore;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(start + easeProgress * (end - start)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [report.overallScore]);

  // Determine colors based on overall score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500 stroke-emerald-500";
    if (score >= 80) return "text-apple-blue stroke-apple-blue";
    if (score >= 70) return "text-indigo-500 stroke-indigo-500";
    return "text-amber-500 stroke-amber-500";
  };

  const getVerdictStyle = (verdict: string) => {
    const v = verdict.toUpperCase();
    if (v.includes("BUY")) return "bg-emerald-50 border-emerald-200/80 text-emerald-700 shadow-emerald-500/5";
    if (v.includes("HOLD")) return "bg-amber-50 border-amber-200/80 text-amber-700 shadow-amber-500/5";
    return "bg-neutral-50 border-neutral-200/80 text-neutral-700 shadow-neutral-500/5";
  };

  return (
    <div className="w-full relative">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full p-12 md:p-24 rounded-[32px] bg-white border border-neutral-200/50 apple-shadow-lg flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]"
          >
            {/* Super premium loading indicator inspired by Apple Vision Pro boot flow */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-purple-600 animate-spin" />
              <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-semibold text-apple-text-primary">
                CRIBR Quantum Compilation
              </h3>
              <p className="text-apple-text-secondary text-base max-w-md mx-auto mt-2 font-light">
                Analyzing registered deeds, construction material testing, satellite layouts, and local resident reviews...
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Header / Summary Glass Section */}
            <div className="rounded-[32px] bg-white border border-neutral-200/50 p-8 md:p-12 apple-shadow-lg mb-12 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-100/20 to-purple-100/20 rounded-full filter blur-[100px] pointer-events-none" />
              
              {/* Radial Dial Indicator Left */}
              <div className="flex flex-col items-center flex-shrink-0 relative">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      className="stroke-neutral-100 fill-none"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="84"
                      className={`fill-none ${getScoreColor(report.overallScore)} transition-all duration-1000 ease-out`}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 84}
                      strokeDashoffset={2 * Math.PI * 84 * (1 - report.overallScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl md:text-6xl font-display font-black tracking-tight text-apple-text-primary">
                      {animatedScore}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-apple-text-secondary font-bold uppercase mt-1">
                      CONFIDENCE INDEX
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary text right */}
              <div className="flex-grow text-center lg:text-left space-y-4">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <span className="px-3.5 py-1 bg-neutral-100 text-[11px] font-mono uppercase tracking-wider text-apple-text-secondary rounded-full border border-neutral-200/40">
                    AI PROPERTY REPORT
                  </span>
                  <span className="px-3.5 py-1 bg-blue-50 text-blue-600 text-[11px] font-mono uppercase tracking-wider rounded-full border border-blue-100">
                    {report.builderName}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-apple-text-primary">
                  {report.propertyOrQueryName}
                </h3>
                <p className="text-lg text-apple-text-secondary font-light leading-relaxed">
                  {report.summary}
                </p>

                {/* Micro Actions inside Report */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={onSaveCurrent}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border text-[14px] font-medium transition-all duration-300 ${
                      isSaved
                        ? "bg-rose-50 border-rose-200 text-rose-600"
                        : "bg-white border-neutral-200 text-apple-text-primary hover:border-neutral-300"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
                    <span>{isSaved ? "Saved to Library" : "Save Intelligence"}</span>
                  </button>

                  <button
                    onClick={() => setIsNotifyModalOpen(true)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border text-[14px] font-medium transition-all duration-300 ${
                      hasSubscription
                        ? "bg-indigo-50 border-indigo-200/80 text-indigo-600 shadow-sm"
                        : "bg-white border-neutral-200 text-apple-text-primary hover:border-neutral-300"
                    }`}
                  >
                    <Bell className={`w-4 h-4 ${hasSubscription ? "fill-indigo-500 text-indigo-500 animate-pulse" : "text-apple-text-secondary"}`} />
                    <span>{hasSubscription ? "Notifications Active" : "Notify Me"}</span>
                  </button>

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-apple-text-primary text-[14px] font-medium hover:border-neutral-300 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Share2 className="w-4 h-4 text-apple-text-secondary" />
                    <span>Share Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Core Capability Parameters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Card 1: Builder Score */}
              <div className="p-8 md:p-10 rounded-[32px] bg-white border border-neutral-200/50 apple-shadow flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-indigo-600">
                      <Building2 className="w-5 h-5" />
                      <span className="text-[13px] font-mono tracking-widest uppercase font-semibold">
                        Developer standing
                      </span>
                    </div>
                    <h4 className="text-xl font-display font-bold text-apple-text-primary">
                      {report.builderName}
                    </h4>
                  </div>
                  <div className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-2xl font-mono font-bold text-[16px] border border-indigo-100">
                    {report.builderScore}%
                  </div>
                </div>
                
                {/* Score bar */}
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                    style={{ width: `${report.builderScore}%` }}
                  />
                </div>

                <p className="text-[15px] text-apple-text-secondary font-light leading-relaxed">
                  {report.builderTrustReport}
                </p>
              </div>

              {/* Card 2: Legal Clearness */}
              <div className="p-8 md:p-10 rounded-[32px] bg-white border border-neutral-200/50 apple-shadow flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-emerald-600">
                      <FileCheck className="w-5 h-5" />
                      <span className="text-[13px] font-mono tracking-widest uppercase font-semibold">
                        Legal clearance
                      </span>
                    </div>
                    <h4 className="text-xl font-display font-bold text-apple-text-primary">
                      Registrar Records
                    </h4>
                  </div>
                  <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-2xl font-mono font-bold text-[16px] border border-emerald-100">
                    {report.legalScore}%
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${report.legalScore}%` }}
                  />
                </div>

                <p className="text-[15px] text-apple-text-secondary font-light leading-relaxed">
                  {report.legalReport}
                </p>
              </div>

              {/* Card 3: Construction Quality */}
              <div className="p-8 md:p-10 rounded-[32px] bg-white border border-neutral-200/50 apple-shadow flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Hammer className="w-5 h-5" />
                      <span className="text-[13px] font-mono tracking-widest uppercase font-semibold">
                        Engineering standard
                      </span>
                    </div>
                    <h4 className="text-xl font-display font-bold text-apple-text-primary">
                      Structural Materials
                    </h4>
                  </div>
                  <div className="px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-2xl font-mono font-bold text-[16px] border border-blue-100">
                    {report.constructionScore}%
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${report.constructionScore}%` }}
                  />
                </div>

                <p className="text-[15px] text-apple-text-secondary font-light leading-relaxed">
                  {report.constructionDetails}
                </p>
              </div>

              {/* Card 4: Investment Yield */}
              <div className="p-8 md:p-10 rounded-[32px] bg-white border border-neutral-200/50 apple-shadow flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-purple-600">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-[13px] font-mono tracking-widest uppercase font-semibold">
                        Capital appreciation
                      </span>
                    </div>
                    <h4 className="text-xl font-display font-bold text-apple-text-primary">
                      Investment Forecast
                    </h4>
                  </div>
                  <div className="px-3.5 py-1.5 bg-purple-50 text-purple-700 rounded-2xl font-mono font-bold text-[16px] border border-purple-100">
                    {report.investmentYieldScore}%
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-1000"
                    style={{ width: `${report.investmentYieldScore}%` }}
                  />
                </div>

                <p className="text-[15px] text-apple-text-secondary font-light leading-relaxed">
                  {report.investmentAnalysis}
                </p>
              </div>
            </div>

            {/* Neighborhood Vibe Grid Section */}
            <div className="rounded-[32px] bg-white border border-neutral-200/50 p-8 md:p-12 apple-shadow mb-12">
              <div className="flex items-center space-x-2 text-apple-blue mb-8">
                <Map className="w-5 h-5" />
                <h4 className="text-[13px] font-mono tracking-widest uppercase font-semibold">
                  Neighborhood Vibe & Decibel parameters
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Parameter 1: Reliability Index */}
                <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/20 flex flex-col justify-between h-32">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-apple-text-secondary">Reliability</span>
                    <Leaf className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-display font-bold text-apple-text-primary">
                      {report.neighborhood.reliabilityIndex || 95}%
                    </span>
                    <span className="text-[11px] font-mono text-apple-text-secondary">Index</span>
                  </div>
                </div>

                {/* Parameter 2: Safety Index */}
                <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/20 flex flex-col justify-between h-32">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-apple-text-secondary">Safety</span>
                    <CheckCircle2 className="w-4 h-4 text-apple-blue" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-display font-bold text-apple-text-primary">
                      {report.neighborhood.safetyIndex || 92}%
                    </span>
                    <span className="text-[11px] font-mono text-apple-text-secondary">Index</span>
                  </div>
                </div>

                {/* Parameter 3: Quality Rating */}
                <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/20 flex flex-col justify-between h-32">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-apple-text-secondary">Quality Standard</span>
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-display font-bold text-apple-text-primary">
                      {report.neighborhood.qualityRating || 96}%
                    </span>
                    <span className="text-[11px] font-mono text-apple-text-secondary">Rating</span>
                  </div>
                </div>

                {/* Parameter 4: Silence Index */}
                <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/20 flex flex-col justify-between h-32">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-apple-text-secondary">Environment</span>
                    <VolumeX className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-display font-bold text-apple-text-primary">
                      94%
                    </span>
                    <span className="text-[11px] font-mono text-apple-text-secondary">Score</span>
                  </div>
                </div>
              </div>

              {/* Resident Sentiment */}
              <div className="p-6 rounded-2xl bg-indigo-50/30 border border-indigo-100/30">
                <p className="text-[11px] font-mono text-indigo-600 uppercase tracking-wider font-bold mb-2">
                  RESIDENT SENTIMENT REVIEW
                </p>
                <p className="text-[15px] text-apple-text-primary font-light italic leading-relaxed">
                  "{report.neighborhood.sentiment || "Verified high resident satisfaction and positive infrastructure feedback."}"
                </p>
              </div>
            </div>

            {/* Pros and Cons Column Split */}
            {(report.pros?.length > 0 || report.cons?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Pros */}
                {report.pros?.length > 0 && (
                  <div className="p-8 md:p-10 rounded-[32px] bg-emerald-50/10 border border-emerald-200/30 p-8 flex flex-col space-y-6">
                    <div className="flex items-center space-x-2 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5 fill-emerald-50 text-emerald-600" />
                      <h4 className="text-[14px] font-mono uppercase tracking-wider font-bold">
                        Strategic Advantages
                      </h4>
                    </div>
                    <ul className="space-y-4">
                      {report.pros.map((pro, index) => (
                        <li key={index} className="flex items-start space-x-3 text-[15px] text-apple-text-primary">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0" />
                          <span className="font-light leading-relaxed">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {report.cons?.length > 0 && (
                  <div className="p-8 md:p-10 rounded-[32px] bg-amber-50/10 border border-amber-200/30 p-8 flex flex-col space-y-6">
                    <div className="flex items-center space-x-2 text-amber-600">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h4 className="text-[14px] font-mono uppercase tracking-wider font-bold">
                        Risk Assessment Warnings
                      </h4>
                    </div>
                    <ul className="space-y-4">
                      {report.cons.map((con, index) => (
                        <li key={index} className="flex items-start space-x-3 text-[15px] text-apple-text-primary">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                          <span className="font-light leading-relaxed">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Comparative Matrix table if it exists */}
            {report.comparativeMatrix && report.comparativeMatrix.length > 0 && (
              <div className="rounded-[32px] bg-white border border-neutral-200/50 p-8 md:p-12 apple-shadow mb-12 overflow-hidden">
                <div className="flex items-center space-x-2 text-apple-blue mb-8">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <h4 className="text-[13px] font-mono tracking-widest uppercase font-semibold">
                    CRIBR AI Comparison Matrix
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100">
                        <th className="py-4 text-[13px] font-mono uppercase text-apple-text-secondary font-bold">Parameters</th>
                        <th className="py-4 text-[15px] font-display font-bold text-apple-text-primary">Developer / Project A</th>
                        <th className="py-4 text-[15px] font-display font-bold text-apple-text-primary">Developer / Project B</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {report.comparativeMatrix.map((item, index) => (
                        <tr key={index} className="hover:bg-neutral-50/40 transition-colors duration-200">
                          <td className="py-4.5 text-[14px] font-semibold text-apple-text-primary pr-4">{item.label}</td>
                          <td className="py-4.5 text-[14px] text-apple-text-secondary font-light pr-4">{item.metricA}</td>
                          <td className="py-4.5 text-[14px] text-apple-text-secondary font-light">{item.metricB}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CRIBR Pulse Live Monitoring Stream Dashboard */}
            <div className="rounded-[32px] bg-white border border-neutral-200/50 p-8 md:p-12 apple-shadow mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-tr from-indigo-50/30 to-blue-50/30 rounded-full filter blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-neutral-100 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-indigo-600">
                    <Zap className="w-4 h-4 animate-bounce" />
                    <span className="text-[11px] font-mono tracking-widest uppercase font-bold">
                      CRIBR Pulse Stream
                    </span>
                  </div>
                  <h4 className="text-2xl font-display font-extrabold text-apple-text-primary tracking-tight">
                    Real-Time Property Monitor
                  </h4>
                  <p className="text-[14px] text-apple-text-secondary font-light">
                    Continuous monitoring of RERA registry logs, price shifts, and structural developments.
                  </p>
                </div>

                <button
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-full text-[13px] font-medium transition-all duration-300 flex items-center space-x-2 self-start md:self-auto hover:scale-105 active:scale-95 shadow-md"
                >
                  <Bell className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Configure Notifications</span>
                </button>
              </div>

              {/* Preferences Quick Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
                {[
                  { label: "RERA Compliance", active: !subscriptionPrefs || subscriptionPrefs.reraProgress },
                  { label: "Price Fluctuations", active: !subscriptionPrefs || subscriptionPrefs.priceDrops },
                  { label: "Construction Checks", active: !subscriptionPrefs || subscriptionPrefs.legalUpdates },
                  { label: "Tranquility Shifts", active: subscriptionPrefs?.noiseFluctuation }
                ].map((pref, i) => (
                  <div
                    key={i}
                    onClick={() => setIsNotifyModalOpen(true)}
                    className={`p-4 rounded-2xl border text-center cursor-pointer transition-all duration-300 ${
                      pref.active
                        ? "bg-indigo-50/30 border-indigo-200/50 text-indigo-700 hover:border-indigo-300"
                        : "bg-neutral-50/50 border-neutral-100 text-neutral-400 hover:border-neutral-200"
                    }`}
                  >
                    <div className="text-[13px] font-bold font-display">{pref.label}</div>
                    <div className="text-[10px] font-mono tracking-widest uppercase font-black mt-1.5 flex items-center justify-center space-x-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${pref.active ? "bg-indigo-500 animate-pulse" : "bg-neutral-300"}`} />
                      <span>{pref.active ? "ACTIVE STREAM" : "INACTIVE"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pulse log stream history */}
              <div className="space-y-4 relative z-10">
                <span className="text-[11px] font-mono uppercase tracking-wider text-apple-text-secondary font-bold block">
                  Simulated Notification Logs
                </span>
                
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 divide-y divide-neutral-100">
                  {[
                    {
                      date: "July 04, 2026",
                      stream: "Construction Progress",
                      title: "14th Floor Slab Solidification Certified",
                      detail: "Autonomous satellite radar verification checked tower B structural layout. Core loading indices normal."
                    },
                    {
                      date: "June 25, 2026",
                      stream: "RERA Registry",
                      title: "Phase 3 RERA Extension Audited",
                      detail: "State RERA registrar synchronized developer schedule with zero customer litigation filings."
                    },
                    {
                      date: "June 18, 2026",
                      stream: "Market Pricing",
                      title: "Standard Inventory Appreciation Shift",
                      detail: "Micro-market secondary resale valuation trends moved stable. Developer launched zero-brokerage inventories."
                    }
                  ].map((log, index) => (
                    <div key={index} className="pt-4.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 text-apple-text-secondary font-semibold">
                            {log.stream}
                          </span>
                          <span className="text-[12px] font-bold text-apple-text-primary">{log.title}</span>
                        </div>
                        <p className="text-[13px] text-apple-text-secondary font-light">{log.detail}</p>
                      </div>
                      <span className="text-[11px] font-mono text-apple-text-secondary flex-shrink-0 self-start sm:self-auto bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-100">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Developer & Structural Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
              {/* Action 1: Export Audit Report */}
              <div className="p-6 rounded-[24px] bg-white border border-neutral-200/50 apple-shadow hover:apple-shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-56">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-apple-blue">
                    <Download className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-[15px] font-bold text-apple-text-primary mt-4">
                    Export Audit Report
                  </h4>
                  <p className="text-[12.5px] text-apple-text-secondary font-light mt-1.5 leading-relaxed">
                    Download full executive summary, verification scorecards, and legal compliance history.
                  </p>
                </div>
                <button
                  onClick={onDownloadReport}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white text-[12.5px] font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span>Download Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action 2: Schedule Expert Callback */}
              <div className="p-6 rounded-[24px] bg-white border border-neutral-200/50 apple-shadow hover:apple-shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-56">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Smartphone className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-[15px] font-bold text-apple-text-primary mt-4">
                    Expert Legal Consultation
                  </h4>
                  <p className="text-[12.5px] text-apple-text-secondary font-light mt-1.5 leading-relaxed">
                    Discuss RERA non-litigation indices and land-encroachment records with a specialist.
                  </p>
                </div>
                <button
                  onClick={() => onScheduleCallback("legal")}
                  className="w-full py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-apple-text-primary text-[12.5px] font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all duration-200 active:scale-95"
                >
                  <span>Request Callback</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>

              {/* Action 3: Unlock Premium Insights */}
              <div className="p-6 rounded-[24px] bg-white border border-neutral-200/50 apple-shadow hover:apple-shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-56 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-50/50 to-transparent rounded-full filter blur-[15px] pointer-events-none" />
                <div>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <Zap className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-[15px] font-bold text-apple-text-primary mt-4 flex items-center gap-1.5">
                    <span>Locked Capital Analysis</span>
                    <span className="text-[9px] font-mono uppercase bg-purple-50 border border-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-black">PRO</span>
                  </h4>
                  <p className="text-[12.5px] text-apple-text-secondary font-light mt-1.5 leading-relaxed">
                    Inspect locked developer leverage indexes, builder debt ratings, and appreciation forecasts.
                  </p>
                </div>
                <button
                  onClick={onUnlockPremium}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white text-[12.5px] font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-all duration-200 active:scale-95 shadow-sm"
                >
                  <span>Unlock Premium Insights</span>
                </button>
              </div>
            </div>

            {/* Verdict Card Bottom */}
            <div className={`rounded-[32px] border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 apple-shadow-lg ${getVerdictStyle(report.verdict)}`}>
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-[12px] font-mono tracking-widest uppercase font-black">
                    CRIBR TRUST VERDICT
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
                  {report.verdict.split(".")[0]}.
                </h3>
                <p className="text-[15px] md:text-16 font-light leading-relaxed opacity-90 max-w-2xl">
                  {report.verdict.split(".").slice(1).join(".")}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={onDownloadReport}
                  className="px-6 py-3.5 bg-neutral-900 text-white hover:bg-black rounded-full font-medium text-[14px] flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-black/10"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report Prospectus</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subscription Preferences Dialog Popup */}
      <AnimatePresence>
        {isNotifyModalOpen && (
          <NotificationPreferencesModal
            propertyName={report.propertyOrQueryName}
            onClose={() => setIsNotifyModalOpen(false)}
            onSubscribe={handleSubscribeUpdate}
            initialPrefs={subscriptionPrefs}
          />
        )}
      </AnimatePresence>

      {/* Share Report Dialog Popup */}
      <AnimatePresence>
        {isShareModalOpen && (
          <ShareReportModal
            report={report}
            onClose={() => setIsShareModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
