"use client"

import { useState, useEffect } from "react"
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
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Search,
  Star,
  Settings,
  Grid3X3,
  CheckCircle
} from "lucide-react"

interface AnswerTemplate {
  maMauPhieu: number
  tenMauPhieu: string
  soCauHoi: number
  soLuaChonMoiCau: number
  laMacDinh: boolean
  moTa?: string
  thoiGianTao: string
  thoiGianCapNhat: string
}

const MOCK_TEMPLATES: AnswerTemplate[] = [
  {
    maMauPhieu: 1,
    tenMauPhieu: "Mẫu 50 câu trắc nghiệm A-D",
    soCauHoi: 50,
    soLuaChonMoiCau: 4,
    laMacDinh: true,
    moTa: "Mẫu phiếu chuẩn cho bài kiểm tra 50 câu với 4 lựa chọn A, B, C, D",
    thoiGianTao: "2025-06-01T10:00:00Z",
    thoiGianCapNhat: "2025-06-01T10:00:00Z"
  },
  {
    maMauPhieu: 2,
    tenMauPhieu: "Mẫu 100 câu trắc nghiệm A-E",
    soCauHoi: 100,
    soLuaChonMoiCau: 5,
    laMacDinh: false,
    moTa: "Mẫu phiếu mở rộng cho bài kiểm tra 100 câu với 5 lựa chọn A, B, C, D, E",
    thoiGianTao: "2025-06-02T14:30:00Z",
    thoiGianCapNhat: "2025-06-02T14:30:00Z"
  },
  {
    maMauPhieu: 3,
    tenMauPhieu: "Mẫu 30 câu ngắn",
    soCauHoi: 30,
    soLuaChonMoiCau: 3,
    laMacDinh: false,
    moTa: "Mẫu phiếu cho bài kiểm tra ngắn 30 câu với 3 lựa chọn A, B, C",
    thoiGianTao: "2025-06-03T09:15:00Z",
    thoiGianCapNhat: "2025-06-03T09:15:00Z"
  },
  {
    maMauPhieu: 4,
    tenMauPhieu: "Mẫu 75 câu chuẩn",
    soCauHoi: 75,
    soLuaChonMoiCau: 4,
    laMacDinh: false,
    moTa: "Mẫu phiếu cho bài kiểm tra 75 câu với 4 lựa chọn chuẩn",
    thoiGianTao: "2025-06-04T16:45:00Z",
    thoiGianCapNhat: "2025-06-04T16:45:00Z"
  }
]

