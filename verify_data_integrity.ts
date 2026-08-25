import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { calculateTimelineReliability, calculateUnitDensity, computeNearestHub } from './src/lib/projectDataMapper';
import { MASTER_PROJECTS } from './src/data';

async function run() {
  const baseData = [];
  await new Promise((resolve) => {
    fs.createReadStream('/Users/arshadkhan/Downloads/Cribr Raw Data - Base Data.csv')
      .pipe(csv())
      .on('data', (row) => baseData.push(row))
      .on('end', resolve);
  });

  const hubs = [];
  await new Promise((resolve) => {
    fs.createReadStream('/Users/arshadkhan/Downloads/Cribr Raw Data - Office Hubs.csv')
      .pipe(csv())
      .on('data', (row) => hubs.push(row))
      .on('end', resolve);
  });

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
      // It's possible for projects to genuinely share sq.m but highly unlikely down to the exact decimal
      console.log(`  ⚠️ WARN: Duplicate sq.m detected: ${proj.landAreaSqm}`);
    }
    seenSqms.add(proj.landAreaSqm);

    if (seenUnits.has(proj.totalUnits) && proj.totalUnits !== '0 Units' && proj.totalUnits !== 'N/A') {
      console.log(`  ⚠️ WARN: Duplicate unit count detected: ${proj.totalUnits}`);
    }
    seenUnits.add(proj.totalUnits);

    // 1. Timeline Reliability Test
    // Expected client formula: progress / ((now - start) / (possession - start))
    const pStart = new Date(proj.projectStartDate).getTime();
    const pPos = new Date(proj.possessionDate).getTime();
    const now = Date.now();
    let expectedRel = 0;
    
    if (pStart && pPos && pPos > pStart) {
      const elapsed = Math.max(0, now - pStart);
      const total = pPos - pStart;
      const tfrac = Math.min(1.0, Math.max(0.001, elapsed / total));
      expectedRel = proj.constructionProgress / tfrac;
    }
    
    const mappedRel = calculateTimelineReliability(null, proj.constructionProgress, proj.projectStartDate, proj.possessionDate);
    const expectedRounded = Math.round(expectedRel * 100) / 100;
    
    console.log(`  Timeline: Start Date | Possession Date | Progress | Time Elapsed % | Expected Reliability | Actual Reliability`);
    const timeFracDisp = pStart && pPos && (pPos > pStart) ? (Math.min(1.0, Math.max(0.001, (now - pStart)/(pPos-pStart))) * 100).toFixed(1) + "%" : "N/A";
    console.log(`  Timeline: ${proj.projectStartDate} | ${proj.possessionDate} | ${proj.constructionProgress}% | ${timeFracDisp} | ${expectedRounded} | ${mappedRel.variance}`);
    
    if (Math.abs(expectedRounded - (mappedRel.variance || 0)) > 1.0) {
      console.log(`  ❌ FAIL: Timeline Reliability Math Mismatch`);
      allPass = false;
    } else {
      console.log(`  ✅ PASS: Timeline Reliability Math`);
    }

    // 2. Density Verification
    const expectedDensity = bd.density;
    console.log(`  Density: Expected (${expectedDensity}) vs UI Output (${proj.densityText})`);
    if (proj.densityText.includes(expectedDensity) || parseFloat(proj.densityText) === parseFloat(expectedDensity)) {
       console.log(`  ✅ PASS: Density matches Base Data.`);
    } else {
       console.log(`  ❌ FAIL: Density mismatch.`);
       allPass = false;
    }

    // 3. Hub Distance
    console.log(`  Nearest Hub: Expected BaseData: ${bd.nearest_office_hub} / ${bd.distance_to_hub_km}km`);
    console.log(`  Nearest Hub: UI Output: ${proj.nearestOfficeHub} / ${proj.distanceToHubKm}km`);
    if (proj.nearestOfficeHub.trim() === bd.nearest_office_hub.trim() || !bd.nearest_office_hub.trim()) {
       console.log(`  ✅ PASS: Hub data mapped.`);
    } else {
       console.log(`  ❌ FAIL: Hub mismatch.`);
       allPass = false;
    }

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
