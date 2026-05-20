export const mockProjects = [
  {
    id: "proj-1",
    name: "Prestige Silver Oak",
    builder: "Prestige Estates",
    location: "Whitefield, Bengaluru",
    price: "₹1.99 Cr - ₹2.5 Cr",
    budgetCategory: "luxury", // budget > 1.5Cr
    configuration: "3 BHK, 4 BHK",
    readiness: "Ready to Move",
    purpose: ["live", "invest"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    scores: {
      commute: 6,
      trust: 9,
      lifestyle: 8,
      connectivity: 7,
      futureGrowth: 7,
      valueForMoney: 6
    },
    insights: {
      bestFor: "Professionals requiring proximity to ITPL with families.",
      downsides: ["High-density layout (2250+ units)", "Pricing is 15% above micro-market average"],
      strengths: ["Tier-1 builder trust", "Excellent ready-to-use amenities", "Spacious layouts"]
    }
  },
  {
    id: "proj-2",
    name: "Godrej Lakeside Orchard",
    builder: "Godrej Properties",
    location: "Sarjapur Road, Bengaluru",
    price: "₹1.2 Cr - ₹1.8 Cr",
    budgetCategory: "premium", // budget 1Cr - 1.5Cr
    configuration: "2 BHK, 3 BHK",
    readiness: "Under Construction",
    purpose: ["live"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    scores: {
      commute: 8,
      trust: 9,
      lifestyle: 7,
      connectivity: 8,
      futureGrowth: 9,
      valueForMoney: 8
    },
    insights: {
      bestFor: "Families prioritizing brand trust and future infrastructure.",
      downsides: ["Possession in 2027", "Extremely large scale (3000+ units)"],
      strengths: ["Lush green surroundings", "High future appreciation potential", "Excellent connectivity to ORR"]
    }
  },
  {
    id: "proj-3",
    name: "Rustomjee Summit",
    builder: "Rustomjee",
    location: "Borivali East, Mumbai",
    price: "₹1.45 Cr",
    budgetCategory: "premium",
    configuration: "2 BHK",
    readiness: "Under Construction",
    purpose: ["live", "invest"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    scores: {
      commute: 9,
      trust: 8,
      lifestyle: 6,
      connectivity: 9,
      futureGrowth: 8,
      valueForMoney: 9
    },
    insights: {
      bestFor: "Smart financial buyers looking for value and metro connectivity.",
      downsides: ["Possession Dec 2026", "Current access road prone to traffic"],
      strengths: ["Direct metro access", "Well within reasonable budget", "Strong rental yield potential"]
    }
  },
  {
    id: "proj-4",
    name: "Lodha Woods",
    builder: "Lodha Group",
    location: "Kandivali East, Mumbai",
    price: "₹1.8 Cr",
    budgetCategory: "luxury",
    configuration: "2 BHK, 3 BHK",
    readiness: "Ready to Move",
    purpose: ["live"],
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    scores: {
      commute: 7,
      trust: 9,
      lifestyle: 9,
      connectivity: 7,
      futureGrowth: 6,
      valueForMoney: 7
    },
    insights: {
      bestFor: "Families prioritizing lifestyle, peace, and immediate possession.",
      downsides: ["Metro station is a 10-minute walk", "Slightly premium pricing"],
      strengths: ["Sanjay Gandhi National Park views", "Tier-1 maintenance quality", "Immediate move-in"]
    }
  },
  {
    id: "proj-5",
    name: "Brigade Cornerstone Utopia",
    builder: "Brigade Group",
    location: "Whitefield, Bengaluru",
    price: "₹95 Lacs - ₹1.1 Cr",
    budgetCategory: "budget", // budget < 1Cr
    configuration: "1 BHK, 2 BHK",
    readiness: "Ready to Move",
    purpose: ["invest", "live"],
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80",
    scores: {
      commute: 8,
      trust: 9,
      lifestyle: 7,
      connectivity: 9,
      futureGrowth: 8,
      valueForMoney: 9
    },
    insights: {
      bestFor: "Young professionals and investors seeking high rental demand.",
      downsides: ["Smaller carpet areas", "Bustling, high-traffic commercial zone"],
      strengths: ["Integrated township with retail/office", "High rental ROI", "Walking distance to work hubs"]
    }
  }
];
