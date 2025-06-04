'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Download, Upload, Filter, Eye, Settings, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/useDebounce';
import { Stats } from '@/components/dashboard/Stats';

// Mock data cho Manager - chỉ classes trong organization
const mockManagerClasses = [
  {
    maLopHoc: 1,
    tenLop: "10A1",
    capHoc: "Lớp 10",
    namHoc: "2024-2025",
    maGiaoVienChuNhiem: 101,
    tenGiaoVienChuNhiem: "Nguyễn Văn An",
    soLuongHocSinh: 35,
    soLuongBaiThi: 12,
    diemTrungBinh: 7.8,
    trangThai: true,
    thoiGianTao: "2024-01-15",
    thoiGianCapNhat: "2024-01-20"
  },
  {
    maLopHoc: 2,
    tenLop: "10A2", 
    capHoc: "Lớp 10",
    namHoc: "2024-2025",
    maGiaoVienChuNhiem: 102,
    tenGiaoVienChuNhiem: "Trần Thị Bình",
    soLuongHocSinh: 32,
    soLuongBaiThi: 8,
    diemTrungBinh: 8.2,
    trangThai: true,
    thoiGianTao: "2024-01-15",
    thoiGianCapNhat: "2024-01-18"
  },
  {
    maLopHoc: 3,
    tenLop: "11B1",
    capHoc: "Lớp 11",
    namHoc: "2024-2025",
    maGiaoVienChuNhiem: 103,
    tenGiaoVienChuNhiem: "Lê Văn Cường",
    soLuongHocSinh: 28,
    soLuongBaiThi: 15,
    diemTrungBinh: 6.9,
    trangThai: true,
    thoiGianTao: "2024-01-10",
    thoiGianCapNhat: "2024-01-22"
  },
  {
    maLopHoc: 4,
    tenLop: "12C1",
    capHoc: "Lớp 12", 
    namHoc: "2024-2025",
    maGiaoVienChuNhiem: null,
    tenGiaoVienChuNhiem: null,
    soLuongHocSinh: 0,
    soLuongBaiThi: 0,
    diemTrungBinh: 0,
    trangThai: false,
    thoiGianTao: "2024-01-08",
    thoiGianCapNhat: "2024-01-08"
  }
];

