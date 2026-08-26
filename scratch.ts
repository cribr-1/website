import { MASTER_PROJECTS } from "./src/server/services/ProjectService.ts";

const rawText = "Structural standards and safety rating";
const terms = rawText.split(/\s+/).filter(t => t.length > 1 && !['in', 'at', 'near', 'under', 'for', 'bhk', 'cr', 'lakhs'].includes(t));

const filtered = MASTER_PROJECTS.filter(p => {
  const fullStr = `${p.name} ${p.builder_name || p.builder} ${p.locality || p.location} ${p.city || ''} ${p.rera_number || ''}`.toLowerCase();
  const matches = terms.filter(t => fullStr.includes(t.toLowerCase()));
  if (matches.length > 0) {
    console.log(`Project ${p.name} matched terms:`, matches);
    return true;
  }
  return false;
});

console.log(`Total matched: ${filtered.length}`);
