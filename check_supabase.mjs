import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function checkDB() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!res.ok) {
    console.error('Failed to fetch:', res.status, res.statusText);
    const text = await res.text();
    console.error(text);
    return;
  }
  
  const projects = await res.json();
  console.log(`Found ${projects.length} projects in DB.`);
  
  for (const p of projects) {
    const data = typeof p.data === 'string' ? JSON.parse(p.data) : p.data;
    console.log(`- ${p.id} : ${p.name}`);
    console.log(`  Amenities: ${data.amenities ? data.amenities.length : 0}`);
    console.log(`  Pros: ${data.pros ? data.pros.length : 0}`);
    console.log(`  Images: ${data.image ? 'Yes' : 'No'}`);
  }
}

checkDB();