export default function AnswerTemplatesPage() {
  const [templates, setTemplates] = useState<AnswerTemplate[]>(MOCK_TEMPLATES)
  const [filteredTemplates, setFilteredTemplates] = useState<AnswerTemplate[]>(MOCK_TEMPLATES)
  const [searchTerm, setSearchTerm] = useState("")
  const [questionFilter, setQuestionFilter] = useState("all")
  const [choiceFilter, setChoiceFilter] = useState("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deleteTemplateId, setDeleteTemplateId] = useState<number | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<AnswerTemplate | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    tenMauPhieu: "",
    soCauHoi: 50,
    soLuaChonMoiCau: 4,
    moTa: "",
    laMacDinh: false
  })

  // Filter templates
  useEffect(() => {
    let filtered = templates

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.tenMauPhieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.moTa && template.moTa.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Question filter
    if (questionFilter !== "all") {
      const [min, max] = questionFilter.split("-").map(Number)
      filtered = filtered.filter(template => {
        if (max) {
          return template.soCauHoi >= min && template.soCauHoi <= max
        } else {
          return template.soCauHoi >= min
        }
      })
    }

    // Choice filter
    if (choiceFilter !== "all") {
      filtered = filtered.filter(template => template.soLuaChonMoiCau === Number(choiceFilter))
    }

    setFilteredTemplates(filtered)
  }, [templates, searchTerm, questionFilter, choiceFilter])

  const resetForm = () => {
    setFormData({
      tenMauPhieu: "",
      soCauHoi: 50,
      soLuaChonMoiCau: 4,
      moTa: "",
      laMacDinh: false
    })
  }

  const handleCreate = async () => {
    if (!formData.tenMauPhieu.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên mẫu phiếu",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const newTemplate: AnswerTemplate = {
        maMauPhieu: Math.max(...templates.map(t => t.maMauPhieu), 0) + 1,
        ...formData,
        thoiGianTao: new Date().toISOString(),
        thoiGianCapNhat: new Date().toISOString()
      }

      setTemplates(prev => [newTemplate, ...prev])
      setIsCreateOpen(false)
      resetForm()
      
      toast({
        title: "Thành công",
        description: "Tạo mẫu phiếu thành công"
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo mẫu phiếu",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (template: AnswerTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      tenMauPhieu: template.tenMauPhieu,
      soCauHoi: template.soCauHoi,
      soLuaChonMoiCau: template.soLuaChonMoiCau,
      moTa: template.moTa || "",
      laMacDinh: template.laMacDinh
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedTemplate || !formData.tenMauPhieu.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      setTemplates(prev => prev.map(template => 
        template.maMauPhieu === selectedTemplate.maMauPhieu
          ? {
              ...template,
              ...formData,
              thoiGianCapNhat: new Date().toISOString()
            }
          : template
      ))
      
      setIsEditOpen(false)
      setSelectedTemplate(null)
      resetForm()
      
      toast({
        title: "Thành công",
        description: "Cập nhật mẫu phiếu thành công"
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật mẫu phiếu",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (templateId: number) => {
    try {
      setTemplates(prev => prev.filter(template => template.maMauPhieu !== templateId))
      setDeleteTemplateId(null)
      
      toast({
        title: "Thành công",
        description: "Xóa mẫu phiếu thành công"
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa mẫu phiếu",
        variant: "destructive"
      })
    }
  }

  const handleDuplicate = async (template: AnswerTemplate) => {
    const newTemplate: AnswerTemplate = {
      ...template,
      maMauPhieu: Math.max(...templates.map(t => t.maMauPhieu), 0) + 1,
      tenMauPhieu: `${template.tenMauPhieu} (Copy)`,
      laMacDinh: false,
      thoiGianTao: new Date().toISOString(),
      thoiGianCapNhat: new Date().toISOString()
    }

    setTemplates(prev => [newTemplate, ...prev])
    
    toast({
      title: "Thành công",
      description: "Sao chép mẫu phiếu thành công"
    })
  }

  const handleSetDefault = async (templateId: number) => {
    setTemplates(prev => prev.map(template => ({
      ...template,
      laMacDinh: template.maMauPhieu === templateId,
      thoiGianCapNhat: template.maMauPhieu === templateId ? new Date().toISOString() : template.thoiGianCapNhat
    })))
    
    toast({
      title: "Thành công",
      description: "Đã đặt làm mẫu phiếu mặc định"
    })
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mẫu phiếu trả lời</h1>
          <p className="text-muted-foreground">
            Quản lý các mẫu phiếu trả lời cho bài kiểm tra
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Tạo mẫu phiếu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tạo mẫu phiếu mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tên mẫu phiếu *</Label>
                <Input
                  placeholder="VD: Mẫu 50 câu trắc nghiệm"
                  value={formData.tenMauPhieu}
                  onChange={(e) => setFormData(prev => ({ ...prev, tenMauPhieu: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Số câu hỏi</Label>
                  <Input
                    type="number"
                    min="1"
                    max="200"
                    value={formData.soCauHoi}
                    onChange={(e) => setFormData(prev => ({ ...prev, soCauHoi: parseInt(e.target.value) || 50 }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Số lựa chọn/câu</Label>
                  <Select 
                    value={formData.soLuaChonMoiCau.toString()} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, soLuaChonMoiCau: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 (A, B)</SelectItem>
                      <SelectItem value="3">3 (A, B, C)</SelectItem>
                      <SelectItem value="4">4 (A, B, C, D)</SelectItem>
                      <SelectItem value="5">5 (A, B, C, D, E)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Input
                  placeholder="Mô tả về mẫu phiếu (tùy chọn)"
                  value={formData.moTa}
                  onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Đang tạo..." : "Tạo mẫu phiếu"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateOpen(false)
                    resetForm()
                  }}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Tổng mẫu phiếu</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Mặc định</p>
                <p className="text-2xl font-bold">
                  {templates.filter(t => t.laMacDinh).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Trung bình câu hỏi</p>
                <p className="text-2xl font-bold">
                  {Math.round(templates.reduce((sum, t) => sum + t.soCauHoi, 0) / templates.length || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">4 lựa chọn</p>
                <p className="text-2xl font-bold">
                  {templates.filter(t => t.soLuaChonMoiCau === 4).length}
                </p>
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
                  placeholder="Tìm theo tên mẫu phiếu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Số câu hỏi</Label>
              <Select value={questionFilter} onValueChange={setQuestionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="1-30">1-30 câu</SelectItem>
                  <SelectItem value="31-50">31-50 câu</SelectItem>
                  <SelectItem value="51-100">51-100 câu</SelectItem>
                  <SelectItem value="101">Trên 100 câu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Số lựa chọn</Label>
              <Select value={choiceFilter} onValueChange={setChoiceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="2">2 lựa chọn</SelectItem>
                  <SelectItem value="3">3 lựa chọn</SelectItem>
                  <SelectItem value="4">4 lựa chọn</SelectItem>
                  <SelectItem value="5">5 lựa chọn</SelectItem>
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
                  setQuestionFilter("all")
                  setChoiceFilter("all")
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.maMauPhieu} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {template.laMacDinh && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  {template.tenMauPhieu}
                </CardTitle>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(template)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDuplicate(template)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setDeleteTemplateId(template.maMauPhieu)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Số câu hỏi</p>
                  <p className="font-semibold text-lg">{template.soCauHoi}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lựa chọn/câu</p>
                  <p className="font-semibold text-lg">{template.soLuaChonMoiCau}</p>
                </div>
              </div>
              
              {template.moTa && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.moTa}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-muted-foreground">
                  Cập nhật: {formatDate(template.thoiGianCapNhat)}
                </div>
                {template.laMacDinh ? (
                  <Badge variant="default" className="text-xs">
                    Mặc định
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleSetDefault(template.maMauPhieu)}
                    className="text-xs h-6"
                  >
                    Đặt mặc định
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Không tìm thấy mẫu phiếu nào</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mẫu phiếu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tên mẫu phiếu *</Label>
              <Input
                placeholder="VD: Mẫu 50 câu trắc nghiệm"
                value={formData.tenMauPhieu}
                onChange={(e) => setFormData(prev => ({ ...prev, tenMauPhieu: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Số câu hỏi</Label>
                <Input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.soCauHoi}
                  onChange={(e) => setFormData(prev => ({ ...prev, soCauHoi: parseInt(e.target.value) || 50 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Số lựa chọn/câu</Label>
                <Select 
                  value={formData.soLuaChonMoiCau.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, soLuaChonMoiCau: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 (A, B)</SelectItem>
                    <SelectItem value="3">3 (A, B, C)</SelectItem>
                    <SelectItem value="4">4 (A, B, C, D)</SelectItem>
                    <SelectItem value="5">5 (A, B, C, D, E)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Input
                placeholder="Mô tả về mẫu phiếu (tùy chọn)"
                value={formData.moTa}
                onChange={(e) => setFormData(prev => ({ ...prev, moTa: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleUpdate}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditOpen(false)
                  setSelectedTemplate(null)
                  resetForm()
                }}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteTemplateId !== null} onOpenChange={() => setDeleteTemplateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mẫu phiếu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteTemplateId && handleDelete(deleteTemplateId)}
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
