'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Mock teachers data
const mockTeachers = [
  { id: 1, name: "Nguyễn Văn An", subject: "Toán" },
  { id: 2, name: "Trần Thị Bình", subject: "Lý" },
  { id: 3, name: "Lê Văn Cường", subject: "Hóa" },
  { id: 4, name: "Phạm Thị Dung", subject: "Văn" },
  { id: 5, name: "Hoàng Văn Em", subject: "Anh" }
];

interface CreateClassForm {
  tenLop: string;
  capHoc: string;
  namHoc: string;
  moTa: string;
  maGiaoVienChuNhiem: string;
}

export default function CreateClassPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CreateClassForm>({
    tenLop: '',
    capHoc: '',
    namHoc: '2024-2025',
    moTa: '',
    maGiaoVienChuNhiem: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateClassForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateClassForm> = {};

    if (!formData.tenLop.trim()) {
      newErrors.tenLop = 'Tên lớp không được để trống';
    } else if (formData.tenLop.length < 2) {
      newErrors.tenLop = 'Tên lớp phải có ít nhất 2 ký tự';
    }

    if (!formData.capHoc) {
      newErrors.capHoc = 'Vui lòng chọn cấp học';
    }

    if (!formData.namHoc) {
      newErrors.namHoc = 'Vui lòng chọn năm học';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Thành công!",
        description: `Lớp học ${formData.tenLop} đã được tạo thành công.`,
      });

      router.push('/dashboard/manager/classes');
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo lớp học. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateClassForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/manager/classes');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/manager/classes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về danh sách lớp
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tạo lớp học mới</h1>
            <p className="text-muted-foreground">
              Tạo lớp học mới trong tổ chức của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin lớp học</CardTitle>
              <CardDescription>
                Nhập thông tin cơ bản cho lớp học mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Class Name */}
                <div className="space-y-2">
                  <Label htmlFor="tenLop">
                    Tên lớp <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="tenLop"
                    value={formData.tenLop}
                    onChange={(e) => handleInputChange('tenLop', e.target.value)}
                    placeholder="Ví dụ: 10A1, 11B2..."
                    className={errors.tenLop ? 'border-red-500' : ''}
                  />
                  {errors.tenLop && (
                    <p className="text-sm text-red-500">{errors.tenLop}</p>
                  )}
                </div>

                {/* Grade Level */}
                <div className="space-y-2">
                  <Label htmlFor="capHoc">
                    Cấp học <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.capHoc} 
                    onValueChange={(value) => handleInputChange('capHoc', value)}
                  >
                    <SelectTrigger className={errors.capHoc ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Chọn cấp học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                      <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                      <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.capHoc && (
                    <p className="text-sm text-red-500">{errors.capHoc}</p>
                  )}
                </div>

                {/* Academic Year */}
                <div className="space-y-2">
                  <Label htmlFor="namHoc">
                    Năm học <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.namHoc} 
                    onValueChange={(value) => handleInputChange('namHoc', value)}
                  >
                    <SelectTrigger className={errors.namHoc ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Chọn năm học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.namHoc && (
                    <p className="text-sm text-red-500">{errors.namHoc}</p>
                  )}
                </div>

                {/* Class Teacher */}
                <div className="space-y-2">
                  <Label htmlFor="maGiaoVienChuNhiem">
                    Giáo viên chủ nhiệm
                  </Label>
                  <Select 
                    value={formData.maGiaoVienChuNhiem} 
                    onValueChange={(value) => handleInputChange('maGiaoVienChuNhiem', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giáo viên chủ nhiệm (tùy chọn)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.name} - {teacher.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Bạn có thể phân công giáo viên chủ nhiệm sau khi tạo lớp
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="moTa">Mô tả</Label>
                  <Textarea
                    id="moTa"
                    value={formData.moTa}
                    onChange={(e) => handleInputChange('moTa', e.target.value)}
                    placeholder="Mô tả ngắn về lớp học (tùy chọn)"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Tạo lớp học
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Đặt tên lớp</p>
                  <p className="text-sm text-muted-foreground">
                    Sử dụng quy ước đặt tên rõ ràng như 10A1, 11B2
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Chọn cấp học</p>
                  <p className="text-sm text-muted-foreground">
                    Chọn đúng cấp học để phân loại lớp trong hệ thống
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Phân công GVCN</p>
                  <p className="text-sm text-muted-foreground">
                    Có thể để trống và phân công sau
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Bước tiếp theo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Thêm học sinh</p>
                  <p className="text-xs text-muted-foreground">
                    Import danh sách từ Excel hoặc thêm thủ công
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tạo bài kiểm tra</p>
                  <p className="text-xs text-muted-foreground">
                    Thiết lập các bài kiểm tra cho lớp học
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-lg text-amber-800">💡 Lưu ý</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• Tên lớp không thể thay đổi sau khi tạo</li>
                <li>• Giáo viên chủ nhiệm có thể được thay đổi bất kỳ lúc nào</li>
                <li>• Bạn có thể thêm học sinh ngay sau khi tạo lớp</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
