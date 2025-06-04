"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClasses } from "@/hooks/useClasses";
import { Class } from "@/lib/api/classes";
import {
  Plus, Search, Filter, Eye, BookOpen, Users, ShieldCheck, XCircle,
  BarChart3, Settings
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/useDebounce";
// import { Stats } from "@/components/dashboard/Stats"; // Có thể bỏ nếu không cần dashboard stat cho admin

export default function AdminClassesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const debouncedSearch = useDebounce(search, 500);

  // Sử dụng hook đã tối ưu
  const { data: classes = [], isLoading } = useClasses({
    search: debouncedSearch || undefined,
  });

  // Lấy danh sách tổ chức từ dữ liệu
  const orgOptions = Array.from(new Set(classes.map((cls: Class) => cls.maToChuc)))
    .map((maToChuc) => {
      const classWithOrg = classes.find((c: Class) => c.maToChuc === maToChuc);
      return {
        value: maToChuc,
        label: classWithOrg?.tenToChuc || `Tổ chức #${maToChuc}`
      };
    });

  // Lấy danh sách năm học
  const yearOptions = Array.from(new Set(classes.map((cls: Class) => cls.namHoc).filter(Boolean))) as string[];

  // Lọc dữ liệu
  const filteredClasses = classes.filter((classItem: Class) => {
    const matchesSearch = classItem.tenLop.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesGrade = selectedGrade === "all" || (classItem.capHoc || "") === selectedGrade;
    const matchesOrg = selectedOrg === "all" || String(classItem.maToChuc) === String(selectedOrg);
    const matchesStatus = selectedStatus === "all"
      || (selectedStatus === "active" && classItem.trangThai)
      || (selectedStatus === "inactive" && !classItem.trangThai);
    const matchesYear = selectedYear === "all" || (classItem.namHoc === selectedYear);
    return matchesSearch && matchesGrade && matchesOrg && matchesStatus && matchesYear;
  });

  // Tổng hợp stats
  const totalStudents = filteredClasses.reduce((sum: number, cls: Class) => sum + (cls.total_students || 0), 0);
  const activeClasses = filteredClasses.filter((cls: Class) => cls.trangThai).length;

  // Handlers
  const handleViewClass = (classId: number) => router.push(`/dashboard/admin/classes/${classId}`);
  const handleViewStudents = (classId: number) => router.push(`/dashboard/admin/classes/${classId}/students`);
  const handleEditClass = (classId: number) => router.push(`/dashboard/admin/classes/${classId}/edit`);
  const handleViewAnalytics = (classId: number) => router.push(`/dashboard/admin/classes/${classId}/analytics`);
  const handleViewSettings = (classId: number) => router.push(`/dashboard/admin/classes/${classId}/settings`);
  const handleCreateClass = () => router.push("/dashboard/admin/classes/create");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Đang tải dữ liệu lớp học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lớp học</h1>
          <p className="text-muted-foreground">
            Danh sách tất cả lớp học thuộc hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateClass} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Tạo lớp học
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng lớp</p>
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
                <p className="text-sm text-muted-foreground">Lớp hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{activeClasses}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng học sinh</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-md flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tỉ lệ hoạt động</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredClasses.length > 0 ? Math.round((activeClasses / filteredClasses.length) * 100) : 0}%
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-md flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tên lớp..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger>
                <SelectValue placeholder="Tổ chức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tổ chức</SelectItem>
                {orgOptions.map(opt =>
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Cấp học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp</SelectItem>
                <SelectItem value="Lớp 1">Lớp 1</SelectItem>
                <SelectItem value="Lớp 2">Lớp 2</SelectItem>
                <SelectItem value="Lớp 3">Lớp 3</SelectItem>
                <SelectItem value="Lớp 4">Lớp 4</SelectItem>
                <SelectItem value="Lớp 5">Lớp 5</SelectItem>
                <SelectItem value="Lớp 6">Lớp 6</SelectItem>
                <SelectItem value="Lớp 7">Lớp 7</SelectItem>
                <SelectItem value="Lớp 8">Lớp 8</SelectItem>
                <SelectItem value="Lớp 9">Lớp 9</SelectItem>
                <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                <SelectItem value="Lớp 12">Lớp 12</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Năm học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả năm</SelectItem>
                {yearOptions.map((year: string) =>
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem: Class) => (
          <Card key={classItem.maLopHoc} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{classItem.tenLop}</CardTitle>
                <Badge
                  variant={classItem.trangThai ? "default" : "destructive"}
                  className={classItem.trangThai ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {classItem.trangThai ? (
                    <ShieldCheck className="inline mr-1 h-4 w-4" />
                  ) : (
                    <XCircle className="inline mr-1 h-4 w-4" />
                  )}
                  {classItem.trangThai ? "Hoạt động" : "Đã đóng"}
                </Badge>
              </div>
              <CardDescription>
                Năm học {classItem.namHoc || "N/A"} &nbsp;|&nbsp;
                Cấp: <span className="font-medium">{classItem.capHoc || "N/A"}</span> &nbsp;|&nbsp;
                {classItem.tenToChuc && (
                  <>Tổ chức: <span className="font-medium">{classItem.tenToChuc}</span></>
                )}
              </CardDescription>
              <p className="text-sm mt-1 text-muted-foreground">
                <span className="font-semibold">GVCN:</span> {classItem.tenGiaoVienChuNhiem || "Chưa phân công"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {classItem.total_students ?? 0}
                  </div>
                  <div className="text-sm text-blue-600">Học sinh</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {classItem.trangThai ? "ON" : "OFF"}
                  </div>
                  <div className="text-sm text-green-600">Trạng thái</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewClass(classItem.maLopHoc)}
                >
                  <Eye className="mr-2 h-3 w-3" />
                  Chi tiết
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Thao tác
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewAnalytics(classItem.maLopHoc)}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Phân tích
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewSettings(classItem.maLopHoc)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewStudents(classItem.maLopHoc)}>
                      <Users className="mr-2 h-4 w-4" />
                      Học sinh
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClass(classItem.maLopHoc)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
              Không tìm thấy lớp học phù hợp
            </h3>
            <p className="text-muted-foreground mb-4">
              Kiểm tra lại bộ lọc hoặc thêm mới lớp học.
            </p>
            <Button onClick={handleCreateClass} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Tạo lớp học đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
