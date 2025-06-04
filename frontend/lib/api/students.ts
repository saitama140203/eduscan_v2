import { apiRequest } from './base';

export interface Student {
  maHocSinh: number;
  hoTen: string;
  maSoHocSinh: string;
  lop: string;
  namSinh: number;
  gioiTinh: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
  hoTenCha: string;
  hoTenMe: string;
  trangThai: 'active' | 'warning' | 'inactive';
  diemTrungBinh: number;
  xepLoai: string;
  soLanVang: number;
  ghiChu: string;
  maToChuc?: number;
}

export interface StudentFilters {
  search?: string;
  lop?: string;
  khoi?: string;
  trangThai?: string;
  xepLoai?: string;
  maToChuc?: number;
  page?: number;
  limit?: number;
}

export const studentsApi = {
  // Get all students with filters
  getStudents: async (filters?: StudentFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 'all') {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    return apiRequest(
      `/students${queryString ? `?${queryString}` : ''}`
    );
  },

  // Get student by ID
  getStudentById: async (id: number) => {
    return apiRequest(`/students/${id}`);
  },

  // Create new student
  createStudent: async (student: Omit<Student, 'maHocSinh'>) => {
    return apiRequest('/students', {
      method: 'POST',
      body: student,
    });
  },

  // Update student
  updateStudent: async (id: number, student: Partial<Student>) => {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: student,
    });
  },

  // Delete student
  deleteStudent: async (id: number) => {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },

  // Get student grades
  getStudentGrades: async (studentId: number) => {
    return apiRequest(`/students/${studentId}/grades`);
  },

  // Transfer student to another class
  transferStudent: async (studentId: number, newClassId: number) => {
    return apiRequest(`/students/${studentId}/transfer`, {
      method: 'POST',
      body: { newClassId },
    });
  },

  // Get student attendance
  getStudentAttendance: async (studentId: number) => {
    return apiRequest(`/students/${studentId}/attendance`);
  },
};
