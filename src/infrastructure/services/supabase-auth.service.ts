import { IAuthService } from '@/domain/services/auth.service'
import { supabase } from '@/lib/supabase'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export class SupabaseAuthService implements IAuthService {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    console.log('login', data, error)
    if (error) throw new Error(error.message)
    return data
  }

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)
    return session
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => Promise<void> | void) {
    return supabase.auth.onAuthStateChange(callback)
  }
} 