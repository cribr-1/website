import { useState, useEffect } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Sparkles,
  MessageSquare,
  Send,
  Twitter,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PropertyReport } from "../types";

interface ShareReportModalProps {
  report: PropertyReport;
  onClose: () => void;
}

export default function ShareReportModal({ report, onClose }: ShareReportModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "summary">("link");

  // Generate dynamic shareable link using the current URL origin and the query parameter
  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}?q=${encodeURIComponent(report.propertyOrQueryName)}`
    : `https://cribr.ai/report/${report.propertyOrQueryName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  // Generate custom structured markdown/text summary tailored for messaging apps
  const emojiScore = report.overallScore >= 90 ? "🟢" : report.overallScore >= 80 ? "🔵" : "🟠";
  const shareSummaryText = `🏠 *CRIBR Property Verification Report*
📍 *Project:* ${report.propertyOrQueryName}
🏗️ *Builder:* ${report.builderName}
${emojiScore} *CRIBR Trust Score:* ${report.overallScore}/100 (${report.verdict})

🔑 *Key Parameters:*
• Developer Score: ${report.builderScore}/100
• Land Deed Clearances: ${report.legalScore}/100
• Construction Speed: ${report.constructionScore}/100
• Yield Projection Score: ${report.investmentYieldScore}/100

💡 *Quick Verdict:* ${report.summary.slice(0, 150)}...

🔍 View the comprehensive spatial intelligence audit here:
👉 ${shareUrl}`;

  const copyToClipboard = async (text: string, isLink: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isLink) {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const getMessagingShareUrl = (platform: "whatsapp" | "telegram" | "twitter") => {
    const textEncoded = encodeURIComponent(shareSummaryText);
    const urlEncoded = encodeURIComponent(shareUrl);
    
    switch (platform) {
      case "whatsapp":
        return `https://api.whatsapp.com/send?text=${textEncoded}`;
      case "telegram":
        return `https://t.me/share/url?url=${urlEncoded}&text=${encodeURIComponent(`Checkout CRIBR Property Verification for ${report.propertyOrQueryName}!`)}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Checked out ${report.propertyOrQueryName} on CRIBR. Verification Score: ${report.overallScore}/100. Know before you buy!`)}&url=${urlEncoded}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[36px] border border-neutral-200/60 shadow-2xl p-8 md:p-10 overflow-hidden"
      >
        {/* Subtle Accent Radial Gradient */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-100/30 rounded-full filter blur-[80px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-apple-blue font-mono text-[12px] uppercase font-bold tracking-widest">
              <Share2 className="w-4.5 h-4.5" />
              <span>Share Verification</span>
            </div>
            <h3 className="text-2xl font-display font-extrabold tracking-tight text-apple-text-primary">
              Propagate Report
            </h3>
            <p className="text-[13px] text-apple-text-secondary font-light">
              Distribute RERA, structural, and legal checklists for <strong className="font-semibold text-apple-text-primary">{report.propertyOrQueryName}</strong>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-neutral-100 hover:bg-neutral-50 flex items-center justify-center text-apple-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs switcher */}
        <div className="flex bg-neutral-100 p-1 rounded-full mb-6 relative z-10">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-full transition-all duration-300 ${
              activeTab === "link"
                ? "bg-white text-apple-text-primary shadow-sm"
                : "text-apple-text-secondary hover:text-apple-text-primary"
            }`}
          >
            Shareable Link
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex-1 py-2 text-[13px] font-semibold rounded-full transition-all duration-300 ${
              activeTab === "summary"
                ? "bg-white text-apple-text-primary shadow-sm"
                : "text-apple-text-secondary hover:text-apple-text-primary"
            }`}
          >
            Interactive Text Summary
          </button>
        </div>

        {/* Content based on tab */}
        <div className="space-y-6 relative z-10">
          {activeTab === "link" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-neutral-200/50 p-4 bg-neutral-50/50">
                <span className="text-[10px] font-mono uppercase tracking-widest text-apple-text-secondary font-bold block mb-1.5">
                  Unique Intelligent URL
                </span>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-mono text-apple-text-primary truncate select-all pr-2">
                    {shareUrl}
                  </span>
                  <button
                    onClick={() => copyToClipboard(shareUrl, true)}
                    className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-300 flex items-center space-x-1.5 ${
                      copiedLink
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-apple-blue text-white hover:brightness-115"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-[12px] text-apple-text-secondary font-light leading-relaxed">
                Anyone with this unique link can view this live verification report immediately. It automatically loads real-time RERA indices and neighborhood tranquility benchmarks.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl border border-neutral-200/50 bg-neutral-50/50 p-4 max-h-[180px] overflow-y-auto">
                <pre className="text-[11px] font-mono text-apple-text-secondary whitespace-pre-wrap leading-relaxed select-all">
                  {shareSummaryText}
                </pre>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => copyToClipboard(shareSummaryText, false)}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      copiedSummary
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-white text-apple-text-primary hover:border-neutral-300 border border-neutral-200"
                    }`}
                    title="Copy Summary"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-apple-text-secondary font-mono">
                  Markdown-formatted for rich messaging platforms.
                </span>
                <button
                  onClick={() => copyToClipboard(shareSummaryText, false)}
                  className="text-[12px] font-semibold text-apple-blue hover:underline flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy entire summary</span>
                </button>
              </div>
            </div>
          )}

          {/* Social Quick Launch Grid */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-apple-text-secondary font-extrabold block">
              3. Direct Messaging Broadcast
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <a
                href={getMessagingShareUrl("whatsapp")}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl border border-neutral-200/40 bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-all text-center flex flex-col items-center justify-center space-y-1.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100/40 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <span className="text-[12px] font-bold text-apple-text-primary">WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={getMessagingShareUrl("telegram")}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl border border-neutral-200/40 bg-white hover:bg-sky-50 hover:border-sky-200 transition-all text-center flex flex-col items-center justify-center space-y-1.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-100/40 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Send className="w-4.5 h-4.5 -rotate-12 translate-x-0.5" />
                </div>
                <span className="text-[12px] font-bold text-apple-text-primary">Telegram</span>
              </a>

              {/* Twitter / X */}
              <a
                href={getMessagingShareUrl("twitter")}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl border border-neutral-200/40 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all text-center flex flex-col items-center justify-center space-y-1.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter className="w-4.5 h-4.5 fill-current" />
                </div>
                <span className="text-[12px] font-bold text-apple-text-primary">Twitter / X</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-apple-text-primary text-[13px] font-semibold rounded-full transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
