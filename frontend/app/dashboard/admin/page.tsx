"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { usersApi } from "@/lib/api/users"
import { rolesMap, statusMap } from "@/lib/constants"
import { Pencil, Trash2, PlusCircle, Search } from "lucide-react"
import Link from "next/link"  
import clsx from "clsx"

function UserStatusBadge({ status }) {
  if (status)
    return <Badge className="bg-green-100 text-green-700">Active</Badge>
  return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Inactive</Badge>
}

function UserRoleBadge({ role }) {
  return <Badge className="bg-blue-100 text-blue-700">{rolesMap[role] || role}</Badge>
}

function TableSkeleton({ rows = 6 }) {
  return (
    <tbody>
      {[...Array(rows)].map((_, idx) => (
        <TableRow key={idx}>
          {[...Array(7)].map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </tbody>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  // Pagination (demo, real API nên có total/pages)
  const [page, setPage] = useState(1)
  const perPage = 10

  // Fake edit form state (demo, bạn tuỳ chỉnh theo schema thực tế)
  const [formData, setFormData] = useState({})

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await usersApi.getAll({ page, perPage, search })
      setUsers(data.users || data)
    } catch {
      toast({ title: "Lỗi", description: "Không thể tải danh sách users.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [page, search])

  const filteredUsers = useMemo(() => {
    if (!search) return users
    return users.filter(u =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSave = async () => {
    try {
      await usersApi.update(selectedUser.id, formData)
      toast({ title: "Đã cập nhật user!" })
      setIsEditDialogOpen(false)
      fetchUsers()
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật user.", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    try {
      await usersApi.delete(selectedUser.id)
      toast({ title: "Đã xóa user!" })
      setIsDeleteDialogOpen(false)
      fetchUsers()
    } catch {
      toast({ title: "Lỗi", description: "Không thể xóa user.", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <Button asChild className="flex items-center gap-2">
          <Link href="/dashboard/admin/users/create">
            <PlusCircle size={18} /> Thêm user mới
          </Link>
        </Button>
      </div>
      {/* Search */}
      <div className="mb-4 flex items-center gap-2 w-full max-w-md">
        <Input
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          prefix={<Search size={16} />}
        />
        <Button variant="outline" onClick={() => fetchUsers()}><Search size={16} /></Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Tổ chức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            {isLoading ? (
              <TableSkeleton />
            ) : filteredUsers.length === 0 ? (
              <tbody>
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                    Không có user nào phù hợp
                  </TableCell>
                </TableRow>
              </tbody>
            ) : (
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted transition-colors">
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell><UserRoleBadge role={user.role} /></TableCell>
                    <TableCell>{user.organization_name || "-"}</TableCell>
                    <TableCell><UserStatusBadge status={user.status} /></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                          <Pencil size={14} /> <span className="ml-1">Sửa</span>
                        </Button>
                        <AlertDialog open={isDeleteDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" onClick={() => { setSelectedUser(user); setIsDeleteDialogOpen(true) }}>
                              <Trash2 size={14} /> <span className="ml-1">Xóa</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc muốn xóa user <b>{user.email}</b>? Thao tác này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>Xác nhận xóa</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>

      {/* Pagination (demo, real nên có pages) */}
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>Trước</Button>
        <span className="px-2 text-sm">Trang {page}</span>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={filteredUsers.length < perPage}>Sau</Button>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa user</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault()
              handleEditSave()
            }}
          >
            <Input
              label="Email"
              name="email"
              value={formData.email}
              disabled
              className="w-full"
            />
            <Input
              label="Họ tên"
              name="full_name"
              value={formData.full_name}
              onChange={e => setFormData(f => ({ ...f, full_name: e.target.value }))}
              className="w-full"
            />
            <select
              name="role"
              value={formData.role}
              onChange={e => setFormData(f => ({ ...f, role: e.target.value }))}
              className="w-full border rounded p-2"
            >
              {Object.entries(rolesMap).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
              className="w-full border rounded p-2"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
