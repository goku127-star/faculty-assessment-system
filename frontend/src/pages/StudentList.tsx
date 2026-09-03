import { FormEvent, useEffect, useState } from 'react';
import { studentApi } from '../api/student';
import { courseApi } from '../api/course';
import { Student, Course } from '../types';

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ rollNumber: '', name: '', email: '', program: '', batch: '' });
  const [enrollTarget, setEnrollTarget] = useState<string | null>(null);
  const [enrollCourseId, setEnrollCourseId] = useState('');

  const load = () => studentApi.list().then(setStudents);

  useEffect(() => {
    load();
    courseApi.list().then(setCourses);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await studentApi.create(form);
      setForm({ rollNumber: '', name: '', email: '', program: '', batch: '' });
      setShowForm(false);
      load();
    } catch {
      setError('Could not create student. Roll number/email may already exist.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this student?')) return;
    await studentApi.remove(id);
    load();
  };

  const handleEnroll = async (studentId: string) => {
    if (!enrollCourseId) return;
    await studentApi.enroll(studentId, enrollCourseId);
    setEnrollTarget(null);
    setEnrollCourseId('');
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Students</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              placeholder="Roll Number"
              value={form.rollNumber}
              onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
              required
            />
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              placeholder="Program (optional)"
              value={form.program}
              onChange={(e) => setForm({ ...form, program: e.target.value })}
            />
            <input
              placeholder="Batch (optional)"
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" type="submit">
            Save Student
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Roll No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Program</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.rollNumber}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.program || '—'}</td>
              <td className="row-actions">
                {enrollTarget === s.id ? (
                  <>
                    <select value={enrollCourseId} onChange={(e) => setEnrollCourseId(e.target.value)}>
                      <option value="">Select course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-primary" onClick={() => handleEnroll(s.id)}>
                      Confirm
                    </button>
                    <button className="btn btn-ghost" onClick={() => setEnrollTarget(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-ghost" onClick={() => setEnrollTarget(s.id)}>
                      Enroll
                    </button>
                    <button className="btn btn-danger-ghost" onClick={() => handleDelete(s.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
