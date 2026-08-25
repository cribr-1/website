import dotenv from 'dotenv';
dotenv.config();

async function getTypes() {
  const res = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/projects?select=*&limit=1`, {
    headers: {
      apikey: process.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
    }
  });
  const data = await res.json();
  if (data.length > 0) {
    for (const [key, val] of Object.entries(data[0])) {
      console.log(key, ':', typeof val, val);
    }
  }
}
getTypes();
