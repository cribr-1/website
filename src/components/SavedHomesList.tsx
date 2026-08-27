import { useState, useEffect } from "react";
import { SavedHome } from "../types";
import { Trash2, Calendar, FileText, ChevronRight, X, Heart, Bell, BellOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import NotificationPreferencesModal from "./NotificationPreferencesModal";
import { cribrNotifications } from "../lib/supabase";

interface SavedHomesListProps {
  savedHomes: SavedHome[];
  onRemove: (id: string) => void;
  onLoadReport: (propertyName: string) => void;
  onClose: () => void;
}

export default function SavedHomesList({ savedHomes, onRemove, onLoadReport, onClose }: SavedHomesListProps) {
  const [selectedHomeForAlerts, setSelectedHomeForAlerts] = useState<SavedHome | null>(null);

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    if (score >= 80) return "bg-blue-50 text-blue-700 border-blue-200/80";
    return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/15 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md h-full bg-white/95 backdrop-blur-xl border-l border-neutral-200/50 shadow-2xl flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200/50 flex items-center justify-between bg-white/50">
          <div className="flex items-center space-x-2.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-display font-bold text-apple-text-primary">
              Saved Intelligence
            </h3>
            <span className="px-2 py-0.5 bg-neutral-100 text-apple-text-secondary text-[11px] font-mono rounded-full border border-neutral-200/40">
              {savedHomes.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-neutral-200/80 hover:bg-neutral-100 flex items-center justify-center text-apple-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Saved List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {savedHomes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
              <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-200/30 flex items-center justify-center text-neutral-400">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-display font-bold text-apple-text-primary">
                  Library is Empty
                </h4>
                <p className="text-[13px] text-apple-text-secondary font-light mt-1 max-w-[240px] leading-relaxed">
                  Save property reports, developer checks, or project matrices to store them securely.
                </p>
              </div>
            </div>
          ) : (
            savedHomes.map((home) => (
              <SavedHomeItem
                key={home.id}
                home={home}
                onRemove={onRemove}
                onLoadReport={onLoadReport}
                onClose={onClose}
                getScoreBg={getScoreBg}
                onConfigureAlerts={() => setSelectedHomeForAlerts(home)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200/50 bg-neutral-50/40 text-center">
          <p className="text-[11px] font-mono text-apple-text-secondary leading-normal">
            Securely synchronized offline via CRIBR Local Engine. Cloud Run encryption verified.
          </p>
        </div>
      </motion.div>

      {/* Inline Modal configuration for notifications */}
      <AnimatePresence>
        {selectedHomeForAlerts && (
          <NotificationPreferencesModal
            propertyName={selectedHomeForAlerts.propertyName}
            onClose={() => setSelectedHomeForAlerts(null)}
            onSubscribe={async (prefs) => {
              try {
                await cribrNotifications.savePreferences({
                  propertyName: selectedHomeForAlerts.propertyName,
                  reraProgress: prefs.reraProgress,
                  priceDrops: prefs.priceDrops,
                  legalUpdates: prefs.legalUpdates,
                  noiseFluctuation: prefs.noiseFluctuation,
                  emailEnabled: prefs.emailEnabled,
                  whatsappEnabled: prefs.whatsappEnabled
                });
              } catch (e) {
                console.warn("Supabase notification save error:", e);
              }
              const key = `cribr_sub_${selectedHomeForAlerts.propertyName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
              localStorage.setItem(key, JSON.stringify(prefs));
              // Dispatch artificial event to refresh items
              window.dispatchEvent(new Event("storage"));
              setSelectedHomeForAlerts(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface SavedHomeItemProps {
  key?: any;
  home: SavedHome;
  onRemove: (id: string) => void;
  onLoadReport: (name: string) => void;
  onClose: () => void;
  getScoreBg: (score: number) => string;
  onConfigureAlerts: () => void;
}

function SavedHomeItem({
  home,
  onRemove,
  onLoadReport,
  onClose,
  getScoreBg,
  onConfigureAlerts
}: SavedHomeItemProps) {
  const [hasSub, setHasSub] = useState(false);

  // Sync internal subscription indicator
  const checkSub = async () => {
    try {
      const prefs = await cribrNotifications.getPreferences(home.propertyName);
      setHasSub(
        prefs.reraProgress || prefs.priceDrops || prefs.legalUpdates || prefs.noiseFluctuation
      );
    } catch (e) {
      const key = `cribr_sub_${home.propertyName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setHasSub(
            parsed.reraProgress || parsed.priceDrops || parsed.legalUpdates || parsed.noiseFluctuation
          );
        } catch {
          setHasSub(false);
        }
      } else {
        setHasSub(false);
      }
    }
  };

  useEffect(() => {
    checkSub();
    window.addEventListener("storage", checkSub);
    return () => window.removeEventListener("storage", checkSub);
  }, [home.propertyName]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/30 hover:bg-white hover:border-neutral-200 hover:apple-shadow-lg transition-all duration-300 flex items-center justify-between space-x-3 relative overflow-hidden"
    >
      <div className="flex-grow min-w-0 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-apple-text-secondary leading-none uppercase tracking-wider">
            {home.city}
          </span>
          <span className="text-neutral-300 text-[10px]">•</span>
          <span className="text-[11px] font-mono text-apple-blue leading-none font-semibold">
            {home.developer}
          </span>
        </div>
        <h4
          onClick={() => {
            const slug = home.id || home.propertyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            window.history.pushState(null, "", `/property/${slug}`);
            window.dispatchEvent(new Event("popstate"));
            onClose();
          }}
          className="text-[15px] font-display font-bold text-apple-text-primary truncate cursor-pointer hover:text-apple-blue transition-colors duration-200"
        >
          {home.propertyName}
        </h4>
        <div className="flex items-center space-x-3.5 text-[11px] text-apple-text-secondary font-light">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Saved {new Date(home.savedAt).toLocaleDateString()}</span>
          </div>

          {/* Quick notification indicator */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfigureAlerts();
            }}
            className={`flex items-center space-x-1 font-mono text-[10px] font-bold uppercase transition-colors px-1.5 py-0.5 rounded ${
              hasSub
                ? "text-indigo-600 bg-indigo-50 border border-indigo-100"
                : "text-neutral-400 hover:text-apple-text-primary hover:bg-neutral-100"
            }`}
          >
            <Bell className={`w-3 h-3 ${hasSub ? "fill-indigo-500 animate-pulse" : ""}`} />
            <span>{hasSub ? "Subscribed" : "Notify"}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Score Indicator */}
        <div className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center font-mono font-bold text-[13px] ${getScoreBg(home.overallScore)}`}>
          {home.overallScore}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(home.id)}
          className="w-8 h-8 rounded-full border border-neutral-200/20 hover:border-rose-200 text-neutral-400 hover:text-rose-500 hover:bg-rose-50/30 flex items-center justify-center transition-all duration-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

