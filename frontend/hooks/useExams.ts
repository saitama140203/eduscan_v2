import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsApi, Exam, ExamFilters } from '@/lib/api/exams';
import { toast } from 'sonner';

// Get all exams
export function useExams(filters?: ExamFilters) {
  return useQuery({
    queryKey: ['exams', filters],
    queryFn: () => examsApi.getExams(filters),
  });
}

// Get exam by ID
export function useExam(id: number) {
  return useQuery({
    queryKey: ['exams', id],
    queryFn: () => examsApi.getExamById(id),
    enabled: !!id,
  });
}

// Create exam
export function useCreateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examsApi.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Bài thi đã được tạo thành công');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo bài thi');
    },
  });
}

// Update exam
export function useUpdateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Exam> }) =>
      examsApi.updateExam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Bài thi đã được cập nhật');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật bài thi');
    },
  });
}

// Delete exam
export function useDeleteExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examsApi.deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Bài thi đã được xóa');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa bài thi');
    },
  });
}

// Duplicate exam
export function useDuplicateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: examsApi.duplicateExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Bài thi đã được sao chép');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi sao chép bài thi');
    },
  });
}

// Get exam results
export function useExamResults(examId: number) {
  return useQuery({
    queryKey: ['exams', examId, 'results'],
    queryFn: () => examsApi.getExamResults(examId),
    enabled: !!examId,
  });
}

// Get exam statistics
export function useExamStatistics(examId: number) {
  return useQuery({
    queryKey: ['exams', examId, 'statistics'],
    queryFn: () => examsApi.getExamStatistics(examId),
    enabled: !!examId,
  });
}
