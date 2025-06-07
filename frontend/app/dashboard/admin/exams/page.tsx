"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Search,
  Calendar,
  Clock,
  Users,
  BarChart3,
  MoreVertical,
  Eye,
  Settings,
  Play,
  Pause,
  Archive,
  TrendingUp
} from "lucide-react"

interface Exam {
  maBaiKiemTra: number
  tieuDe: string
  monHoc: string
  moTa?: string
  ngayThi?: string
  thoiGianLamBai?: number
  tongSoCau: number
  tongDiem: number
  trangThai: 'nhap' | 'san_sang' | 'dang_thi' | 'ket_thuc'
  laDeTongHop: boolean
  soHocSinhDaLam?: number
  diemTrungBinh?: number
  tyLeDat?: number
  thoiGianTao: string
  thoiGianCapNhat: string
}

const MOCK_EXAMS: Exam[] = [
  {
    maBaiKiemTra: 1,
    tieuDe: "Kiểm tra Toán học kỳ 1",
    monHoc: "Toán học",
    moTa: "Bài kiểm tra cuối kỳ 1 môn Toán học lớp 12",
    ngayThi: "2025-06-15",
    thoiGianLamBai: 90,
    tongSoCau: 50,
    tongDiem: 10,
    trangThai: "san_sang",
    laDeTongHop: false,
    soHocSinhDaLam: 128,
    diemTrungBinh: 7.5,
    tyLeDat: 85.5,
    thoiGianTao: "2025-06-01T10:00:00Z",
    thoiGianCapNhat: "2025-06-07T14:30:00Z"
  },
  {
    maBaiKiemTra: 2,
    tieuDe: "Kiểm tra Văn học kỳ 1",
    monHoc: "Ngữ văn",
    moTa: "Bài kiểm tra cuối kỳ 1 môn Ngữ văn",
    ngayThi: "2025-06-20",
    thoiGianLamBai: 120,
    tongSoCau: 40,
    tongDiem: 10,
    trangThai: "dang_thi",
    laDeTongHop: true,
    soHocSinhDaLam: 95,
    diemTrungBinh: 6.8,
    tyLeDat: 72.3,
    thoiGianTao: "2025-06-02T09:15:00Z",
    thoiGianCapNhat: "2025-06-07T16:45:00Z"
  },
  {
    maBaiKiemTra: 3,
    tieuDe: "Kiểm tra Hóa học - Chương 1",
    monHoc: "Hóa học",
    moTa: "Kiểm tra 15 phút chương 1",
    ngayThi: "2025-06-10",
    thoiGianLamBai: 15,
    tongSoCau: 20,
    tongDiem: 10,
    trangThai: "ket_thuc",
    laDeTongHop: false,
    soHocSinhDaLam: 156,
    diemTrungBinh: 8.2,
    tyLeDat: 92.1,
    thoiGianTao: "2025-05-28T11:30:00Z",
    thoiGianCapNhat: "2025-06-10T17:00:00Z"
  },
  {
    maBaiKiemTra: 4,
    tieuDe: "Bài tập Vật lý - Cơ học",
    monHoc: "Vật lý",
    moTa: "Bài tập về cơ học",
    thoiGianLamBai: 45,
    tongSoCau: 30,
    tongDiem: 10,
    trangThai: "nhap",
    laDeTongHop: false,
    soHocSinhDaLam: 0,
    thoiGianTao: "2025-06-07T08:00:00Z",
    thoiGianCapNhat: "2025-06-07T08:00:00Z"
  }
]

