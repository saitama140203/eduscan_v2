'use client';

import { useState } from 'react';
import { Plus, Search, Download, Upload, Filter } from 'lucide-react';
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
import { useDebounce } from '@/hooks/useDebounce';
import { Stats } from '@/components/dashboard/Stats';

// Mock data - sẽ thay bằng real API calls
const mockStudents = [
  {
    maHocSinh: 1,
    maHocSinhTruong: "HS001",
    hoTen: "Nguyễn Văn An",
    ngaySinh: "2008-05-15",
    lop: "10A1",
    toChuc: "THPT Lê Quý Đôn",
    trangThai: true,
    soLuongBaiThi: 12,
    diemTrungBinh: 8.5
  },
  {
    maHocSinh: 2,
    maHocSinhTruong: "HS002", 
    hoTen: "Trần Thị Bình",
    ngaySinh: "2008-08-22",
    lop: "10A2",
    toChuc: "THPT Lê Quý Đôn",
    trangThai: true,
    soLuongBaiThi: 15,
    diemTrungBinh: 7.8
  },
  {
    maHocSinh: 3,
    maHocSinhTruong: "HS003",
    hoTen: "Lê Văn Cường", 
    ngaySinh: "2008-12-03",
    lop: "11B1",
    toChuc: "THPT Nguyễn Huệ",
    trangThai: false,
    soLuongBaiThi: 8,
    diemTrungBinh: 6.2
  }
];

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const debouncedSearch = useDebounce(search, 500);

  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.hoTen.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         student.maHocSinhTruong.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesOrg = selectedOrganization === 'all' || student.toChuc === selectedOrganization;
    const matchesClass = selectedClass === 'all' || student.lop === selectedClass;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && student.trangThai) ||
                         (selectedStatus === 'inactive' && !student.trangThai);
    
    return matchesSearch && matchesOrg && matchesClass && matchesStatus;
  });

  const handleExportStudents = () => {
    // Logic xuất danh sách học sinh
    console.log('Exporting students...');
  };

  const handleImportStudents = () => {
    // Logic import học sinh từ file
    console.log('Importing students...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý học sinh</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả học sinh trong hệ thống - phạm vi toàn tổ chức
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportStudents}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button variant="outline" onClick={handleImportStudents}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm học sinh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Stats />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm học sinh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Organization Filter */}
            <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tổ chức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tổ chức</SelectItem>
                <SelectItem value="THPT Lê Quý Đôn">THPT Lê Quý Đôn</SelectItem>
                <SelectItem value="THPT Nguyễn Huệ">THPT Nguyễn Huệ</SelectItem>
              </SelectContent>
            </Select>

            {/* Class Filter */}
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                <SelectItem value="10A1">10A1</SelectItem>
                <SelectItem value="10A2">10A2</SelectItem>
                <SelectItem value="11B1">11B1</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang học</SelectItem>
                <SelectItem value="inactive">Đã nghỉ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học sinh</CardTitle>
          <CardDescription>
            Hiển thị {filteredStudents.length} / {mockStudents.length} học sinh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HS</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Tổ chức</TableHead>
                <TableHead>Số bài thi</TableHead>
                <TableHead>Điểm TB</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.maHocSinh}>
                  <TableCell className="font-medium">{student.maHocSinhTruong}</TableCell>
                  <TableCell>{student.hoTen}</TableCell>
                  <TableCell>{new Date(student.ngaySinh).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.lop}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{student.toChuc}</TableCell>
                  <TableCell className="text-center">{student.soLuongBaiThi}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={student.diemTrungBinh >= 8 ? "default" : 
                              student.diemTrungBinh >= 6.5 ? "secondary" : "destructive"}
                    >
                      {student.diemTrungBinh}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.trangThai ? "default" : "secondary"}>
                      {student.trangThai ? "Đang học" : "Đã nghỉ"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Xem
                      </Button>
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Không tìm thấy học sinh nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
