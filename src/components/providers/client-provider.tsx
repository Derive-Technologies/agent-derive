'use client'

import { useEffect } from 'react'

// Import the warning suppressor immediately
import '@/lib/suppress-warnings'

export function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Additional client-side initialization if needed
    // The warning suppressor has already run by this point
  }, [])

  return <>{children}</>
}