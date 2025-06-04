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
// Individual API functions for easier typing
export const getUsers = async (skip = 0, limit = 100) => {
  return apiRequest(`/users/?skip=${skip}&limit=${limit}`)
}

export const getUsersByOrganization = async (orgId: number, skip = 0, limit = 100) => {
  return apiRequest(`/users/organization/${orgId}?skip=${skip}&limit=${limit}`)
}

export const getTeachers = async (orgId?: number, skip = 0, limit = 100) => {
  if (orgId) {
    const users = await getUsersByOrganization(orgId, skip, limit)
    return users.filter((user: User) => user.vaiTro.toLowerCase() === 'teacher')
  } else {
    const users = await getUsers(skip, limit)
    return users.filter((user: User) => user.vaiTro.toLowerCase() === 'teacher')
  }
}

export const getUser = async (userId: string) => {
  return apiRequest(`/users/${userId}`)
}

export const createUser = async (data: UserCreate) => {
  return apiRequest('/users/', {
    method: 'POST',
    body: data,
  })
}

export const updateUser = async (userId: string, data: UserUpdate) => {
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: data,
  })
}

export const deleteUser = async (userId: string) => {
  return apiRequest(`/users/${userId}`, {
    method: 'DELETE',
  })
}

export const usersApi = {
  getUsers,
  getUsersByOrganization,
  getTeachers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}

