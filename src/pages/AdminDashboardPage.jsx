import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaEdit, FaEye, FaPlus, FaTimes, FaTrashAlt, FaUserGraduate, FaUsers } from "react-icons/fa";
import AdminCourseForm from "../components/AdminCourseForm";
import AdminCourseList from "../components/AdminCourseList";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import FullScreenSpinner from "../components/FullScreenSpinner";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeSection, setActiveSection] = useState("courses");
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [groupForm, setGroupForm] = useState({ courseId: "", name: "", sessions: [] });
  const [studentForm, setStudentForm] = useState({ firstName: "", lastName: "", phone: "", email: "", username: "", password: "" });
  const [teacherForm, setTeacherForm] = useState({ firstName: "", lastName: "", bio: "", email: "", username: "", password: "" });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAssignTeacher, setShowAssignTeacher] = useState(false);
  const [showAssignStudent, setShowAssignStudent] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);

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

  useEffect(() => {
    if (!token) return;
    Promise.all([api.getAdminGroups(token), api.getAdminStudents(token), api.getAdminTeachers(token)])
      .then(([g, s, t]) => {
        setGroups(g);
        setStudents(s);
        setTeachers(t);
      })
      .catch((e) => setError(e.message));
  }, [token]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

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
        setShowCourseModal(false);
      } else {
        const newCourse = await api.createCourse(token, formData);
        setCourses((current) => [newCourse, ...current]);
        setShowCourseModal(false);
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

  async function createGroup() {
    if (editingGroupId) await api.updateAdminGroup(token, editingGroupId, groupForm);
    else await api.createAdminGroup(token, groupForm);
    const g = await api.getAdminGroups(token);
    setGroups(g);
    setShowGroupModal(false);
    setEditingGroupId(null);
    setGroupForm({ courseId: "", name: "", sessions: [] });
  }

  async function createStudent() {
    if (editingStudentId) {
      const updated = await api.updateAdminStudent(token, editingStudentId, studentForm);
      setStudents((c) => c.map((x) => (x.id === updated.id ? updated : x)));
    } else {
      const created = await api.createAdminStudent(token, studentForm);
      setStudents((c) => [created, ...c]);
    }
    setShowStudentModal(false);
    setEditingStudentId(null);
    setStudentForm({ firstName: "", lastName: "", phone: "", email: "", username: "", password: "" });
  }

  async function createTeacher() {
    if (editingTeacherId) {
      const updated = await api.updateAdminTeacher(token, editingTeacherId, teacherForm);
      setTeachers((c) => c.map((x) => (x.id === updated.id ? updated : x)));
    } else {
      const created = await api.createAdminTeacher(token, teacherForm);
      setTeachers((c) => [created, ...c]);
    }
    setShowTeacherModal(false);
    setEditingTeacherId(null);
    setTeacherForm({ firstName: "", lastName: "", bio: "", email: "", username: "", password: "" });
  }
  async function refreshGroups() {
    setGroups(await api.getAdminGroups(token));
  }
  function toLocalInput(value) {
    const d = new Date(value || Date.now());
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day}T${hh}:${mm}`;
  }
  function rebuildGroupSessions(courseId, baseSessions = []) {
    const course = courses.find((c) => c.id === courseId);
    const total = Number(course?.sessionCount || 1);
    const hours = Number(course?.hoursPerSession || 1);
    const now = new Date();
    const sessions = Array.from({ length: total }).map((_, i) => {
      const prev = baseSessions[i];
      if (prev) return prev;
      const start = new Date(now);
      start.setDate(now.getDate() + i);
      start.setHours(19, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + hours);
      return { title: `Sesion ${i + 1}`, startAt: start.toISOString(), endAt: end.toISOString() };
    });
    setGroupForm((c) => ({ ...c, courseId, sessions }));
  }
  function askConfirm(title, message, onConfirm) {
    setConfirmAction({ title, message, onConfirm });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:gap-6 md:grid-cols-[250px_1fr]">
        <aside className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50 h-fit md:sticky md:top-6">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Panel admin</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">DigiFacil</h2>
          <nav className="mt-4 grid grid-cols-2 gap-2 md:block md:space-y-2">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "courses", label: "Cursos" },
              { id: "groups", label: "Grupos" },
              { id: "students", label: "Alumnos" },
              { id: "teachers", label: "Docentes" },
            ].map((item) => (
              <button
                key={item.id}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                  activeSection === item.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button className="mt-4 w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700" onClick={handleLogout}>Cerrar sesion</button>
        </aside>

        <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm shadow-cyan-100/50">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Administracion</p>
              <h1 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">Panel de cursos DigiFacil</h1>
              <p className="mt-2 text-sm text-slate-600">Usuario conectado: {user?.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700" href="/">Ver sitio publico</a>
            </div>
          </div>
        </section>

        {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        {activeSection === "dashboard" ? (
          <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm shadow-cyan-100/50">
            <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
            <p className="mt-2 text-sm text-slate-600">Selecciona una opcion del sidebar para gestionar cursos, grupos, alumnos y docentes.</p>
          </section>
        ) : null}

        {activeSection === "courses" ? (
          <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm shadow-cyan-100/50">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Cursos</h2>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              onClick={() => {
                setSelectedCourse(null);
                setShowCourseModal(true);
              }}
            >
              <FaPlus />
              Anadir
            </button>
          </div>

          {!loading ? (
            <AdminCourseList
              courses={courses}
              onEdit={(course) => {
                setSelectedCourse(course);
                setShowCourseModal(true);
              }}
              onDelete={(id) => askConfirm("Eliminar curso", "Se eliminara este curso.", () => handleDelete(id))}
              busyId={busyId}
            />
          ) : null}
          </section>
        ) : null}

        {activeSection === "groups" ? (
          <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm shadow-cyan-100/50">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">Grupos</h2>
              <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditingGroupId(null); setGroupForm({ courseId: "", name: "", sessions: [] }); setShowGroupModal(true); }}><FaPlus />Crear grupo</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2 text-left">Curso</th><th className="px-3 py-2 text-left">Nombre</th><th className="px-3 py-2 text-left">Acciones</th></tr></thead>
                <tbody>{groups.map((g) => <tr key={g.id} className="border-t"><td className="px-3 py-2">{g.course?.title || "-"}</td><td className="px-3 py-2">{g.name}</td><td className="px-3 py-2"><div className="flex gap-2 text-slate-700">
                  <button title="Asignar docente" onClick={() => { setSelectedGroup(g); setShowAssignTeacher(true); }}><FaChalkboardTeacher /></button>
                  <button title="Asignar alumno" onClick={() => { setSelectedGroup(g); setShowAssignStudent(true); }}><FaUserGraduate /></button>
                  <button title="Ver alumnos" onClick={() => { setSelectedGroup(g); setShowStudentsModal(true); }}><FaUsers /></button>
                  <button title="Ver sesiones" onClick={() => { setSelectedGroup(g); setShowSessionsModal(true); }}><FaEye /></button>
                  <button title="Editar grupo" onClick={() => { setEditingGroupId(g.id); setGroupForm({ courseId: g.courseId, name: g.name, sessions: (g.sessions || []).map((s) => ({ title: s.title, startAt: s.startAt, endAt: s.endAt })) }); setShowGroupModal(true); }}><FaEdit /></button>
                  <button title="Eliminar grupo" className="text-rose-600" onClick={() => askConfirm("Eliminar grupo", `Se eliminara el grupo ${g.name}.`, async () => { await api.deleteAdminGroup(token, g.id); await refreshGroups(); setToast({ type: "success", message: "Grupo eliminado." }); })}><FaTrashAlt /></button>
                </div></td></tr>)}</tbody>
              </table>
            </div>
          </section>
        ) : null}

        {activeSection === "students" ? (
          <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm shadow-cyan-100/50">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">Alumnos</h2>
              <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditingStudentId(null); setStudentForm({ firstName: "", lastName: "", phone: "", email: "", username: "", password: "" }); setShowStudentModal(true); }}><FaPlus />Crear alumno</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2 text-left">Nombres</th><th className="px-3 py-2 text-left">Apellidos</th><th className="px-3 py-2 text-left">Correo</th><th className="px-3 py-2 text-left">Usuario</th><th className="px-3 py-2 text-left">Acciones</th></tr></thead>
                <tbody>{students.map((s) => <tr key={s.id} className="border-t"><td className="px-3 py-2">{s.firstName}</td><td className="px-3 py-2">{s.lastName}</td><td className="px-3 py-2">{s.email}</td><td className="px-3 py-2">{s.username}</td><td className="px-3 py-2"><div className="flex gap-2"><button onClick={() => { setEditingStudentId(s.id); setStudentForm({ firstName: s.firstName, lastName: s.lastName, phone: s.phone || "", email: s.email, username: s.username, password: "" }); setShowStudentModal(true); }}><FaEdit /></button><button className="text-rose-600" onClick={() => askConfirm("Eliminar alumno", `Se eliminara a ${s.firstName} ${s.lastName}.`, async () => { await api.deleteAdminStudent(token, s.id); setStudents((cur) => cur.filter((x) => x.id !== s.id)); setToast({ type: "success", message: "Alumno eliminado." }); })}><FaTrashAlt /></button></div></td></tr>)}</tbody>
              </table>
            </div>
          </section>
        ) : null}

        {activeSection === "teachers" ? (
          <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-sm shadow-cyan-100/50">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Docentes</h2>
              <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => { setEditingTeacherId(null); setTeacherForm({ firstName: "", lastName: "", bio: "", email: "", username: "", password: "" }); setShowTeacherModal(true); }}><FaPlus />Crear docente</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2 text-left">Nombres</th><th className="px-3 py-2 text-left">Apellidos</th><th className="px-3 py-2 text-left">Correo</th><th className="px-3 py-2 text-left">Usuario</th><th className="px-3 py-2 text-left">Acciones</th></tr></thead>
                <tbody>{teachers.map((t) => <tr key={t.id} className="border-t"><td className="px-3 py-2">{t.firstName}</td><td className="px-3 py-2">{t.lastName}</td><td className="px-3 py-2">{t.email}</td><td className="px-3 py-2">{t.username}</td><td className="px-3 py-2"><div className="flex gap-2"><button onClick={() => { setEditingTeacherId(t.id); setTeacherForm({ firstName: t.firstName, lastName: t.lastName, bio: t.bio || "", email: t.email, username: t.username, password: "" }); setShowTeacherModal(true); }}><FaEdit /></button><button className="text-rose-600" onClick={() => askConfirm("Eliminar docente", `Se eliminara a ${t.firstName} ${t.lastName}.`, async () => { await api.deleteAdminTeacher(token, t.id); setTeachers((cur) => cur.filter((x) => x.id !== t.id)); setToast({ type: "success", message: "Docente eliminado." }); })}><FaTrashAlt /></button></div></td></tr>)}</tbody>
              </table>
            </div>
          </section>
        ) : null}

        {showCourseModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
              <button
                className="absolute right-3 top-3 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                onClick={() => {
                  if (!saving) {
                    setShowCourseModal(false);
                    setSelectedCourse(null);
                  }
                }}
              >
                <FaTimes />
              </button>
              <AdminCourseForm
                selectedCourse={selectedCourse}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowCourseModal(false);
                  setSelectedCourse(null);
                }}
                busy={saving}
              />
            </div>
          </div>
        ) : null}
        {showGroupModal ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-2xl rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowGroupModal(false)}><FaTimes /></button><h3 className="font-bold">{editingGroupId ? "Editar grupo" : "Nuevo grupo"}</h3><div className="mt-3 space-y-2"><select className="w-full rounded border p-2" value={groupForm.courseId} onChange={(e) => rebuildGroupSessions(e.target.value, groupForm.sessions)}><option value="">Selecciona curso</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select><input className="w-full rounded border p-2" placeholder="Nombre grupo" value={groupForm.name} onChange={(e) => setGroupForm((c) => ({ ...c, name: e.target.value }))} /><div className="rounded-xl border p-3"><p className="text-sm font-semibold text-slate-700">Fechas y horas por sesion</p><div className="mt-2 space-y-2">{(groupForm.sessions || []).map((s, i) => <div key={i} className="grid gap-2 md:grid-cols-3"><input className="rounded border p-2" value={s.title || `Sesion ${i + 1}`} onChange={(e) => setGroupForm((c) => ({ ...c, sessions: c.sessions.map((x, j) => j === i ? { ...x, title: e.target.value } : x) }))} /><input className="rounded border p-2" type="datetime-local" value={toLocalInput(s.startAt)} onChange={(e) => setGroupForm((c) => ({ ...c, sessions: c.sessions.map((x, j) => j === i ? { ...x, startAt: new Date(e.target.value).toISOString() } : x) }))} /><input className="rounded border p-2" type="datetime-local" value={toLocalInput(s.endAt)} onChange={(e) => setGroupForm((c) => ({ ...c, sessions: c.sessions.map((x, j) => j === i ? { ...x, endAt: new Date(e.target.value).toISOString() } : x) }))} /></div>)}</div></div></div><div className="mt-3 flex justify-end gap-2"><button className="rounded border px-3 py-2" onClick={() => setShowGroupModal(false)}>Cancelar</button><button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => askConfirm(editingGroupId ? "Actualizar grupo" : "Crear grupo", "Se guardaran los cambios del grupo y sus sesiones.", createGroup)}>Guardar</button></div></div></div> : null}
        {showStudentModal ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowStudentModal(false)}><FaTimes /></button><h3 className="font-bold">{editingStudentId ? "Editar alumno" : "Nuevo alumno"}</h3><div className="mt-3 grid gap-2 md:grid-cols-2"><input className="rounded border p-2" placeholder="Nombres" value={studentForm.firstName} onChange={(e) => setStudentForm((c) => ({ ...c, firstName: e.target.value }))} /><input className="rounded border p-2" placeholder="Apellidos" value={studentForm.lastName} onChange={(e) => setStudentForm((c) => ({ ...c, lastName: e.target.value }))} /><input className="rounded border p-2" placeholder="Correo" value={studentForm.email} onChange={(e) => setStudentForm((c) => ({ ...c, email: e.target.value }))} /><input className="rounded border p-2" placeholder="Usuario" value={studentForm.username} onChange={(e) => setStudentForm((c) => ({ ...c, username: e.target.value }))} /><input className="rounded border p-2" placeholder="Telefono" value={studentForm.phone} onChange={(e) => setStudentForm((c) => ({ ...c, phone: e.target.value }))} /><input className="rounded border p-2" placeholder="Password (opcional en edición)" type="password" value={studentForm.password} onChange={(e) => setStudentForm((c) => ({ ...c, password: e.target.value }))} /></div><div className="mt-3 flex justify-end gap-2"><button className="rounded border px-3 py-2" onClick={() => setShowStudentModal(false)}>Cancelar</button><button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => askConfirm(editingStudentId ? "Actualizar alumno" : "Crear alumno", "Se guardaran los datos del alumno.", createStudent)}>Guardar</button></div></div></div> : null}
        {showTeacherModal ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowTeacherModal(false)}><FaTimes /></button><h3 className="font-bold">{editingTeacherId ? "Editar docente" : "Nuevo docente"}</h3><div className="mt-3 grid gap-2 md:grid-cols-2"><input className="rounded border p-2" placeholder="Nombres" value={teacherForm.firstName} onChange={(e) => setTeacherForm((c) => ({ ...c, firstName: e.target.value }))} /><input className="rounded border p-2" placeholder="Apellidos" value={teacherForm.lastName} onChange={(e) => setTeacherForm((c) => ({ ...c, lastName: e.target.value }))} /><input className="rounded border p-2 md:col-span-2" placeholder="Bio" value={teacherForm.bio} onChange={(e) => setTeacherForm((c) => ({ ...c, bio: e.target.value }))} /><input className="rounded border p-2" placeholder="Correo" value={teacherForm.email} onChange={(e) => setTeacherForm((c) => ({ ...c, email: e.target.value }))} /><input className="rounded border p-2" placeholder="Usuario" value={teacherForm.username} onChange={(e) => setTeacherForm((c) => ({ ...c, username: e.target.value }))} /><input className="rounded border p-2 md:col-span-2" placeholder="Password (opcional en edición)" type="password" value={teacherForm.password} onChange={(e) => setTeacherForm((c) => ({ ...c, password: e.target.value }))} /></div><div className="mt-3 flex justify-end gap-2"><button className="rounded border px-3 py-2" onClick={() => setShowTeacherModal(false)}>Cancelar</button><button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => askConfirm(editingTeacherId ? "Actualizar docente" : "Crear docente", "Se guardaran los datos del docente.", createTeacher)}>Guardar</button></div></div></div> : null}
        {showAssignTeacher && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowAssignTeacher(false)}><FaTimes /></button><h3 className="font-bold">Asignar docente: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{teachers.map((t) => <button key={t.id} className="w-full rounded border p-2 text-left" onClick={() => askConfirm("Asignar docente", `Se asignara ${t.firstName} ${t.lastName} a ${selectedGroup.name}.`, async () => { try { await api.assignTeacherToGroup(token, selectedGroup.id, t.id); await refreshGroups(); setShowAssignTeacher(false); setToast({ type: "success", message: "Docente asignado." }); } catch (e) { setToast({ type: "error", message: e.message }); } })}>{t.firstName} {t.lastName} - {t.email}</button>)}</div></div></div> : null}
        {showAssignTeacher && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowAssignTeacher(false)}><FaTimes /></button><h3 className="font-bold">Asignar docente: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{teachers.map((t) => { const alreadyAssigned = (selectedGroup.teachers || []).some((tg) => tg.teacherId === t.id || tg.teacher?.id === t.id); return <button key={t.id} className={`w-full rounded border p-2 text-left ${alreadyAssigned ? "cursor-not-allowed bg-slate-100 text-slate-400" : ""}`} disabled={alreadyAssigned} onClick={() => askConfirm("Asignar docente", `Se asignara ${t.firstName} ${t.lastName} a ${selectedGroup.name}.`, async () => { try { await api.assignTeacherToGroup(token, selectedGroup.id, t.id); await refreshGroups(); setShowAssignTeacher(false); setToast({ type: "success", message: "Docente asignado." }); } catch (e) { setToast({ type: "error", message: e.message }); } })}>{t.firstName} {t.lastName} - {t.email}{alreadyAssigned ? " (ya asignado)" : ""}</button>; })}</div></div></div> : null}
        {showAssignStudent && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowAssignStudent(false)}><FaTimes /></button><h3 className="font-bold">Asignar alumno: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{students.map((s) => { const alreadyAssigned = (selectedGroup.enrollments || []).some((en) => en.studentId === s.id || en.student?.id === s.id); return <button key={s.id} className={`w-full rounded border p-2 text-left ${alreadyAssigned ? "cursor-not-allowed bg-slate-100 text-slate-400" : ""}`} disabled={alreadyAssigned} onClick={() => askConfirm("Asignar alumno", `Se asignara ${s.firstName} ${s.lastName} a ${selectedGroup.name}.`, async () => { try { await api.assignStudentToGroup(token, selectedGroup.id, s.id); await refreshGroups(); setShowAssignStudent(false); setToast({ type: "success", message: "Alumno asignado." }); } catch (e) { setToast({ type: "error", message: e.message }); } })}>{s.firstName} {s.lastName} - {s.email}{alreadyAssigned ? " (ya asignado)" : ""}</button>; })}</div></div></div> : null}
        {showStudentsModal && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-2xl rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowStudentsModal(false)}><FaTimes /></button><h3 className="font-bold">Alumnos asignados: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{(selectedGroup.enrollments || []).map((en) => <div key={en.id} className="flex items-center justify-between rounded border p-2"><span>{en.student.firstName} {en.student.lastName} - {en.student.user?.email}</span><button className="text-rose-600" onClick={() => setConfirmAction({ title: "Quitar alumno", message: "Se quitara el alumno del grupo.", onConfirm: async () => { await api.removeStudentFromGroup(token, selectedGroup.id, en.studentId); await refreshGroups(); setSelectedGroup((await api.getAdminGroups(token)).find((g) => g.id === selectedGroup.id)); setToast({ type: "success", message: "Alumno quitado del grupo." }); } })}><FaTrashAlt /></button></div>)}</div><div className="mt-3 text-right"><button className="rounded border px-3 py-2" onClick={() => setShowStudentsModal(false)}>Cerrar</button></div></div></div> : null}
        {showSessionsModal && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-2xl rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowSessionsModal(false)}><FaTimes /></button><h3 className="font-bold">Sesiones: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{(selectedGroup.sessions || []).map((s) => <div key={s.id} className="rounded border p-2"><div className="flex items-center justify-between"><p className="font-semibold">{s.title}</p><button className="text-rose-600" onClick={() => setConfirmAction({ title: "Eliminar sesion", message: "Se eliminara la sesion y su contenido.", onConfirm: async () => { await api.deleteGroupSession(token, selectedGroup.id, s.id); await refreshGroups(); setSelectedGroup((await api.getAdminGroups(token)).find((g) => g.id === selectedGroup.id)); setToast({ type: "success", message: "Sesion eliminada." }); } })}><FaTrashAlt /></button></div><p className="text-sm text-slate-600">{s.description}</p><p className="text-xs text-slate-500">{new Date(s.startAt).toLocaleString()} - {new Date(s.endAt).toLocaleString()}</p></div>)}</div><div className="mt-3 text-right"><button className="rounded border px-3 py-2" onClick={() => setShowSessionsModal(false)}>Cerrar</button></div></div></div> : null}
        </div>
      </div>
      <FullScreenSpinner show={loading} label="Cargando panel admin..." />
      <ConfirmModal open={Boolean(confirmAction)} title={confirmAction?.title} message={confirmAction?.message} onCancel={() => setConfirmAction(null)} onConfirm={async () => { try { await confirmAction.onConfirm(); } catch (e) { setToast({ type: "error", message: e.message }); } finally { setConfirmAction(null); } }} />
      <Toast toast={toast} />
    </main>
  );
}
