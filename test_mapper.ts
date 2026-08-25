import { calculateTimelineReliability } from './src/lib/projectDataMapper.ts';

const result = calculateTimelineReliability(null, 21, "2024-11-01", "Sep 2030");
console.log("Godrej Lakeside Orchard Timeline:", result);

const r2 = calculateTimelineReliability(null, 62, "2023-12-01", "Dec 2028");
console.log("Brigade Sanctuary Timeline:", r2);
