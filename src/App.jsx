import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import IntranetLoginPage from "./pages/IntranetLoginPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

function PrivateRoute({ children, roles, loginPath = "/intranet/login" }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />;
  }

  return roles.includes(user?.role) ? (
    children
  ) : (
    <Navigate to={loginPath} replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={["ADMIN"]} loginPath="/admin/login">
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/intranet/login" element={<IntranetLoginPage />} />
        <Route
          path="/docente/dashboard"
          element={
            <PrivateRoute roles={["TEACHER"]} loginPath="/intranet/login">
              <TeacherDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/alumno/dashboard"
          element={
            <PrivateRoute roles={["STUDENT"]} loginPath="/intranet/login">
              <StudentDashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
