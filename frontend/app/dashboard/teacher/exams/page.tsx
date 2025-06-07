"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Edit, Users, BarChart3, FileText, Calendar, Clock, Hash, Target } from "lucide-react"
import Link from "next/link"

interface Exam {
  maBaiKiemTra: number
  tieuDe: string
  monHoc: string
  ngayThi: string | null
  thoiGianLamBai: number
  tongSoCau: number
  tongDiem: number
  trangThai: 'nhap' | 'san_sang' | 'dang_thi' | 'ket_thuc'
  moTa?: string
  thoiGianTao: string
  thoiGianCapNhat: string
}

interface CreateExamData {
  tieuDe: string
  monHoc: string
  ngayThi: string
  thoiGianLamBai: number
  tongSoCau: number
  tongDiem: number
  moTa: string
}

const EXAM_STATUS_CONFIG = {
  nhap: { label: "Nháp", variant: "secondary" as const, color: "bg-gray-100 text-gray-800" },
  san_sang: { label: "Sẵn sàng", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
  dang_thi: { label: "Đang thi", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
  ket_thuc: { label: "Kết thúc", variant: "outline" as const, color: "bg-green-100 text-green-800" }
} as const

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newExam, setNewExam] = useState<CreateExamData>({
    tieuDe: "",
    monHoc: "",
    ngayThi: "",
    thoiGianLamBai: 60,
    tongSoCau: 40,
    tongDiem: 10,
    moTa: ""
  })

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true)
      
      // TODO: Replace with actual API call
      // const response = await fetch("/api/v1/exams", {
      //   headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      // })
      // const data = await response.json()
      
      // Mock data with realistic structure
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API delay
      
      const mockExams: Exam[] = [
        {
          maBaiKiemTra: 1,
          tieuDe: "Kiểm tra Toán học kỳ 1",
          monHoc: "Toán",
          ngayThi: "2024-01-15",
          thoiGianLamBai: 90,
          tongSoCau: 40,
          tongDiem: 10,
          trangThai: "nhap",
          moTa: "Kiểm tra cuối kỳ 1 môn Toán",
          thoiGianTao: "2024-01-01T10:00:00Z",
          thoiGianCapNhat: "2024-01-01T10:00:00Z"
        },
        {
          maBaiKiemTra: 2,
          tieuDe: "Kiểm tra Văn học",
          monHoc: "Ngữ văn",
          ngayThi: "2024-01-20",
          thoiGianLamBai: 120,
          tongSoCau: 30,
          tongDiem: 10,
          trangThai: "san_sang",
          moTa: "Kiểm tra văn học lớp 12",
          thoiGianTao: "2024-01-02T10:00:00Z",
          thoiGianCapNhat: "2024-01-02T10:00:00Z"
        },
        {
          maBaiKiemTra: 3,
          tieuDe: "Kiểm tra Vật lý",
          monHoc: "Vật lý",
          ngayThi: null,
          thoiGianLamBai: 75,
          tongSoCau: 35,
          tongDiem: 10,
          trangThai: "nhap",
          thoiGianTao: "2024-01-03T10:00:00Z",
          thoiGianCapNhat: "2024-01-03T10:00:00Z"
        }
      ]
      
      setExams(mockExams)
    } catch (error) {
      console.error("Error fetching exams:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài kiểm tra",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  const handleCreateExam = async () => {
    if (!newExam.tieuDe.trim() || !newExam.monHoc.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ tiêu đề và môn học",
        variant: "destructive"
      })
      return
    }

    try {
      setCreating(true)
      
      // TODO: Replace with actual API call
      // const response = await fetch("/api/v1/exams", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${localStorage.getItem("token")}`
      //   },
      //   body: JSON.stringify(newExam)
      // })
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      const newId = Math.max(...exams.map(e => e.maBaiKiemTra), 0) + 1
      const createdExam: Exam = {
        ...newExam,
        maBaiKiemTra: newId,
        trangThai: "nhap",
        thoiGianTao: new Date().toISOString(),
        thoiGianCapNhat: new Date().toISOString(),
        ngayThi: newExam.ngayThi || null
      }
      
      setExams(prev => [createdExam, ...prev])
      setIsCreateDialogOpen(false)
      resetForm()
      
      toast({
        title: "Thành công",
        description: "Tạo bài kiểm tra thành công"
      })
    } catch (error) {
      console.error("Error creating exam:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo bài kiểm tra",
        variant: "destructive"
      })
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setNewExam({
      tieuDe: "",
      monHoc: "",
      ngayThi: "",
      thoiGianLamBai: 60,
      tongSoCau: 40,
      tongDiem: 10,
      moTa: ""
    })
  }

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.monHoc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || exam.trangThai === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Exam['trangThai']) => {
    const config = EXAM_STATUS_CONFIG[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa đặt"
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const ExamSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Bài kiểm tra</h1>
          <p className="text-muted-foreground mt-1">
            Tạo và quản lý các bài kiểm tra của bạn
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài kiểm tra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Tạo bài kiểm tra mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin cơ bản cho bài kiểm tra. Bạn có thể chỉnh sửa chi tiết sau.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={newExam.tieuDe}
                    onChange={(e) => setNewExam(prev => ({...prev, tieuDe: e.target.value}))}
                    placeholder="VD: Kiểm tra Toán học kỳ 1"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Môn học *</Label>
                  <Input
                    id="subject"
                    value={newExam.monHoc}
                    onChange={(e) => setNewExam(prev => ({...prev, monHoc: e.target.value}))}
                    placeholder="VD: Toán học"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Ngày thi</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExam.ngayThi}
                    onChange={(e) => setNewExam(prev => ({...prev, ngayThi: e.target.value}))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="questions">Số câu hỏi</Label>
                  <Input
                    id="questions"
                    type="number"
                    min="1"
                    max="200"
                    value={newExam.tongSoCau}
                    onChange={(e) => setNewExam(prev => ({...prev, tongSoCau: parseInt(e.target.value) || 40}))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Thời gian (phút)</Label>
                  <Input
                    id="time"
                    type="number"
                    min="15"
                    max="300"
                    value={newExam.thoiGianLamBai}
                    onChange={(e) => setNewExam(prev => ({...prev, thoiGianLamBai: parseInt(e.target.value) || 60}))}
                    className="mt-1"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={newExam.moTa}
                    onChange={(e) => setNewExam(prev => ({...prev, moTa: e.target.value}))}
                    placeholder="Mô tả ngắn về bài kiểm tra (tùy chọn)"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreateExam} 
                  disabled={creating}
                  className="flex-1"
                >
                  {creating ? "Đang tạo..." : "Tạo bài kiểm tra"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={creating}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề hoặc môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="nhap">Nháp</SelectItem>
            <SelectItem value="san_sang">Sẵn sàng</SelectItem>
            <SelectItem value="dang_thi">Đang thi</SelectItem>
            <SelectItem value="ket_thuc">Kết thúc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ExamSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <Card key={exam.maBaiKiemTra} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg leading-tight">{exam.tieuDe}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <span>{exam.monHoc}</span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(exam.trangThai)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Số câu:</span>
                      <span className="font-medium">{exam.tongSoCau}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Thời gian:</span>
                      <span className="font-medium">{exam.thoiGianLamBai}p</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Điểm:</span>
                      <span className="font-medium">{exam.tongDiem}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Ngày thi:</span>
                      <span className="font-medium">{formatDate(exam.ngayThi)}</span>
                    </div>
                  </div>

                  {exam.moTa && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exam.moTa}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/dashboard/teacher/exams/${exam.maBaiKiemTra}`}>
                        <Edit className="h-3 w-3 mr-1" />
                        Sửa
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/dashboard/teacher/exams/${exam.maBaiKiemTra}/classes`}>
                        <Users className="h-3 w-3 mr-1" />
                        Lớp
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/dashboard/teacher/exams/${exam.maBaiKiemTra}/results`}>
                        <BarChart3 className="h-3 w-3 mr-1" />
                        KQ
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredExams.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {searchTerm || statusFilter !== "all" 
              ? "Không tìm thấy bài kiểm tra" 
              : "Chưa có bài kiểm tra nào"
            }
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchTerm || statusFilter !== "all" 
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm kết quả"
              : "Tạo bài kiểm tra đầu tiên để bắt đầu quản lý và chấm điểm cho học sinh"
            }
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài kiểm tra đầu tiên
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
