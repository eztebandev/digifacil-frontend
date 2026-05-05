import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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

function AnalyticsTracker() {
  const location = useLocation();
  const gaId = import.meta.env.VITE_GA_ID;

  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: `${location.pathname}${location.search}`,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [gaId, location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard/:section?"
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
          path="/alumno/dashboard/:section?"
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