export default function ManagerClassesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  
  const debouncedSearch = useDebounce(search, 500);

  // Filter classes based on search and filters
  const filteredClasses = mockManagerClasses.filter(classItem => {
    const matchesSearch = classItem.tenLop.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         (classItem.tenGiaoVienChuNhiem && classItem.tenGiaoVienChuNhiem.toLowerCase().includes(debouncedSearch.toLowerCase()));
    
    const matchesGrade = selectedGrade === 'all' || classItem.capHoc === selectedGrade;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && classItem.trangThai) ||
                         (selectedStatus === 'inactive' && !classItem.trangThai);
    const matchesYear = selectedYear === 'all' || classItem.namHoc === selectedYear;
    const matchesTeacher = selectedTeacher === 'all' || 
                          (selectedTeacher === 'assigned' && classItem.tenGiaoVienChuNhiem) ||
                          (selectedTeacher === 'unassigned' && !classItem.tenGiaoVienChuNhiem);
    
    return matchesSearch && matchesGrade && matchesStatus && matchesYear && matchesTeacher;
  });

  const handleViewClass = (classId: number) => {
    router.push(`/dashboard/manager/classes/${classId}`);
  };

  const handleViewStudents = (classId: number) => {
    router.push(`/dashboard/manager/classes/${classId}/students`);
  };

  const handleViewExams = (classId: number) => {
    router.push(`/dashboard/manager/classes/${classId}/exams`);
  };

  const handleAssignTeacher = (classId: number) => {
    router.push(`/dashboard/manager/classes/${classId}/assign-teacher`);
  };

  const handleViewAnalytics = (classId: number) => {
    router.push(`/dashboard/manager/classes/${classId}/analytics`);
  };

  const handleEditClass = (classId: number) => {
    router.push(`/dashboard/manager/classes/${classId}/edit`);
  };

  const handleExportClasses = () => {
    console.log('Exporting organization classes...');
  };

  const handleCreateClass = () => {
    router.push('/dashboard/manager/classes/create');
  };

  // Calculate summary stats
  const totalStudents = filteredClasses.reduce((sum, cls) => sum + cls.soLuongHocSinh, 0);
  const totalExams = filteredClasses.reduce((sum, cls) => sum + cls.soLuongBaiThi, 0);
  const unassignedClasses = filteredClasses.filter(cls => !cls.tenGiaoVienChuNhiem).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lớp học</h1>
          <p className="text-muted-foreground">
            Quản lý lớp học trong tổ chức của bạn
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportClasses}>
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button onClick={handleCreateClass}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo lớp học
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
                <p className="text-sm text-muted-foreground">Tổng lớp học</p>
                <p className="text-2xl font-bold">{filteredClasses.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
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
                <p className="text-sm text-muted-foreground">Tổng bài thi</p>
                <p className="text-2xl font-bold">{totalExams}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-md flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chưa phân GVCN</p>
                <p className="text-2xl font-bold text-red-600">{unassignedClasses}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-md flex items-center justify-center">
                <Users className="h-4 w-4 text-red-600" />
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
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm lớp, GVCN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Grade Filter */}
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

            {/* Teacher Assignment Filter */}
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="GVCN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="assigned">Đã phân công</SelectItem>
                <SelectItem value="unassigned">Chưa phân công</SelectItem>
              </SelectContent>
            </Select>

            {/* Year Filter */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Năm học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả năm</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm ngưng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lớp học</CardTitle>
          <CardDescription>
            Hiển thị {filteredClasses.length} / {mockManagerClasses.length} lớp học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên lớp</TableHead>
                <TableHead>Cấp học</TableHead>
                <TableHead>GVCN</TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Bài thi</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((classItem) => (
                <TableRow key={classItem.maLopHoc}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{classItem.tenLop}</div>
                      <div className="text-sm text-muted-foreground">
                        {classItem.namHoc}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{classItem.capHoc}</Badge>
                  </TableCell>
                  <TableCell>
                    {classItem.tenGiaoVienChuNhiem ? (
                      <div className="text-sm">
                        <div className="font-medium">{classItem.tenGiaoVienChuNhiem}</div>
                        <div className="text-muted-foreground">ID: {classItem.maGiaoVienChuNhiem}</div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-red-600 w-fit">
                          Chưa phân công
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAssignTeacher(classItem.maLopHoc)}
                          className="text-xs h-6"
                        >
                          Phân công
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold">{classItem.soLuongHocSinh}</div>
                    <div className="text-xs text-muted-foreground">học sinh</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold">{classItem.soLuongBaiThi}</div>
                    <div className="text-xs text-muted-foreground">bài thi</div>
                  </TableCell>
                  <TableCell className="text-center">
                    {classItem.diemTrungBinh > 0 ? (
                      <Badge 
                        variant={classItem.diemTrungBinh >= 8 ? "default" : 
                                classItem.diemTrungBinh >= 6.5 ? "secondary" : "destructive"}
                      >
                        {classItem.diemTrungBinh}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={classItem.trangThai ? "default" : "secondary"}>
                      {classItem.trangThai ? "Hoạt động" : "Tạm ngưng"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Quản lý
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Quản lý lớp học</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewClass(classItem.maLopHoc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem tổng quan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewAnalytics(classItem.maLopHoc)}>
                          📊 Phân tích thành tích
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewStudents(classItem.maLopHoc)}>
                          👥 Quản lý học sinh ({classItem.soLuongHocSinh})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewExams(classItem.maLopHoc)}>
                          📝 Quản lý bài thi ({classItem.soLuongBaiThi})
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditClass(classItem.maLopHoc)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Chỉnh sửa lớp
                        </DropdownMenuItem>
                        {!classItem.tenGiaoVienChuNhiem && (
                          <DropdownMenuItem onClick={() => handleAssignTeacher(classItem.maLopHoc)}>
                            👨‍🏫 Phân công GVCN
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredClasses.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Không tìm thấy lớp học nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
