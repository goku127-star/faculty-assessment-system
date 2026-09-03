import { apiClient } from './client';
import { Student } from '../types';

export const studentApi = {
  list: () => apiClient.get<Student[]>('/students').then((r) => r.data),
  get: (id: string) => apiClient.get<Student>(`/students/${id}`).then((r) => r.data),
  create: (data: Partial<Student>) => apiClient.post<Student>('/students', data).then((r) => r.data),
  update: (id: string, data: Partial<Student>) =>
    apiClient.patch<Student>(`/students/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/students/${id}`).then((r) => r.data),
  enroll: (id: string, courseId: string) =>
    apiClient.post(`/students/${id}/enroll`, { courseId }).then((r) => r.data),
};
