import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CourseList } from './pages/CourseList';
import { CourseDetail } from './pages/CourseDetail';
import { StudentList } from './pages/StudentList';
import { AssessmentList } from './pages/AssessmentList';
import { AssessmentDetail } from './pages/AssessmentDetail';
import { FacultyList } from './pages/FacultyList';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/assessments" element={<AssessmentList />} />
              <Route path="/assessments/:id" element={<AssessmentDetail />} />
              <Route path="/faculty" element={<FacultyList />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
