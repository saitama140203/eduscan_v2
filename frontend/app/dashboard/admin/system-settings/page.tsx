"use client"
import { useSettings } from '@/hooks/useSettings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SystemSettingsPage() {
  const { data: settings = [], isLoading } = useSettings()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settings.map((s: any) => (
            <Card key={s.maCaiDat}>
              <CardHeader>
                <CardTitle>{s.tuKhoa}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">{s.giaTri}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
