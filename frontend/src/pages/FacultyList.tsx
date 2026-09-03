import { FormEvent, useEffect, useState } from 'react';
import { facultyApi } from '../api/faculty';
import { Faculty } from '../types';

export function FacultyList() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employeeCode: '',
    name: '',
    email: '',
    password: '',
    department: '',
    designation: '',
  });
  const [error, setError] = useState('');

  const load = () => facultyApi.list().then(setFaculty);

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await facultyApi.create(form);
      setForm({ employeeCode: '', name: '', email: '', password: '', department: '', designation: '' });
      setShowForm(false);
      load();
    } catch {
      setError('Could not create faculty. Check for duplicate email/employee code.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this faculty member?')) return;
    await facultyApi.remove(id);
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Faculty</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add Faculty'}
        </button>
      </div>

      {showForm && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              placeholder="Employee Code"
              value={form.employeeCode}
              onChange={(e) => setForm({ ...form, employeeCode: e.target.value })}
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
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            />
            <input
              placeholder="Designation (optional)"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" type="submit">
            Save Faculty
          </button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((f) => (
            <tr key={f.id}>
              <td>{f.employeeCode}</td>
              <td>{f.name}</td>
              <td>{f.email}</td>
              <td>{f.department}</td>
              <td>{f.designation || '—'}</td>
              <td>
                <button className="btn btn-danger-ghost" onClick={() => handleDelete(f.id)}>
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
