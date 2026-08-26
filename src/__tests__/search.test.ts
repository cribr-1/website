import { projectService } from "../server/services/ProjectService.ts";
import { mapToWhitelistedProject } from "../lib/projectDataMapper.ts";

async function runTests() {
  console.log("=== Testing Search Architecture ===\n");
  
  // Test 1: Under 1 Cr (Max price 100 Lakhs)
  console.log("TEST 1: Search 'under 1 cr' (Backend Filter)");
  const intent1 = { maxPriceINR: 10000000 };
  const results1 = await projectService.searchProjects(intent1, "under 1 cr");
  
  const mapped1 = results1.map(p => mapToWhitelistedProject(p));
  
  const hasGodrej = mapped1.some(p => p.projectName.includes("Godrej"));
  const hasNambiar = mapped1.some(p => p.projectName.includes("Nambiar"));
  const hasBirla = mapped1.some(p => p.projectName.includes("Birla"));
  
  console.log(`Results count: ${mapped1.length}`);
  console.log(`Includes Godrej (>1 Cr): ${hasGodrej}`);
  console.log(`Includes Nambiar (Price on Request): ${hasNambiar}`);
  console.log(`Includes Birla (Price on Request): ${hasBirla}`);
  
  if (hasGodrej || hasNambiar || hasBirla) {
    console.error("FAIL: Backend filter allowed >1Cr or Price on Request projects.");
  } else {
    console.log("PASS: Backend filter correctly excluded invalid projects.\n");
  }

  // Test 2: Affordable Category Filter (Frontend Filter)
  console.log("TEST 2: Category Filter 'Affordable' (Frontend logic)");
  const allProjects = await projectService.getAllProjects();
  const allMapped = allProjects.map(p => mapToWhitelistedProject(p));
  
  const affordable = allMapped.filter(p => {
    return p.minPriceLakhs !== null && p.minPriceLakhs <= 100;
  });
  
  const affHasGodrej = affordable.some(p => p.projectName.includes("Godrej"));
  const affHasNambiar = affordable.some(p => p.projectName.includes("Nambiar"));
  const affHasBirla = affordable.some(p => p.projectName.includes("Birla"));
  
  console.log(`Results count: ${affordable.length}`);
  console.log(`Includes Godrej (>1 Cr): ${affHasGodrej}`);
  console.log(`Includes Nambiar (Price on Request): ${affHasNambiar}`);
  console.log(`Includes Birla (Price on Request): ${affHasBirla}`);

  if (affHasGodrej || affHasNambiar || affHasBirla) {
    console.error("FAIL: Frontend category filter allowed >1Cr or Price on Request projects.");
  } else {
    console.log("PASS: Frontend category filter correctly excluded invalid projects.\n");
  }
}

runTests().catch(console.error);
