import { apiRequest } from './base';

export interface Exam {
  maBaiThi: number;
  tenBaiThi: string;
  monHoc: string;
  lop: string;
  giaoVienTao: string;
  ngayTao: string;
  ngayThi: string;
  thoiGianLam: number;
  soLuongCauHoi: number;
  soHocSinhDangKy: number;
  soHocSinhDaLam: number;
  trangThai: 'upcoming' | 'inprogress' | 'grading' | 'completed';
  diemTrungBinh: number;
  tyLeDat: number;
  loaiBaiThi: 'midterm' | 'final' | 'quiz' | 'practice' | 'regular';
  maToChuc?: number;
}

export interface ExamFilters {
  search?: string;
  monHoc?: string;
  loaiBaiThi?: string;
  trangThai?: string;
  lop?: string;
  giaoVien?: string;
  maToChuc?: number;
  page?: number;
  limit?: number;
}

export const examsApi = {
  // Get all exams with filters
  getExams: async (filters?: ExamFilters) => {
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
      `/exams${queryString ? `?${queryString}` : ''}`
    );
  },

  // Get exam by ID
  getExamById: async (id: number) => {
    return apiRequest(`/exams/${id}`);
  },

  // Create new exam
  createExam: async (exam: Omit<Exam, 'maBaiThi' | 'soHocSinhDaLam' | 'diemTrungBinh' | 'tyLeDat'>) => {
    return apiRequest('/exams', {
      method: 'POST',
      body: exam,
    });
  },

  // Update exam
  updateExam: async (id: number, exam: Partial<Exam>) => {
    return apiRequest(`/exams/${id}`, {
      method: 'PUT',
      body: exam,
    });
  },

  // Delete exam
  deleteExam: async (id: number) => {
    return apiRequest(`/exams/${id}`, {
      method: 'DELETE',
    });
  },

  // Get exam results
  getExamResults: async (examId: number) => {
    return apiRequest(`/exams/${examId}/results`);
  },

  // Duplicate exam
  duplicateExam: async (examId: number) => {
    return apiRequest(`/exams/${examId}/duplicate`, {
      method: 'POST',
    });
  },

  // Get exam statistics
  getExamStatistics: async (examId: number) => {
    return apiRequest(`/exams/${examId}/statistics`);
  },
};
