'use client'

import { Button } from '@/components/ui/button/button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <Button onClick={() => reset()} className="mt-4">
        Try again
      </Button>
    </div>
  )
} 