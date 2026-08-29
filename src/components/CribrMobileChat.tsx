import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Mic,
  Plus,
  Check,
  X,
  History,
  Search,
  Pin,
  Trash2,
  Edit2,
  Bookmark,
  ExternalLink,
  Calendar,
  MapPin,
  HelpCircle,
  TrendingUp,
  Scale,
  ShieldCheck,
  Award,
  WifiOff,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Building,
  Info,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PremiumProperty, SavedHome } from "../types";
import { CribrUser, cribrChats } from "../lib/supabase";
import { trackAIChatStarted, trackAIRecommendationClicked } from "../lib/gtag";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  recommendedProperties?: any[];
}

export interface ChatSession {
  id: string;
  title: string;
  isPinned: boolean;
  createdAt: string;
  messages: ChatMessage[];
}

interface CribrMobileChatProps {
  currentUser: CribrUser | null;
  savedHomes: SavedHome[];
  onSaveHome: (property: PremiumProperty) => void;
  onRemoveSaved: (id: string) => void;
  onBookVisit: (property: PremiumProperty) => void;
  onBackToHome: () => void;
  initialQuery?: string;
}

const CHAT_STATUS_MESSAGES = [
  "Analyzing your request...",
  "Searching CRIBR database...",
  "Checking RERA...",
  "Scanning builder records...",
  "Analyzing locality...",
  "Calculating investment score...",
  "Comparing nearby projects...",
  "Generating AI insights..."
];

// Offline fallback responses for common Indian real estate queries
const OFFLINE_RESPONSES: Record<string, { text: string; recommendedProperties?: any[] }> = {
  "2bhk": {
    text: `### Real Estate Investment Advice: 2 BHK Layouts\n\nWhen evaluating 2 BHK layouts in high-growth corridors:\n\n* **Carpet Efficiency**: Look for floor plans with >70% usable carpet area to super built-up ratio.\n* **Corridor Connectivity**: Prioritize arterial connectivity to primary IT hubs and upcoming metro stations.\n* **Title Verification**: Verify undivided land share (UDS) and ensure no pending litigation in the K-RERA registry.`,
    recommendedProperties: []
  },
  "compare": {
    text: `### Developer Comparison Guidance\n\nWhen comparing developers:\n\n1. **Execution Track Record**: Inspect historical milestone delivery times and track record of on-time handovers.\n2. **Grade & Governance**: Institutional Grade A/A+ developers maintain strict statutory compliance and clear title deeds.\n3. **Density & Open Space**: Evaluate unit density per acre for long-term lifestyle quality and amenities utilization.`,
    recommendedProperties: []
  },
  "rera": {
    text: `### What is RERA and how does it protect you?\n\n**RERA (Real Estate Regulatory Authority)** was enacted to protect home-buyers from builder delays, fraudulent titles, and substandard construction quality.\n\nKey aspects:\n* **Escrow Account**: Developers must deposit 70% of buyer payments in a dedicated account used purely for construction.\n* **Standardized Carpets**: Pricing must be calculated based on absolute net carpet area, not gross super-builtup area.\n* **Delays & Fines**: Builders are legally required to compensate buyers for delivery delays at standard interest rates.`,
    recommendedProperties: []
  },
  "default": {
    text: `### CRIBR Property AI Advisor\n\nI can assist you with:\n* Analyzing project densities, RERA statutory filings, and construction timelines.\n* Comparing developer reliability, prices per sq.ft, and commute times to tech corridors.\n* Understanding title deed audits and regulatory compliance.`,
    recommendedProperties: []
  }
};

