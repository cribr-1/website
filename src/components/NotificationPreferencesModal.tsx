import { useState, useEffect } from "react";
import {
  X,
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  DollarSign,
  FileCheck,
  Hammer,
  Volume2,
  Play,
  Check,
  Sparkles,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cribrNotifications } from "../lib/supabase";

interface NotificationPreferencesModalProps {
  propertyName: string;
  onClose: () => void;
  onSubscribe: (preferences: {
    reraProgress: boolean;
    priceDrops: boolean;
    legalUpdates: boolean;
    noiseFluctuation: boolean;
    emailEnabled: boolean;
    whatsappEnabled: boolean;
    email: string;
    phone: string;
  }) => void;
  initialPrefs?: {
    reraProgress: boolean;
    priceDrops: boolean;
    legalUpdates: boolean;
    noiseFluctuation: boolean;
    emailEnabled: boolean;
    whatsappEnabled: boolean;
    email: string;
    phone: string;
  };
}

export default function NotificationPreferencesModal({
  propertyName,
  onClose,
  onSubscribe,
  initialPrefs
}: NotificationPreferencesModalProps) {
  // Preferences State
  const [reraProgress, setReraProgress] = useState(initialPrefs?.reraProgress ?? true);
  const [priceDrops, setPriceDrops] = useState(initialPrefs?.priceDrops ?? true);
  const [legalUpdates, setLegalUpdates] = useState(initialPrefs?.legalUpdates ?? true);
  const [noiseFluctuation, setNoiseFluctuation] = useState(initialPrefs?.noiseFluctuation ?? false);
  
  const [emailEnabled, setEmailEnabled] = useState(initialPrefs?.emailEnabled ?? true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(initialPrefs?.whatsappEnabled ?? false);
  const [email, setEmail] = useState(initialPrefs?.email ?? "aaryanrajputofficial@gmail.com");
  const [phone, setPhone] = useState(initialPrefs?.phone ?? "+91 98765 43210");

  // Real database-driven sync
  useEffect(() => {
    const loadRealPrefs = async () => {
      try {
        const dbPrefs = await cribrNotifications.getPreferences(propertyName);
        if (dbPrefs) {
          setReraProgress(dbPrefs.reraProgress);
          setPriceDrops(dbPrefs.priceDrops);
          setLegalUpdates(dbPrefs.legalUpdates);
          setNoiseFluctuation(dbPrefs.noiseFluctuation);
          setEmailEnabled(dbPrefs.emailEnabled);
          setWhatsappEnabled(dbPrefs.whatsappEnabled);
        }
      } catch (err) {
        console.warn("Failed to load notifications from database", err);
      }
    };
    if (!initialPrefs) {
      loadRealPrefs();
    }
  }, [propertyName, initialPrefs]);

  const [isSaved, setIsSaved] = useState(false);
  const [showSimulatedToast, setShowSimulatedToast] = useState(false);
  const [simulatedAlertText, setSimulatedAlertText] = useState("");

  const handleSave = () => {
    onSubscribe({
      reraProgress,
      priceDrops,
      legalUpdates,
      noiseFluctuation,
      emailEnabled,
      whatsappEnabled,
      email,
      phone
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  // Simulate an instant alert to showcase real-time subscription flow
  const triggerSimulation = (type: "rera" | "price" | "noise" | "legal") => {
    let message = "";
    if (type === "rera") {
      message = `CRIBR Pulse Alert [RERA]: ${propertyName} RERA status changed to "Phase 3 Structure Certified". Delivery target matches 2027-Q4 precisely.`;
    } else if (type === "price") {
      message = `CRIBR Pulse Alert [PRICE DROP]: Standard price for 3 BHK inventory at ${propertyName} dropped by 2.4% due to festive builder cash-back release.`;
    } else if (type === "noise") {
      message = `CRIBR Pulse Alert [DECIBELS]: Ambient decibel ratings around ${propertyName} shifted from 72dB to 61dB due to new municipal green-acoustic routing.`;
    } else {
      message = `CRIBR Pulse Alert [LEGAL]: Land registry clearances for ${propertyName} verified clean. Registrar A-Khata deeds synchronized.`;
    }

    setSimulatedAlertText(message);
    setShowSimulatedToast(true);
  };

  useEffect(() => {
    if (showSimulatedToast) {
      const timer = setTimeout(() => {
        setShowSimulatedToast(false);
      }, 6500);
      return () => clearTimeout(timer);
    }
  }, [showSimulatedToast]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
      />

      {/* Preferences Panel */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[36px] border border-neutral-200/50 shadow-2xl p-8 md:p-10 overflow-hidden"
      >
        {/* Apple Style Accent Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100/30 rounded-full filter blur-[60px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-apple-blue">
              <Bell className="w-5 h-5 animate-pulse" />
              <span className="text-[12px] font-mono tracking-widest uppercase font-bold">
                CRIBR Pulse Alerts
              </span>
            </div>
            <h3 className="text-2xl font-display font-extrabold tracking-tight text-apple-text-primary">
              Subscribe to Updates
            </h3>
            <p className="text-[13px] text-apple-text-secondary font-light">
              Configure real-time monitoring streams for <strong className="font-semibold text-apple-text-primary">{propertyName}</strong>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-neutral-100 hover:bg-neutral-50 flex items-center justify-center text-apple-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form preferences list */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-apple-text-secondary font-bold">
              1. Choose Status Streams
            </h4>
            
            {/* Stream List */}
            <div className="space-y-2.5">
              {/* Toggle 1: RERA Progress */}
              <div
                onClick={() => setReraProgress(!reraProgress)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  reraProgress
                    ? "bg-blue-50/20 border-blue-200/60 shadow-sm"
                    : "bg-neutral-50/50 border-neutral-200/30 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center space-x-3.5 pr-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${reraProgress ? "bg-blue-100/50 text-blue-600" : "bg-neutral-100 text-neutral-500"}`}>
                    <FileCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-apple-text-primary leading-tight">RERA Progression</h5>
                    <p className="text-[11px] text-apple-text-secondary font-light mt-0.5 leading-snug">RERA certificate extensions, litigation updates, delay filings.</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex-shrink-0 ${reraProgress ? "bg-apple-blue" : "bg-neutral-200"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${reraProgress ? "translate-x-5" : ""}`} />
                </div>
              </div>

              {/* Toggle 2: Price Drops */}
              <div
                onClick={() => setPriceDrops(!priceDrops)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  priceDrops
                    ? "bg-blue-50/20 border-blue-200/60 shadow-sm"
                    : "bg-neutral-50/50 border-neutral-200/30 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center space-x-3.5 pr-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${priceDrops ? "bg-blue-100/50 text-blue-600" : "bg-neutral-100 text-neutral-500"}`}>
                    <DollarSign className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-apple-text-primary leading-tight">Price Fluctuations</h5>
                    <p className="text-[11px] text-apple-text-secondary font-light mt-0.5 leading-snug">Notify if builder updates inventories or discounts shift &gt; 2%.</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex-shrink-0 ${priceDrops ? "bg-apple-blue" : "bg-neutral-200"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${priceDrops ? "translate-x-5" : ""}`} />
                </div>
              </div>

              {/* Toggle 3: Construction updates */}
              <div
                onClick={() => setLegalUpdates(!legalUpdates)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  legalUpdates
                    ? "bg-blue-50/20 border-blue-200/60 shadow-sm"
                    : "bg-neutral-50/50 border-neutral-200/30 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center space-x-3.5 pr-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${legalUpdates ? "bg-blue-100/50 text-blue-600" : "bg-neutral-100 text-neutral-500"}`}>
                    <Hammer className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-apple-text-primary leading-tight">Construction Milestones</h5>
                    <p className="text-[11px] text-apple-text-secondary font-light mt-0.5 leading-snug">Updates on active slab-casting verified via satellite.</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex-shrink-0 ${legalUpdates ? "bg-apple-blue" : "bg-neutral-200"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${legalUpdates ? "translate-x-5" : ""}`} />
                </div>
              </div>

              {/* Toggle 4: Noise levels */}
              <div
                onClick={() => setNoiseFluctuation(!noiseFluctuation)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                  noiseFluctuation
                    ? "bg-blue-50/20 border-blue-200/60 shadow-sm"
                    : "bg-neutral-50/50 border-neutral-200/30 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center space-x-3.5 pr-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${noiseFluctuation ? "bg-blue-100/50 text-blue-600" : "bg-neutral-100 text-neutral-500"}`}>
                    <Volume2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-apple-text-primary leading-tight">Decibel Vibe Monitor</h5>
                    <p className="text-[11px] text-apple-text-secondary font-light mt-0.5 leading-snug">Tranquility shifts, traffic decibels, green cover revisions.</p>
                  </div>
                </div>
                <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex-shrink-0 ${noiseFluctuation ? "bg-apple-blue" : "bg-neutral-200"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${noiseFluctuation ? "translate-x-5" : ""}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-apple-text-secondary font-bold">
              2. Delivery Channels
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email channel */}
              <div
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  emailEnabled
                    ? "bg-neutral-50 border-neutral-300"
                    : "bg-white border-neutral-100 hover:border-neutral-200"
                }`}
              >
                <div className="flex items-center space-x-2 pb-2">
                  <input
                    type="checkbox"
                    id="email-toggle"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="rounded border-neutral-300 text-apple-blue focus:ring-apple-blue w-4 h-4"
                  />
                  <label htmlFor="email-toggle" className="text-[12px] font-bold text-apple-text-primary flex items-center space-x-1 cursor-pointer">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Email Delivery</span>
                  </label>
                </div>
                {emailEnabled && (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full text-[11px] text-apple-text-primary bg-white border border-neutral-200 px-2.5 py-1.5 rounded-lg focus:outline-none"
                  />
                )}
              </div>

              {/* WhatsApp channel */}
              <div
                className={`p-3 rounded-xl border flex flex-col justify-between ${
                  whatsappEnabled
                    ? "bg-neutral-50 border-neutral-300"
                    : "bg-white border-neutral-100 hover:border-neutral-200"
                }`}
              >
                <div className="flex items-center space-x-2 pb-2">
                  <input
                    type="checkbox"
                    id="whatsapp-toggle"
                    checked={whatsappEnabled}
                    onChange={(e) => setWhatsappEnabled(e.target.checked)}
                    className="rounded border-neutral-300 text-apple-blue focus:ring-apple-blue w-4 h-4"
                  />
                  <label htmlFor="whatsapp-toggle" className="text-[12px] font-bold text-apple-text-primary flex items-center space-x-1 cursor-pointer">
                    <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>WhatsApp Delivery</span>
                  </label>
                </div>
                {whatsappEnabled && (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full text-[11px] text-apple-text-primary bg-white border border-neutral-200 px-2.5 py-1.5 rounded-lg focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* SIMULATION BENCHMARK SECTION */}
          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/30">
            <div className="flex items-center justify-between pb-2.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-600 font-black flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Instant Sandbox Simulator</span>
              </span>
              <span className="text-[10px] text-indigo-500 font-mono font-medium">Verify channels</span>
            </div>
            <p className="text-[11px] text-indigo-950 font-light leading-normal mb-3.5">
              Click any stream below to broadcast a verified test notification instantly onto your screen:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => triggerSimulation("rera")}
                className="px-2.5 py-1.5 bg-white border border-indigo-200/50 hover:bg-indigo-50 text-[11px] font-mono rounded-lg text-indigo-700 flex items-center space-x-1 transition-all"
              >
                <Play className="w-2.5 h-2.5 fill-indigo-600 text-indigo-600" />
                <span>RERA Progress</span>
              </button>
              <button
                type="button"
                onClick={() => triggerSimulation("price")}
                className="px-2.5 py-1.5 bg-white border border-indigo-200/50 hover:bg-indigo-50 text-[11px] font-mono rounded-lg text-indigo-700 flex items-center space-x-1 transition-all"
              >
                <Play className="w-2.5 h-2.5 fill-indigo-600 text-indigo-600" />
                <span>Price Fluctuation</span>
              </button>
              <button
                type="button"
                onClick={() => triggerSimulation("legal")}
                className="px-2.5 py-1.5 bg-white border border-indigo-200/50 hover:bg-indigo-50 text-[11px] font-mono rounded-lg text-indigo-700 flex items-center space-x-1 transition-all"
              >
                <Play className="w-2.5 h-2.5 fill-indigo-600 text-indigo-600" />
                <span>Clean Titles</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 flex items-center space-x-3 pt-4 border-t border-neutral-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-neutral-200 hover:bg-neutral-50 text-apple-text-primary text-[14px] font-medium rounded-full transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className="flex-1 py-3 bg-apple-blue hover:brightness-110 text-white text-[14px] font-medium rounded-full transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Subscription Active</span>
              </>
            ) : (
              <span>Confirm Subscription</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Floating Dynamic Simulated Pulse Alert Toast */}
      <AnimatePresence>
        {showSimulatedToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel-dark text-white rounded-2xl p-4.5 shadow-2xl z-[200] border border-white/10 flex items-start space-x-3"
          >
            <div className="w-9 h-9 rounded-full bg-apple-blue/20 text-apple-blue flex items-center justify-center flex-shrink-0 animate-bounce">
              <Bell className="w-4.5 h-4.5 text-blue-400 fill-blue-400" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">CRIBR PULSE</span>
                <span className="text-[9px] font-mono text-white/40">Just now</span>
              </div>
              <p className="text-[12px] font-light text-white/90 leading-relaxed mt-1">{simulatedAlertText}</p>
            </div>
            <button
              onClick={() => setShowSimulatedToast(false)}
              className="text-white/40 hover:text-white/90"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