const STATUS_CONFIG = {
  nhap: { label: "Nháp", variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
  san_sang: { label: "Sẵn sàng", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
  dang_thi: { label: "Đang thi", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
  ket_thuc: { label: "Kết thúc", variant: "outline" as const, color: "bg-green-100 text-green-800" }
}

export default function AdminExamsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS)
  const [filteredExams, setFilteredExams] = useState<Exam[]>(MOCK_EXAMS)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [deleteExamId, setDeleteExamId] = useState<number | null>(null)

  // Filter exams
  useEffect(() => {
    let filtered = exams

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.monHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exam.moTa && exam.moTa.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(exam => exam.trangThai === statusFilter)
    }

    // Subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter(exam => exam.monHoc === subjectFilter)
    }

    setFilteredExams(filtered)
  }, [exams, searchTerm, statusFilter, subjectFilter])

  const subjects = Array.from(new Set(exams.map(exam => exam.monHoc)))

  const handleStatusChange = async (examId: number, newStatus: string) => {
    setExams(prev => prev.map(exam => 
      exam.maBaiKiemTra === examId 
        ? { ...exam, trangThai: newStatus as any, thoiGianCapNhat: new Date().toISOString() }
        : exam
    ))
    
    toast({
      title: "Thành công",
      description: `Đã cập nhật trạng thái bài kiểm tra`
    })
  }

  const handleDelete = async (examId: number) => {
    setExams(prev => prev.filter(exam => exam.maBaiKiemTra !== examId))
    setDeleteExamId(null)
    
    toast({
      title: "Thành công",
      description: "Xóa bài kiểm tra thành công"
    })
  }

  const handleDuplicate = async (exam: Exam) => {
    const newExam: Exam = {
      ...exam,
      maBaiKiemTra: Math.max(...exams.map(e => e.maBaiKiemTra), 0) + 1,
      tieuDe: `${exam.tieuDe} (Copy)`,
      trangThai: "nhap",
      soHocSinhDaLam: 0,
      diemTrungBinh: undefined,
      tyLeDat: undefined,
      thoiGianTao: new Date().toISOString(),
      thoiGianCapNhat: new Date().toISOString()
    }

    setExams(prev => [newExam, ...prev])
    
    toast({
      title: "Thành công",
      description: "Sao chép bài kiểm tra thành công"
    })
  }

  const getStatistics = () => {
    const totalExams = exams.length
    const activeExams = exams.filter(e => e.trangThai === 'dang_thi').length
    const completedExams = exams.filter(e => e.trangThai === 'ket_thuc').length
    const totalStudents = exams.reduce((sum, e) => sum + (e.soHocSinhDaLam || 0), 0)
    const avgScore = exams
      .filter(e => e.diemTrungBinh)
      .reduce((sum, e, _, arr) => sum + (e.diemTrungBinh || 0) / arr.length, 0)

    return { totalExams, activeExams, completedExams, totalStudents, avgScore }
  }

  const stats = getStatistics()

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa đặt"
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(dateString))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý bài kiểm tra</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả bài kiểm tra trong hệ thống
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/exams/create')} className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo bài kiểm tra
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tổng bài kiểm tra</p>
                <p className="text-2xl font-bold">{stats.totalExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Đang diễn ra</p>
                <p className="text-2xl font-bold">{stats.activeExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
                <p className="text-2xl font-bold">{stats.completedExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Lượt thi</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Điểm TB</p>
                <p className="text-2xl font-bold">{stats.avgScore.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tiêu đề, môn học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="nhap">Nháp</SelectItem>
                  <SelectItem value="san_sang">Sẵn sàng</SelectItem>
                  <SelectItem value="dang_thi">Đang thi</SelectItem>
                  <SelectItem value="ket_thuc">Kết thúc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Môn học</Label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setSubjectFilter("all")
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredExams.map((exam) => (
          <Card key={exam.maBaiKiemTra} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{exam.tieuDe}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium text-blue-600">{exam.monHoc}</span>
                    <Badge className={STATUS_CONFIG[exam.trangThai].color}>
                      {STATUS_CONFIG[exam.trangThai].label}
                    </Badge>
                    {exam.laDeTongHop && (
                      <Badge variant="outline" className="text-xs">Tổng hợp</Badge>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/exams/${exam.maBaiKiemTra}`)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/exams/${exam.maBaiKiemTra}/edit`)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(exam)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Sao chép
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setDeleteExamId(exam.maBaiKiemTra)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {exam.moTa && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exam.moTa}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Ngày thi: {formatDate(exam.ngayThi)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Thời gian: {exam.thoiGianLamBai || 0} phút</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>Số câu: {exam.tongSoCau}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {exam.soHocSinhDaLam !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Đã thi: {exam.soHocSinhDaLam}</span>
                    </div>
                  )}
                  {exam.diemTrungBinh !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span>Điểm TB: {exam.diemTrungBinh}</span>
                    </div>
                  )}
                  {exam.tyLeDat !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>Tỷ lệ đạt: {exam.tyLeDat}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Cập nhật: {new Intl.DateTimeFormat('vi-VN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(new Date(exam.thoiGianCapNhat))}
                </div>
                
                <div className="flex gap-2">
                  {exam.trangThai === 'nhap' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusChange(exam.maBaiKiemTra, 'san_sang')}
                    >
                      Xuất bản
                    </Button>
                  )}
                  {exam.trangThai === 'san_sang' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusChange(exam.maBaiKiemTra, 'dang_thi')}
                    >
                      Bắt đầu
                    </Button>
                  )}
                  {exam.trangThai === 'dang_thi' && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleStatusChange(exam.maBaiKiemTra, 'ket_thuc')}
                    >
                      Kết thúc
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Không tìm thấy bài kiểm tra nào</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteExamId !== null} onOpenChange={() => setDeleteExamId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài kiểm tra này? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteExamId && handleDelete(deleteExamId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
