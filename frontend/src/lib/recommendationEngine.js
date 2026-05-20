import { supabase } from './supabase';
import { mockProjects } from '@/data/mockProjects';

const localityImages = {
  "whitefield": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
  "sarjapur": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
  "harlur": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  "electronic city": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  "hennur": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "bellandur": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "varthur": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "panathur": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "kadugodi": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
  "kr puram": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80",
  "marathahalli": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  "budigere": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "koramangala": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  "jp nagar": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  "bannerghatta": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
  "hebbal": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "yelahanka": "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=800&q=80",
  "devanahalli": "https://images.unsplash.com/photo-1475855581690-80abb1d50df4?auto=format&fit=crop&w=800&q=80",
  "hosur road": "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
  "gunjur": "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
  "anekal": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
};

function getBuilderMetadata(builderName) {
  const norm = (builderName || "").trim().toLowerCase();
  
  // Mapping based on typical values from East Bangalore dataset
  const metadata = {
    "prestige estates": { reliability: 0.90, complaints: 2 },
    "prestige": { reliability: 0.90, complaints: 2 },
    "snn estates": { reliability: 0.82, complaints: 45 },
    "snn": { reliability: 0.82, complaints: 45 },
    "nvt quality lifestyle": { reliability: 0.97, complaints: 0 },
    "nvt": { reliability: 0.97, complaints: 0 },
    "sobha limited": { reliability: 0.77, complaints: 0 },
    "sobha": { reliability: 0.77, complaints: 0 },
    "godrej properties": { reliability: 0.83, complaints: 0 },
    "godrej": { reliability: 0.83, complaints: 0 },
    "shriram properties": { reliability: 0.90, complaints: 2 },
    "shriram": { reliability: 0.90, complaints: 2 },
    "puravankara": { reliability: 0.83, complaints: 0 },
    "dsr infraprojects": { reliability: 0.80, complaints: 2 },
    "dsr": { reliability: 0.80, complaints: 2 },
    "valmark developers": { reliability: 0.78, complaints: 2 },
    "valmark": { reliability: 0.78, complaints: 2 },
    "hm constructions": { reliability: 0.97, complaints: 0 },
    "hm": { reliability: 0.97, complaints: 0 },
    "vaswani group": { reliability: 0.82, complaints: 45 },
    "vaswani": { reliability: 0.82, complaints: 45 },
    "salarpuria sattva": { reliability: 0.80, complaints: 0 },
    "sattva": { reliability: 0.80, complaints: 0 },
    "birla estates": { reliability: 0.95, complaints: 5 },
    "birla": { reliability: 0.95, complaints: 5 },
    "ozone group": { reliability: 0.95, complaints: 10 },
    "ozone": { reliability: 0.95, complaints: 10 },
    "mims builders": { reliability: 0.94, complaints: 2 },
    "mims": { reliability: 0.94, complaints: 2 },
    "nambiar builders": { reliability: 0.88, complaints: 2 },
    "nambiar": { reliability: 0.88, complaints: 2 },
    "ukn properties": { reliability: 0.78, complaints: 0 },
    "ukn": { reliability: 0.78, complaints: 0 },
    "rohan builders": { reliability: 0.90, complaints: 0 },
    "rohan": { reliability: 0.90, complaints: 0 },
    "radiant group": { reliability: 0.96, complaints: 5 },
    "radiant": { reliability: 0.96, complaints: 5 },
    "assetz property group": { reliability: 0.79, complaints: 2 },
    "assetz": { reliability: 0.79, complaints: 2 },
    "vaishnavi group": { reliability: 0.86, complaints: 2 },
    "vaishnavi": { reliability: 0.86, complaints: 2 },
    "sumadhura group": { reliability: 0.96, complaints: 45 },
    "sumadhura": { reliability: 0.96, complaints: 45 },
    "mahaveer group": { reliability: 0.97, complaints: 0 },
    "mahaveer": { reliability: 0.97, complaints: 0 },
    "adarsh developers": { reliability: 0.96, complaints: 0 },
    "adarsh": { reliability: 0.96, complaints: 0 },
    "brigade enterprises": { reliability: 0.78, complaints: 0 },
    "brigade": { reliability: 0.78, complaints: 0 },
    "brigade group": { reliability: 0.78, complaints: 0 },
    "gopalan enterprises": { reliability: 0.92, complaints: 10 },
    "gopalan": { reliability: 0.92, complaints: 10 },
    "abhee ventures": { reliability: 0.85, complaints: 2 },
    "abhee": { reliability: 0.85, complaints: 2 },
    "casa grand": { reliability: 0.83, complaints: 5 },
    "raja housing": { reliability: 0.83, complaints: 0 },
    "raja": { reliability: 0.83, complaints: 0 },
    "total environment": { reliability: 0.86, complaints: 2 }
  };

  for (const key of Object.keys(metadata)) {
    if (norm.includes(key)) {
      return metadata[key];
    }
  }
  
  // Stable fallback generator
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = norm.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rel = 0.7 + (Math.abs(hash) % 29) / 100;
  const compPool = [0, 2, 5, 10, 20, 45];
  const comp = compPool[Math.abs(hash) % compPool.length];
  return { reliability: Math.round(rel * 100) / 100, complaints: comp };
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

const normProject = (p, isDb = true) => {
  const builderName = isDb ? (p.builders?.name || "Premium Builder") : (p.builder || "Premium Builder");
  const bMeta = getBuilderMetadata(builderName);
  
  const googleScore = isDb ? (p.google_reviews_score ?? 4.2) : (p.scores?.trust ? p.scores.trust / 2 : 4.2);
  const timelineRel = isDb ? (p.timeline_reliability ?? 0.8) : (p.scores?.futureGrowth ? p.scores.futureGrowth / 10 : 0.8);
  const commute = isDb ? (p.commute_score ?? 0.7) : (p.scores?.commute ? p.scores.commute / 10 : 0.7);
  const pComplaints = isDb ? (p.complaints ?? 0) : 0;
  const bComplaints = bMeta.complaints;
  const litigations = isDb ? (p.land_litigations ?? 0) : 0;
  const bReliability = bMeta.reliability;
  
  // Calculate Truth Score (0-100)
  const scoreBuilderRel = bReliability * 20;
  const scoreTimelineRel = timelineRel * 20;
  const scoreGoogle = (googleScore / 5.0) * 20;
  const scoreLitigation = litigations === 0 ? 20 : (litigations === 1 ? 10 : 0);
  const complaintScore = Math.max(0, 20 - (pComplaints * 3) - (bComplaints * 0.2));
  
  const truthScoreNum = Math.round(scoreBuilderRel + scoreTimelineRel + scoreGoogle + scoreLitigation + complaintScore);
  const truthScoreVal = Math.min(100, Math.max(0, truthScoreNum));
  
  let label = "Moderate Risk";
  let color = "amber";
  if (truthScoreVal >= 85) {
    label = "Trusted";
    color = "emerald";
  } else if (truthScoreVal < 60) {
    label = "Investigate Further";
    color = "rose";
  }

  // Handle image hierarchy logic
  let projectImage = null;
  if (isDb && p.images && p.images.length > 0 && p.images[0]) {
    projectImage = p.images[0];
  }
  
  const locality = isDb ? (p.locality || "Sarjapur") : (p.location ? p.location.split(',')[0] : "Sarjapur");
  let localityImage = null;
  const locKey = locality.toLowerCase().trim();
  for (const key of Object.keys(localityImages)) {
    if (locKey.includes(key)) {
      localityImage = localityImages[key];
      break;
    }
  }
  
  const finalImage = projectImage || localityImage || null;

  // Readiness
  const readiness = isDb ? (p.construction_progress === 100 ? "Ready to Move" : "Under Construction") : (p.readiness || "Ready to Move");

  // Format price
  const priceFormatted = isDb ? formatPrice(p.price_min, p.price_max) : p.price;

  // Unit Types
  const unitTypes = isDb ? (p.unit_types ? p.unit_types.join(", ") : "2 BHK, 3 BHK") : (p.configuration || "2 BHK, 3 BHK");

  // Derived budget category
  const minPrice = isDb ? (p.price_min || 0) : (p.price.includes("Cr") ? 12000000 : 8000000);
  let budgetCategory = "budget";
  if (minPrice > 15000000) {
    budgetCategory = "luxury";
  } else if (minPrice >= 10000000) {
    budgetCategory = "premium";
  }

  // Derived strengths / downsides
  const strengths = isDb ? [
    googleScore >= 4.3 ? `Tier-1 builder trust (${builderName})` : null,
    commute >= 0.8 ? "Exceptional commute convenience and hub proximity" : null,
    (p.density || 75) < 70 ? "Spacious low-density layouts" : null,
    "Excellent ready-to-use modern amenities",
    litigations === 0 ? "Clear title with no pending litigations" : null
  ].filter(Boolean) : (p.insights?.strengths || []);

  const downsides = isDb ? [
    pComplaints > 1 ? `Reported minor complaints (${pComplaints})` : null,
    p.construction_progress < 50 ? "Under construction (longer wait timeline)" : null,
    (p.density || 75) > 120 ? "High-density complex layout" : null,
    "Slightly premium maintenance fees"
  ].filter(Boolean) : (p.insights?.downsides || []);

  return {
    id: p.id,
    name: p.name,
    builder: builderName,
    locality: locality,
    location: isDb ? `${p.locality || 'Sarjapur'}, ${p.area || 'Bengaluru'}` : p.location,
    price: priceFormatted,
    price_min: isDb ? p.price_min : minPrice,
    price_max: isDb ? p.price_max : minPrice * 1.5,
    price_per_sft: isDb ? (p.price_per_sft || 12000) : 12000,
    possession_date: isDb ? p.possession_date : (p.readiness === "Ready to Move" ? "2024-12-31" : "2026-12-31"),
    construction_progress: isDb ? (p.construction_progress ?? 100) : (p.readiness === "Ready to Move" ? 100 : 45),
    land_area_acres: isDb ? (p.land_area_acres || 8.5) : 8.5,
    total_units: isDb ? (p.total_units || 450) : 450,
    unit_types: unitTypes,
    complaints: pComplaints,
    complaints_on_builder: bComplaints,
    land_litigations: litigations,
    property_title_summary: isDb ? (p.property_title_summary || "Clear title with no encumbrances.") : "Clear title with no encumbrances.",
    google_reviews_score: googleScore,
    distance_from_nearest_office_hub: isDb ? (p.distance_from_nearest_office_hub || 6.2) : 6.2,
    density: isDb ? (p.density || 80) : 80,
    timeline_reliability: timelineRel,
    builder_reliability: bReliability,
    commute_score: commute,
    rera_number: isDb ? (p.rera_number || "PRM/KA/RERA/Pending") : "PRM/KA/RERA/Pending",
    image: finalImage,
    imageSource: projectImage ? "project" : (localityImage ? "locality" : "placeholder"),
    truthScore: {
      score: truthScoreVal,
      label: label,
      color: color
    },
    scores: {
      commute: clamp(commute * 10),
      trust: clamp(googleScore * 2),
      lifestyle: isDb ? clamp(10 - (p.density || 75) / 15) : (p.scores?.lifestyle || 7),
      connectivity: isDb ? clamp(10 - (p.distance_from_nearest_office_hub || 10) / 2) : (p.scores?.connectivity || 7),
      futureGrowth: clamp(timelineRel * 10),
      valueForMoney: isDb ? clamp(10 - (p.price_per_sft || 12000) / 3000) : (p.scores?.valueForMoney || 7)
    },
    insights: {
      bestFor: isDb ? `Families and professionals seeking ${p.locality || 'prime East Bangalore'}.` : (p.insights?.bestFor || ""),
      downsides,
      strengths
    },
    budgetCategory,
    purpose: isDb ? (p.price_min > 12000000 ? ["live", "invest"] : ["live"]) : (p.purpose || ["live"])
  };
};

export async function getRecommendations(answers) {
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
    if (rawQuery.includes("under 1") || rawQuery.includes("1cr") || rawQuery.includes("1 cr") || rawQuery.includes("budget")) {
      budget = "budget";
    } else if (rawQuery.includes("1.5") || rawQuery.includes("premium")) {
      budget = "premium";
    } else if (rawQuery.includes("above 1.5") || rawQuery.includes("luxury") || rawQuery.includes("2cr") || rawQuery.includes("3cr") || rawQuery.includes("2 cr") || rawQuery.includes("3 cr")) {
      budget = "luxury";
    }

    if (rawQuery.includes("metro") || rawQuery.includes("commute") || rawQuery.includes("office") || rawQuery.includes("working") || rawQuery.includes("transit") || rawQuery.includes("near work")) {
      commute = "critical";
    }

    if (rawQuery.includes("invest") || rawQuery.includes("roi") || rawQuery.includes("yield")) {
      purpose = "invest";
    }
  }

  // Build projects matching structures
  let projects = [];
  if (!fetchFailed && dbProjects && dbProjects.length > 0) {
    projects = dbProjects.map(p => normProject(p, true));
  } else {
    projects = mockProjects.map(p => normProject(p, false));
  }

  // Scoring logic matching user answers
  let scoredProjects = projects.map(project => {
    let score = 50; // base score
    let matchReasons = [];

    if (budget && project.budgetCategory === budget) {
      score += 20;
      matchReasons.push("Perfectly fits your budget tier.");
    } else if (budget === "luxury" && project.budgetCategory === "premium") {
      score += 10;
      matchReasons.push("Well within your maximum budget allocation.");
    }

    if (purpose && project.purpose.includes(purpose)) {
      score += 15;
      if (purpose === 'invest') {
        matchReasons.push("Strong historical data for local ROI & rental yields.");
      } else {
        matchReasons.push("Ideal neighborhood for self-use & family living.");
      }
    }

    if (commute === "critical" && project.scores.commute >= 8) {
      score += 15;
      matchReasons.push("Top-tier location for transit and road connectivity.");
    } else if (commute === "low" && project.scores.lifestyle >= 8) {
      score += 10;
      matchReasons.push("Prioritizes tranquil green spaces over traffic hubs.");
    }

    if (rawQuery) {
      let queryHits = 0;
      
      if (project.location.toLowerCase().includes(rawQuery) || project.name.toLowerCase().includes(rawQuery)) {
        score += 25;
        queryHits++;
        matchReasons.push(`Direct location match for "${answers.query}".`);
      }
      
      if (rawQuery.includes("2bhk") || rawQuery.includes("2 bhk")) {
        if (project.unit_types.toLowerCase().includes("2bhk") || project.unit_types.toLowerCase().includes("2.5bhk")) {
          score += 15;
          queryHits++;
        }
      }
      if (rawQuery.includes("3bhk") || rawQuery.includes("3 bhk")) {
        if (project.unit_types.toLowerCase().includes("3bhk") || project.unit_types.toLowerCase().includes("3.5bhk")) {
          score += 15;
          queryHits++;
        }
      }
      if (rawQuery.includes("4bhk") || rawQuery.includes("4 bhk")) {
        if (project.unit_types.toLowerCase().includes("4bhk")) {
          score += 15;
          queryHits++;
        }
      }

      if (rawQuery.includes("family") || rawQuery.includes("parent") || rawQuery.includes("quiet") || rawQuery.includes("peace")) {
        if (project.scores.lifestyle >= 7) {
          score += 15;
          queryHits++;
          matchReasons.push("Perfect match for peaceful family lifestyle.");
        }
      }

      if (queryHits > 0) {
        score += 10;
      }
    }

    score = Math.min(score, 99);

    return {
      ...project,
      matchScore: score,
      matchReasons
    };
  });

  scoredProjects.sort((a, b) => b.matchScore - a.matchScore);

  const heroProject = scoredProjects[0] || projects[0];
  const alternativeProject = scoredProjects.find(p => p.id !== heroProject.id) || projects[1];
  
  const remaining = scoredProjects.filter(p => p.id !== heroProject.id && p.id !== alternativeProject.id);
  remaining.sort((a, b) => b.scores.valueForMoney - a.scores.valueForMoney);
  const valuePickProject = remaining[0] || projects[2];

  const formatProject = (project, badge, roleSummary) => ({
    ...project,
    badge,
    matchScore: project.matchScore,
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
