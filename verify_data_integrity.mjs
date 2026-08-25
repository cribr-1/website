import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

async function run() {
  const baseData = [];
  await new Promise((resolve) => {
    fs.createReadStream('/Users/arshadkhan/Downloads/Cribr Raw Data - Base Data.csv')
      .pipe(csv())
      .on('data', (row) => {
          if(row.project_name) baseData.push(row);
      })
      .on('end', resolve);
  });

  const dataTsContent = fs.readFileSync('/Users/arshadkhan/Desktop/cribr/cribr/remix-cribr (1)/src/data.ts', 'utf-8');
  const jsonMatch = dataTsContent.match(/export const MASTER_PROJECTS: FullProject\[\] = (\[[\s\S]*?\]);\n/);
  const MASTER_PROJECTS = JSON.parse(jsonMatch[1]);

  console.log("==========================================");
  console.log("   CRIBR DATA PIPELINE QC VERIFICATION    ");
  console.log("==========================================\n");

  let allPass = true;
  let seenSqms = new Set();
  let seenUnits = new Set();

  for (const proj of MASTER_PROJECTS) {
    console.log(`[VERIFYING] ${proj.name}`);
    
    // Find matching base data
    const bd = baseData.find(b => {
      const n1 = b.project_name.toLowerCase().replace(/ph\.1|phase 1| /g, '');
      const n2 = proj.name.toLowerCase().replace(/ph\.1|phase 1| /g, '');
      return n1.includes(n2) || n2.includes(n1) || (n1.includes('eatonpark') && n2.includes('eatonpark'));
    });

    if (!bd) {
      console.log(`  ❌ FAIL: Could not find ${proj.name} in Base Data. Cross-contamination risk!`);
      allPass = false;
      continue;
    }

    // Check Sqm / Units duplication
    if (seenSqms.has(proj.landAreaSqm) && proj.landAreaSqm !== '0 sq.m' && proj.landAreaSqm !== 'N/A') {
      console.log(`  ⚠️ WARN: Duplicate sq.m detected: ${proj.landAreaSqm}`);
    }
    seenSqms.add(proj.landAreaSqm);

    if (seenUnits.has(proj.totalUnits) && proj.totalUnits !== '0 Units' && proj.totalUnits !== 'N/A') {
      console.log(`  ⚠️ WARN: Duplicate unit count detected: ${proj.totalUnits}`);
    }
    seenUnits.add(proj.totalUnits);

    // 1. Timeline Reliability Test
    const pStart = new Date(proj.projectStartDate).getTime();
    const pPos = new Date(proj.possessionDate).getTime();
    const now = Date.now();
    let expectedRel = 0;
    let expectedRounded = 0;
    
    if (pStart && pPos && pPos > pStart) {
      const elapsed = Math.max(0, now - pStart);
      const total = pPos - pStart;
      const tfrac = Math.min(1.0, Math.max(0.001, elapsed / total));
      expectedRel = proj.constructionProgress / tfrac;
      expectedRounded = Math.round(expectedRel * 100) / 100;
    }
    
    console.log(`  Timeline: Start Date | Possession Date | Progress | Time Elapsed % | Expected Reliability`);
    const timeFracDisp = pStart && pPos && (pPos > pStart) ? (Math.min(1.0, Math.max(0.001, (now - pStart)/(pPos-pStart))) * 100).toFixed(1) + "%" : "N/A";
    console.log(`  Timeline: ${proj.projectStartDate} | ${proj.possessionDate} | ${proj.constructionProgress}% | ${timeFracDisp} | ${expectedRounded}`);

    // 2. Density Verification
    const expectedDensity = bd.density;
    console.log(`  Density: Expected (${expectedDensity}) vs UI Output (${proj.densityText})`);
    if (proj.densityText.includes(expectedDensity) || parseFloat(proj.densityText) === parseFloat(expectedDensity) || proj.densityText.includes(String(Math.round(parseFloat(expectedDensity))))) {
       console.log(`  ✅ PASS: Density matches Base Data.`);
    } else {
       console.log(`  ❌ FAIL: Density mismatch.`);
       allPass = false;
    }

    // 3. Hub Distance
    const bdHub = bd.nearest_office_hub || bd['Office Hub'] || '';
    const bdDist = bd.distance_to_hub_km || bd['Distance'] || '';
    console.log(`  Nearest Hub: Expected BaseData: ${bdHub} / ${bdDist}km`);
    console.log(`  Nearest Hub: UI Output: ${proj.nearestOfficeHub} / ${proj.distanceToHubKm}km`);
    if (proj.nearestOfficeHub.trim() === bdHub.trim() || !bdHub.trim()) {
       console.log(`  ✅ PASS: Hub data mapped.`);
    } else {
       console.log(`  ❌ FAIL: Hub mismatch.`);
       allPass = false;
    }

    // 4. Builder Reliability
    console.log(`  Builder: Expected Grade: ${bd.builder_grade || 'N/A'}, Reliability: ${bd.builder_reliability || 'N/A'}`);
    console.log(`  Builder: Actual UI Grade: ${proj.builderGrade}, Reliability: ${proj.builderReliability}`);
    
    // 5. Title Audit
    console.log(`  Title: Actual UI Text: ${proj.verificationTitleAuditNote}`);
    
    console.log("------------------------------------------");
  }

  if (MASTER_PROJECTS.length !== 7) {
     console.log(`❌ FAIL: Expected 7 production projects, found ${MASTER_PROJECTS.length}`);
     allPass = false;
  } else {
     console.log(`✅ PASS: Exactly 7 projects generated (no contamination)`);
  }

  if (allPass) {
     console.log("\n🎉 ALL QC CHECKS PASSED!");
  } else {
     console.log("\n⚠️ QC CHECKS FAILED. See above.");
  }
}

run();
