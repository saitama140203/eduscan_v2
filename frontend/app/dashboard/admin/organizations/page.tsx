"use client"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Organization, organizationsApi } from "@/lib/api/organizations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Building2, Search, X, BarChart } from "lucide-react"
import { timeAgo } from "@/lib/timeago"
import { ORG_TYPES } from "@/lib/constants"
import { CreateOrgDialog } from "./CreateOrgDialog"
import { EditOrgDialog } from "./EditOrgDialog"
import { LogoCropDialog } from "./LogoCropDialog"

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/eduscan/image/upload"
const CLOUDINARY_UPLOAD_PRESET = "eduscan"

async function uploadToCloudinary(blob: Blob): Promise<string> {
  const formData = new FormData()
  formData.append("file", blob)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: formData })
  const data = await res.json()
  if (data.secure_url) return data.secure_url
  throw new Error("Upload ảnh lên Cloudinary thất bại")
}

const EMPTY_FORM: Partial<Organization> = {
  name: "",
  address: "",
  type: ORG_TYPES[0].value,
  logo_url: ""
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [formData, setFormData] = useState<Partial<Organization>>(EMPTY_FORM)
  const [showCrop, setShowCrop] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | undefined>(undefined)
  const [cropContext, setCropContext] = useState<"create" | "edit">("create")
  const cropperRef = useRef<any>(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const { toast } = useToast()

  // Statistics by type
  const stats = useMemo(() => {
    const total = organizations.length
    const byType: Record<string, number> = {}
    ORG_TYPES.forEach(type => byType[type.value] = 0)
    organizations.forEach(org => {
      if (byType[org.type] !== undefined) byType[org.type] += 1
    })
    return { total, byType }
  }, [organizations])

  // Fetch orgs
  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await organizationsApi.getAll()
      setOrganizations(Array.isArray(data) ? data : data.organizations || [])
    } catch {
      toast({ title: "Lỗi", description: "Không thể tải danh sách tổ chức.", variant: "destructive" })
      setOrganizations([])
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchOrganizations() }, [fetchOrganizations])

  // Input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Logo crop
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, context: "create" | "edit") => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCropSrc(reader.result as string)
      setShowCrop(true)
      setCropContext(context)
    }
    reader.readAsDataURL(file)
  }

  const handleCropAndUpload = async () => {
    if (!cropperRef.current) return
    setUploading(true)
    try {
      const canvas = cropperRef.current.cropper.getCroppedCanvas({ width: 256, height: 256, fillColor: "#fff" })
      const blob: Blob = await new Promise(resolve => canvas.toBlob(resolve as any, "image/jpeg", 0.92))
      const url = await uploadToCloudinary(blob)
      setFormData(prev => ({ ...prev, logo_url: url }))
      toast({ title: "Logo đã được tải lên thành công!" })
      setShowCrop(false)
    } catch (err) {
      toast({ title: "Lỗi upload ảnh", description: String(err), variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  // CRUD handlers
  const handleCreateOrg = useCallback(async () => {
    try {
      await organizationsApi.create(formData)
      setIsCreateDialogOpen(false)
      setFormData(EMPTY_FORM)
      toast({ title: "Thành công", description: "Đã tạo tổ chức mới" })
      fetchOrganizations()
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể tạo tổ chức.", variant: "destructive" })
    }
  }, [formData, fetchOrganizations, toast])

  const handleEditOrg = useCallback(async () => {
    if (!selectedOrg) return
    try {
      await organizationsApi.update(selectedOrg.id, formData)
      setIsEditDialogOpen(false)
      setSelectedOrg(null)
      setFormData(EMPTY_FORM)
      toast({ title: "Thành công", description: "Đã cập nhật tổ chức" })
      fetchOrganizations()
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể cập nhật tổ chức.", variant: "destructive" })
    }
  }, [formData, selectedOrg, fetchOrganizations, toast])

  const handleDeleteOrg = async (org: Organization) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa tổ chức "${org.name}"?`)) return
    try {
      await organizationsApi.delete(org.id)
      toast({ title: "Thành công", description: "Đã xóa tổ chức" })
      fetchOrganizations()
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể xóa tổ chức.", variant: "destructive" })
    }
  }

  const openEditDialog = (org: Organization) => {
    setSelectedOrg(org)
    setFormData({
      name: org.name,
      address: org.address,
      type: org.type,
      logo_url: org.logo_url
    })
    setIsEditDialogOpen(true)
  }

  // Filtered
  const filteredOrganizations = useMemo(() => {
    let data = organizations
    if (search)
      data = data.filter(org =>
        (org.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (org.address || '').toLowerCase().includes(search.toLowerCase())
      )
    if (filterType)
      data = data.filter(org => org.type === filterType)
    return data
  }, [organizations, search, filterType])

  const hasActiveFilters = search || filterType
  const clearFilters = () => {
    setSearch("")
    setFilterType("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <LogoCropDialog
        open={showCrop}
        setOpen={setShowCrop}
        cropSrc={cropSrc}
        cropperRef={cropperRef}
        uploading={uploading}
        handleCropAndUpload={handleCropAndUpload}
      />
      <div className="container mx-auto py-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Quản lý tổ chức
            </h1>
            <p className="text-gray-600">Tạo, cập nhật và quản lý các tổ chức trong hệ thống.</p>
          </div>
          <CreateOrgDialog
            open={isCreateDialogOpen}
            setOpen={setIsCreateDialogOpen}
            formData={formData}
            onInputChange={handleInputChange}
            onFileChange={e => handleFileChange(e, "create")}
            uploading={uploading}
            onCreate={handleCreateOrg}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs font-medium">Tổng số tổ chức</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BarChart className="w-8 h-8 opacity-90" />
              </div>
            </CardContent>
          </Card>
          {ORG_TYPES.map(type => (
            <Card
              key={type.value}
              className="border-0 shadow-lg text-white"
              style={{
                background: type.color || "linear-gradient(90deg, #a7c7fc, #587bfd)"
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-80">{type.label}</p>
                    <p className="text-2xl font-bold">{stats.byType[type.value]}</p>
                  </div>
                  <span className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter & search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm tên hoặc địa chỉ tổ chức..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-blue-200 bg-white"
            >
              <option value="">Tất cả loại tổ chức</option>
              {ORG_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="border px-3 rounded text-gray-600 hover:bg-gray-50 ml-2 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Xóa lọc
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="border-b border-gray-100 bg-white">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Danh sách tổ chức ({filteredOrganizations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Tên tổ chức</TableHead>
                    <TableHead className="font-semibold text-gray-700">Địa chỉ</TableHead>
                    <TableHead className="font-semibold text-gray-700">Loại</TableHead>
                    <TableHead className="font-semibold text-gray-700">Logo</TableHead>
                    <TableHead className="font-semibold text-gray-700">Cập nhật</TableHead>
                    <TableHead className="font-semibold text-gray-700">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7} className="py-5">
                          <div className="w-full h-6 bg-gray-100 rounded animate-pulse"></div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredOrganizations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-gray-300" />
                          </div>
                          <div className="text-gray-500 font-medium">
                            {hasActiveFilters
                              ? "Không tìm thấy tổ chức phù hợp"
                              : "Chưa có tổ chức nào trong hệ thống"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrganizations.map(org => (
                      <TableRow key={org.id}>
                        <TableCell className="text-gray-500 font-mono">#{org.id}</TableCell>
                        <TableCell className="font-semibold flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          {org.name}
                        </TableCell>
                        <TableCell>{org.address}</TableCell>
                        <TableCell>
                          <span
                            className="px-2 py-1 rounded-lg text-xs font-semibold"
                            style={{
                              background: ORG_TYPES.find(t => t.value === org.type)?.color || "#f4f4f5",
                              color: "#222"
                            }}
                          >
                            {ORG_TYPES.find(t => t.value === org.type)?.label || org.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {org.logo_url ? (
                              <img
                                src={org.logo_url}
                                alt="Logo"
                                className="h-10 w-10 rounded-full object-cover border shadow"
                                style={{ background: "#f5f6fa" }}
                              />
                            ) : (
                              <span className="inline-block h-10 w-10 rounded-full bg-gray-100 border flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-gray-400" />
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{timeAgo(org.updated_at)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => openEditDialog(org)}
                              title="Sửa tổ chức"
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteOrg(org)}
                              title="Xóa tổ chức"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog */}
        <EditOrgDialog
          open={isEditDialogOpen}
          setOpen={setIsEditDialogOpen}
          formData={formData}
          onInputChange={handleInputChange}
          onFileChange={e => handleFileChange(e, "edit")}
          uploading={uploading}
          onUpdate={handleEditOrg}
        />
      </div>
    </div>
  )
}
