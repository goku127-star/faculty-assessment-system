import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assessmentApi } from '../api/assessment';
import { courseApi } from '../api/course';
import { recordApi } from '../api/record';

interface RowState {
  studentId: string;
  name: string;
  rollNumber: string;
  marksObtained: string;
  remarks: string;
}

export function AssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<any>(null);
  const [rows, setRows] = useState<RowState[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    assessmentApi.get(id).then(async (a: any) => {
      setAssessment(a);
      const course = await courseApi.get(a.courseId);
      const enrolled = (course as any).enrollments ?? [];
      const existingRecords: any[] = a.records ?? [];

      const initialRows: RowState[] = enrolled.map((e: any) => {
        const existing = existingRecords.find((r) => r.studentId === e.student.id);
        return {
          studentId: e.student.id,
          name: e.student.name,
          rollNumber: e.student.rollNumber,
          marksObtained: existing ? String(existing.marksObtained) : '',
          remarks: existing?.remarks || '',
        };
      });
      setRows(initialRows);
    });
  }, [id]);

  const updateRow = (studentId: string, field: 'marksObtained' | 'remarks', value: string) => {
    setRows((prev) => prev.map((r) => (r.studentId === studentId ? { ...r, [field]: value } : r)));
  };

  const handleSaveAll = async () => {
    if (!id) return;
    setSaving(true);
    setMessage('');
    try {
      const entries = rows
        .filter((r) => r.marksObtained !== '')
        .map((r) => ({
          studentId: r.studentId,
          marksObtained: Number(r.marksObtained),
          remarks: r.remarks || undefined,
        }));
      await recordApi.bulkUpsert(id, entries);
      setMessage('Marks saved successfully.');
    } catch {
      setMessage('Failed to save marks.');
    } finally {
      setSaving(false);
    }
  };

  if (!assessment) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>{assessment.title}</h1>
      </div>
      <p className="subtitle">
        {assessment.course?.code} — {assessment.course?.title} · {assessment.type} · Max marks:{' '}
        {assessment.maxMarks} · Weightage: {assessment.weightage}%
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Roll No.</th>
            <th>Student</th>
            <th>Marks (/{assessment.maxMarks})</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.studentId}>
              <td>{r.rollNumber}</td>
              <td>{r.name}</td>
              <td>
                <input
                  type="number"
                  min={0}
                  max={assessment.maxMarks}
                  value={r.marksObtained}
                  onChange={(e) => updateRow(r.studentId, 'marksObtained', e.target.value)}
                  className="marks-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={r.remarks}
                  onChange={(e) => updateRow(r.studentId, 'remarks', e.target.value)}
                  placeholder="Optional remarks"
                  className="remarks-input"
                />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4}>No students enrolled in this course yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      {rows.length > 0 && (
        <div className="save-bar">
          <button className="btn btn-primary" onClick={handleSaveAll} disabled={saving}>
            {saving ? 'Saving…' : 'Save All Marks'}
          </button>
          {message && <span className="save-message">{message}</span>}
        </div>
      )}
    </div>
  );
}
