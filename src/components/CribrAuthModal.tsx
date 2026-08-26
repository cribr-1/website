import React, { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cribrAuth, CribrUser } from "../lib/supabase";
import { showToast } from "./CribrToast";

interface CribrAuthModalProps {
  onClose: () => void;
  onSuccess: (user: CribrUser) => void;
}

export default function CribrAuthModal({ onClose, onSuccess }: CribrAuthModalProps) {
  // Authentication states
  const [step, setStep] = useState<"identifier" | "password" | "register">("identifier");
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAppleDevice, setIsAppleDevice] = useState(false);

  // Check if device is Apple for exclusive Apple login options
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      const isApple = ua.includes("iphone") || ua.includes("ipad") || ua.includes("macintosh");
      setIsAppleDevice(isApple);
    }
  }, []);

  // Back button handler
  const handleBack = () => {
    setError(null);
    if (step === "password" || step === "register") {
      setStep("identifier");
    }
  };

  // Step 1: Identifier check (Amazon style)
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your email or mobile number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cribrAuth.checkAccountExists(identifier);
      if (result.exists) {
        // Account exists, prompt for password
        setStep("password");
        // Pre-fill fields for a clean user state
        setIdentifier(result.email);
      } else {
        // New account, switch to registration
        setStep("register");
        if (identifier.includes("@")) {
          setPhone("");
        } else {
          setPhone(identifier);
          setIdentifier("");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected validation error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Sign In submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Please provide your account password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cribrAuth.signIn(identifier, password);
      if (result.success && result.user) {
        showToast(`Welcome back, ${result.user.fullName}!`, "success");
        onSuccess(result.user);
        onClose();
      } else {
        setError(result.error || "Incorrect password. Please verify and try again.");
      }
    } catch (err: any) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  // Sign Up / Register submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!identifier.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cribrAuth.signUp({
        fullName,
        email: identifier,
        phone,
        password
      });

      if (result.success && result.user) {
        showToast("Account created successfully!", "success");
        onSuccess(result.user);
        onClose();
      } else {
        setError(result.error || "Registration failed. Try again.");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // OAuth Trigger
  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(true);
    setError(null);
    try {
      const user = await cribrAuth.handleSocialLogin(provider);
      showToast(`Logged in successfully via ${provider === "google" ? "Google" : "Apple"}`, "success");
      onSuccess(user);
      onClose();
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md"
      />

      {/* Auth Box Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[440px] bg-white rounded-[24px] border border-neutral-200/50 shadow-2xl p-8 md:p-10 overflow-hidden text-apple-text-primary z-10"
      >
        {/* Apple Inspired Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full border border-neutral-100 hover:bg-neutral-50 flex items-center justify-center text-apple-text-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Back navigation button if in nested screens */}
        {step !== "identifier" && (
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 w-8 h-8 rounded-full border border-neutral-100 hover:bg-neutral-50 flex items-center justify-center text-apple-text-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {/* Brand Icon logo */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-apple-blue shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 flex items-start gap-2 text-[13px] leading-relaxed animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Switch states with clean animations */}
        <AnimatePresence mode="wait">
          {step === "identifier" && (
            <motion.div
              key="identifier-screen"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-display font-bold tracking-tight text-apple-text-primary">
                  Sign in to continue
                </h3>
                <p className="text-[14px] text-apple-text-secondary font-light max-w-[320px] mx-auto leading-relaxed">
                  Create your free Cribr account to save properties, book visits and unlock AI insights.
                </p>
              </div>

              <form onSubmit={handleIdentifierSubmit} className="space-y-4">
                <div>
                  <label className="text-[12px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block mb-2">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com or mobile"
                    className="w-full px-4 py-3.5 rounded-[16px] border border-neutral-200/80 bg-neutral-50/50 text-[15px] focus:outline-none focus:border-apple-blue focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-[16px] bg-apple-blue text-white text-[15px] font-semibold hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-neutral-100" />
                <span className="px-4 text-[11px] font-mono tracking-widest text-apple-text-secondary uppercase">
                  or
                </span>
                <div className="flex-grow border-t border-neutral-100" />
              </div>

              {/* Social Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => handleOAuth("google")}
                  className="w-full py-3.5 rounded-[16px] border border-neutral-200 hover:border-neutral-300 bg-white text-[14px] font-semibold text-apple-text-primary hover:bg-neutral-50 flex items-center justify-center space-x-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  disabled={loading}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.74 0 3.3.6 4.53 1.76l3.39-3.39C17.84 1.34 15.11.5 12 .5 7.37.5 3.39 3.16 1.48 7.06l3.96 3.07C6.4 7.3 9 .04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.84-.08-1.64-.21-2.42H12v4.61h6.46c-.28 1.46-1.11 2.69-2.35 3.52l3.66 2.84c2.14-1.97 3.72-4.88 3.72-8.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.44 14.87c-.24-.72-.38-1.5-.38-2.3c0-.8.14-1.58.38-2.3L1.48 7.2C.54 9.12 0 11.24 0 13.5c0 2.26.54 4.38 1.48 6.3l3.96-3.07v-.86z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.1.74-2.51 1.18-4.3 1.18-3 0-5.6-2.03-6.56-4.78L1.48 17.2c1.91 3.9 5.89 6.3 10.52 6.3z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Show Apple logo dynamically if checked */}
                {(isAppleDevice || true) && (
                  <button
                    onClick={() => handleOAuth("apple")}
                    className="w-full py-3.5 rounded-[16px] bg-neutral-900 hover:bg-black text-white text-[14px] font-semibold flex items-center justify-center space-x-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.52-.64.74-1.2 1.88-1.05 2.99 1.11.09 2.25-.56 2.92-1.45" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                )}
              </div>

              {/* Disclaimer */}
              <p className="mt-8 text-[11px] text-center text-apple-text-secondary leading-normal font-light">
                By continuing you agree to Cribr's <br />
                <a href="#terms" className="underline font-medium hover:text-apple-blue">Terms of Service</a> and <a href="#privacy" className="underline font-medium hover:text-apple-blue">Privacy Policy</a>.
              </p>
            </motion.div>
          )}

          {step === "password" && (
            <motion.div
              key="password-screen"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-display font-bold tracking-tight text-apple-text-primary">
                  Enter Password
                </h3>
                <p className="text-[14px] text-apple-text-secondary font-mono bg-neutral-50 px-3 py-1 rounded-full border border-neutral-100 inline-block">
                  {identifier}
                </p>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[12px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => showToast("Password reset stream sent to registered email.", "info")}
                      className="text-[12px] font-semibold text-apple-blue hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full px-4 py-3.5 rounded-[16px] border border-neutral-200/80 bg-neutral-50/50 text-[15px] focus:outline-none focus:border-apple-blue focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-[16px] bg-apple-blue text-white text-[15px] font-semibold hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === "register" && (
            <motion.div
              key="register-screen"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="max-h-[480px] overflow-y-auto pr-1"
            >
              <div className="text-center space-y-2 mb-6">
                <h3 className="text-2xl font-display font-bold tracking-tight text-apple-text-primary">
                  Create Account
                </h3>
                <p className="text-[13px] text-apple-text-secondary font-light">
                  Complete registration to book immediate site visits and unlock premium intelligence metrics.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aaryan Rajput"
                    className="w-full px-4 py-3 rounded-[16px] border border-neutral-200/80 bg-neutral-50/50 text-[14px] focus:outline-none focus:border-apple-blue focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-[16px] border border-neutral-200/80 bg-neutral-50/50 text-[14px] focus:outline-none focus:border-apple-blue focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-[16px] border border-neutral-200/80 bg-neutral-50/50 text-[14px] focus:outline-none focus:border-apple-blue focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block mb-1.5">
                    Password (6+ characters)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set account password"
                    className="w-full px-4 py-3 rounded-[16px] border border-neutral-200/80 bg-neutral-50/50 text-[14px] focus:outline-none focus:border-apple-blue focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1.5">
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-1 accent-apple-blue"
                  />
                  <label htmlFor="marketing" className="text-[12px] text-apple-text-secondary font-light leading-normal select-none">
                    Receive premium real estate briefings, capital appreciation updates, and exclusive inventory launches.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-[16px] bg-apple-blue text-white text-[14px] font-semibold hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Create Free Account</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
