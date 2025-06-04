"use client"
import { Stats } from '@/components/dashboard/Stats'
export default function SystemAnalyticsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Phân tích hệ thống</h1>
      <Stats />
    </div>
  )
}
