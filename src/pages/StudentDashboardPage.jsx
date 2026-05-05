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

function toFileSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function downloadCertificateFile(url, fileName) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo descargar el certificado.");
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
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
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveNav(section === "calendar" ? "calendar" : section === "certificates" ? "certificates" : "courses");
  }, [section]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([api.getStudentCourses(token), api.getStudentCalendar(token), api.getStudentCertificates(token)])
      .then(([coursesPayload, calendarPayload, certificatesPayload]) => {
        setData({
          student: coursesPayload.student || calendarPayload.student,
          enrollments: coursesPayload.enrollments || [],
          calendar: calendarPayload.calendar || [],
        });
        setCertificates(certificatesPayload.certificates || []);
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
    const requestBySection = activeNav === "calendar"
      ? api.getStudentCalendar(token)
      : activeNav === "certificates"
        ? api.getStudentCertificates(token)
        : api.getStudentCourses(token);
    requestBySection
      .then((payload) => {
        if (activeNav === "certificates") {
          setCertificates(payload.certificates || []);
          setData((current) => ({ ...current, student: payload.student || current?.student }));
        } else {
          setData((current) => ({
            student: payload.student || current?.student,
            enrollments: activeNav === "courses" ? (payload.enrollments || []) : (current?.enrollments || []),
            calendar: activeNav === "calendar" ? (payload.calendar || []) : (current?.calendar || []),
          }));
        }
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
            <button className={`w-full rounded-lg px-3 py-2 text-left ${activeNav === "certificates" ? "bg-slate-900 text-white" : "bg-slate-100"}`} onClick={() => navigate("/alumno/dashboard/certificates")}>Mis certificados</button>
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
          {activeNav === "certificates" ? (
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
              <h2 className="font-semibold">Mis certificados</h2>
              {(certificates || []).length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Aún no tienes certificados emitidos.</p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {certificates.map((cert) => (
                    <article key={cert.id} className="rounded-xl border p-2">
                      <div className="aspect-video overflow-hidden rounded-lg bg-slate-100">
                        <img src={cert.certificateUrl} alt={`Certificado de ${cert.courseTitle}`} className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-800">{cert.courseTitle}</p>
                      <button className="mt-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => setSelectedCertificate(cert)}>Ver más</button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </section>
      </div>
      {selectedCertificate ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5">
            <h3 className="text-lg font-bold text-slate-900">Detalle de certificado</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <p className="text-sm text-slate-700"><span className="font-semibold">Curso:</span> {selectedCertificate.courseTitle}</p>
              <p className="text-sm text-slate-700"><span className="font-semibold">Alumno:</span> {selectedCertificate.studentName}</p>
              <p className="text-sm text-slate-700 sm:col-span-2"><span className="font-semibold">Fecha de emisión:</span> {new Date(selectedCertificate.issuedAt).toLocaleString()}</p>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border">
              <img src={selectedCertificate.certificateUrl} alt={`Certificado de ${selectedCertificate.courseTitle}`} className="h-auto w-full object-contain" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-xl border px-3 py-2 text-sm" onClick={() => setSelectedCertificate(null)}>Cerrar</button>
              <button
                type="button"
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                onClick={() =>
                  downloadCertificateFile(
                    selectedCertificate.certificateUrl,
                    `certificado-${toFileSlug(selectedCertificate.courseTitle)}-${toFileSlug(selectedCertificate.studentName)}.png`,
                  ).catch(() => setToast({ type: "error", message: "No se pudo descargar el certificado." }))
                }
              >
                Descargar
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ConfirmModal open={confirmLogout} title="Cerrar sesion" message="Se cerrara tu sesion actual." onCancel={() => setConfirmLogout(false)} onConfirm={() => { logout(); }} />
      <Toast toast={toast} />
      <FullScreenSpinner show={loading} label="Cargando panel alumno..." />
    </main>
  );
}
