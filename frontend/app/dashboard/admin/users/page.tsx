"use client";
import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUsers } from "@/hooks/api/useUserQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rolesMap } from "@/lib/constants";
import { Pencil, Trash2, PlusCircle, Search, UserX, UserCheck, User2 } from "lucide-react";

// Import các Dialog
import { CreateUserDialog } from "./CreateUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { DeactivateUserDialog } from "./DeactivateUserDialog";
import { ActivateUserDialog } from "./ActivateUserDialog";
import { AvatarCropDialog } from "./AvatarCropDialog";

interface User {
  maNguoiDung: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  trangThai: boolean;
  tenToChuc?: string;
  urlAnhDaiDien?: string;
}

function UserStatusBadge({ status }: { status: boolean }) {
  return status
    ? <Badge className="bg-green-100 text-green-700">Active</Badge>
    : <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">Inactive</Badge>;
}
function UserRoleBadge({ role }: { role: string }) {
  return (
    <Badge className="bg-blue-100 text-blue-700">
      {rolesMap[role as keyof typeof rolesMap] || role}
    </Badge>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const debouncedSearch = useDebounce(search, 400);

  // Dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
  const [openAvatarCrop, setOpenAvatarCrop] = useState(false);

  // User đang chọn cho thao tác
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Query data
  const { data: usersData = [], isLoading, refetch } = useUsers({
    skip: (page - 1) * perPage,
    limit: perPage,
  });

  // Filter theo search
  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return usersData;
    const key = debouncedSearch.toLowerCase();
    return usersData.filter(
      (u: User) =>
        u.hoTen?.toLowerCase().includes(key) ||
        u.email?.toLowerCase().includes(key)
    );
  }, [usersData, debouncedSearch]);

  // Callback mở từng dialog, set selected user
  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setOpenEdit(true);
  }, []);
  const handleDeactivate = useCallback((user: User) => {
    setSelectedUser(user);
    setOpenDeactivate(true);
  }, []);
  const handleActivate = useCallback((user: User) => {
    setSelectedUser(user);
    setOpenActivate(true);
  }, []);
  const handleAvatarCrop = useCallback((user: User) => {
    setSelectedUser(user);
    setOpenAvatarCrop(true);
  }, []);

  // Refetch sau khi action thành công
  const onActionSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    refetch();
  }, [queryClient, refetch]);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setOpenCreate(true)}
        >
          <PlusCircle size={18} /> Thêm user mới
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2 w-full max-w-md">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </span>
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => refetch()} title="Tìm lại">
          <Search size={16} />
        </Button>
      </div>

      {/* Danh sách người dùng */}
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
                <TableHead>Avatar</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                      <div className="text-gray-500">
                        <p className="font-medium">Đang tải dữ liệu...</p>
                        <p className="text-sm">Vui lòng chờ trong giây lát</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-gray-500">
                    Không có user nào phù hợp
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.maNguoiDung}>
                    <TableCell>{user.maNguoiDung}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.hoTen}</TableCell>
                    <TableCell><UserRoleBadge role={user.vaiTro} /></TableCell>
                    <TableCell>{user.tenToChuc || "-"}</TableCell>
                    <TableCell><UserStatusBadge status={user.trangThai} /></TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAvatarCrop(user)}
                        title="Cập nhật ảnh đại diện"
                      >
                        {user.urlAnhDaiDien ? (
                          <img src={user.urlAnhDaiDien} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <User2 className="h-5 w-5" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                          <Pencil size={14} /> <span className="ml-1">Sửa</span>
                        </Button>
                        {user.trangThai ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeactivate(user)}
                          >
                            <UserX size={14} /> <span className="ml-1">Vô hiệu hóa</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleActivate(user)}
                          >
                            <UserCheck size={14} /> <span className="ml-1">Kích hoạt</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
        >
          Trước
        </Button>
        <span className="px-2 text-sm">Trang {page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={filteredUsers.length < perPage || isLoading}
        >
          Sau
        </Button>
      </div>

      {/* --- Dialogs --- */}
      <CreateUserDialog open={openCreate} onOpenChange={setOpenCreate} onSuccess={onActionSuccess} />
      {selectedUser && (
        <>
          <EditUserDialog open={openEdit} onOpenChange={setOpenEdit} user={selectedUser} onSuccess={onActionSuccess} />
          <DeactivateUserDialog open={openDeactivate} onOpenChange={setOpenDeactivate} user={selectedUser} onSuccess={onActionSuccess} />
          <ActivateUserDialog open={openActivate} onOpenChange={setOpenActivate} user={selectedUser} onSuccess={onActionSuccess} />
          <AvatarCropDialog open={openAvatarCrop} onOpenChange={setOpenAvatarCrop} user={selectedUser} onSuccess={onActionSuccess} />
        </>
      )}
    </div>
  );
}