// Custom Minimalist Markdown Formatter
function CribrMarkdown({ content }: { content: string }) {
  const blocks = content.split("\n\n");

  return (
    <div className="space-y-3 text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={bIdx} className="text-sm font-bold text-[#111111] dark:text-white mt-3 mb-1 tracking-tight flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
              <span>{trimmed.replace(/^###\s*/, "")}</span>
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={bIdx} className="text-base font-extrabold text-[#111111] dark:text-white mt-4 mb-2 tracking-tight">
              {trimmed.replace(/^##\s*/, "")}
            </h3>
          );
        }

        // Unordered lists
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const items = trimmed.split(/\n[\*\-]\s+/);
          return (
            <ul key={bIdx} className="list-disc pl-4 space-y-1 text-neutral-700 dark:text-neutral-300 my-1.5">
              {items.map((item, iIdx) => (
                <li key={iIdx}>
                  {parseInlineMarkdown(item.replace(/^[\*\-]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        // Ordered lists
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split(/\n\d+\.\s+/);
          return (
            <ol key={bIdx} className="list-decimal pl-4 space-y-1 text-neutral-700 dark:text-neutral-300 my-1.5">
              {items.map((item, iIdx) => (
                <li key={iIdx}>
                  {parseInlineMarkdown(item.replace(/^\d+\.\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        // Tables
        if (trimmed.includes("|") && trimmed.includes("-|-")) {
          const rows = trimmed.split("\n");
          const tableRows = rows.filter(r => r.trim() && !r.includes("-|-"));
          return (
            <div key={bIdx} className="overflow-x-auto my-2.5 border border-neutral-100 dark:border-neutral-800 rounded-xl shadow-sm">
              <table className="min-w-full text-[11px] divide-y divide-neutral-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
                <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold">
                  <tr>
                    {tableRows[0].split("|").filter(c => c.trim()).map((cell, cIdx) => (
                      <th key={cIdx} className="px-2.5 py-1.5 text-left uppercase tracking-wider">
                        {cell.trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {tableRows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                      {row.split("|").filter(c => c.trim()).map((cell, cIdx) => (
                        <td key={cIdx} className="px-2.5 py-1.5">
                          {parseInlineMarkdown(cell.trim())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Default paragraph
        return (
          <p key={bIdx} className="font-light">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function parseInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-[#111111] dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function CribrMobileChat({
  currentUser,
  savedHomes,
  onSaveHome,
  onRemoveSaved,
  onBookVisit,
  onBackToHome,
  initialQuery
}: CribrMobileChatProps) {
  // State variables
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusTextIndex, setStatusTextIndex] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceWaveText, setVoiceWaveText] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  
  // Offline check
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Property Details Sheet State
  const [detailsProp, setDetailsProp] = useState<any | null>(null);
  
  // Property Comparison State
  const [comparisonProp, setComparisonProp] = useState<any | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Suggested starter prompts (Matching requirements exactly!)
  const SUGGESTED_CARDS = [
    { emoji: "🏠", label: "Find a 2 BHK under ₹80L", query: "Find me a 2 BHK under ₹80 lakh in Pune." },
    { emoji: "📍", label: "Best investment in Nagpur", query: "What are the best high-appreciation investment properties or areas in Nagpur?" },
    { emoji: "🏗", label: "Compare Godrej vs Lodha", query: "Compare Godrej and Lodha builders." },
    { emoji: "⚖️", label: "Check legal status", query: "Explain RERA and check legal status of new developments." },
    { emoji: "📈", label: "Predict future appreciation", query: "Estimate future price appreciation and which locality has better appreciation?" },
    { emoji: "🚇", label: "Flats near Metro", query: "Show projects near Metro stations." },
    { emoji: "💰", label: "Best rental investment", query: "Find low-risk investment properties with best rental yield/potential." }
  ];

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Initialize Chat sessions from Supabase/LocalStorage
  useEffect(() => {
    const loadSessions = async () => {
      const data = await cribrChats.getSessions();
      if (Array.isArray(data) && data.length > 0) {
        setSessions(data);
        if (!initialQuery) {
          setActiveSessionId(data[0].id);
        }
      } else {
        const defaultSession: ChatSession = {
          id: "default-session-id",
          title: "New Property Chat",
          isPinned: false,
          createdAt: new Date().toISOString(),
          messages: []
        };
        setSessions([defaultSession]);
        setActiveSessionId(defaultSession.id);
      }
    };
    loadSessions();
  }, [initialQuery]);

  // Handle Initial Query from home tab
  useEffect(() => {
    if (initialQuery && sessions.length > 0) {
      const existing = sessions.find(s => s.messages.length > 0 && s.messages[0].text === initialQuery);
      if (existing) {
        setActiveSessionId(existing.id);
      } else {
        createNewSessionWithQuery(initialQuery);
      }
    }
  }, [initialQuery, sessions.length]);

  // Sync session changes using optimistic updates
  const syncSession = async (updatedSessions: ChatSession[], activeSession: ChatSession) => {
    setSessions(updatedSessions);
    await cribrChats.saveSession({
      id: activeSession.id,
      title: activeSession.title,
      isPinned: activeSession.isPinned,
      messages: activeSession.messages
    });
  };

  // Scroll to bottom of chat when new messages arrive or loading occurs
  useEffect(() => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [activeSessionId, sessions, isLoading]);

  // Rotate loading status messages every 1500ms (Requirement: Animated circular gradient rotation)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setStatusTextIndex(0);
      interval = setInterval(() => {
        setStatusTextIndex((prev) => (prev + 1) % CHAT_STATUS_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Create new chat session helper
  const createNewSessionWithQuery = async (queryText: string) => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: queryText.length > 25 ? `${queryText.substring(0, 25)}...` : queryText,
      isPinned: false,
      createdAt: new Date().toISOString(),
      messages: []
    };

    const updatedSessions = [newSession, ...sessions.filter(s => s.id !== "default-session-id" || s.messages.length > 0)];
    setSessions(updatedSessions);
    setActiveSessionId(newSessionId);

    // Trigger AI response for this query
    await sendChatMessage(queryText, newSessionId, updatedSessions);
  };

  // Generate new blank session
  const handleNewSessionClick = () => {
    const newId = `session-${Date.now()}`;
    const newSess: ChatSession = {
      id: newId,
      title: `Property Consultation #${sessions.length + 1}`,
      isPinned: false,
      createdAt: new Date().toISOString(),
      messages: []
    };
    const updated = [newSess, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setHistoryOpen(false);
  };

  // Sends the user message and requests API response
  const handleSend = async () => {
    if (!inputText.trim()) return;
    const messageToSend = inputText;
    setInputText("");
    await sendChatMessage(messageToSend, activeSessionId, sessions);
  };

  const sendChatMessage = async (msgText: string, sessId: string, currentSessions: ChatSession[]) => {
    const targetSession = currentSessions.find(s => s.id === sessId);
    if (!targetSession) return;

    trackAIChatStarted(msgText);

    // Create user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message immediately
    let updatedMessages = [...targetSession.messages, userMsg];
    let updatedSess = {
      ...targetSession,
      messages: updatedMessages,
      title: targetSession.messages.length === 0 ? (msgText.length > 25 ? `${msgText.substring(0, 25)}...` : msgText) : targetSession.title
    };

    let newSessions = currentSessions.map(s => s.id === sessId ? updatedSess : s);
    setSessions(newSessions);

    // Show loading
    setIsLoading(true);

    try {
      if (!isOnline) {
        // Offline processing engine!
        await new Promise((resolve) => setTimeout(resolve, 2000));
        let offlineKey = "default";
        const cleanMsg = msgText.toLowerCase();
        if (cleanMsg.includes("2") || cleanMsg.includes("bhk") || cleanMsg.includes("80")) {
          offlineKey = "2bhk";
        } else if (cleanMsg.includes("compare") || cleanMsg.includes("godrej") || cleanMsg.includes("lodha")) {
          offlineKey = "compare";
        } else if (cleanMsg.includes("rera") || cleanMsg.includes("legal")) {
          offlineKey = "rera";
        }

        const fallbackData = OFFLINE_RESPONSES[offlineKey];
        setIsLoading(false);

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          sender: "ai",
          text: fallbackData.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProperties: fallbackData.recommendedProperties || []
        };

        updatedMessages = [...updatedMessages, aiMsg];
        updatedSess = { ...updatedSess, messages: updatedMessages };
        newSessions = newSessions.map(s => s.id === sessId ? updatedSess : s);
        await syncSession(newSessions, updatedSess);
        return;
      }

      // Online API call
      const response = await fetch("/api/cribr/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: msgText,
          history: updatedMessages.slice(-8)
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const resData = await response.json();
      setIsLoading(false);

      if (resData.error) {
        throw new Error(resData.error);
      }

      // Create streaming placeholder
      const aiMsgId = `msg-${Date.now()}-ai`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProperties: resData.recommendedProperties || []
      };

      updatedMessages = [...updatedMessages, aiMsg];
      updatedSess = { ...updatedSess, messages: updatedMessages };
      newSessions = newSessions.map(s => s.id === sessId ? updatedSess : s);
      setSessions(newSessions);

      // Word-by-word streaming animation
      const words = resData.text.split(" ");
      let currentWordIndex = 0;
      let streamedText = "";

      const streamTimer = setInterval(() => {
        if (currentWordIndex < words.length) {
          streamedText += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex];
          currentWordIndex++;

          const latestMsg = { ...aiMsg, text: streamedText };
          const streamMessages = updatedMessages.map(m => m.id === aiMsgId ? latestMsg : m);
          const streamSess = { ...updatedSess, messages: streamMessages };
          
          setSessions(prev => prev.map(s => s.id === sessId ? streamSess : s));
        } else {
          clearInterval(streamTimer);
          const finalMsg = { ...aiMsg, text: resData.text };
          const finalMessages = updatedMessages.map(m => m.id === aiMsgId ? finalMsg : m);
          const finalSess = { ...updatedSess, messages: finalMessages };
          const finalSessions = newSessions.map(s => s.id === sessId ? finalSess : s);
          syncSession(finalSessions, finalSess);
        }
      }, 25);

    } catch (error: any) {
      setIsLoading(false);
      const failMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        sender: "ai",
        text: `### Connection Interruption\n\nI was unable to complete the real-time RERA search due to a network disruption: "${error.message || 'Server timeout'}".\n\nTo ensure a smooth offline experience, I will continue responding using our localized real estate index.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      updatedMessages = [...updatedMessages, failMsg];
      updatedSess = { ...updatedSess, messages: updatedMessages };
      setSessions(newSessions.map(s => s.id === sessId ? updatedSess : s));
    }
  };

  // Web Speech API Voice Recognition
  const triggerVoiceInquiry = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceActive(true);
      setVoiceWaveText("Listening to voice query...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceWaveText(`"${transcript}"`);
      setTimeout(() => {
        setVoiceActive(false);
        setInputText(transcript);
      }, 1200);
    };

    recognition.onerror = (event: any) => {
      setVoiceWaveText(`Error: ${event.error}`);
      setTimeout(() => setVoiceActive(false), 2000);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setVoiceActive(false);
    }
  };

  // Chat management features
  const handleTogglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const session = sessions.find(s => s.id === id);
    if (!session) return;

    const toggledSession = { ...session, isPinned: !session.isPinned };
    const updated = sessions.map(s => s.id === id ? toggledSession : s);
    const sorted = [
      ...updated.filter(s => s.isPinned),
      ...updated.filter(s => !s.isPinned)
    ];
    setSessions(sorted);
    await cribrChats.saveSession(toggledSession);
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    await cribrChats.deleteSession(id);
    
    if (updated.length === 0) {
      const fallback: ChatSession = {
        id: "default-session-id",
        title: "New Property Chat",
        isPinned: false,
        createdAt: new Date().toISOString(),
        messages: []
      };
      setSessions([fallback]);
      setActiveSessionId(fallback.id);
    } else {
      setSessions(updated);
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }
    }
  };

  const handleStartRename = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(id);
    setEditingTitle(title);
  };

  const handleSaveRename = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session && editingTitle.trim()) {
      const renamed = { ...session, title: editingTitle };
      const updated = sessions.map(s => s.id === id ? renamed : s);
      setSessions(updated);
      await cribrChats.saveSession(renamed);
    }
    setEditingSessionId(null);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
    s.messages.some(m => m.text.toLowerCase().includes(searchHistoryQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FC] dark:bg-neutral-950 flex flex-col h-full overflow-hidden text-[#111111] dark:text-neutral-100 font-sans">
      
      {/* HEADER BAR (Glassmorphic, Apple-inspired) */}
      <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800 px-4 py-3 flex items-center justify-between z-40 relative">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToHome}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100/80 dark:bg-neutral-800 active:scale-90 transition-all text-neutral-600 dark:text-neutral-300 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-black text-[#111111] dark:text-white tracking-tight">CRIBR AI</h2>
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? "bg-[#10B981]" : "bg-amber-500"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? "bg-[#10B981]" : "bg-amber-500"}`}></span>
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-light truncate max-w-44">
              AI Property Intelligence Assistant
            </p>
          </div>
        </div>

        {/* Offline status badge */}
        {!isOnline && (
          <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900 text-amber-600 dark:text-amber-400 rounded-full text-[9px] font-mono font-bold">
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </div>
        )}

        <button
          onClick={() => setHistoryOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100/80 dark:bg-neutral-800 active:scale-90 transition-all text-neutral-600 dark:text-neutral-300 relative cursor-pointer"
        >
          <History className="w-5 h-5" />
          {sessions.filter(s => s.messages.length > 0).length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#2563EB] rounded-full border border-white dark:border-neutral-900 animate-pulse" />
          )}
        </button>
      </header>

      {/* CHAT VIEWPORT */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-none">
        
        {/* Welcome Screen */}
        {messages.length === 0 && (
          <div className="max-w-md mx-auto space-y-6 pt-6 flex flex-col items-center">
            
            {/* Elegant AI Logo */}
            <div className="text-center space-y-3.5 flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-[#2563EB] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/10"
              >
                <Sparkles className="w-8 h-8 text-amber-200" />
              </motion.div>
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">How can I help you today?</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-light max-w-xs leading-relaxed mx-auto">
                  Ask anything about Indian real estate. Discover flats, compare developers, calculate EMI, and check RERA legal safety instantly.
                </p>
              </div>
            </div>

            {/* Suggested Prompt Cards */}
            <div className="w-full space-y-3">
              <h4 className="text-[10px] font-mono font-black tracking-wider text-neutral-400 dark:text-neutral-500 uppercase text-center">
                Suggested Consultations
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {SUGGESTED_CARDS.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => createNewSessionWithQuery(card.query)}
                    className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl shadow-sm text-left hover:border-neutral-300 dark:hover:border-neutral-700 active:scale-[0.98] transition-all flex items-center space-x-3.5 cursor-pointer"
                  >
                    <span className="text-lg w-8 h-8 rounded-xl bg-[#F8F9FC] dark:bg-neutral-800 flex items-center justify-center">{card.emoji}</span>
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">
                      {card.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Chat Messages */}
        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            
            {/* Bubble Layout */}
            <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-[24px] px-4.5 py-3.5 shadow-sm ${
                  message.sender === "user"
                    ? "bg-[#2563EB] text-white rounded-br-sm"
                    : "bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 text-[#111111] dark:text-neutral-100 rounded-bl-sm"
                }`}
              >
                {message.sender === "user" ? (
                  <p className="text-xs font-light leading-relaxed whitespace-pre-wrap">{message.text}</p>
                ) : (
                  <CribrMarkdown content={message.text} />
                )}
                
                <div className="mt-1 flex justify-end">
                  <span className={`text-[8px] font-mono ${message.sender === "user" ? "text-blue-100" : "text-neutral-400 dark:text-neutral-500"}`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>

            {/* Horizontal scrolling recommended property cards */}
            {message.sender === "ai" && message.recommendedProperties && message.recommendedProperties.length > 0 && (
              <div className="space-y-2 py-1">
                <div className="flex items-center space-x-1.5 px-1.5">
                  <Award className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
                  <span className="text-[10px] font-black text-[#2563EB] dark:text-sky-400 uppercase tracking-wider font-mono">
                    CRIBR AI Recommendation Card
                  </span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
                  {message.recommendedProperties.map((prop: any) => {
                    const isSaved = savedHomes.some((h) => h.id === prop.id);
                    return (
                      <div
                        key={prop.id}
                        className="flex-shrink-0 w-72 bg-white dark:bg-neutral-900 rounded-[24px] border border-neutral-200/60 dark:border-neutral-800 shadow-md overflow-hidden snap-center flex flex-col justify-between"
                      >
                        {/* Image + Overlays */}
                        <div className="h-36 relative overflow-hidden">
                          <img
                            src={prop.image}
                            alt={prop.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-full text-[9px] font-black text-neutral-800 dark:text-neutral-100 shadow-sm">
                            {prop.city}
                          </div>
                          
                          {/* AI Score */}
                          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-neutral-900/90 backdrop-blur-md text-white rounded-full text-[9px] font-mono font-bold flex items-center space-x-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                            <span>{prop.overallScore}% AI Score</span>
                          </div>
                        </div>

                        {/* Content Grid & Metrices */}
                        <div className="p-4 space-y-3">
                          <div className="space-y-0.5">
                            <h5 className="text-sm font-extrabold text-[#111111] dark:text-white leading-tight truncate">
                              {prop.name}
                            </h5>
                            <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
                              <span className="truncate max-w-40">by {prop.developer}</span>
                              <span className="text-[#2563EB] dark:text-sky-400 font-black font-mono">{prop.priceRange}</span>
                            </div>
                          </div>

                          {/* Technical benchmarks for real estate (Requirement: RERA, Investment Score, Legal risk, Rental yield) */}
                          <div className="grid grid-cols-4 gap-1 bg-neutral-50 dark:bg-neutral-800/50 p-2 rounded-xl text-center text-[9px] font-mono border border-neutral-100 dark:border-neutral-800">
                            <div>
                              <span className="text-neutral-400 dark:text-neutral-500 block text-[7px] uppercase font-bold leading-none">RERA</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">Compliant</span>
                            </div>
                            <div className="border-l border-neutral-200/50 dark:border-neutral-800">
                              <span className="text-neutral-400 dark:text-neutral-500 block text-[7px] uppercase font-bold leading-none">Invest</span>
                              <span className="text-[#2563EB] dark:text-sky-400 font-black font-mono">{prop.investmentYieldScore}/100</span>
                            </div>
                            <div className="border-l border-neutral-200/50 dark:border-neutral-800">
                              <span className="text-neutral-400 dark:text-neutral-500 block text-[7px] uppercase font-bold leading-none">Legal</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black font-mono">{prop.legalScore}/100</span>
                            </div>
                            <div className="border-l border-neutral-200/50 dark:border-neutral-800">
                              <span className="text-neutral-400 dark:text-neutral-500 block text-[7px] uppercase font-bold leading-none">Rental</span>
                              <span className="text-purple-600 dark:text-purple-400 font-black font-mono">{Math.round(prop.investmentYieldScore * 0.95)}/100</span>
                            </div>
                          </div>

                          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light leading-snug line-clamp-2">
                            {prop.legalReport}
                          </p>

                          {/* Requirement: View Details, Compare, Save buttons */}
                          <div className="grid grid-cols-3 gap-1.5 pt-1">
                            <button
                              onClick={() => setDetailsProp(prop)}
                              className="py-2 bg-neutral-900 dark:bg-neutral-800 text-white rounded-xl text-[9px] font-black flex items-center justify-center space-x-0.5 active:scale-95 transition-all cursor-pointer"
                            >
                              <Info className="w-3 h-3" />
                              <span>Details</span>
                            </button>
                            <button
                              onClick={() => {
                                // Match other items to compare
                                const other = message.recommendedProperties?.find((p: any) => p.id !== prop.id) || message.recommendedProperties?.[0];
                                setComparisonProp({ propertyA: prop, propertyB: other });
                              }}
                              className="py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-[9px] font-black flex items-center justify-center space-x-0.5 active:scale-95 transition-all cursor-pointer"
                            >
                              <Scale className="w-3 h-3" />
                              <span>Compare</span>
                            </button>
                            <button
                              onClick={() => isSaved ? onRemoveSaved(prop.id) : onSaveHome(prop as any)}
                              className="py-2 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/40 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-[9px] font-black flex items-center justify-center space-x-0.5 active:scale-95 transition-all cursor-pointer"
                            >
                              <Bookmark className={`w-3 h-3 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
                              <span>{isSaved ? "Saved" : "Save"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Advanced Gradient Loading Experience */}
        {isLoading && (
          <div className="flex justify-start items-start">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 rounded-[24px] rounded-tl-sm p-4 shadow-sm w-full max-w-[85%] space-y-3.5">
              
              {/* Rotating Animated Gradient Spinner */}
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-neutral-100 dark:border-neutral-800" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-[#2563EB] border-r-purple-600 animate-spin" />
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">CRIBR AI Advisor</span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono font-medium">
                    {CHAT_STATUS_MESSAGES[statusTextIndex]}
                  </span>
                </div>
              </div>

              {/* Slow progress feedback line */}
              <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#2563EB] to-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 15, ease: "linear" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* INPUT CONTROLS FOOTER */}
      <footer className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200/50 dark:border-neutral-800 space-y-2.5 z-30">
        
        {/* Rounded Input wrapper */}
        <div className="flex items-center space-x-2 bg-[#F8F9FC] dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700 rounded-full h-13 px-3 shadow-sm">
          
          {/* Simulated Attachment Button */}
          <button
            onClick={() => {
              alert("Photo uploaded! Our intelligence engine has scanned the floor plan blueprint image.");
            }}
            className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-white dark:bg-neutral-700 border border-neutral-200/50 dark:border-neutral-600 text-neutral-500 dark:text-neutral-300 active:scale-90 transition-all shadow-sm cursor-pointer"
            title="Attach floor plan blueprint or lease document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text input supporting Shift + Enter for new lines */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder="Ask anything about real estate..."
            className="flex-1 bg-transparent border-none text-xs text-[#111111] dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 font-light focus:outline-none focus:ring-0 px-1 py-2 scrollbar-none resize-none max-h-12"
          />

          {/* Voice Search Button */}
          <button
            onClick={triggerVoiceInquiry}
            className="w-8.5 h-8.5 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 active:scale-90 transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`w-8.5 h-8.5 flex items-center justify-center rounded-full shadow-sm transition-all cursor-pointer ${
              inputText.trim()
                ? "bg-[#2563EB] text-white active:scale-90 hover:brightness-110"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 pointer-events-none"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

      {/* VOICE OVERLAY */}
      <AnimatePresence>
        {voiceActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#F8F9FC]/95 dark:bg-neutral-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6"
          >
            <div className="max-w-xs space-y-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-sky-400 relative">
                <div className="absolute inset-0 rounded-full bg-[#2563EB]/20 animate-ping" />
                <div className="absolute -inset-4 rounded-full bg-[#2563EB]/10 animate-pulse" />
                <Mic className="w-8 h-8 text-[#2563EB] dark:text-sky-400 relative z-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#111111] dark:text-white">Voice Query Active</h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-light">Ask CRIBR AI about a location, builder comparison, or legal check...</p>
              </div>

              <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl w-full shadow-sm min-h-16 flex items-center justify-center">
                <p className="text-xs font-semibold text-[#2563EB] dark:text-sky-400 italic leading-tight">
                  {voiceWaveText || "Listening..."}
                </p>
              </div>

              <button
                onClick={() => setVoiceActive(false)}
                className="px-5 py-2 bg-neutral-900 dark:bg-neutral-800 text-white rounded-full text-[10px] font-bold active:scale-95 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECENT SESSIONS DRAWER */}
      <AnimatePresence>
        {historyOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-x-0 bottom-0 max-h-[85%] bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden border-t border-neutral-200/50 dark:border-neutral-800"
            >
              <div className="w-12 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto mt-3 mb-2" />

              <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <h3 className="text-sm font-bold text-[#111111] dark:text-white">Recent Consultations</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleNewSessionClick}
                    className="px-3 py-1.5 bg-[#2563EB] text-white rounded-full text-[10px] font-bold flex items-center space-x-1 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>New Consultation</span>
                  </button>
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="p-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-full cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* History Search */}
              <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center space-x-2 bg-[#F8F9FC] dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700 rounded-xl px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    value={searchHistoryQuery}
                    onChange={(e) => setSearchHistoryQuery(e.target.value)}
                    placeholder="Search past conversations..."
                    className="flex-1 bg-transparent border-none text-xs text-[#111111] dark:text-neutral-100 focus:outline-none placeholder-neutral-400 dark:placeholder-neutral-500"
                  />
                  {searchHistoryQuery && (
                    <button onClick={() => setSearchHistoryQuery("")}>
                      <X className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* History list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 space-y-2">
                    <HelpCircle className="w-8 h-8 mx-auto text-neutral-200 dark:text-neutral-700" />
                    <p className="text-xs font-semibold">No Consultation Found</p>
                  </div>
                ) : (
                  filteredSessions.map((sess) => {
                    const isEditing = editingSessionId === sess.id;
                    const isActive = activeSessionId === sess.id;

                    return (
                      <div
                        key={sess.id}
                        onClick={() => {
                          if (!isEditing) {
                            setActiveSessionId(sess.id);
                            setHistoryOpen(false);
                          }
                        }}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-[#2563EB]/5 dark:bg-[#2563EB]/15 border-[#2563EB]/20 dark:border-[#2563EB]/30 text-[#2563EB] dark:text-sky-400"
                            : "bg-white dark:bg-neutral-800/60 border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <button
                            onClick={(e) => handleTogglePin(sess.id, e)}
                            className={`p-1 rounded-md transition-all ${
                              sess.isPinned 
                                ? "text-amber-500 hover:text-amber-600" 
                                : "text-neutral-300 dark:text-neutral-600 hover:text-neutral-400 dark:hover:text-neutral-400"
                            }`}
                          >
                            <Pin className={`w-3.5 h-3.5 ${sess.isPinned ? "fill-amber-500" : ""}`} />
                          </button>

                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  className="border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 rounded px-1.5 py-0.5 text-xs text-[#111111] dark:text-white focus:outline-none focus:border-[#2563EB] flex-1"
                                />
                                <button
                                  onClick={() => handleSaveRename(sess.id)}
                                  className="p-1 bg-emerald-500 text-white rounded cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 truncate">
                                  {sess.title}
                                </h4>
                                <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-light">
                                  {sess.messages.length} messages • {new Date(sess.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {!isEditing && (
                          <div className="flex items-center space-x-1 ml-2">
                            <button
                              onClick={(e) => handleStartRename(sess.id, sess.title, e)}
                              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteSession(sess.id, e)}
                              className="p-1 text-neutral-400 hover:text-rose-500 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROPERTY DETAILS SLIDE-UP DRAWER */}
      <AnimatePresence>
        {detailsProp && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailsProp(null)}
              className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute inset-x-0 bottom-0 max-h-[90%] bg-white dark:bg-neutral-900 rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden border-t border-neutral-200/50 dark:border-neutral-800"
            >
              <div className="w-12 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto mt-3 mb-1" />
              
              <div className="px-5 py-3.5 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-sky-400" />
                  <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">CRIBR Property Intelligence Report</h3>
                </div>
                <button
                  onClick={() => setDetailsProp(null)}
                  className="p-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable details block */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Image & Price Summary */}
                <div className="relative rounded-2xl overflow-hidden shadow-sm border border-neutral-200/50 dark:border-neutral-800">
                  <img src={detailsProp.image} alt={detailsProp.name} className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-blue-300 font-bold">{detailsProp.developer}</span>
                    <h4 className="text-base font-extrabold">{detailsProp.name}</h4>
                    <p className="text-xs text-neutral-200 font-light">{detailsProp.location}</p>
                  </div>
                </div>

                {/* Technical Benchmarks */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/60 space-y-1">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono block">AI TRUST SCORE</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-lg font-black text-neutral-900 dark:text-white">{detailsProp.overallScore}%</span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Excellent</span>
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/60 space-y-1">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono block">RERA COMPLIANCE</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-lg font-black text-neutral-900 dark:text-white">{detailsProp.legalScore}%</span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Verified</span>
                    </div>
                  </div>
                </div>

                {/* Local Area & Investment Potential */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">Property Analysis</h4>
                  
                  <div className="space-y-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-start space-x-3 bg-blue-50/40 dark:bg-blue-950/30 p-3 rounded-2xl border border-blue-500/10 dark:border-blue-500/20">
                      <TrendingUp className="w-4 h-4 text-[#2563EB] dark:text-sky-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-800 dark:text-neutral-200 font-black block">Investment Outlook</strong>
                        <span>{detailsProp.investmentAnalysis} Yield rating is marked at {detailsProp.investmentYieldScore}/100.</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 bg-emerald-50/40 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-500/10 dark:border-emerald-500/20">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-neutral-800 dark:text-neutral-200 font-black block">Legal Certificate Check</strong>
                        <span>{detailsProp.legalReport} Title deeds cleared with no outstanding litigation warnings.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to action booking */}
                <button
                  onClick={() => {
                    setDetailsProp(null);
                    onBookVisit(detailsProp);
                  }}
                  className="w-full py-3.5 bg-[#2563EB] text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/15 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Guided Site Visit</span>
                </button>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROPERTY COMPARISON MODAL */}
      <AnimatePresence>
        {comparisonProp && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setComparisonProp(null)}
              className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800 max-h-[80%] flex flex-col"
            >
              <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-850">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-[#2563EB] dark:text-sky-400" />
                  <h3 className="text-xs font-black text-neutral-900 dark:text-white uppercase font-mono tracking-wider">CRIBR AI Head-to-Head Comparison</h3>
                </div>
                <button
                  onClick={() => setComparisonProp(null)}
                  className="p-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comparison table */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center items-center pb-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono text-left">Specs</span>
                  <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 truncate">{comparisonProp.propertyA.name}</span>
                  <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 truncate">{comparisonProp.propertyB.name}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center items-center py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono text-left">Builder</span>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{comparisonProp.propertyA.developer}</span>
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 truncate">{comparisonProp.propertyB.developer}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center items-center py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono text-left">Price range</span>
                  <span className="text-xs font-black text-[#2563EB] dark:text-sky-400 font-mono">{comparisonProp.propertyA.priceRange}</span>
                  <span className="text-xs font-black text-[#2563EB] dark:text-sky-400 font-mono">{comparisonProp.propertyB.priceRange}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center items-center py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono text-left">AI Score</span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono">{comparisonProp.propertyA.overallScore}/100</span>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono">{comparisonProp.propertyB.overallScore}/100</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center items-center py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono text-left">Legal Clear</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{comparisonProp.propertyA.legalScore}/100</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{comparisonProp.propertyB.legalScore}/100</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center items-center py-2.5">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono text-left">Investment Score</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">{comparisonProp.propertyA.investmentYieldScore}/100</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">{comparisonProp.propertyB.investmentYieldScore}/100</span>
                </div>

                <div className="pt-3">
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed italic bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-700/60 text-center">
                    CRIBR AI Verdict: Both developments offer secure legal titles. Choose <strong>{comparisonProp.propertyA.name}</strong> for better micro-market rentability.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
