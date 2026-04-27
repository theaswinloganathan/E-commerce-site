import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function probeColumns() {
  const columnsToTest = ['user_id', 'order_id', 'total', 'order_status', 'address', 'shipping_address', 'payment_status', 'tracking_steps', 'status', 'total_amount', 'payment_id'];
  
  console.log('Probing columns for table "orders"...');
  
  for (const col of columnsToTest) {
    const { error } = await supabase.from('orders').select(col).limit(1);
    if (error) {
      if (error.message.includes('Could not find the')) {
        console.log(`❌ ${col}: Not found`);
      } else {
        console.log(`❓ ${col}: Other error - ${error.message}`);
      }
    } else {
      console.log(`✅ ${col}: Found`);
    }
  }
}

probeColumns();
