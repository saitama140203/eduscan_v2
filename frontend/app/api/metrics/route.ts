import { NextResponse } from "next/server"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const headersList = headers()

  // Basic server metrics
  const metrics = {
    timestamp: new Date().toISOString(),
    server: {
      region: process.env.VERCEL_REGION || "unknown",
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    },
    request: {
      userAgent: headersList.get("user-agent"),
      ip: headersList.get("x-forwarded-for") || headersList.get("x-real-ip"),
      host: headersList.get("host"),
    },
  }

  return NextResponse.json(metrics, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}

export async function POST(request: Request) {
  try {
    const clientMetrics = await request.json()
    const headersList = headers()

    // Log client metrics (in production, send to monitoring service)
    console.log("Client metrics received:", clientMetrics)

    // Enrich with server context
    const enrichedMetrics = {
      ...clientMetrics,
      server: {
        region: process.env.VERCEL_REGION || "unknown",
        timestamp: new Date().toISOString(),
      },
      request: {
        userAgent: headersList.get("user-agent"),
        ip: headersList.get("x-forwarded-for") || headersList.get("x-real-ip"),
        host: headersList.get("host"),
      },
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === "production") {
      // Example: await sendToMonitoringService(enrichedMetrics)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error processing metrics:", error)
    return NextResponse.json({ error: "Failed to process metrics" }, { status: 500 })
  }
}
