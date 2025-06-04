import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  // Simple status endpoint for uptime monitoring
  const status = {
    status: "operational",
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    region: process.env.VERCEL_REGION || "unknown",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      frontend: "operational",
      api: "operational", // This would check actual API status
      database: "operational", // This would check actual DB status
    },
  }

  return NextResponse.json(status, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Status": "operational",
      "X-Version": status.version,
    },
  })
}
