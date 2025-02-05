import { User, Session } from '@supabase/supabase-js'

export interface AuthService {
  login(email: string, password: string): Promise<{ user: User | null; session: Session | null }>
  logout(): Promise<void>
  getSession(): Promise<Session | null>
} 