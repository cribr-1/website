export type SearchResponseType =
  | "ranking"
  | "project"
  | "builder"
  | "locality"
  | "comparison"
  | "investment"
  | "summary";

export interface CitationItem {
  id: string;
  source: string; // e.g. "Karnataka RERA Portal", "Google Places API", "Bengaluru Master Plan 2031", "Knight Frank Real Estate Report 2025"
  title: string;
  url?: string;
  dateVerified?: string;
  category: "RERA" | "Market" | "Transit" | "Reviews" | "Government";
}

export interface CribrScoreBreakdown {
  builderReliability: number; // 20%
  constructionProgress: number; // 15%
  locationTransit: number; // 20%
  appreciationYield: number; // 20%
  reraSafety: number; // 15%
  densityLivability: number; // 10%
}

export interface SchoolItem {
  name: string;
  distance: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  verifiedBuyer: boolean;
}

export interface TimelineItem {
  phase: string;
  status: "completed" | "in_progress" | "upcoming";
  date: string;
  description: string;
  delayNotice?: string;
}

export interface DocumentItem {
  title: string;
  type: "RERA Certificate" | "Title Deed" | "Environmental Clearance" | "Occupancy Certificate" | "Master Plan";
  verified: boolean;
  fileSize: string;
  fileUrl?: string;
}

export interface WinnerBadges {
  isOverallWinner?: boolean;
  isBestValue?: boolean;
  isBestInvestment?: boolean;
  isBestLuxury?: boolean;
  isBestRentalYield?: boolean;
}

export interface FullProject {
  id: string;
  rank?: number;
  name: string;
  builder: string;
  builderId: string;
  location: string;
  localityName: string;
  city: string;
  reraNumber: string;
  priceRange: string;
  minPriceLakhs: number;
  maxPriceLakhs: number;
  pricePerSqft: string;
  densityValue: number; // units per acre
  densityText: string;
  commuteScore: number; // out of 10
  commuteText: string;
  builderGrade: string;
  reliabilityScore: number; // 0-100
  constructionProgress: number; // 0-100 percentage
  possessionDate: string;
  googleRating: number; // e.g. 4.7
  reviewsCount: number;
  complaintsCount: string;
  activeComplaintsNum: number;
  totalUnits: string;
  totalAcres: number;
  status: "safe" | "delayed" | "fairPrice" | "ready";
  statusText: string;
  delayMonths: number;
  pros: string[];
  cons: string[];
  amenities: string[];
  schools: SchoolItem[];
  metroDistance: string;
  hospitalDistance: string;
  investmentScore: number; // 0-100
  rentalYieldPercent?: number; // e.g. 4.2%
  futureGrowthText: string;
  safeToBuy: boolean;
  aiVerdict: string;
  cribrScore: number; // Proprietary overall score 0-100
  cribrScoreBreakdown?: CribrScoreBreakdown;
  winnerBadges?: WinnerBadges;
  citations?: CitationItem[];
  aiInsights: {
    type: "positive" | "warning" | "neutral" | "investment";
    title: string;
    description: string;
  }[];
  images: string[];
  image?: string;
  developer?: string;
  category?: string;
  description?: string;
  price?: string;
  aiScore?: number;
  configurations?: string;
  mapCoords: { x: number; y: number }; // percentage coordinates for interactive map
  timeline: TimelineItem[];
  documents: DocumentItem[];
  reviews: ReviewItem[];
}

export interface BuilderProfile {
  id: string;
  name: string;
  grade: string;
  reliabilityScore: number;
  establishedYear: number;
  headquarters: string;
  totalProjectsDelivered: number;
  ongoingProjectsCount: number;
  complaintResolutionRate: string;
  summary: string;
  pros: string[];
  cons: string[];
  topProjects: string[];
  citations?: CitationItem[];
}

export interface PriceTrendPoint {
  period: string; // e.g. "2022", "2023", "2024", "2025"
  avgPriceSqft: number;
  rentalYield: number;
}

export interface LocalityAnalysis {
  localityName: string;
  city: string;
  avgPricePerSqft: string;
  priceGrowthYoy: string;
  totalActiveProjects: number;
  topBuilders: string[];
  keyInfrastructure: string[];
  connectivityScore: number; // 10
  liveabilityScore: number; // 10
  summary: string;
  topRecommendedProjectIds: string[];
  priceTrends?: PriceTrendPoint[];
  crimeSafetyRating?: number; // 10
  futureGrowthDrivers?: string[];
  citations?: CitationItem[];
}

export interface ProjectComparison {
  title: string;
  summary: string;
  projectIds: string[];
  overallWinnerId?: string;
  bestInvestmentId?: string;
  bestValueId?: string;
  winnerRationale?: {
    overallWinner: string;
    investmentWinner: string;
    valueWinner: string;
  };
  metrics: {
    category: string;
    key: string;
    label: string;
    values: Record<string, string | number | boolean>;
  }[];
  citations?: CitationItem[];
}

export interface InvestmentRecommendation {
  title: string;
  summary: string;
  targetBudget: string;
  recommendedProjectIds: string[];
  projectedYield: string;
  appreciationScore: number;
  riskLevel: "Low" | "Moderate" | "High";
  rationale: string[];
  citations?: CitationItem[];
}

export interface SearchResponse {
  type: SearchResponseType;
  title: string;
  summary: string;
  query: string;
  sessionId?: string;
  projects?: FullProject[];
  recommendedProperties?: FullProject[];
  singleProject?: FullProject;
  builderProfile?: BuilderProfile;
  localityAnalysis?: LocalityAnalysis;
  comparison?: ProjectComparison;
  investment?: InvestmentRecommendation;
  followUpChips?: string[];
  citations?: CitationItem[];
  reasoningSteps?: string[];
}

export interface FilterOptions {
  maxBudgetLakhs?: number;
  minDensity?: number;
  maxDensity?: number;
  builderGrade?: string;
  locality?: string;
  onlySafeToBuy?: boolean;
  onlyReadyToMove?: boolean;
  minCommuteScore?: number;
  minRating?: number;
  minCribrScore?: number;
  minRentalYield?: number;
  maxMetroDistanceKm?: number;
  possessionStatus?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  responsePayload?: SearchResponse;
  citations?: CitationItem[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  activeFilters?: FilterOptions;
}

export interface StreamingStep {
  step: string;
  status: "pending" | "active" | "completed";
  detail?: string;
}
