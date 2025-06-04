import { NextResponse } from "next/server"
import { verifyDeployment } from "@/lib/deployment/verification"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const verification = await verifyDeployment()

    const statusCode = verification.overall === "fail" ? 500 : 200

    return NextResponse.json(verification, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Deployment-Status": verification.overall,
        "X-App-Version": verification.version,
        "X-Region": verification.region,
      },
    })
  } catch (error) {
    console.error("Deployment verification failed:", error)

    return NextResponse.json(
      {
        overall: "fail",
        checks: [
          {
            name: "Verification Process",
            status: "fail",
            message: "Failed to run deployment verification",
            details: error instanceof Error ? error.message : "Unknown error",
          },
        ],
        timestamp: new Date().toISOString(),
        version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
        region: process.env.VERCEL_REGION || "unknown",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}
