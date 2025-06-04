"use client"
import { useAnswerTemplates } from '@/hooks/useAnswerTemplates'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnswerTemplatesPage() {
  const { data: templates = [], isLoading } = useAnswerTemplates()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mẫu phiếu trả lời</h1>
        <Button disabled className="cursor-not-allowed">Tạo mới</Button>
      </div>
      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl: any) => (
            <Card key={tpl.maMauPhieu}>
              <CardHeader>
                <CardTitle>{tpl.tenMauPhieu}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>Số câu: {tpl.soCauHoi}</p>
                <p>Lựa chọn/câu: {tpl.soLuaChonMoiCau}</p>
                <p>Mặc định: {tpl.laMacDinh ? 'Có' : 'Không'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
