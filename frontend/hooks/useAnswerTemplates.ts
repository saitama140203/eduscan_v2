import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { answerTemplateApi, AnswerSheetTemplateCreate, AnswerSheetTemplateUpdate } from '@/lib/api/answer-templates'
import { toast } from 'sonner'

export const templateKeys = {
  all: ['answerTemplates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (org?: number) => [...templateKeys.lists(), org] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: number) => [...templateKeys.details(), id] as const,
}

export function useAnswerTemplates(orgId?: number) {
  return useQuery({
    queryKey: templateKeys.list(orgId),
    queryFn: () => answerTemplateApi.getTemplates(orgId),
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AnswerSheetTemplateCreate) => answerTemplateApi.createTemplate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: templateKeys.all })
      toast.success('Đã tạo mẫu phiếu')
    },
    onError: (e: Error) => toast.error(`Lỗi: ${e.message}`),
  })
}

export function useUpdateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AnswerSheetTemplateUpdate }) =>
      answerTemplateApi.updateTemplate(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: templateKeys.all })
      qc.invalidateQueries({ queryKey: templateKeys.detail(id) })
      toast.success('Đã cập nhật')
    },
    onError: (e: Error) => toast.error(`Lỗi: ${e.message}`),
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => answerTemplateApi.deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: templateKeys.all })
      toast.success('Đã xóa')
    },
    onError: (e: Error) => toast.error(`Lỗi: ${e.message}`),
  })
}
