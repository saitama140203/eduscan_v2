"use client";
import { useExams } from "@/hooks/useExams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminExamsPage() {
  const { data: exams = [], isLoading } = useExams();
  const router = useRouter();

  if (isLoading) {
    return <p>Đang tải danh sách bài kiểm tra...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý bài kiểm tra</h1>
        <Button onClick={() => router.push('/dashboard/admin/exams/create')}>Tạo bài kiểm tra</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam: any) => (
          <Card key={exam.maBaiKiemTra} className="hover:shadow">
            <CardHeader>
              <CardTitle>{exam.tieuDe}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>Môn: {exam.monHoc}</p>
              <p>Số câu: {exam.tongSoCau}</p>
              <p>Trạng thái: {exam.trangThai}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
