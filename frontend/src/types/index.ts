export type Role = 'ADMIN' | 'FACULTY';
export type Semester = 'ODD' | 'EVEN';
export type AssessmentType = 'QUIZ' | 'ASSIGNMENT' | 'MIDTERM' | 'FINAL' | 'PROJECT' | 'VIVA';

export interface Faculty {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  department: string;
  designation?: string | null;
  role: Role;
  isActive: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  credits: number;
  semester: Semester;
  academicYear: string;
  facultyId: string;
  faculty?: Faculty;
  _count?: { enrollments: number; assessments: number };
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  program?: string | null;
  batch?: string | null;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  type: AssessmentType;
  maxMarks: number;
  weightage: number;
  scheduledOn?: string | null;
  course?: Course;
  _count?: { records: number };
}

export interface AssessmentRecord {
  id: string;
  assessmentId: string;
  studentId: string;
  marksObtained: number;
  remarks?: string | null;
  student?: Student;
  assessment?: Assessment;
}

export interface LoginResponse {
  accessToken: string;
  faculty: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: Role;
  };
}
