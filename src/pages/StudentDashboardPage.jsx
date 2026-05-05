import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import FullScreenSpinner from "../components/FullScreenSpinner";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import StudentCoursesSection from "../components/student/StudentCoursesSection";
import StudentCalendarSection from "../components/student/StudentCalendarSection";

function keyOf(dateValue) {
  const d = new Date(dateValue);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function StudentDashboardPage() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const { section } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState(section === "calendar" ? "calendar" : "courses");
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [toast, setToast] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveNav(section === "calendar" ? "calendar" : "courses");
  }, [section]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([api.getStudentCourses(token), api.getStudentCalendar(token)])
      .then(([coursesPayload, calendarPayload]) => {
        setData({
          student: coursesPayload.student || calendarPayload.student,
          enrollments: coursesPayload.enrollments || [],
          calendar: calendarPayload.calendar || [],
        });
        if (coursesPayload.enrollments?.length) setSelectedEnrollmentId(coursesPayload.enrollments[0].id);
      })
      .catch((e) => {
        setError(e.message);
        setToast({ type: "error", message: e.message });
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !activeNav) return;
    setLoading(true);
    const requestBySection = activeNav === "calendar" ? api.getStudentCalendar(token) : api.getStudentCourses(token);
    requestBySection
      .then((payload) => {
        setData((current) => ({
          student: payload.student || current?.student,
          enrollments: activeNav === "courses" ? (payload.enrollments || []) : (current?.enrollments || []),
          calendar: activeNav === "calendar" ? (payload.calendar || []) : (current?.calendar || []),
        }));
        if (activeNav === "courses" && payload.enrollments?.length) {
          setSelectedEnrollmentId((current) => current || payload.enrollments[0].id);
        }
      })
      .catch((e) => {
        setError(e.message);
        setToast({ type: "error", message: e.message });
      })
      .finally(() => setLoading(false));
  }, [token, activeNav]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const selected = useMemo(
    () => data?.enrollments?.find((e) => e.id === selectedEnrollmentId) || data?.enrollments?.[0] || null,
    [data, selectedEnrollmentId],
  );

  const byDay = useMemo(() => {
    const map = {};
    for (const item of data?.calendar || []) {
      const k = keyOf(item.startAt);
      if (!map[k]) map[k] = [];
      map[k].push(item);
    }
    return map;
  }, [data]);

  const monthMeta = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const cells = [];
    for (let i = 0; i < first.getDay(); i += 1) cells.push(null);
    for (let d = 1; d <= last.getDate(); d += 1) cells.push(new Date(year, month, d));
    return { label: monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" }), cells };
  }, [monthCursor]);

  if (error) return <main className="p-6 text-red-600">{error}</main>;
  if (!data) return <main className="p-6">Cargando...</main>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:gap-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
          <p className="text-xs uppercase text-slate-500">Alumno</p>
          <h1 className="text-xl font-bold">{data.student.firstName} {data.student.lastName}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <nav className="mt-4 grid grid-cols-2 gap-2 md:block md:space-y-2">
            <button className={`w-full rounded-lg px-3 py-2 text-left ${activeNav === "courses" ? "bg-slate-900 text-white" : "bg-slate-100"}`} onClick={() => navigate("/alumno/dashboard/courses")}>Mis cursos</button>
            <button className={`w-full rounded-lg px-3 py-2 text-left ${activeNav === "calendar" ? "bg-slate-900 text-white" : "bg-slate-100"}`} onClick={() => navigate("/alumno/dashboard/calendar")}>Mi calendario</button>
          </nav>
          <button className="mt-4 w-full rounded-lg bg-rose-600 px-3 py-2 text-white md:w-auto" onClick={() => setConfirmLogout(true)}>Salir</button>
        </aside>

        <section className="space-y-4">
          {activeNav === "courses" ? (
            <StudentCoursesSection data={data} selected={selected} setSelectedEnrollmentId={setSelectedEnrollmentId} />
          ) : null}
          {activeNav === "calendar" ? (
            <StudentCalendarSection monthCursor={monthCursor} setMonthCursor={setMonthCursor} monthMeta={monthMeta} byDay={byDay} />
          ) : null}
        </section>
      </div>
      <ConfirmModal open={confirmLogout} title="Cerrar sesion" message="Se cerrara tu sesion actual." onCancel={() => setConfirmLogout(false)} onConfirm={() => { logout(); }} />
      <Toast toast={toast} />
      <FullScreenSpinner show={loading} label="Cargando panel alumno..." />
    </main>
  );
}
