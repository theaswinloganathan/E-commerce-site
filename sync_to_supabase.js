import { createClient } from '@supabase/supabase-js'
import { largeProducts } from './src/lib/largeProducts.js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY // Use service role if available for better performance, but anon usually works with correct RLS

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const uploadInBatches = async () => {
  const BATCH_SIZE = 100
  console.log(`Starting upload of ${largeProducts.length} products...`)

  for (let i = 0; i < largeProducts.length; i += BATCH_SIZE) {
    const batch = largeProducts.slice(i, i + BATCH_SIZE)
    
    const { error } = await supabase
      .from('products')
      .upsert(batch, { onConflict: 'id' })

    if (error) {
      console.error(`Error uploading batch ${i / BATCH_SIZE + 1}:`, error.message)
    } else {
      console.log(`Uploaded batch ${i / BATCH_SIZE + 1} of ${Math.ceil(largeProducts.length / BATCH_SIZE)}`)
    }
  }

  console.log('Upload complete!')
}

uploadInBatches()
