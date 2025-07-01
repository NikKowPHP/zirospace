// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Only check NEXT_PUBLIC_ variables on the client side
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Create the public client (for client-side use)
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// This function is now redundant as it's purely a client-side file.
// You can remove it, or keep it if other parts of the client-side code use it.
// The useAuth hook will get the session from the client instance anyway.
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) throw error
  return session
}