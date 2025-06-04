import { NextResponse } from "next/server"
import { headers } from "next/headers"

// Simple feature flags system
// In production, this would connect to a feature flag service or database
const FEATURE_FLAGS = {
  // Core features
  "new-dashboard": {
    enabled: true,
    rolloutPercentage: 100,
    enabledFor: ["admin", "manager", "teacher"],
  },
  "advanced-analytics": {
    enabled: true,
    rolloutPercentage: 50,
    enabledFor: ["admin", "manager"],
  },
  "bulk-import": {
    enabled: true,
    rolloutPercentage: 100,
    enabledFor: ["admin", "manager"],
  },

  // Experimental features
  "ai-grading": {
    enabled: process.env.NODE_ENV === "production" ? false : true,
    rolloutPercentage: 10,
    enabledFor: ["admin"],
  },
  "real-time-collaboration": {
    enabled: false,
    rolloutPercentage: 0,
    enabledFor: [],
  },
}

export const dynamic = "force-dynamic"
export const revalidate = 60 // Cache for 1 minute

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const headersList = headers()

  // Get user info from query params or headers
  const userId = searchParams.get("userId") || "anonymous"
  const userRole = searchParams.get("role") || "anonymous"

  // Calculate which features are enabled for this user
  const userFeatureFlags: Record<string, boolean> = {}

  Object.entries(FEATURE_FLAGS).forEach(([featureKey, feature]) => {
    // Check if feature is enabled globally
    if (!feature.enabled) {
      userFeatureFlags[featureKey] = false
      return
    }

    // Check if user role is in enabled roles
    const roleEnabled = feature.enabledFor.includes(userRole)
    if (!roleEnabled) {
      userFeatureFlags[featureKey] = false
      return
    }

    // Apply percentage rollout (using userId for consistency)
    const userPercentile = getUserPercentile(userId)
    userFeatureFlags[featureKey] = userPercentile <= feature.rolloutPercentage
  })

  return NextResponse.json(
    {
      features: userFeatureFlags,
      userId,
      userRole,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    },
  )
}

// Helper to get consistent user percentile (0-100) based on userId
function getUserPercentile(userId: string): number {
  // Simple hash function to get a number between 0-100
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash % 100)
}
