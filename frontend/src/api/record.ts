import { apiClient } from './client';
import { AssessmentRecord } from '../types';

export const recordApi = {
  list: (assessmentId?: string, studentId?: string) =>
    apiClient
      .get<AssessmentRecord[]>('/assessment-records', {
        params: { ...(assessmentId ? { assessmentId } : {}), ...(studentId ? { studentId } : {}) },
      })
      .then((r) => r.data),
  bulkUpsert: (assessmentId: string, entries: { studentId: string; marksObtained: number; remarks?: string }[]) =>
    apiClient
      .post<AssessmentRecord[]>('/assessment-records/bulk', { assessmentId, entries })
      .then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/assessment-records/${id}`).then((r) => r.data),
  report: (studentId: string, courseId: string) =>
    apiClient
      .get('/assessment-records/report', { params: { studentId, courseId } })
      .then((r) => r.data),
};
