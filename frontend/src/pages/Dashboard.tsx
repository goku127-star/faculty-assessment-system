import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/course';
import { studentApi } from '../api/student';
import { assessmentApi } from '../api/assessment';
import { Course, Student, Assessment } from '../types';

export function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([courseApi.list(), studentApi.list(), assessmentApi.list()])
      .then(([c, s, a]) => {
        setCourses(c);
        setStudents(s);
        setAssessments(a);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading dashboard…</div>;

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <Link to="/courses" className="stat-card">
          <div className="stat-value">{courses.length}</div>
          <div className="stat-label">Courses</div>
        </Link>
        <Link to="/students" className="stat-card">
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Students</div>
        </Link>
        <Link to="/assessments" className="stat-card">
          <div className="stat-value">{assessments.length}</div>
          <div className="stat-label">Assessments</div>
        </Link>
      </div>

      <h2>Recent Courses</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Faculty</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {courses.slice(0, 6).map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>
                <Link to={`/courses/${c.id}`}>{c.title}</Link>
              </td>
              <td>{c.faculty?.name}</td>
              <td>{c.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
