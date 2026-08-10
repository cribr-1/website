import { useState, useEffect } from "react";
import {
  X,
  User,
  Calendar,
  Heart,
  Sparkles,
  ChevronRight,
  LogOut,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Trash2,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CribrUser, CribrBooking, cribrBookings, localDb } from "../lib/supabase";
import { PREMIUM_PROPERTIES } from "../data";
import { showToast } from "./CribrToast";

interface CribrDashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CribrUser;
  onSignOut: () => void;
  savedPropertyIds: string[];
  onRemoveSavedProperty: (propertyId: string) => void;
  onSelectPropertyToAnalyze: (propertyName: string) => void;
}

export default function CribrDashboardDrawer({
  isOpen,
  onClose,
  currentUser,
  onSignOut,
  savedPropertyIds,
  onRemoveSavedProperty,
  onSelectPropertyToAnalyze
}: CribrDashboardDrawerProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "saved" | "intelligence">("bookings");
  const [bookings, setBookings] = useState<CribrBooking[]>([]);
  const [loading, setLoading] = useState(false);

  // Load Bookings
  const loadBookings = async () => {
    setLoading(true);
    try {
      const list = await cribrBookings.getBookings();
      setBookings(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen]);

  // Cancel Booking handler
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const success = await cribrBookings.cancelBooking(bookingId);
      if (success) {
        showToast("Site visit has been cancelled.", "info");
        loadBookings();
      } else {
        throw new Error("Supabase operation was unsuccessful.");
      }
    } catch (e) {
      console.warn("Supabase cancel booking failed, using local DB cache fallback:", e);
      const list = localDb.getBookings();
      const updated = list.map((b) => b.id === bookingId ? { ...b, status: "cancelled" as const } : b);
      localDb.saveBookings(updated);
      setBookings(updated.filter((b) => b.userId === currentUser.id));
      showToast("Site visit has been cancelled.", "info");
    }
  };

  // Find saved property items
  const savedProperties = PREMIUM_PROPERTIES.filter((p) => savedPropertyIds.includes(p.id));

  // Compute metrics
  const totalBookings = bookings.filter((b) => b.status === "scheduled").length;
  const portfolioRating = savedProperties.length > 0 
    ? Math.round(savedProperties.reduce((acc, p) => acc + (p.score || 89), 0) / savedProperties.length)
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/20 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="h-full w-full bg-white border-l border-neutral-200/50 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Header section with User Profile */}
              <div className="p-6 md:p-8 border-b border-neutral-100 bg-neutral-50/50 relative">
                {/* Close Drawer button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full border border-neutral-200/40 hover:bg-white flex items-center justify-center text-apple-text-secondary transition-colors shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-4">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-md">
                      <User className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-apple-blue bg-blue-50 border border-blue-100/50 px-2 py-0.5 rounded-full inline-block mb-1">
                      Verified Member
                    </span>
                    <h3 className="text-lg font-display font-bold tracking-tight text-apple-text-primary leading-tight">
                      {currentUser.fullName}
                    </h3>
                    <p className="text-[12px] text-apple-text-secondary font-mono">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                {/* Account details and quick stats */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3 bg-white rounded-2xl border border-neutral-200/20 shadow-sm">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block">
                      Active Tour Visits
                    </span>
                    <span className="text-xl font-display font-bold text-apple-text-primary flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4 text-apple-blue" />
                      {totalBookings} Scheduled
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-neutral-200/20 shadow-sm">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block">
                      Portfolio trust index
                    </span>
                    <span className="text-xl font-display font-bold text-apple-text-primary flex items-center gap-1.5 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      {portfolioRating ? `${portfolioRating}%` : "No Saved"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 md:px-8 pt-4 flex gap-1.5 border-b border-neutral-100">
                {[
                  { id: "bookings", label: "My Visits", icon: Calendar },
                  { id: "saved", label: "Saved Estates", icon: Heart },
                  { id: "intelligence", label: "Profile Briefing", icon: User }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-3 px-3.5 text-[13px] font-semibold flex items-center space-x-1.5 border-b-2 transition-all ${
                        isActive
                          ? "border-apple-blue text-apple-blue font-bold"
                          : "border-transparent text-apple-text-secondary hover:text-apple-text-primary"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Content Panel area */}
              <div className="flex-grow p-6 md:p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === "bookings" && (
                    <motion.div
                      key="tab-bookings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-apple-text-secondary font-bold">
                          SITE VISIT BRIEFINGS
                        </span>
                        {loading && <div className="w-3 h-3 border-2 border-apple-blue border-t-transparent rounded-full animate-spin" />}
                      </div>

                      {bookings.length === 0 ? (
                        <div className="p-8 border border-dashed border-neutral-200 rounded-3xl text-center space-y-3 bg-neutral-50/20">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[13px] font-bold text-apple-text-primary">No Scheduled Site Visits</p>
                            <p className="text-[12px] text-apple-text-secondary font-light">Site visits you book from builder portals appear here with live updates.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {bookings.map((booking) => (
                            <div
                              key={booking.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                booking.status === "cancelled"
                                  ? "bg-neutral-50/50 border-neutral-100 opacity-60"
                                  : "bg-white border-neutral-200/80 apple-shadow hover:scale-[1.01]"
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                                    <span className="text-[13px] font-bold text-apple-text-primary truncate max-w-[180px]">
                                      {booking.propertyName}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-apple-text-secondary block font-light">
                                    by {booking.builderName}
                                  </span>
                                </div>
                                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                                  booking.status === "scheduled"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                                }`}>
                                  {booking.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-100 text-[12px] text-apple-text-secondary">
                                <div className="flex items-center space-x-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                                  <span className="truncate">{booking.visitDate.split(",")[1]?.trim() || booking.visitDate}</span>
                                </div>
                                <div className="flex items-center space-x-1.5 justify-end">
                                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                  <span className="capitalize">{booking.visitTime} slot</span>
                                </div>
                              </div>

                              {booking.status === "scheduled" && (
                                <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-neutral-100/60">
                                  <span className="text-[10px] font-mono text-apple-text-secondary">
                                    RERA ID: PRM-492-93
                                  </span>
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 hover:underline flex items-center space-x-1"
                                  >
                                    <span>Cancel Visit</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "saved" && (
                    <motion.div
                      key="tab-saved"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <span className="text-[11px] font-mono uppercase tracking-wider text-apple-text-secondary font-bold block">
                        SAVED PROPERTIES ({savedProperties.length})
                      </span>

                      {savedProperties.length === 0 ? (
                        <div className="p-8 border border-dashed border-neutral-200 rounded-3xl text-center space-y-3 bg-neutral-50/20">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto">
                            <Heart className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[13px] font-bold text-apple-text-primary">No Bookmarked Properties</p>
                            <p className="text-[12px] text-apple-text-secondary font-light">Properties you bookmark while browsing appear here for instant analysis.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {savedProperties.map((property) => (
                            <div
                              key={property.id}
                              className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex items-center justify-between gap-4 group hover:border-neutral-300 transition-all duration-300"
                            >
                              <div className="space-y-0.5 truncate flex-grow">
                                <div className="flex items-center space-x-1.5 truncate">
                                  <span className="text-[13px] font-bold text-apple-text-primary truncate">
                                    {property.name}
                                  </span>
                                </div>
                                <p className="text-[11px] text-apple-text-secondary truncate">
                                  {property.developer} • Module Vector
                                </p>
                              </div>

                              <div className="flex items-center space-x-1.5 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    onSelectPropertyToAnalyze(property.name);
                                    onClose();
                                  }}
                                  className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-[11px] font-semibold text-apple-blue flex items-center space-x-1"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Inspect</span>
                                </button>
                                <button
                                  onClick={() => onRemoveSavedProperty(property.id)}
                                  className="p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-neutral-400 hover:text-rose-600 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "intelligence" && (
                    <motion.div
                      key="tab-intelligence"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-5"
                    >
                      <span className="text-[11px] font-mono uppercase tracking-wider text-apple-text-secondary font-bold block">
                        COGNITIVE VERIFICATION PROFILE
                      </span>

                      <div className="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-200/40 space-y-4">
                        <div className="flex gap-3">
                          <User className="w-4 h-4 mt-1 text-apple-blue flex-shrink-0" />
                          <div>
                            <span className="text-[10px] font-mono text-apple-text-secondary uppercase block">Member Name</span>
                            <span className="text-[13px] font-bold text-apple-text-primary">{currentUser.fullName}</span>
                          </div>
                        </div>

                        <div className="flex gap-3 border-t border-neutral-100 pt-3">
                          <Phone className="w-4 h-4 mt-1 text-neutral-400 flex-shrink-0" />
                          <div>
                            <span className="text-[10px] font-mono text-apple-text-secondary uppercase block">Primary Contact</span>
                            <span className="text-[13px] font-semibold text-apple-text-primary">{currentUser.phone || "+91 98765 43210"}</span>
                          </div>
                        </div>

                        <div className="flex gap-3 border-t border-neutral-100 pt-3">
                          <ShieldCheck className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" />
                          <div>
                            <span className="text-[10px] font-mono text-apple-text-secondary uppercase block">CRIBR ID standing</span>
                            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded font-black">
                              VERIFIED_CLASS_A
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info warning */}
                      <div className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/20 text-indigo-800 text-[12.5px] leading-relaxed font-light">
                        Verified spatial intelligence coordinates your details securely. To edit credentials or unlink third-party credentials, reach out directly via support portals.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer action bar */}
              <div className="p-6 md:p-8 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
                <button
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="flex items-center space-x-2 text-[13px] font-bold text-rose-500 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Account</span>
                </button>

                <span className="text-[11px] font-mono text-apple-text-secondary">
                  v1.4.2 Core SDK
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
