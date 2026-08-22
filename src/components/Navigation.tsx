import { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Heart, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CribrUser } from "../lib/supabase";

interface NavigationProps {
  savedCount: number;
  onOpenSaved: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  currentUser: CribrUser | null;
  onOpenDashboard: () => void;
  onSignInClick: () => void;
}

export default function Navigation({
  savedCount,
  onOpenSaved,
  activeSection,
  onNavigate,
  currentUser,
  onOpenDashboard,
  onSignInClick,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "explorer", label: "Explore Projects" },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };


  return (
    <nav
      id="cribr-navigation"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? "py-3 glass-nav apple-shadow-lg scale-[0.99] rounded-b-2xl mt-0"
          : "py-6 bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Brand Logo & Badge */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleItemClick("hero")}>
          <div className="flex items-center space-x-1">
            <span className="font-display font-bold tracking-tight text-2xl text-apple-text-primary">
              CRIBR
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`text-[15px] font-medium tracking-tight transition-all duration-300 relative py-1 hover:text-apple-text-primary ${isActive ? "text-apple-text-primary" : "text-apple-text-secondary"
                  }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-apple-blue rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Saved Homes Button */}
          <button
            onClick={onOpenSaved}
            className="flex items-center space-x-2 px-4 py-2 rounded-full border border-neutral-200/80 bg-white/50 hover:bg-white text-apple-text-primary hover:scale-105 active:scale-95 transition-all duration-300 relative group"
          >
            <Heart className={`w-4 h-4 transition-colors duration-300 ${savedCount > 0 ? "fill-rose-500 text-rose-500" : "text-apple-text-secondary group-hover:text-rose-500"}`} />
            <span className="text-14 font-medium hidden sm:inline text-apple-text-secondary group-hover:text-apple-text-primary">Saved</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-apple-blue text-white text-[10px] font-mono font-bold rounded-full animate-pulse">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Portal Access / Trigger Button */}
          {currentUser ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-neutral-200/80 bg-neutral-50/50 hover:bg-white text-apple-text-primary hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-sm"
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  referrerPolicy="no-referrer"
                  className="w-5.5 h-5.5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5.5 h-5.5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-apple-blue text-[11px] font-bold">
                  {currentUser.fullName.charAt(0)}
                </div>
              )}
              <span className="text-[13px] font-semibold text-apple-text-secondary hover:text-apple-text-primary hidden sm:inline pr-1">
                Account
              </span>
            </button>
          ) : (
            <button
              onClick={onSignInClick}
              className="px-5 py-2 rounded-full bg-apple-blue hover:brightness-110 active:scale-[0.98] text-white text-[13.5px] font-semibold tracking-tight transition-all duration-300 shadow-sm"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full border border-neutral-200/80 bg-white/50 hover:bg-white text-apple-text-primary transition-all duration-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 w-full glass-panel text-apple-text-primary shadow-2xl py-6 px-8 flex flex-col space-y-4 border-b border-neutral-200"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="text-left py-2.5 text-lg font-medium border-b border-neutral-100 last:border-0 hover:text-apple-blue transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}

            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard();
                }}
                className="mt-4 w-full py-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-apple-text-primary text-center font-bold text-[15px] transition-all"
              >
                My Account Drawer
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignInClick();
                }}
                className="mt-4 w-full py-3.5 rounded-full bg-apple-blue text-white text-center font-bold text-[15px] transition-all"
              >
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
