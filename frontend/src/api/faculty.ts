import { apiClient } from './client';
import { Faculty } from '../types';

export const facultyApi = {
  list: () => apiClient.get<Faculty[]>('/faculty').then((r) => r.data),
  get: (id: string) => apiClient.get<Faculty>(`/faculty/${id}`).then((r) => r.data),
  create: (data: Partial<Faculty> & { password: string }) =>
    apiClient.post<Faculty>('/faculty', data).then((r) => r.data),
  update: (id: string, data: Partial<Faculty>) =>
    apiClient.patch<Faculty>(`/faculty/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/faculty/${id}`).then((r) => r.data),
};
