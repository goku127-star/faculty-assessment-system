import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assessmentApi } from '../api/assessment';
import { courseApi } from '../api/course';
import { Assessment, AssessmentType, Course } from '../types';

const TYPES: AssessmentType[] = ['QUIZ', 'ASSIGNMENT', 'MIDTERM', 'FINAL', 'PROJECT', 'VIVA'];

export function AssessmentList() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    courseId: '',
    title: '',
    type: 'QUIZ' as AssessmentType,
    maxMarks: 20,
    weightage: 10,
    scheduledOn: '',
  });

  const load = () => assessmentApi.list().then(setAssessments);

  useEffect(() => {
    load();
    courseApi.list().then(setCourses);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await assessmentApi.create({ ...form, scheduledOn: form.scheduledOn || undefined });
      setForm({ courseId: '', title: '', type: 'QUIZ', maxMarks: 20, weightage: 10, scheduledOn: '' });
      setShowForm(false);
      load();
    } catch {
      setError('Could not create assessment.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assessment and all recorded marks?')) return;
    await assessmentApi.remove(id);
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Assessments</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add Assessment'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <select
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
            <input
              placeholder="Title (e.g. Midterm Exam)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssessmentType })}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              placeholder="Max Marks"
              type="number"
              min={1}
              value={form.maxMarks}
              onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
              required
            />
            <input
              placeholder="Weightage %"
              type="number"
              min={0}
              max={100}
              value={form.weightage}
              onChange={(e) => setForm({ ...form, weightage: Number(e.target.value) })}
            />
            <input
              type="date"
              value={form.scheduledOn}
              onChange={(e) => setForm({ ...form, scheduledOn: e.target.value })}
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" type="submit">
            Save Assessment
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Course</th>
            <th>Type</th>
            <th>Max Marks</th>
            <th>Weightage</th>
            <th>Records</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((a) => (
            <tr key={a.id}>
              <td>
                <Link to={`/assessments/${a.id}`}>{a.title}</Link>
              </td>
              <td>{a.course?.code}</td>
              <td>{a.type}</td>
              <td>{a.maxMarks}</td>
              <td>{a.weightage}%</td>
              <td>{a._count?.records ?? 0}</td>
              <td>
                <button className="btn btn-danger-ghost" onClick={() => handleDelete(a.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
