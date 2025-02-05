import { AuthService } from '@/domain/services/auth.service'
import { supabase } from '@/lib/supabase'

export class SupabaseAuthService implements AuthService {
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
} 