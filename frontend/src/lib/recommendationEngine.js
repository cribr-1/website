import { supabase } from './supabase';
import { mockProjects } from '@/data/mockProjects';

const premiumImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
];

function getStableImage(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % premiumImages.length;
  return premiumImages[idx];
}

function formatPrice(min, max) {
  const formatVal = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(0)} Lacs`;
    }
    return `₹${val}`;
  };
  if (min && max && min !== max) {
    return `${formatVal(min)} - ${formatVal(max)}`;
  }
  return formatVal(min || max || 0);
}

const clamp = (val) => Math.min(Math.max(Math.round(val), 1), 10);

export async function getRecommendations(answers) {
  // Query projects and builders from Supabase
  let dbProjects = [];
  let fetchFailed = false;
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        builders (
          name
        )
      `);
      
    if (error) {
      console.warn("Supabase query returned error, using fallback mock data:", error);
      fetchFailed = true;
    } else {
      dbProjects = data || [];
    }
  } catch (err) {
    console.warn("Supabase connection failed, using fallback mock data:", err);
    fetchFailed = true;
  }

  // Parse raw text query if available to extract filters
  let budget = answers.budget;
  let purpose = answers.purpose;
  let commute = answers.commute;
  const rawQuery = answers.query ? answers.query.toLowerCase() : "";

  if (rawQuery) {
    // Budget Parsing
    if (rawQuery.includes("under 1") || rawQuery.includes("1cr") || rawQuery.includes("1 cr") || rawQuery.includes("budget")) {
      budget = "budget";
    } else if (rawQuery.includes("1.5") || rawQuery.includes("premium")) {
      budget = "premium";
    } else if (rawQuery.includes("above 1.5") || rawQuery.includes("luxury") || rawQuery.includes("2cr") || rawQuery.includes("3cr") || rawQuery.includes("2 cr") || rawQuery.includes("3 cr")) {
      budget = "luxury";
    }

    // Commute Parsing
    if (rawQuery.includes("metro") || rawQuery.includes("commute") || rawQuery.includes("office") || rawQuery.includes("working") || rawQuery.includes("transit") || rawQuery.includes("near work")) {
      commute = "critical";
    }

    // Purpose Parsing
    if (rawQuery.includes("invest") || rawQuery.includes("roi") || rawQuery.includes("yield")) {
      purpose = "invest";
    }
  }

  // Build projects matching structures
  let projects = [];
  
  if (!fetchFailed && dbProjects && dbProjects.length > 0) {
    projects = dbProjects.map(p => {
      const minPrice = p.price_min || 0;
      
      // Determine budget category
      let budgetCategory = "budget";
      if (minPrice > 15000000) {
        budgetCategory = "luxury";
      } else if (minPrice >= 10000000) {
        budgetCategory = "premium";
      }

      // Readiness
      const readiness = p.construction_progress === 100 ? "Ready to Move" : "Under Construction";

      // Scoring mappings (scaled 1-10)
      const commuteScore = clamp((p.commute_score || 0.6) * 10);
      const trustScore = clamp((p.google_reviews_score || 4.2) * 2);
      const lifestyleScore = clamp(10 - (p.density || 75) / 15);
      const connectivityScore = clamp(10 - (p.distance_from_nearest_office_hub || 10) / 2);
      const futureGrowthScore = clamp((p.timeline_reliability || 0.8) * 10);
      const valueForMoneyScore = clamp(10 - (p.price_per_sft || 12000) / 3000);

      // Derived traits for UI
      const strengths = [];
      if (trustScore >= 8) strengths.push(`Tier-1 builder trust (${p.builders?.name || 'Prestige'})`);
      if (commuteScore >= 8) strengths.push("Exceptional commute convenience and metro proximity");
      if (lifestyleScore >= 8) strengths.push("Spacious low-density layouts");
      if (strengths.length < 3) strengths.push("Excellent ready-to-use modern amenities");
      if (strengths.length < 3) strengths.push("Clear title with no pending litigations");

      const downsides = [];
      if (p.complaints > 1) downsides.push(`Reported minor complaints (${p.complaints})`);
      if (p.construction_progress < 50) downsides.push("Under construction (longer wait timeline)");
      if (lifestyleScore < 6) downsides.push("High-density complex layout");
      if (downsides.length === 0) downsides.push("Slightly premium maintenance fees");

      return {
        id: p.id,
        name: p.name,
        builder: p.builders?.name || "Premium Builder",
        location: `${p.locality || 'Sarjapur'}, ${p.area || 'Bengaluru'}`,
        price: formatPrice(p.price_min, p.price_max),
        budgetCategory,
        configuration: p.unit_types ? p.unit_types.join(", ") : "2 BHK, 3 BHK",
        readiness,
        purpose: p.price_min > 12000000 ? ["live", "invest"] : ["live"],
        image: getStableImage(p.id),
        scores: {
          commute: commuteScore,
          trust: trustScore,
          lifestyle: lifestyleScore,
          connectivity: connectivityScore,
          futureGrowth: futureGrowthScore,
          valueForMoney: valueForMoneyScore
        },
        insights: {
          bestFor: `Families and professionals seeking ${p.locality || 'prime East Bangalore'}.`,
          downsides,
          strengths
        }
      };
    });
  } else {
    projects = mockProjects;
  }


  // Basic scoring logic matching user answers:
  let scoredProjects = projects.map(project => {
    let score = 50; // base score
    let matchReasons = [];

    // Budget match (Heavy weight)
    if (budget && project.budgetCategory === budget) {
      score += 20;
      matchReasons.push("Perfectly fits your budget tier.");
    } else if (budget === "luxury" && project.budgetCategory === "premium") {
      score += 10;
      matchReasons.push("Well within your maximum budget allocation.");
    }

    // Purpose match
    if (purpose && project.purpose.includes(purpose)) {
      score += 15;
      if (purpose === 'invest') {
        matchReasons.push("Strong historical data for local ROI & rental yields.");
      } else {
        matchReasons.push("Ideal neighborhood for self-use & family living.");
      }
    }

    // Commute match
    if (commute === "critical" && project.scores.commute >= 8) {
      score += 15;
      matchReasons.push("Top-tier location for transit and road connectivity.");
    } else if (commute === "low" && project.scores.lifestyle >= 8) {
      score += 10;
      matchReasons.push("Prioritizes tranquil green spaces over traffic hubs.");
    }

    // Search query relevance boosting
    if (rawQuery) {
      let queryHits = 0;
      
      // Match locality/area name
      if (project.location.toLowerCase().includes(rawQuery) || project.name.toLowerCase().includes(rawQuery)) {
        score += 25;
        queryHits++;
        matchReasons.push(`Direct location match for "${answers.query}".`);
      }
      
      // Match configuration
      if (rawQuery.includes("2bhk") || rawQuery.includes("2 bhk")) {
        if (project.configuration.toLowerCase().includes("2bhk") || project.configuration.toLowerCase().includes("2.5bhk")) {
          score += 15;
          queryHits++;
        }
      }
      if (rawQuery.includes("3bhk") || rawQuery.includes("3 bhk")) {
        if (project.configuration.toLowerCase().includes("3bhk") || project.configuration.toLowerCase().includes("3.5bhk")) {
          score += 15;
          queryHits++;
        }
      }
      if (rawQuery.includes("4bhk") || rawQuery.includes("4 bhk")) {
        if (project.configuration.toLowerCase().includes("4bhk")) {
          score += 15;
          queryHits++;
        }
      }

      // Match lifestyle tags
      if (rawQuery.includes("family") || rawQuery.includes("parent") || rawQuery.includes("quiet") || rawQuery.includes("peace")) {
        if (project.scores.lifestyle >= 7) {
          score += 15;
          queryHits++;
          matchReasons.push("Perfect match for peaceful family lifestyle.");
        }
      }

      if (queryHits > 0) {
        score += 10; // Extra synergy bonus
      }
    }

    score = Math.min(score, 99);

    return {
      ...project,
      matchScore: score,
      matchReasons
    };
  });

  // Sort descending
  scoredProjects.sort((a, b) => b.matchScore - a.matchScore);

  const heroProject = scoredProjects[0] || projects[0];
  const alternativeProject = scoredProjects.find(p => p.id !== heroProject.id) || projects[1];
  
  const remaining = scoredProjects.filter(p => p.id !== heroProject.id && p.id !== alternativeProject.id);
  remaining.sort((a, b) => b.scores.valueForMoney - a.scores.valueForMoney);
  const valuePickProject = remaining[0] || projects[2];

  const formatProject = (project, badge, roleSummary) => ({
    id: project.id,
    badge,
    matchScore: project.matchScore,
    name: project.name,
    location: project.location,
    price: project.price,
    configuration: project.configuration,
    readiness: project.readiness,
    image: project.image,
    builder: project.builder,
    scores: project.scores,
    reasoning: {
      summary: roleSummary || (project.matchReasons.length > 0 ? project.matchReasons.join(" ") : project.insights.bestFor),
      idealUser: project.insights.bestFor,
      strengths: project.insights.strengths,
      compromises: project.insights.downsides
    }
  });

  return {
    hero: formatProject(heroProject, "Best Match", heroProject.matchReasons.join(" ") + " " + heroProject.insights.bestFor),
    alternative: formatProject(alternativeProject, "Alternative", "A reliable alternative offering distinct location advantages with similar amenities."),
    valuePick: formatProject(valuePickProject, "Value Pick", "The smartest pricing value profile in this category.")
  };
}
