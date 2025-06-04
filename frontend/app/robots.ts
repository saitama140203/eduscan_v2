import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/auth/login"],
      disallow: ["/api/", "/dashboard/admin/", "/dashboard/manager/", "/dashboard/teacher/", "/auth/reset-password"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  }
}
