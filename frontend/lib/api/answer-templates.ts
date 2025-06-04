import { apiRequest } from './base'

export interface AnswerSheetTemplate {
  maMauPhieu: number
  maToChuc: number
  maNguoiTao: number
  tenMauPhieu: string
  soCauHoi: number
  soLuaChonMoiCau: number
  khoGiay: string
  coTuLuan: boolean
  coThongTinHocSinh: boolean
  coLogo: boolean
  cauTrucJson?: any
  cssFormat?: string
  laMacDinh: boolean
  laCongKhai: boolean
  thoiGianTao: string
  thoiGianCapNhat: string
}

export interface AnswerSheetTemplateCreate {
  maToChuc: number
  maNguoiTao: number
  tenMauPhieu: string
  soCauHoi: number
  soLuaChonMoiCau?: number
  khoGiay?: string
  coTuLuan?: boolean
  coThongTinHocSinh?: boolean
  coLogo?: boolean
  cauTrucJson?: any
  cssFormat?: string
  laMacDinh?: boolean
  laCongKhai?: boolean
}

export interface AnswerSheetTemplateUpdate {
  tenMauPhieu?: string
  soCauHoi?: number
  soLuaChonMoiCau?: number
  khoGiay?: string
  coTuLuan?: boolean
  coThongTinHocSinh?: boolean
  coLogo?: boolean
  cauTrucJson?: any
  cssFormat?: string
  laMacDinh?: boolean
  laCongKhai?: boolean
}

export const answerTemplateApi = {
  getTemplates: async (orgId?: number) => {
    const qs = orgId ? `?ma_to_chuc=${orgId}` : ''
    return apiRequest(`/answer-templates${qs}`)
  },
  getTemplate: async (id: number) => apiRequest(`/answer-templates/${id}`),
  createTemplate: async (data: AnswerSheetTemplateCreate) =>
    apiRequest('/answer-templates', { method: 'POST', body: data }),
  updateTemplate: async (id: number, data: AnswerSheetTemplateUpdate) =>
    apiRequest(`/answer-templates/${id}`, { method: 'PUT', body: data }),
  deleteTemplate: async (id: number) =>
    apiRequest(`/answer-templates/${id}`, { method: 'DELETE' }),
}
