// Google Analytics 4 (GA4) & Event Telemetry Module

export const GA_MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || "";

// Dynamically initialize GA4 script if measurement ID is present in environment
export function initGA4(): void {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;

  // Prevent duplicate script injection
  if (document.getElementById("ga4-script")) return;

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
}

// Generic event dispatcher
export function gtagEvent(action: string, params?: Record<string, any>): void {
  if (typeof window !== "undefined" && (window as any).gtag && GA_MEASUREMENT_ID) {
    (window as any).gtag("event", action, params);
  }
}

// Specialized Telemetry Event Helpers
export function trackSearchSubmitted(query: string, resultsCount: number, intent?: any): void {
  gtagEvent("search_submitted", {
    search_term: query,
    results_count: resultsCount,
    intent_city: intent?.city,
    intent_locality: intent?.locality,
    intent_builder: intent?.builder,
    intent_budget: intent?.budgetRange,
  });

  if (resultsCount === 0) {
    gtagEvent("zero_result_search", {
      search_term: query,
      intent_city: intent?.city,
      intent_locality: intent?.locality,
    });
  }
}

export function trackPropertyOpened(projectId: string, projectName?: string): void {
  gtagEvent("property_opened", {
    property_id: projectId,
    property_name: projectName,
  });
}

export function trackImageViewed(projectId: string, imageIndex: number): void {
  gtagEvent("image_viewed", {
    property_id: projectId,
    image_index: imageIndex,
  });
}

export function trackCompareClicked(projectIds: string[]): void {
  gtagEvent("compare_clicked", {
    compared_properties_count: projectIds.length,
    property_ids: projectIds.join(","),
  });
}

export function trackEnquirySubmitted(projectId: string, userName?: string): void {
  gtagEvent("enquiry_submitted", {
    property_id: projectId,
    user_name: userName,
  });
}

export function trackBookingRequested(projectId: string, visitDate: string): void {
  gtagEvent("booking_requested", {
    property_id: projectId,
    visit_date: visitDate,
  });
}

export function trackAIChatStarted(query?: string): void {
  gtagEvent("ai_chat_started", {
    initial_query: query || "",
  });
}

export function trackAIRecommendationClicked(projectId: string, name?: string): void {
  gtagEvent("ai_recommendation_clicked", {
    property_id: projectId,
    property_name: name,
  });
}
