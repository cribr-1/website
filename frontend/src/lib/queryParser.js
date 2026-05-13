export function parseQuery(query) {
  const result = {
    bhk: null,
    priceMax: null,
    locality: null,
    amenities: [],
    remainingQuery: query
  };

  if (!query) return result;

  const lowerQuery = query.toLowerCase();

  // Extract BHK (e.g., 2BHK, 3 BHK)
  const bhkMatch = lowerQuery.match(/\b(\d)\s*bhk\b/);
  if (bhkMatch) {
    result.bhk = `${bhkMatch[1]}BHK`;
    // Remove from remaining query
    const originalText = query.match(new RegExp(`\\b${bhkMatch[1]}\\s*bhk\\b`, 'i'));
    if (originalText) {
      result.remainingQuery = result.remainingQuery.replace(originalText[0], '');
    }
  }

  // Extract Price (e.g., under 1 Cr, less than 50 lakhs)
  // Match "under X Cr"
  const crMatch = lowerQuery.match(/(?:under|less than|below)\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/);
  if (crMatch) {
    result.priceMax = parseFloat(crMatch[1]) * 10000000;
    const originalText = query.match(new RegExp(`(?:under|less than|below)\\s*${crMatch[1]}\\s*(?:cr|crore|crores)`, 'i'));
    if (originalText) {
      result.remainingQuery = result.remainingQuery.replace(originalText[0], '');
    }
  }

  // Match "under X Lakh"
  const lakhMatch = lowerQuery.match(/(?:under|less than|below)\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)/);
  if (lakhMatch) {
    if (!result.priceMax) { // Prefer Cr if both somehow match
      result.priceMax = parseFloat(lakhMatch[1]) * 100000;
    }
    const originalText = query.match(new RegExp(`(?:under|less than|below)\\s*${lakhMatch[1]}\\s*(?:lakh|lakhs)`, 'i'));
    if (originalText) {
      result.remainingQuery = result.remainingQuery.replace(originalText[0], '');
    }
  }

  // Extract Location (simple "in [Location]")
  const inMatch = lowerQuery.match(/\bin\s+([a-z\s]+)(?:$|\b)/);
  if (inMatch) {
    const loc = inMatch[1].trim();
    // Simple check to avoid matching random words
    if (loc && loc.length > 2 && !['the', 'and', 'with'].includes(loc)) {
      result.locality = loc;
      const originalText = query.match(new RegExp(`\\bin\\s+${loc}`, 'i'));
      if (originalText) {
        result.remainingQuery = result.remainingQuery.replace(originalText[0], '');
      }
    }
  }

  // Extract common amenities
  const commonAmenities = ['pool', 'swimming pool', 'gym', 'clubhouse', 'metro', 'park'];
  commonAmenities.forEach(amenity => {
    if (lowerQuery.includes(amenity)) {
      result.amenities.push(amenity);
      const originalText = query.match(new RegExp(amenity, 'i'));
      if (originalText) {
        result.remainingQuery = result.remainingQuery.replace(originalText[0], '');
      }
    }
  });

  // Clean up remaining query
  result.remainingQuery = result.remainingQuery.replace(/\s+/g, ' ').trim();
  
  // If remaining query is just connecting words, clear it
  if (/^(?:for|with|and|at|in)$/i.test(result.remainingQuery)) {
    result.remainingQuery = '';
  }

  return result;
}
