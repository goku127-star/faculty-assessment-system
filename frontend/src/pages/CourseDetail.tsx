import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { courseApi } from '../api/course';
import { Course } from '../types';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (id) courseApi.get(id).then(setCourse as any);
  }, [id]);

  if (!course) return <div className="page">Loading…</div>;

  const c = course as any;

  return (
    <div className="page">
      <div className="page-header">
        <h1>
          {c.code} — {c.title}
        </h1>
      </div>
      <p className="subtitle">
        {c.department} · {c.semester} semester · {c.academicYear} · Faculty: {c.faculty?.name}
      </p>

      <h2>Assessments</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Max Marks</th>
            <th>Weightage</th>
          </tr>
        </thead>
        <tbody>
          {c.assessments?.map((a: any) => (
            <tr key={a.id}>
              <td>
                <Link to={`/assessments/${a.id}`}>{a.title}</Link>
              </td>
              <td>{a.type}</td>
              <td>{a.maxMarks}</td>
              <td>{a.weightage}%</td>
            </tr>
          ))}
          {c.assessments?.length === 0 && (
            <tr>
              <td colSpan={4}>No assessments yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Enrolled Students</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Roll No.</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {c.enrollments?.map((e: any) => (
            <tr key={e.id}>
              <td>{e.student.rollNumber}</td>
              <td>{e.student.name}</td>
              <td>{e.student.email}</td>
            </tr>
          ))}
          {c.enrollments?.length === 0 && (
            <tr>
              <td colSpan={3}>No students enrolled yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
