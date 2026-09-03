import { apiClient } from './client';
import { Assessment } from '../types';

export const assessmentApi = {
  list: (courseId?: string) =>
    apiClient
      .get<Assessment[]>('/assessments', { params: courseId ? { courseId } : {} })
      .then((r) => r.data),
  get: (id: string) => apiClient.get<Assessment>(`/assessments/${id}`).then((r) => r.data),
  create: (data: Partial<Assessment>) =>
    apiClient.post<Assessment>('/assessments', data).then((r) => r.data),
  update: (id: string, data: Partial<Assessment>) =>
    apiClient.patch<Assessment>(`/assessments/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/assessments/${id}`).then((r) => r.data),
};
