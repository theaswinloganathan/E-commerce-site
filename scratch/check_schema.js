import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error fetching orders:', error);
  } else {
    console.log('Successfully fetched (or empty). Columns present in response:');
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log('Table is empty, trying to get column info from a dummy insert failure or other method...');
      // If empty, we can try to insert a garbage object and see what the error says about missing columns
      const { error: insertError } = await supabase.from('orders').insert({ dummy_column: 'test' });
      console.log('Insert error message (contains column info usually):', insertError?.message);
    }
  }
}

checkSchema();
