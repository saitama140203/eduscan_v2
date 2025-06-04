'use client'

import { useAuth } from "@/hooks/useAuth"
import { AnalyticsProvider } from "@/providers/analytics-provider"
import { FeatureFlagsProvider } from "@/providers/feature-flags-provider"
import type { ReactNode } from "react"

export function AuthConsumer({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return (
    <AnalyticsProvider user={user}>
      <FeatureFlagsProvider user={user}>
        {children}
      </FeatureFlagsProvider>
    </AnalyticsProvider>
  )
} 