import { apiClient } from './client';
import { Course } from '../types';

export const courseApi = {
  list: (facultyId?: string) =>
    apiClient
      .get<Course[]>('/courses', { params: facultyId ? { facultyId } : {} })
      .then((r) => r.data),
  get: (id: string) => apiClient.get<Course>(`/courses/${id}`).then((r) => r.data),
  create: (data: Partial<Course>) => apiClient.post<Course>('/courses', data).then((r) => r.data),
  update: (id: string, data: Partial<Course>) =>
    apiClient.patch<Course>(`/courses/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/courses/${id}`).then((r) => r.data),
};
