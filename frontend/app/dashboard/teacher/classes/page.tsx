"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { classesApi, Class } from "@/lib/api/classes";
import {
  Plus, Search, Filter, Eye, BookOpen, Users, FileText, TrendingUp, Scan,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { Stats } from "@/components/dashboard/Stats";

export default function TeacherClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const debouncedSearch = useDebounce(search, 500);

  // Lấy dữ liệu lớp học qua API (đã login)
  useEffect(() => {
    let ignore = false;
    async function fetchClasses() {
      setIsLoading(true);
      try {
        const res = await classesApi.getClasses({
          search: debouncedSearch,
        });
        if (!ignore) setClasses(Array.isArray(res) ? res : []);
      } catch (e) {
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClasses();
    return () => { ignore = true; };
  }, [debouncedSearch]);

  // Lọc theo tìm kiếm/cấp học/trạng thái
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.tenLop.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesGrade = selectedGrade === "all" || (classItem.capHoc || "") === selectedGrade;
    const matchesStatus = selectedStatus === "all"
      || (selectedStatus === "active" && classItem.trangThai)
      || (selectedStatus === "inactive" && !classItem.trangThai);
    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Tổng hợp stats (fallback nếu API chưa trả đủ)
  const totalStudents = filteredClasses.reduce((sum, cls) => sum + (cls.total_students || 0), 0);
  const totalExams = filteredClasses.reduce((sum, cls) => sum + (cls["soLuongBaiThi"] || 0), 0);
  const pendingSheets = filteredClasses.reduce((sum, cls) => sum + (cls["soLuongPhieuChuaQuet"] || 0), 0);
  const avgScore = filteredClasses.length > 0
    ? (filteredClasses.reduce((sum, cls) => sum + (cls["diemTrungBinh"] || 0), 0) / filteredClasses.length).toFixed(1)
    : 0;

  // Handlers
  const handleViewClass = (classId: number) => router.push(`/dashboard/teacher/classes/${classId}`);
  const handleViewStudents = (classId: number) => router.push(`/dashboard/teacher/classes/${classId}/students`);
  const handleViewExams = (classId: number) => router.push(`/dashboard/teacher/classes/${classId}/exams`);
  const handleCreateExam = (classId: number) => router.push(`/dashboard/teacher/classes/${classId}/exams/create`);
  const handleScanAnswers = () => router.push("/dashboard/teacher/scan");

  // Loading UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-muted-foreground">Đang tải dữ liệu lớp học...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lớp học của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý các lớp học bạn là giáo viên chủ nhiệm
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleScanAnswers}>
            <Scan className="mr-2 h-4 w-4" />
            Quét phiếu trả lời
          </Button>
          <Button onClick={() => router.push("/dashboard/teacher/classes/select-for-exam")}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài kiểm tra
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Stats />

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lớp của tôi</p>
                <p className="text-2xl font-bold">{filteredClasses.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Học sinh</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bài kiểm tra</p>
                <p className="text-2xl font-bold">{totalExams}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-md flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Điểm TB lớp</p>
                <p className="text-2xl font-bold">{avgScore}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-md flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions Alert */}
      {pendingSheets > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-orange-100 rounded-md flex items-center justify-center">
                  <Scan className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-orange-800">
                    Bạn có {pendingSheets} phiếu trả lời chưa quét
                  </p>
                  <p className="text-sm text-orange-600">
                    Hãy quét các phiếu để cập nhật kết quả học sinh
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleScanAnswers} className="border-orange-300">
                <Scan className="mr-2 h-4 w-4" />
                Quét ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm lớp học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Cấp học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp</SelectItem>
                <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                <SelectItem value="Lớp 12">Lớp 12</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang dạy</SelectItem>
                <SelectItem value="inactive">Tạm ngưng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <Card key={classItem.maLopHoc} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{classItem.tenLop}</CardTitle>
                <Badge variant="secondary">{classItem.capHoc}</Badge>
              </div>
              <CardDescription>
                Năm học {classItem.namHoc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats - nếu thiếu có thể để trống hoặc cập nhật sau */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {classItem.total_students || 0}
                  </div>
                  <div className="text-sm text-blue-600">Học sinh</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {classItem["soLuongBaiThi"] || 0}
                  </div>
                  <div className="text-sm text-purple-600">Bài kiểm tra</div>
                </div>
              </div>
              {/* Các thống kê khác (nếu có) ... */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleViewClass(classItem.maLopHoc)}>
                  <Eye className="mr-2 h-3 w-3" />
                  Xem chi tiết
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCreateExam(classItem.maLopHoc)}>
                  <Plus className="mr-2 h-3 w-3" />
                  Tạo bài thi
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewStudents(classItem.maLopHoc)}
                  className="text-xs"
                >
                  👥 Học sinh ({classItem.total_students || 0})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewExams(classItem.maLopHoc)}
                  className="text-xs"
                >
                  📝 Bài thi ({classItem["soLuongBaiThi"] || 0})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-10">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Chưa có lớp học nào
            </h3>
            <p className="text-muted-foreground mb-4">
              Bạn chưa được phân công làm chủ nhiệm lớp học nào.
            </p>
            <p className="text-sm text-muted-foreground">
              Liên hệ quản lý để được phân công lớp học.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
