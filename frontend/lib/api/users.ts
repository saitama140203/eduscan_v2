// lib/api/users.ts
import { apiRequest } from './base';

// Types
export interface User {
  maNguoiDung: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  soDienThoai?: string;
  urlAnhDaiDien?: string;
  maToChuc?: number;
  trangThai: boolean;
  thoiGianTao: string;
  thoiGianCapNhat: string;
}

export interface UserCreate {
  email: string;
  password: string;
  passwordConfirm: string;
  hoTen: string;
  vaiTro: string;
  soDienThoai?: string;
  urlAnhDaiDien?: string;
  maToChuc?: number;
}

export interface UserUpdate {
  email?: string;
  hoTen?: string;
  vaiTro?: string;
  soDienThoai?: string;
  urlAnhDaiDien?: string;
  maToChuc?: number;
  trangThai?: boolean;
}

// API functions
export const usersApi = {
  // Lấy danh sách users
  getUsers: async (skip = 0, limit = 100) => {
    return apiRequest(`/users/?skip=${skip}&limit=${limit}`);
  },

  // Lấy danh sách users theo organization
  getUsersByOrganization: async (orgId: number, skip = 0, limit = 100) => {
    return apiRequest(`/users/organization/${orgId}?skip=${skip}&limit=${limit}`);
  },

  // Lấy danh sách teachers (users với role Teacher)
  getTeachers: async (orgId?: number, skip = 0, limit = 100) => {
    if (orgId) {
      const users = await usersApi.getUsersByOrganization(orgId, skip, limit);
      return users.filter((user: User) => user.vaiTro.toLowerCase() === 'teacher');
    } else {
      const users = await usersApi.getUsers(skip, limit);
      return users.filter((user: User) => user.vaiTro.toLowerCase() === 'teacher');
    }
  },

  // Lấy chi tiết user
  getUser: async (userId: string) => {
    return apiRequest(`/users/${userId}`);
  },

  // Tạo user mới
  createUser: async (data: UserCreate) => {
    return apiRequest("/users/", {
      method: "POST",
      body: data,
    });
  },

  // Cập nhật user
  updateUser: async (userId: string, data: UserUpdate) => {
    return apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: data,
    });
  },

  // Xóa user
  deleteUser: async (userId: string) => {
    return apiRequest(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};
