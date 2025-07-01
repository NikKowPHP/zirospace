// src/components/protected-route.tsx (This is now the main guard)
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If loading is finished and there's no user, redirect.
    if (!loading && !user) {
      router.replace('/admin/login')
    }
  }, [user, loading, router])

  // While loading, show a spinner to prevent content flashing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If there is a user, render the children. Otherwise, render nothing while redirecting.
  return user ? <>{children}</> : null
}