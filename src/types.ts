export interface MetricData {
  name: string;
  reliabilityIndex: number;
  safetyIndex: number;
  qualityRating: number;
  sentiment: string;
}

export interface ComparisonMetric {
  label: string;
  metricA: string;
  metricB: string;
}

export interface PropertyReport {
  propertyOrQueryName: string;
  summary: string;
  overallScore: number;
  builderScore: number;
  builderName: string;
  builderTrustReport: string;
  legalScore: number;
  legalReport: string;
  constructionScore: number;
  constructionDetails: string;
  investmentYieldScore: number;
  investmentAnalysis: string;
  neighborhood: MetricData;
  pros: string[];
  cons: string[];
  comparativeMatrix?: ComparisonMetric[];
  verdict: string;
}

export interface KeyFinding {
  id: string;
  title: string;
  status: 'passed' | 'warning' | 'info';
  explanation: string;
  details: string;
}

export interface TimelineStep {
  step: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'queued';
  detail: string;
}

export interface IntelligenceReportItem {
  id: string;
  title: string;
  analysisId: string;
  generatedTime: string;
  lastUpdated: string;
  confidenceScore: number;
  badges: { text: string; type: 'verified' | 'ai' | 'confidence' | 'review' | 'low_risk' }[];
  metrics: {
    label: string;
    value: string;
    icon: string;
    subtext?: string;
  }[];
  executiveSummary: string;
  keyFindings: KeyFinding[];
  evidenceTimeline: TimelineStep[];
  modelVersion: string;
  processingTime: string;
  lastSync: string;
}

export interface PremiumProperty {
  id: string;
  name: string;
  developer: string;
  category: string;
  description: string;
  badge?: string;
  score?: number;
  summary?: string;
  location?: string;
  reraId?: string;
  badges?: { text: string; variant: 'green' | 'amber' | 'blue' }[];
  statsGrid?: { label: string; value: string }[];
  cribrNote?: { text: string; footer: string };
  followUpChips?: string[];
  metrics?: { label: string; value: string }[];
}

export interface SubscriptionPreferences {
  reraProgress: boolean;
  priceDrops: boolean;
  legalUpdates: boolean;
  noiseFluctuation: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
}

export interface SavedHome {
  id: string;
  propertyName: string;
  developer: string;
  city: string;
  overallScore: number;
  savedAt: string;
  subscription?: SubscriptionPreferences;
}

