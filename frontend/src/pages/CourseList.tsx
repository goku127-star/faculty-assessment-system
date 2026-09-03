import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/course';
import { facultyApi } from '../api/faculty';
import { Course, Faculty, Semester } from '../types';

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [facultyOptions, setFacultyOptions] = useState<Faculty[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    code: '',
    title: '',
    department: '',
    credits: 3,
    semester: 'ODD' as Semester,
    academicYear: '',
    facultyId: '',
  });

  const load = () => courseApi.list().then(setCourses);

  useEffect(() => {
    load();
    facultyApi.list().then(setFacultyOptions);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await courseApi.create(form);
      setForm({ code: '', title: '', department: '', credits: 3, semester: 'ODD', academicYear: '', facultyId: '' });
      setShowForm(false);
      load();
    } catch {
      setError('Could not create course. Course code may already exist.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course? This removes its assessments too.')) return;
    await courseApi.remove(id);
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Courses</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              placeholder="Course Code (e.g. CS301)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            />
            <input
              placeholder="Credits"
              type="number"
              min={1}
              value={form.credits}
              onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
              required
            />
            <select
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value as Semester })}
            >
              <option value="ODD">Odd</option>
              <option value="EVEN">Even</option>
            </select>
            <input
              placeholder="Academic Year (e.g. 2025-2026)"
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              required
            />
            <select
              value={form.facultyId}
              onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
              required
            >
              <option value="">Select Faculty</option>
              {facultyOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" type="submit">
            Save Course
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Faculty</th>
            <th>Semester</th>
            <th>Credits</th>
            <th>Students</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>
                <Link to={`/courses/${c.id}`}>{c.title}</Link>
              </td>
              <td>{c.faculty?.name}</td>
              <td>{c.semester}</td>
              <td>{c.credits}</td>
              <td>{c._count?.enrollments ?? 0}</td>
              <td>
                <button className="btn btn-danger-ghost" onClick={() => handleDelete(c.id)}>
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
