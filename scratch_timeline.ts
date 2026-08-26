import { projectService } from "./src/server/services/ProjectService.ts";
import { mapToWhitelistedProject } from "./src/lib/projectDataMapper.ts";

async function run() {
  const all = await projectService.getAllProjects();
  console.log(`Total projects fetched: ${all.length}`);
  
  for (const p of all) {
    const mapped = mapToWhitelistedProject(p);
    console.log(`\nProject: ${mapped.projectName}`);
    const rawTR = p.timeline_reliability_ratio || p.timelineReliabilityRatio || p.timeline_reliability || p.timelineReliability;
    console.log(`Raw DB timeline_reliability: ${rawTR}`);
    console.log(`Mapped Full Display: ${mapped.timelineReliabilityDisplay}`);
  }
}

run().catch(console.error);
