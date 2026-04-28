import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCourseForm from "../components/AdminCourseForm";
import AdminCourseList from "../components/AdminCourseList";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function loadCourses() {
    try {
      const data = await api.getAdminCourses(token);
      setCourses(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleSubmit(formData) {
    setSaving(true);
    setError("");

    try {
      if (selectedCourse) {
        const updatedCourse = await api.updateCourse(token, selectedCourse.id, formData);
        setCourses((current) =>
          current.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
        );
        setSelectedCourse(null);
      } else {
        const newCourse = await api.createCourse(token, formData);
        setCourses((current) => [newCourse, ...current]);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setBusyId(id);
    setError("");

    try {
      await api.deleteCourse(token, id);
      setCourses((current) => current.filter((course) => course.id !== id));
      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Administracion</span>
          <h1>Gestiona la oferta academica de DigiFacil</h1>
          <p>Usuario conectado: {user?.email}</p>
        </div>
        <div className="dashboard-top-actions">
          <a className="ghost-button" href="/">
            Ver sitio publico
          </a>
          <button className="danger-button" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </section>

      {error && <p className="form-error dashboard-error">{error}</p>}
      {loading && <p className="status-card">Cargando panel...</p>}

      {!loading && (
        <section className="dashboard-grid">
          <AdminCourseForm
            selectedCourse={selectedCourse}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedCourse(null)}
            busy={saving}
          />

          <AdminCourseList
            courses={courses}
            onEdit={setSelectedCourse}
            onDelete={handleDelete}
            busyId={busyId}
          />
        </section>
      )}
    </main>
  );
}
