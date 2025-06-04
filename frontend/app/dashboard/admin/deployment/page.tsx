import { DeploymentStatus } from "@/components/deployment/deployment-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: "Deployment Status",
  description: "Monitor deployment health and configuration",
}

export default function DeploymentPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deployment Status</h1>
        <p className="text-muted-foreground">Monitor your application deployment health and configuration</p>
      </div>

      <DeploymentStatus />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
            <CardDescription>Current deployment environment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Environment</span>
              <Badge variant="outline">{process.env.NODE_ENV === "production" ? "Production" : "Development"}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Version</span>
              <Badge variant="secondary">{process.env.NEXT_PUBLIC_APP_VERSION || "Unknown"}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Region</span>
              <Badge variant="outline">{process.env.VERCEL_REGION || "Unknown"}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">App URL</span>
              <a
                href={process.env.NEXT_PUBLIC_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {process.env.NEXT_PUBLIC_APP_URL}
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">API URL</span>
              <a
                href={process.env.NEXT_PUBLIC_API_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {process.env.NEXT_PUBLIC_API_URL}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common deployment and monitoring tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Health Checks</h4>
              <div className="space-y-1">
                <a
                  href="/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  → Frontend Health Check
                </a>
                <a
                  href="/api/deployment/verify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  → Deployment Verification
                </a>
                <a
                  href="/metrics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-600 hover:underline"
                >
                  → Performance Metrics
                </a>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">External Services</h4>
              <div className="space-y-1">
                {process.env.NEXT_PUBLIC_GA_ID && (
                  <a
                    href="https://analytics.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    → Google Analytics
                  </a>
                )}
                {process.env.NEXT_PUBLIC_SENTRY_DSN && (
                  <a
                    href="https://sentry.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    → Sentry Dashboard
                  </a>
                )}
                {process.env.GOOGLE_SITE_VERIFICATION && (
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    → Google Search Console
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deployment Checklist</CardTitle>
          <CardDescription>Essential items to verify after deployment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">✅ Configuration</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• All environment variables configured</li>
                <li>• Security headers implemented</li>
                <li>• SSL/TLS certificate active</li>
                <li>• Domain configuration correct</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">✅ Monitoring</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Error tracking active (Sentry)</li>
                <li>• Analytics tracking (Google Analytics)</li>
                <li>• Performance monitoring enabled</li>
                <li>• Health checks responding</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">✅ Performance</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Core Web Vitals optimized</li>
                <li>• Bundle size optimized</li>
                <li>• Images optimized</li>
                <li>• Caching configured</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">✅ SEO & Accessibility</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Meta tags configured</li>
                <li>• Sitemap generated</li>
                <li>• Robots.txt configured</li>
                <li>• Accessibility compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
