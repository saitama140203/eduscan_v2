import { apiRequest } from './base';

export interface Class {
  maLopHoc: number;
  tenLop: string;
  maToChuc: number;
  capHoc?: string;
  namHoc?: string;
  maGiaoVienChuNhiem?: number;
  moTa?: string;
  trangThai: boolean;
  thoiGianTao: string;
  thoiGianCapNhat: string;
  tenGiaoVienChuNhiem?: string;
  tenToChuc?: string;
  total_students?: number;
  total_exams?: number;
}

export interface ClassCreate {
  tenLop: string;
  maToChuc: number;
  capHoc?: string;
  namHoc?: string;
  maGiaoVienChuNhiem?: number;
  moTa?: string;
}

export interface ClassUpdate {
  tenLop?: string;
  capHoc?: string;
  namHoc?: string;
  maGiaoVienChuNhiem?: number;
  moTa?: string;
  trangThai?: boolean;
}

export const classesApi = {
  // Lấy danh sách lớp học
  getClasses: async (params?: {
    org_id?: number;
    teacher_id?: number;
    search?: string;
    skip?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.org_id !== undefined) searchParams.append('org_id', params.org_id.toString());
      if (params.teacher_id !== undefined) searchParams.append('teacher_id', params.teacher_id.toString());
      if (params.search !== undefined) searchParams.append('search', params.search);
      if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
      if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    }
    const queryString = searchParams.toString();
        return apiRequest(`/classes/${queryString ? `?${queryString}` : ''}`);
  },

  // Lấy chi tiết lớp học
  getClass: async (classId: number) => {
    return apiRequest(`/classes/${classId}`);
  },

  // Tạo lớp học mới
  createClass: async (data: ClassCreate) => {
    return apiRequest("/classes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  // Cập nhật lớp học
  updateClass: async (classId: number, data: ClassUpdate) => {
    return apiRequest(`/classes/${classId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  // Xóa lớp học
  deleteClass: async (classId: number) => {
    return apiRequest(`/classes/${classId}`, {
      method: "DELETE",
    });
  },
};

// Class Analytics Types
export interface ExamStatistic {
  maKyThi: number;
  tenKyThi: string;
  ngayThi: string;
  soLuongHocSinh: number;
  diemTrungBinh: number;
  diemCao: number;
  diemThap: number;
  tyLeDau: number;
  phanPhoi: {
    gioi: number;
    kha: number;
    trungBinh: number;
    yeu: number;
  };
  trend?: string;
}

export interface ClassAnalytics {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  examTrend: ExamStatistic[];
  overallAverage: string;
  bestExam: ExamStatistic;
  worstExam: ExamStatistic;
  totalExams: number;
}

// Class Settings Types
export interface ClassSettings {
  maLopHoc: number;
  maxStudents: number;
  allowSelfEnroll: boolean;
  requireApproval: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  parentNotifications: boolean;
  autoGrading: boolean;
  passingScore: number;
  retakeAllowed: boolean;
  maxRetakeAttempts: number;
  showStudentList: boolean;
  showScores: boolean;
  allowStudentComments: boolean;
  dataRetentionDays: number;
  backupFrequency: string;
  auditLogging: boolean;
}

export interface ClassSettingsUpdate {
  maxStudents?: number;
  allowSelfEnroll?: boolean;
  requireApproval?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  parentNotifications?: boolean;
  autoGrading?: boolean;
  passingScore?: number;
  retakeAllowed?: boolean;
  maxRetakeAttempts?: number;
  showStudentList?: boolean;
  showScores?: boolean;
  allowStudentComments?: boolean;
  dataRetentionDays?: number;
  backupFrequency?: string;
  auditLogging?: boolean;
}

// Class Analytics API
export const classAnalyticsApi = {
  getAnalytics: async (classId: number, period: string = "all", metric: string = "average") => {
    const params = new URLSearchParams({ period, metric });
    return apiRequest(`/classes/${classId}/analytics?${params}`);
  }
};

// Class Settings API
export const classSettingsApi = {
  getSettings: async (classId: number) => {
    return apiRequest(`/classes/${classId}/settings`);
  },

  updateSettings: async (classId: number, settings: ClassSettingsUpdate) => {
    return apiRequest(`/classes/${classId}/settings`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
  }
};
