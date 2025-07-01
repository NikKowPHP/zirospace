// src/contexts/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User, AuthError, AuthChangeEvent } from '@supabase/supabase-js' // Import AuthChangeEvent
import { SupabaseAuthService } from '@/infrastructure/services/supabase-auth.service'
import { useRouter, usePathname } from 'next/navigation' 
import { MockAuthService } from '@/infrastructure/services/mock-auth-service.service'
import logger from '@/lib/logger'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isMock] = useState(
    () => process.env.NEXT_PUBLIC_MOCK_REPOSITORIES === 'true'
  )
  const [authService] = useState(() =>
    isMock ? new MockAuthService() : new SupabaseAuthService()
  )

  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true);
    authService
      .getSession()
      .then((session) => {
        setSession(session)
        setUser(session?.user ?? null)
      })
      .catch((error) => {
        setError(
          error instanceof Error ? error.message : 'Session error occurred'
        )
      })
      .finally(() => {
        setLoading(false)
      })

    const {
      data: { subscription },
    } = authService.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // --- 💡 START OF THE FIX ---
      // When a user successfully signs in or out, the cookie is set/cleared on the client.
      // We need to trigger a server request to make the new session state available
      // to the middleware and Server Components. `router.refresh()` does this.
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh();
      }
      // --- END OF THE FIX ---
    })

    return () => subscription.unsubscribe()
  }, [authService, router]);


  useEffect(() => {
    if (loading) return;

    const isLoginPage = pathname === '/admin/login';
    logger.log('AuthProvider: Current pathname:', pathname);
    logger.log('AuthProvider: Is login page:', isLoginPage);
    logger.log('AuthProvider: User:', user);
    
    if (user && isLoginPage) {
      console.log('AuthProvider: User detected on login page, redirecting to dashboard...');
      router.replace('/admin/sections/dashboard');
    }

    const isAdminPage = pathname.startsWith('/admin/');
    if (!user && isAdminPage && !isLoginPage) {
      console.log('AuthProvider: No user detected on protected page, redirecting to login...');
      router.replace('/admin/login');
    }

  }, [user, loading, router, pathname]);
    const login = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      await authService.login(email, password)
      // The onAuthStateChange listener will handle the refresh and redirect.
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Failed to login'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await authService.logout()
      setUser(null)
      setSession(null)
      // Redirecting after logout is good practice.
      router.replace('/admin/login'); 
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Logout failed')
    }
  }

  const clearError = () => setError(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}