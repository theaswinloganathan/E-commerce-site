import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// If these are placeholders, the app should theoretically use mock data
// to ensure the UI works perfectly and looks premium even before connecting a real database.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
