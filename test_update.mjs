import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testUpdate() {
  const { data, error } = await supabase
    .from('projects')
    .update({ amenities: [] })
    .eq('id', 'proj-nambiar-district-25-ph1')
    .select();
    
  if (error) {
    console.error('Update Error:', error);
  } else {
    console.log('Update Success:', data);
  }
}
testUpdate();
