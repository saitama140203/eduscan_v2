'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Search, UserCheck, Users, GraduationCap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';

// Mock class data
const mockClassData = {
  maLopHoc: 1,
  tenLop: "10A1",
  capHoc: "Lớp 10",
  namHoc: "2024-2025",
  soLuongHocSinh: 35,
  currentTeacher: null
};

// Mock teachers data
const mockTeachers = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nva@school.edu.vn",
    phone: "0901234567",
    subject: "Toán",
    experience: 8,
    currentClasses: ["11A2", "12B1"],
    isAvailable: true,
    avatar: "/avatars/teacher1.jpg"
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "ttb@school.edu.vn",
    phone: "0907654321",
    subject: "Lý",
    experience: 5,
    currentClasses: ["10B1"],
    isAvailable: true,
    avatar: "/avatars/teacher2.jpg"
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    email: "lvc@school.edu.vn",
    phone: "0912345678",
    subject: "Hóa",
    experience: 12,
    currentClasses: ["11C1", "12A1", "12C2"],
    isAvailable: false,
    avatar: "/avatars/teacher3.jpg"
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    email: "ptd@school.edu.vn",
    phone: "0987654321",
    subject: "Văn",
    experience: 6,
    currentClasses: [],
    isAvailable: true,
    avatar: "/avatars/teacher4.jpg"
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    email: "hve@school.edu.vn",
    phone: "0934567890",
    subject: "Anh",
    experience: 3,
    currentClasses: ["10A2"],
    isAvailable: true,
    avatar: "/avatars/teacher5.jpg"
  }
];

export default function AssignTeacherPage({ params }: { params: { classId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const classId = params.classId;
  
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearch = useDebounce(search, 300);

  // Filter teachers based on search
  const filteredTeachers = mockTeachers.filter(teacher => 
    teacher.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    teacher.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedTeacher) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn giáo viên để phân công.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const teacher = mockTeachers.find(t => t.id.toString() === selectedTeacher);
      
      toast({
        title: "Thành công!",
        description: `Đã phân công ${teacher?.name} làm chủ nhiệm lớp ${mockClassData.tenLop}.`,
      });

      router.push(`/dashboard/manager/classes/${classId}`);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi phân công giáo viên. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/manager/classes/${classId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/manager/classes/${classId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về chi tiết lớp
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phân công giáo viên chủ nhiệm</h1>
            <p className="text-muted-foreground">
              Chọn giáo viên chủ nhiệm cho lớp {mockClassData.tenLop}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Tìm kiếm giáo viên</CardTitle>
              <CardDescription>
                Tìm kiếm theo tên, môn học hoặc email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm giáo viên..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Teachers List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách giáo viên</CardTitle>
              <CardDescription>
                Hiển thị {filteredTeachers.length} / {mockTeachers.length} giáo viên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <div className="space-y-4">
                  {filteredTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        selectedTeacher === teacher.id.toString()
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      } ${!teacher.isAvailable ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={teacher.id.toString()} 
                          id={`teacher-${teacher.id}`}
                          disabled={!teacher.isAvailable}
                        />
                        <Label 
                          htmlFor={`teacher-${teacher.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{teacher.name}</h3>
                                  {!teacher.isAvailable && (
                                    <Badge variant="secondary">Bận</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{teacher.email}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <div className="flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{teacher.subject}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{teacher.experience} năm kinh nghiệm</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                Đang chủ nhiệm: {teacher.currentClasses.length} lớp
                              </div>
                              {teacher.currentClasses.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {teacher.currentClasses.map((className, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {className}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {filteredTeachers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Không tìm thấy giáo viên
                  </h3>
                  <p className="text-muted-foreground">
                    Thử thay đổi từ khóa tìm kiếm
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleAssign} disabled={!selectedTeacher || isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Đang phân công...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Phân công
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Class Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin lớp học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Tên lớp</Label>
                <p className="font-medium">{mockClassData.tenLop}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Cấp học</Label>
                <p className="font-medium">{mockClassData.capHoc}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Năm học</Label>
                <p className="font-medium">{mockClassData.namHoc}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Số học sinh</Label>
                <p className="font-medium">{mockClassData.soLuongHocSinh} học sinh</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">GVCN hiện tại</Label>
                <p className="font-medium text-orange-600">
                  {mockClassData.currentTeacher || "Chưa phân công"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hướng dẫn phân công</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Kiểm tra khả năng</p>
                  <p className="text-sm text-muted-foreground">
                    Chọn giáo viên có thời gian và kinh nghiệm phù hợp
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Cân nhắc tải công việc</p>
                  <p className="text-sm text-muted-foreground">
                    Giáo viên đã chủ nhiệm nhiều lớp có thể ảnh hưởng chất lượng
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Thông báo cho giáo viên</p>
                  <p className="text-sm text-muted-foreground">
                    Hệ thống sẽ tự động gửi thông báo đến giáo viên được chọn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê giáo viên</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tổng số giáo viên:</span>
                <span className="font-medium">{mockTeachers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sẵn sàng nhận lớp:</span>
                <span className="font-medium text-green-600">
                  {mockTeachers.filter(t => t.isAvailable).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Đang bận:</span>
                <span className="font-medium text-orange-600">
                  {mockTeachers.filter(t => !t.isAvailable).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Chưa có lớp:</span>
                <span className="font-medium text-blue-600">
                  {mockTeachers.filter(t => t.currentClasses.length === 0).length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-lg text-amber-800">⚠️ Lưu ý</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• Giáo viên sẽ nhận thông báo qua email</li>
                <li>• Có thể thay đổi GVCN bất kỳ lúc nào</li>
                <li>• Giáo viên bận có thể từ chối nhận lớp</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
