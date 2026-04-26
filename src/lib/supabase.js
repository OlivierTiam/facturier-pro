// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uvgaenieeymkvpurzgay.supabase.co'
const supabaseAnonKey = 'sb_publishable_b5m5I9jfNkpdq1exlRZg9Q_gBs58csw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})