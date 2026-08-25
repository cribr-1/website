import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, data');
    
  if (error) {
    console.error('Error fetching:', error);
  } else {
    data.forEach(p => {
      const d = typeof p.data === 'string' ? JSON.parse(p.data) : p.data;
      console.log(`- ${p.id} : ${p.name}`);
      console.log(`  Amenities:`, d.amenities ? d.amenities.length : 0);
      console.log(`  Images:`, d.image ? 'Yes' : 'No', d.images ? d.images.length : 0);
      console.log(`  Pros/Cons:`, (d.pros ? d.pros.length : 0) + (d.cons ? d.cons.length : 0));
    });
  }
}
test();
