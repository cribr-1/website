import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Save,
  Send,
  Building2,
  MapPin,
  UserCheck,
  DollarSign,
  Ruler,
  Sparkles,
  Image as ImageIcon,
  Layers,
  FileText,
  Compass,
  Cpu,
  ShieldCheck,
  Hammer,
  MessageSquare,
  HelpCircle,
  Globe,
  Settings,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RotateCcw,
  Clock,
  ExternalLink,
  Film
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { showToast } from "./CribrToast";
import PropertyIntelligenceDetailsModal from "./PropertyIntelligenceDetailsModal";

export interface FullPropertyFormData {
  id: string;
  // 1. Basic Info
  name: string;
  slug: string;
  type: string;
  listingType: "Sale" | "Rent";
  status: "Upcoming" | "Under Construction" | "Ready to Move" | "Sold Out";
  isFeatured: boolean;
  isVerified: boolean;
  isReraRegistered: boolean;
  reraNumber: string;
  shortDescription: string;
  detailedDescription: string;

  // 2. Location
  country: string;
  state: string;
  city: string;
  locality: string;
  landmark: string;
  fullAddress: string;
  pincode: string;
  latitude: string;
  longitude: string;
  googleMapsUrl: string;

  // 3. Builder Info
  developer: string;
  builderLogo: string;
  builderDescription: string;
  builderWebsite: string;
  builderContact: string;
  builderEmail: string;
  yearsInBusiness: string;
  projectsCompleted: string;
  projectsOngoing: string;
  builderRating: number;

  // 4. Pricing
  priceRange: string;
  startingPriceLakhs: number;
  maxPriceLakhs: number;
  pricePerSqFt: string;
  bookingAmount: string;
  maintenanceCharges: string;
  registrationCharges: string;
  isGstIncluded: boolean;
  isEmiAvailable: boolean;
  priceHistory: { date: string; price: string }[];

  // 5. Specifications
  bhkOptions: string[];
  carpetArea: string;
  builtUpArea: string;
  superBuiltUpArea: string;
  plotArea: string;
  floors: string;
  totalTowers: string;
  totalUnits: string;
  ceilingHeight: string;
  facing: string;
  furnishing: string;
  parking: string;
  propertyAge: string;
  possessionDate: string;

  // 6. Amenities
  amenities: string[];

  // 7. Gallery
  image: string; // cover image
  images: { url: string; category: string; caption?: string }[];
  videos: string[];
  virtualTourUrl: string;

  // 8. Floor Plans
  floorPlans: { title: string; bhk: string; area: string; image: string; pdfUrl?: string }[];

  // 9. Documents
  documents: { title: string; category: string; fileUrl: string }[];

  // 10. Location Intelligence
  nearbyPlaces: { category: string; name: string; distance: string; travelTime: string }[];

  // 11. AI & Analytics
  score: number;
  legalScore: number;
  constructionScore: number;
  builderTrustScore: number;
  locationScore: number;
  valueScore: number;
  investmentScore: number;
  riskScore: number;
  aiVerdict: string;
  executiveSummary: string;
  pros: string[];
  cons: string[];
  investmentRecommendation: string;
  targetBuyer: string;
  expectedAppreciation: string;

  // 12. Legal Information
  landOwnership: string;
  approvalStatus: string;
  environmentalClearance: string;
  bankApprovals: string[];
  legalIssues: string;
  litigationStatus: string;

  // 13. Construction
  constructionStage: string;
  completionPercentage: number;
  currentMilestone: string;
  expectedPossession: string;
  constructionUpdates: { date: string; title: string; description: string; image?: string }[];

  // 14. Reviews
  reviews: { id: string; name: string; rating: number; text: string; verifiedBuyer: boolean; date: string }[];

  // 15. FAQ
  faqs: { question: string; answer: string }[];

  // 16. SEO
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;

  // 17. Settings
  isPublished: boolean;
  isDraft: boolean;
  isArchived: boolean;
  isTrending: boolean;
  isRecommended: boolean;
  displayOrder: number;
  visibility: "Public" | "Private" | "Unlisted";
  publishStatus?: "published" | "draft" | "archived";
}

const PRESET_AMENITIES = [
  "Swimming Pool", "Gym", "Clubhouse", "Garden", "Children Play Area",
  "Jogging Track", "Indoor Games", "Security", "CCTV", "Power Backup",
  "Lift", "Visitor Parking", "EV Charging", "Temple", "Hospital",
  "School", "Shopping", "Co-working", "Pet Park", "Library", "Party Hall"
];

const GALLERY_CATEGORIES = [
  "Exterior", "Interior", "Bedroom", "Kitchen", "Bathroom",
  "Amenities", "Master Plan", "Construction Progress"
];

export const INITIAL_PROPERTY_FORM: FullPropertyFormData = {
  id: "",
  name: "",
  slug: "",
  type: "Apartment",
  listingType: "Sale",
  status: "Under Construction",
  isFeatured: true,
  isVerified: true,
  isReraRegistered: true,
  reraNumber: "PRM/KA/RERA/1251/310/PR/210625/004200",
  shortDescription: "",
  detailedDescription: "",

  country: "India",
  state: "Karnataka",
  city: "Bangalore",
  locality: "",
  landmark: "",
  fullAddress: "",
  pincode: "560001",
  latitude: "12.9716",
  longitude: "77.5946",
  googleMapsUrl: "",

  developer: "",
  builderLogo: "",
  builderDescription: "",
  builderWebsite: "",
  builderContact: "",
  builderEmail: "",
  yearsInBusiness: "25+",
  projectsCompleted: "45",
  projectsOngoing: "12",
  builderRating: 4.8,

  priceRange: "₹1.5 Cr - ₹3.2 Cr",
  startingPriceLakhs: 150,
  maxPriceLakhs: 320,
  pricePerSqFt: "₹11,500/sq.ft",
  bookingAmount: "₹2,00,000",
  maintenanceCharges: "₹4.5/sq.ft",
  registrationCharges: "5% + Stamp Duty",
  isGstIncluded: true,
  isEmiAvailable: true,
  priceHistory: [
    { date: "Jan 2025", price: "₹10,500/sq.ft" },
    { date: "Jul 2025", price: "₹11,200/sq.ft" },
    { date: "Jan 2026", price: "₹11,500/sq.ft" }
  ],

  bhkOptions: ["2 BHK", "3 BHK", "4 BHK"],
  carpetArea: "1,150 - 2,400 sq.ft",
  builtUpArea: "1,400 - 2,800 sq.ft",
  superBuiltUpArea: "1,650 - 3,200 sq.ft",
  plotArea: "12 Acres",
  floors: "G + 28 Floors",
  totalTowers: "6 Towers",
  totalUnits: "540 Units",
  ceilingHeight: "10.5 Feet",
  facing: "East / North-East",
  furnishing: "Semi-Furnished",
  parking: "Covered Basement Parking",
  propertyAge: "New Launch",
  possessionDate: "December 2027",

  amenities: ["Swimming Pool", "Gym", "Clubhouse", "Garden", "CCTV", "Power Backup", "EV Charging", "Children Play Area"],

  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  images: [
    { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", category: "Exterior", caption: "Elevation Render" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", category: "Interior", caption: "Living Lounge" },
    { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", category: "Kitchen", caption: "Modular Kitchen Layout" },
    { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", category: "Amenities", caption: "Infinity Pool View" }
  ],
  videos: [],
  virtualTourUrl: "",

  floorPlans: [
    { title: "2 BHK Luxury Suite", bhk: "2 BHK", area: "1,250 sq.ft", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
    { title: "3 BHK Premium Residence", bhk: "3 BHK", area: "1,850 sq.ft", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80" }
  ],

  documents: [
    { title: "Project E-Brochure", category: "Brochure", fileUrl: "#" },
    { title: "RERA Approval Certificate", category: "RERA Certificate", fileUrl: "#" },
    { title: "Master Layout Plan", category: "Master Plan", fileUrl: "#" }
  ],

  nearbyPlaces: [
    { category: "School", name: "Greenwood High International", distance: "2.5 km", travelTime: "8 mins" },
    { category: "Hospital", name: "Manipal Specialty Hospital", distance: "1.8 km", travelTime: "5 mins" },
    { category: "Metro", name: "Namma Metro Purple Line Station", distance: "800 m", travelTime: "3 mins walk" },
    { category: "Office Hub", name: "Prestige Tech Park", distance: "3.2 km", travelTime: "10 mins" }
  ],

  score: 92,
  legalScore: 96,
  constructionScore: 90,
  builderTrustScore: 94,
  locationScore: 88,
  valueScore: 91,
  investmentScore: 93,
  riskScore: 12,
  aiVerdict: "VERIFIED BUY: Exceptional title clearance, top tier builder track record, and strong commute index.",
  executiveSummary: "Prime residential offering engineered with structural resilience, clear title land ownership, and strong projected rental yields.",
  pros: [
    "Grade-A Tier-1 Builder with 98% on-time delivery record",
    "Absolute legal clarity with zero litigation encumbrance",
    "Prime proximity to Metro station and major IT parks"
  ],
  cons: [
    "Premium pricing loading relative to standalone local builders"
  ],
  investmentRecommendation: "Recommended for both end-users seeking long-term capital preservation and investors targeting 5.5% gross rental yields.",
  targetBuyer: "Tech executives, nuclear families, and long-term portfolio investors",
  expectedAppreciation: "38% projected 5-year appreciation",

  landOwnership: "Freehold Title Land with A-Katha Certification",
  approvalStatus: "BBMP & BDA Sanctioned",
  environmentalClearance: "State Level Environment Impact Assessment Approved",
  bankApprovals: ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"],
  legalIssues: "None. Clean title search report verified by Senior High Court Advocate.",
  litigationStatus: "Zero pending litigations or court disputes.",

  constructionStage: "Superstructure 60% Complete",
  completionPercentage: 62,
  currentMilestone: "Slab casting in progress for Tower C & D",
  expectedPossession: "Q4 2027",
  constructionUpdates: [
    { date: "May 2026", title: "Tower A & B Structure Completed", description: "Top slab poured successfully. MIVAN shuttering progressing on schedule." }
  ],

  reviews: [
    { id: "rev-1", name: "Rajesh Kumar", rating: 5, text: "Very smooth booking experience. RERA compliance and land title verification was very transparent.", verifiedBuyer: true, date: "May 2026" }
  ],

  faqs: [
    { question: "Is the project RERA approved?", answer: "Yes, fully registered under RERA with verified filing numbers." },
    { question: "What are the payment terms?", answer: "Construction-linked payment plan with 10% booking advance." }
  ],

  seoTitle: "Verified Luxury Apartments in Bangalore | CRIBR Intelligence",
  metaDescription: "Comprehensive AI legal and quality audit report for luxury residential property.",
  keywords: "real estate, bangalore, luxury apartments, rera verified, cribr",
  ogImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  canonicalUrl: "",

  isPublished: true,
  isDraft: false,
  isArchived: false,
  isTrending: true,
  isRecommended: true,
  displayOrder: 1,
  visibility: "Public",
  publishStatus: "published"
};

interface AdminCreatePropertyFormProps {
  initialData?: Partial<FullPropertyFormData> | null;
  onClose: () => void;
  onSave: (property: FullPropertyFormData) => void;
  isAdminDark?: boolean;
}

export default function AdminCreatePropertyForm({
  initialData,
  onClose,
  onSave,
  isAdminDark = false
}: AdminCreatePropertyFormProps) {
  const [formData, setFormData] = useState<FullPropertyFormData>(() => {
    if (initialData && initialData.name) {
      return { ...INITIAL_PROPERTY_FORM, ...initialData, id: initialData.id || `prop-${Date.now()}` };
    }
    // Check autosave cache
    try {
      const saved = localStorage.getItem("cribr_property_form_autosave");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          return { ...INITIAL_PROPERTY_FORM, ...parsed };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return { ...INITIAL_PROPERTY_FORM, id: `prop-${Date.now()}` };
  });

  const [activeSection, setActiveSection] = useState<number>(1);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 1: true });
  const [lastAutosaved, setLastAutosaved] = useState<string | null>(null);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [customAmenity, setCustomAmenity] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Auto-generate slug from name if slug not manually locked
  const handleNameChange = (val: string) => {
    const slug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === "" || prev.slug === INITIAL_PROPERTY_FORM.slug ? slug : prev.slug
    }));
    if (validationErrors.name) {
      setValidationErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  // Autosave effect every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (formData.name.trim()) {
        setIsAutosaving(true);
        localStorage.setItem("cribr_property_form_autosave", JSON.stringify(formData));
        setTimeout(() => {
          setIsAutosaving(false);
          setLastAutosaved(new Date().toLocaleTimeString());
        }, 400);
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [formData]);

  // Section toggle helper
  const toggleSection = (id: number) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Property Name is required.";
    if (!formData.type) errors.type = "Property Type is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.locality.trim()) errors.locality = "Area / Locality is required.";
    if (!formData.developer.trim()) errors.developer = "Builder Name is required.";
    if (!formData.priceRange.trim()) errors.priceRange = "Price Structure is required.";

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstErrKey = Object.keys(errors)[0];
      showToast(`Please complete required field: ${errors[firstErrKey]}`, "error");
      // Open section 1 if name/type missing, section 2 if city/loc, section 3 if developer, section 4 if price
      if (errors.name || errors.type) setOpenSections((p) => ({ ...p, 1: true }));
      else if (errors.city || errors.locality) setOpenSections((p) => ({ ...p, 2: true }));
      else if (errors.developer) setOpenSections((p) => ({ ...p, 3: true }));
      else if (errors.priceRange) setOpenSections((p) => ({ ...p, 4: true }));
      return false;
    }
    return true;
  };

  const handlePublish = (status: "published" | "draft" | "archived") => {
    if (status === "published" && !validateForm()) {
      return;
    }

    const payload: FullPropertyFormData = {
      ...formData,
      isPublished: status === "published",
      isDraft: status === "draft",
      isArchived: status === "archived",
      publishStatus: status,
      // Map to standard CRIBR featured property format
      id: formData.id || `prop-${Date.now()}`
    };

    onSave(payload);
    localStorage.removeItem("cribr_property_form_autosave");
    showToast(
      status === "published"
        ? `"${formData.name}" published successfully!`
        : `Saved draft for "${formData.name}".`,
      "success"
    );
    onClose();
  };

  // File drag & drop simulator / base64 reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, category: string = "Exterior") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (!prev || prev >= 90) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 150);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setTimeout(() => {
        setUploadProgress(null);
        setFormData((prev) => {
          const newImages = [...prev.images, { url: result, category, caption: file.name }];
          return {
            ...prev,
            images: newImages,
            image: prev.image ? prev.image : result
          };
        });
        showToast(`Uploaded ${file.name}`, "success");
      }, 600);
    };
    reader.readAsDataURL(file);
  };

  const SECTIONS = [
    { id: 1, title: "1. Basic Information", icon: Building2, reqKeys: ["name", "type"] },
    { id: 2, title: "2. Location & Address", icon: MapPin, reqKeys: ["city", "locality"] },
    { id: 3, title: "3. Builder & Developer", icon: UserCheck, reqKeys: ["developer"] },
    { id: 4, title: "4. Pricing & Commercials", icon: DollarSign, reqKeys: ["priceRange"] },
    { id: 5, title: "5. Property Specifications", icon: Ruler, reqKeys: [] },
    { id: 6, title: "6. Amenities & Facilities", icon: Sparkles, reqKeys: [] },
    { id: 7, title: "7. Gallery & Media", icon: ImageIcon, reqKeys: [] },
    { id: 8, title: "8. Floor Plans", icon: Layers, reqKeys: [] },
    { id: 9, title: "9. Statutory Documents", icon: FileText, reqKeys: [] },
    { id: 10, title: "10. Location Intelligence & Commute", icon: Compass, reqKeys: [] },
    { id: 11, title: "11. AI Audit & Scorecard", icon: Cpu, reqKeys: [] },
    { id: 12, title: "12. Legal Clearance", icon: ShieldCheck, reqKeys: [] },
    { id: 13, title: "13. Construction Timeline", icon: Hammer, reqKeys: [] },
    { id: 14, title: "14. Buyer Reviews", icon: MessageSquare, reqKeys: [] },
    { id: 15, title: "15. FAQ & Q&A", icon: HelpCircle, reqKeys: [] },
    { id: 16, title: "16. SEO & Metadata", icon: Globe, reqKeys: [] },
    { id: 17, title: "17. Settings & Visibility", icon: Settings, reqKeys: [] }
  ];

  const themeBg = isAdminDark ? "bg-[#0A0C0E] text-neutral-100" : "bg-[#F8FAFC] text-neutral-900";
  const cardBg = isAdminDark ? "bg-[#12151A] border-neutral-800" : "bg-white border-neutral-200/90";
  const inputBg = isAdminDark
    ? "bg-[#1A1E24] border-neutral-700 text-white focus:border-indigo-500"
    : "bg-white border-neutral-200/90 text-neutral-900 focus:border-indigo-600";
  const labelText = isAdminDark ? "text-neutral-400" : "text-neutral-600";

  return (
    <div className={`fixed inset-0 z-[300] flex flex-col ${themeBg} overflow-hidden font-sans`}>
      {/* HEADER BAR */}
      <header className={`h-16 px-6 border-b flex items-center justify-between shrink-0 ${cardBg}`}>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black font-display text-sm shadow-md">
            C
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold font-display tracking-tight">
                {formData.name ? `Editing: ${formData.name}` : "Create Property Asset"}
              </h1>
              <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                formData.publishStatus === "published"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-amber-500/10 text-amber-500"
              }`}>
                {formData.publishStatus || "Draft"}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Full Property Intelligence Engine & Catalog Registry
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Autosave status indicator */}
          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-neutral-400 font-mono pr-2">
            {isAutosaving ? (
              <span className="flex items-center text-indigo-500 animate-pulse">
                <Clock className="w-3.5 h-3.5 mr-1 animate-spin" />
                Autosaving...
              </span>
            ) : lastAutosaved ? (
              <span className="flex items-center text-emerald-500">
                <Check className="w-3.5 h-3.5 mr-1" />
                Saved {lastAutosaved}
              </span>
            ) : null}
          </div>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 border rounded-xl text-xs font-semibold flex items-center space-x-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => handlePublish("draft")}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handlePublish("published")}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Property</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER (2 COLUMNS: SECTION NAV + CONTENT BODY) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT NAV SIDEBAR */}
        <aside className={`w-72 border-r overflow-y-auto p-4 space-y-1 shrink-0 hidden md:block ${cardBg}`}>
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold px-3 py-2">
            Form Navigator ({SECTIONS.length} Sections)
          </div>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const hasErr = sec.reqKeys.some((k) => validationErrors[k]);
            const isOpen = openSections[sec.id];
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setOpenSections((prev) => ({ ...prev, [sec.id]: true }));
                  const el = document.getElementById(`section-${sec.id}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isOpen
                    ? "bg-indigo-600/10 text-indigo-600 font-bold"
                    : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isOpen ? "text-indigo-600" : "text-neutral-400"}`} />
                  <span className="truncate">{sec.title.replace(/^\d+\.\s*/, "")}</span>
                </div>
                {hasErr && (
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Missing required fields" />
                )}
              </button>
            );
          })}
        </aside>

        {/* RIGHT CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* TOP SUMMARY ALERT */}
          <div className="bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-blue-900/10 rounded-2xl p-4 border border-indigo-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider font-mono">
                Property Intelligence Form Engine
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Every field populated here feeds directly into RERA audit metrics, AI Scorecards, and search indexing.
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setOpenSections(
                    Object.fromEntries(SECTIONS.map((s) => [s.id, true]))
                  );
                }}
                className="px-3 py-1.5 bg-white dark:bg-neutral-800 border text-[11px] font-semibold rounded-lg shadow-2xs hover:bg-neutral-50 transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenSections({ 1: true });
                }}
                className="px-3 py-1.5 bg-white dark:bg-neutral-800 border text-[11px] font-semibold rounded-lg shadow-2xs hover:bg-neutral-50 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* ================= 1. BASIC INFORMATION ================= */}
          <section id="section-1" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(1)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">1. Basic Information</h3>
                  <p className="text-[11px] text-neutral-400">Core identity, classification, RERA status, and descriptions</p>
                </div>
              </div>
              {openSections[1] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[1] && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>
                      Property Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Prestige Kingston Smart Condos"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                    {validationErrors.name && (
                      <p className="text-[11px] text-red-500 font-semibold">{validationErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Property Slug (URL)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                      placeholder="prestige-kingston-smart-condos"
                      className={`w-full p-2.5 rounded-xl border font-mono text-[11px] ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Property Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    >
                      {["Apartment", "Villa", "Plot", "Commercial", "Office", "Retail", "Warehouse", "Mixed Use"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Listing Type</label>
                    <select
                      value={formData.listingType}
                      onChange={(e) => setFormData((p) => ({ ...p, listingType: e.target.value as any }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    >
                      <option value="Sale">Sale</option>
                      <option value="Rent">Rent</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Property Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as any }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Sold Out">Sold Out</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold">Featured Property</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData((p) => ({ ...p, isVerified: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold">CRIBR Verified</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isReraRegistered}
                      onChange={(e) => setFormData((p) => ({ ...p, isReraRegistered: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold">RERA Registered</span>
                  </label>
                </div>

                {formData.isReraRegistered && (
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>RERA Registration Number</label>
                    <input
                      type="text"
                      value={formData.reraNumber}
                      onChange={(e) => setFormData((p) => ({ ...p, reraNumber: e.target.value }))}
                      placeholder="PRM/KA/RERA/..."
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className={`font-bold block ${labelText}`}>Short Overview Brief</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                    placeholder="Ultra-luxury high-rise smart residences situated in prime tech corridor..."
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`font-bold block ${labelText}`}>Detailed Description</label>
                  <textarea
                    rows={4}
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData((p) => ({ ...p, detailedDescription: e.target.value }))}
                    placeholder="Provide detailed narrative on architectural design, material quality, landscape coverage..."
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
                </div>
              </div>
            )}
          </section>

          {/* ================= 2. LOCATION ================= */}
          <section id="section-2" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(2)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">2. Location & Address</h3>
                  <p className="text-[11px] text-neutral-400">Geospatial coordinates, locality name, and map routing links</p>
                </div>
              </div>
              {openSections[2] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[2] && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>
                      Area / Locality <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => setFormData((p) => ({ ...p, locality: e.target.value }))}
                      placeholder="e.g. Whitefield"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Landmark</label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData((p) => ({ ...p, landmark: e.target.value }))}
                      placeholder="Near Forum Mall"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={`font-bold block ${labelText}`}>Full Street Address</label>
                    <input
                      type="text"
                      value={formData.fullAddress}
                      onChange={(e) => setFormData((p) => ({ ...p, fullAddress: e.target.value }))}
                      placeholder="Plot 42, Outer Ring Road, Whitefield Phase 2"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>PIN Code</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData((p) => ({ ...p, pincode: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData((p) => ({ ...p, latitude: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData((p) => ({ ...p, longitude: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ================= 3. BUILDER INFORMATION ================= */}
          <section id="section-3" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(3)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">3. Builder & Developer Profile</h3>
                  <p className="text-[11px] text-neutral-400">Company history, track record metrics, and contact info</p>
                </div>
              </div>
              {openSections[3] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[3] && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>
                      Builder / Developer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.developer}
                      onChange={(e) => setFormData((p) => ({ ...p, developer: e.target.value }))}
                      placeholder="e.g. Prestige Group"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Builder Logo URL</label>
                    <input
                      type="text"
                      value={formData.builderLogo}
                      onChange={(e) => setFormData((p) => ({ ...p, builderLogo: e.target.value }))}
                      placeholder="https://..."
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Years in Business</label>
                    <input
                      type="text"
                      value={formData.yearsInBusiness}
                      onChange={(e) => setFormData((p) => ({ ...p, yearsInBusiness: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Projects Completed</label>
                    <input
                      type="text"
                      value={formData.projectsCompleted}
                      onChange={(e) => setFormData((p) => ({ ...p, projectsCompleted: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Projects Ongoing</label>
                    <input
                      type="text"
                      value={formData.projectsOngoing}
                      onChange={(e) => setFormData((p) => ({ ...p, projectsOngoing: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Builder Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.builderRating}
                      onChange={(e) => setFormData((p) => ({ ...p, builderRating: parseFloat(e.target.value) || 4.5 }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Website</label>
                    <input
                      type="text"
                      value={formData.builderWebsite}
                      onChange={(e) => setFormData((p) => ({ ...p, builderWebsite: e.target.value }))}
                      placeholder="https://prestigeconstructions.com"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Contact Number</label>
                    <input
                      type="text"
                      value={formData.builderContact}
                      onChange={(e) => setFormData((p) => ({ ...p, builderContact: e.target.value }))}
                      placeholder="+91 1800 3000 0000"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Email</label>
                    <input
                      type="email"
                      value={formData.builderEmail}
                      onChange={(e) => setFormData((p) => ({ ...p, builderEmail: e.target.value }))}
                      placeholder="sales@builder.com"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ================= 4. PRICING ================= */}
          <section id="section-4" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(4)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">4. Pricing & Commercials</h3>
                  <p className="text-[11px] text-neutral-400">Price range, sqft rates, booking fees, maintenance, and historical trend</p>
                </div>
              </div>
              {openSections[4] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[4] && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>
                      Price Structure Display <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.priceRange}
                      onChange={(e) => setFormData((p) => ({ ...p, priceRange: e.target.value }))}
                      placeholder="e.g. ₹1.5 Cr - ₹3.2 Cr"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Starting Price (Lakhs)</label>
                    <input
                      type="number"
                      value={formData.startingPriceLakhs}
                      onChange={(e) => setFormData((p) => ({ ...p, startingPriceLakhs: parseFloat(e.target.value) || 0 }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Max Price (Lakhs)</label>
                    <input
                      type="number"
                      value={formData.maxPriceLakhs}
                      onChange={(e) => setFormData((p) => ({ ...p, maxPriceLakhs: parseFloat(e.target.value) || 0 }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Price per Sq Ft</label>
                    <input
                      type="text"
                      value={formData.pricePerSqFt}
                      onChange={(e) => setFormData((p) => ({ ...p, pricePerSqFt: e.target.value }))}
                      placeholder="₹11,500/sq.ft"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Booking Amount</label>
                    <input
                      type="text"
                      value={formData.bookingAmount}
                      onChange={(e) => setFormData((p) => ({ ...p, bookingAmount: e.target.value }))}
                      placeholder="₹2,00,000"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Maintenance Charges</label>
                    <input
                      type="text"
                      value={formData.maintenanceCharges}
                      onChange={(e) => setFormData((p) => ({ ...p, maintenanceCharges: e.target.value }))}
                      placeholder="₹4.5/sq.ft/mo"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Registration & Stamp</label>
                    <input
                      type="text"
                      value={formData.registrationCharges}
                      onChange={(e) => setFormData((p) => ({ ...p, registrationCharges: e.target.value }))}
                      placeholder="5% + Stamp duty"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isGstIncluded}
                      onChange={(e) => setFormData((p) => ({ ...p, isGstIncluded: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold">GST Included in Pricing</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isEmiAvailable}
                      onChange={(e) => setFormData((p) => ({ ...p, isEmiAvailable: e.target.checked }))}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold">Pre-approved Bank EMI Available</span>
                  </label>
                </div>
              </div>
            )}
          </section>

          {/* ================= 5. SPECIFICATIONS ================= */}
          <section id="section-5" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(5)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">5. Property Specifications</h3>
                  <p className="text-[11px] text-neutral-400">Dimensions, area breakdown, towers, units, facing, and possession</p>
                </div>
              </div>
              {openSections[5] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[5] && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Carpet Area</label>
                    <input
                      type="text"
                      value={formData.carpetArea}
                      onChange={(e) => setFormData((p) => ({ ...p, carpetArea: e.target.value }))}
                      placeholder="1,150 - 2,400 sq.ft"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Built-up Area</label>
                    <input
                      type="text"
                      value={formData.builtUpArea}
                      onChange={(e) => setFormData((p) => ({ ...p, builtUpArea: e.target.value }))}
                      placeholder="1,400 - 2,800 sq.ft"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Super Built-up Area</label>
                    <input
                      type="text"
                      value={formData.superBuiltUpArea}
                      onChange={(e) => setFormData((p) => ({ ...p, superBuiltUpArea: e.target.value }))}
                      placeholder="1,650 - 3,200 sq.ft"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Total Towers</label>
                    <input
                      type="text"
                      value={formData.totalTowers}
                      onChange={(e) => setFormData((p) => ({ ...p, totalTowers: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Total Units</label>
                    <input
                      type="text"
                      value={formData.totalUnits}
                      onChange={(e) => setFormData((p) => ({ ...p, totalUnits: e.target.value }))}
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Facing Direction</label>
                    <input
                      type="text"
                      value={formData.facing}
                      onChange={(e) => setFormData((p) => ({ ...p, facing: e.target.value }))}
                      placeholder="East / North-East"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Possession Date</label>
                    <input
                      type="text"
                      value={formData.possessionDate}
                      onChange={(e) => setFormData((p) => ({ ...p, possessionDate: e.target.value }))}
                      placeholder="Dec 2027"
                      className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ================= 6. AMENITIES ================= */}
          <section id="section-6" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(6)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">6. Amenities ({formData.amenities.length} Selected)</h3>
                  <p className="text-[11px] text-neutral-400">Select standard project amenities or add custom features</p>
                </div>
              </div>
              {openSections[6] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[6] && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_AMENITIES.map((am) => {
                    const isSelected = formData.amenities.includes(am);
                    return (
                      <button
                        key={am}
                        type="button"
                        onClick={() => {
                          setFormData((p) => ({
                            ...p,
                            amenities: isSelected
                              ? p.amenities.filter((a) => a !== am)
                              : [...p.amenities, am]
                          }));
                        }}
                        className={`p-2.5 rounded-xl border text-left font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-indigo-400"
                        }`}
                      >
                        <span className="truncate">{am}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amenity Adder */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    placeholder="Add custom amenity..."
                    className={`flex-1 p-2.5 rounded-xl border ${inputBg}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
                        setFormData((p) => ({ ...p, amenities: [...p.amenities, customAmenity.trim()] }));
                        setCustomAmenity("");
                      }
                    }}
                    className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ================= 7. GALLERY & MEDIA ================= */}
          <section id="section-7" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(7)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">7. Gallery & Media ({formData.images.length} Photos)</h3>
                  <p className="text-[11px] text-neutral-400">High-resolution property renders, category taggers, drag and drop upload</p>
                </div>
              </div>
              {openSections[7] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[7] && (
              <div className="p-6 space-y-4 text-xs">
                {/* Drag and Drop Upload Box */}
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer relative bg-indigo-500/5">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, "Exterior")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <p className="font-bold text-sm">Drag & Drop Property Images or Click to Upload</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Supports PNG, JPG, WEBP up to 10MB each</p>

                  {uploadProgress !== null && (
                    <div className="mt-3 w-48 mx-auto bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>

                {/* Uploaded Image Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 group bg-black/5">
                      <img src={img.url} alt="" className="w-full h-28 object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="p-2 bg-white dark:bg-neutral-900 border-t space-y-1">
                        <select
                          value={img.category}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            setFormData((p) => {
                              const updated = [...p.images];
                              updated[idx].category = newCat;
                              return { ...p, images: updated };
                            });
                          }}
                          className="w-full text-[10px] p-1 rounded border bg-transparent font-medium"
                        >
                          {GALLERY_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ================= 8. FLOOR PLANS ================= */}
          <section id="section-8" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(8)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">8. Floor Plans ({formData.floorPlans.length})</h3>
                  <p className="text-[11px] text-neutral-400">Unit layouts, floor dimensions, and downloadable PDF links</p>
                </div>
              </div>
              {openSections[8] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[8] && (
              <div className="p-6 space-y-4 text-xs">
                {formData.floorPlans.map((fp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    <input
                      type="text"
                      value={fp.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((p) => {
                          const updated = [...p.floorPlans];
                          updated[idx].title = val;
                          return { ...p, floorPlans: updated };
                        });
                      }}
                      placeholder="Title e.g. 3 BHK Suite"
                      className={`p-2 rounded-lg border ${inputBg}`}
                    />
                    <input
                      type="text"
                      value={fp.bhk}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((p) => {
                          const updated = [...p.floorPlans];
                          updated[idx].bhk = val;
                          return { ...p, floorPlans: updated };
                        });
                      }}
                      placeholder="e.g. 3 BHK"
                      className={`p-2 rounded-lg border ${inputBg}`}
                    />
                    <input
                      type="text"
                      value={fp.area}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((p) => {
                          const updated = [...p.floorPlans];
                          updated[idx].area = val;
                          return { ...p, floorPlans: updated };
                        });
                      }}
                      placeholder="Area e.g. 1,850 sq.ft"
                      className={`p-2 rounded-lg border ${inputBg}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, floorPlans: p.floorPlans.filter((_, i) => i !== idx) }));
                      }}
                      className="px-3 py-2 bg-red-500/10 text-red-500 font-bold rounded-lg hover:bg-red-500/20 transition-colors text-center"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setFormData((p) => ({
                      ...p,
                      floorPlans: [...p.floorPlans, { title: "New Floor Plan", bhk: "3 BHK", area: "1,500 sq.ft", image: "" }]
                    }));
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Floor Plan Variant</span>
                </button>
              </div>
            )}
          </section>

          {/* ================= 11. AI & ANALYTICS ================= */}
          <section id="section-11" className={`rounded-2xl border ${cardBg} overflow-hidden shadow-xs`}>
            <div
              onClick={() => toggleSection(11)}
              className="p-4 border-b flex items-center justify-between cursor-pointer hover:bg-neutral-500/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display">11. AI Scorecard & Audit Metrics</h3>
                  <p className="text-[11px] text-neutral-400">Set CRIBR index score, legal score, construction rating, pros/cons</p>
                </div>
              </div>
              {openSections[11] ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
            </div>

            {openSections[11] && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Overall CRIBR Score</label>
                    <input
                      type="number"
                      value={formData.score}
                      onChange={(e) => setFormData((p) => ({ ...p, score: parseInt(e.target.value) || 85 }))}
                      className={`w-full p-2.5 rounded-xl border font-mono font-bold text-indigo-600 ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Legal Score</label>
                    <input
                      type="number"
                      value={formData.legalScore}
                      onChange={(e) => setFormData((p) => ({ ...p, legalScore: parseInt(e.target.value) || 90 }))}
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Construction Score</label>
                    <input
                      type="number"
                      value={formData.constructionScore}
                      onChange={(e) => setFormData((p) => ({ ...p, constructionScore: parseInt(e.target.value) || 88 }))}
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`font-bold block ${labelText}`}>Builder Trust Score</label>
                    <input
                      type="number"
                      value={formData.builderTrustScore}
                      onChange={(e) => setFormData((p) => ({ ...p, builderTrustScore: parseInt(e.target.value) || 92 }))}
                      className={`w-full p-2.5 rounded-xl border font-mono ${inputBg}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`font-bold block ${labelText}`}>AI Verdict Statement</label>
                  <textarea
                    rows={2}
                    value={formData.aiVerdict}
                    onChange={(e) => setFormData((p) => ({ ...p, aiVerdict: e.target.value }))}
                    placeholder="VERIFIED BUY: Clear title land ownership..."
                    className={`w-full p-2.5 rounded-xl border ${inputBg}`}
                  />
                </div>
              </div>
            )}
          </section>

          {/* PUBLISH ACTION FOOTER */}
          <div className={`p-6 rounded-2xl border ${cardBg} flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm`}>
            <div>
              <h4 className="text-sm font-bold font-display">Ready to submit property listing?</h4>
              <p className="text-xs text-neutral-400">
                Publishing makes this property immediately discoverable in CRIBR's mobile and desktop catalog.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => handlePublish("draft")}
                className="px-5 py-2.5 border rounded-xl font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handlePublish("published")}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Publish Property Now</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* LIVE PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[400] flex flex-col bg-black/80 backdrop-blur-md">
            <div className="p-4 bg-neutral-900 border-b border-neutral-800 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs">Live Property Intelligence Preview</span>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-1 hover:bg-neutral-800 rounded-lg">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <PropertyIntelligenceDetailsModal
                property={formData}
                isOpen={true}
                onClose={() => setIsPreviewOpen(false)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
