import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChalkboardTeacher, FaEdit, FaEye, FaTimes, FaTrashAlt, FaUserGraduate, FaUsers } from "react-icons/fa";
import AdminCourseForm from "../components/AdminCourseForm";
import AdminDashboardSection from "../components/admin/sections/AdminDashboardSection";
import AdminCoursesSection from "../components/admin/sections/AdminCoursesSection";
import AdminGroupsSection from "../components/admin/sections/AdminGroupsSection";
import AdminStudentsSection from "../components/admin/sections/AdminStudentsSection";
import AdminTeachersSection from "../components/admin/sections/AdminTeachersSection";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import FullScreenSpinner from "../components/FullScreenSpinner";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { section } = useParams();
  const { token, user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeSection, setActiveSection] = useState(section || "courses");
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryModalError, setCategoryModalError] = useState("");
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
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [certificateBusyByStudent, setCertificateBusyByStudent] = useState({});

  async function loadCourses() {
    const [courseData, categoryData] = await Promise.all([
      api.getAdminCourses(token),
      api.getAdminCategories(token),
    ]);
    setCourses(courseData);
    setCategories(categoryData);
  }

  async function loadGroupsAndRelations() {
    const [g, s, t] = await Promise.all([
      api.getAdminGroups(token),
      api.getAdminStudents(token),
      api.getAdminTeachers(token),
    ]);
    setGroups(g);
    setStudents(s);
    setTeachers(t);
  }

  useEffect(() => {
    if (!token) return;
    const nextSection = section || "courses";
    setActiveSection(nextSection);
    setLoading(true);
    const loaders = [];
    if (nextSection === "courses" || nextSection === "groups") loaders.push(loadCourses());
    if (nextSection === "groups") loaders.push(loadGroupsAndRelations());
    if (nextSection === "students") loaders.push(api.getAdminStudents(token).then(setStudents));
    if (nextSection === "teachers") loaders.push(api.getAdminTeachers(token).then(setTeachers));
    if (nextSection === "dashboard") loaders.push(Promise.resolve());
    Promise.all(loaders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, section]);

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
  async function uploadCertificateForStudent(studentId, file) {
    if (!selectedGroup || !file) return;
    const okType = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
    if (!okType) {
      setToast({ type: "error", message: "Solo se permiten archivos PNG o JPG." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setToast({ type: "error", message: "El certificado no debe pesar más de 10MB." });
      return;
    }
    const toBase64 = (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    try {
      setCertificateBusyByStudent((cur) => ({ ...cur, [studentId]: true }));
      const fileBase64 = await toBase64(file);
      await api.uploadStudentCertificate(token, selectedGroup.id, studentId, {
        fileName: file.name,
        mimeType: file.type,
        fileBase64,
      });
      const refreshed = await api.getAdminGroups(token);
      setGroups(refreshed);
      setSelectedGroup(refreshed.find((g) => g.id === selectedGroup.id) || null);
      setToast({ type: "success", message: "Certificado subido correctamente." });
    } catch (e) {
      setToast({ type: "error", message: e.message });
    } finally {
      setCertificateBusyByStudent((cur) => ({ ...cur, [studentId]: false }));
    }
  }
  async function deleteCertificateForStudent(studentId) {
    if (!selectedGroup) return;
    try {
      setCertificateBusyByStudent((cur) => ({ ...cur, [studentId]: true }));
      await api.deleteStudentCertificate(token, selectedGroup.id, studentId);
      const refreshed = await api.getAdminGroups(token);
      setGroups(refreshed);
      const nextGroup = refreshed.find((g) => g.id === selectedGroup.id) || null;
      setSelectedGroup(nextGroup);
      if (selectedEnrollment) {
        setSelectedEnrollment((nextGroup?.enrollments || []).find((en) => en.id === selectedEnrollment.id) || null);
      }
      setToast({ type: "success", message: "Certificado eliminado." });
    } catch (e) {
      setToast({ type: "error", message: e.message });
    } finally {
      setCertificateBusyByStudent((cur) => ({ ...cur, [studentId]: false }));
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:gap-6 md:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50 h-fit md:sticky md:top-6">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Panel admin</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">DigiFacil</h2>
          <nav className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2 md:block md:space-y-2">
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
                onClick={() => navigate(`/admin/dashboard/${item.id}`)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button className="mt-4 w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700" onClick={handleLogout}>Cerrar sesion</button>
        </aside>

        <div className="min-w-0 space-y-6">
        <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50 sm:p-6">
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

        {activeSection === "dashboard" ? <AdminDashboardSection /> : null}

        {activeSection === "courses" ? (
          <AdminCoursesSection
            loading={loading}
            courses={courses}
            busyId={busyId}
            onOpenCategories={() => setShowCategoryModal(true)}
            onCreate={() => {
              setSelectedCourse(null);
              setShowCourseModal(true);
            }}
            onEdit={(course) => {
              setSelectedCourse(course);
              setShowCourseModal(true);
            }}
            onDelete={(id) => askConfirm("Eliminar curso", "Se eliminara este curso.", () => handleDelete(id))}
          />
        ) : null}

        {activeSection === "groups" ? (
          <AdminGroupsSection
            groups={groups}
            onCreate={() => { setEditingGroupId(null); setGroupForm({ courseId: "", name: "", sessions: [] }); setShowGroupModal(true); }}
            onAssignTeacher={(g) => { setSelectedGroup(g); setShowAssignTeacher(true); }}
            onAssignStudent={(g) => { setSelectedGroup(g); setShowAssignStudent(true); }}
            onShowStudents={(g) => { setSelectedGroup(g); setShowStudentsModal(true); }}
            onShowSessions={(g) => { setSelectedGroup(g); setShowSessionsModal(true); }}
            onEdit={(g) => { setEditingGroupId(g.id); setGroupForm({ courseId: g.courseId, name: g.name, sessions: (g.sessions || []).map((s) => ({ title: s.title, startAt: s.startAt, endAt: s.endAt })) }); setShowGroupModal(true); }}
            onDelete={(g) => askConfirm("Eliminar grupo", `Se eliminara el grupo ${g.name}.`, async () => { await api.deleteAdminGroup(token, g.id); await refreshGroups(); setToast({ type: "success", message: "Grupo eliminado." }); })}
          />
        ) : null}

        {activeSection === "students" ? (
          <AdminStudentsSection
            students={students}
            onCreate={() => { setEditingStudentId(null); setStudentForm({ firstName: "", lastName: "", phone: "", email: "", username: "", password: "" }); setShowStudentModal(true); }}
            onEdit={(s) => { setEditingStudentId(s.id); setStudentForm({ firstName: s.firstName, lastName: s.lastName, phone: s.phone || "", email: s.email, username: s.username, password: "" }); setShowStudentModal(true); }}
            onDelete={(s) => askConfirm("Eliminar alumno", `Se eliminara a ${s.firstName} ${s.lastName}.`, async () => { await api.deleteAdminStudent(token, s.id); setStudents((cur) => cur.filter((x) => x.id !== s.id)); setToast({ type: "success", message: "Alumno eliminado." }); })}
          />
        ) : null}

        {activeSection === "teachers" ? (
          <AdminTeachersSection
            teachers={teachers}
            onCreate={() => { setEditingTeacherId(null); setTeacherForm({ firstName: "", lastName: "", bio: "", email: "", username: "", password: "" }); setShowTeacherModal(true); }}
            onEdit={(t) => { setEditingTeacherId(t.id); setTeacherForm({ firstName: t.firstName, lastName: t.lastName, bio: t.bio || "", email: t.email, username: t.username, password: "" }); setShowTeacherModal(true); }}
            onDelete={(t) => askConfirm("Eliminar docente", `Se eliminara a ${t.firstName} ${t.lastName}.`, async () => { await api.deleteAdminTeacher(token, t.id); setTeachers((cur) => cur.filter((x) => x.id !== t.id)); setToast({ type: "success", message: "Docente eliminado." }); })}
          />
        ) : null}

        {showCourseModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
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
                categories={categories}
                onCancel={() => {
                  setShowCourseModal(false);
                  setSelectedCourse(null);
                }}
                busy={saving}
              />
            </div>
          </div>
        ) : null}
        {showCategoryModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
              <button className="absolute right-3 top-3 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800" onClick={() => setShowCategoryModal(false)}>
                <FaTimes />
              </button>
              <h3 className="text-lg font-bold">Categorias</h3>
              <p className="mt-1 text-sm text-slate-600">Gestiona el listado global de categorias.</p>
              <div className="mt-4 flex gap-2">
                <input className="w-full rounded-lg border p-2" placeholder="Nueva categoria" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                <button
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                  onClick={async () => {
                    const name = newCategoryName.trim();
                    if (!name) return;
                    const alreadyExists = categories.some(
                      (category) => category.name.trim().toLowerCase() === name.toLowerCase(),
                    );
                    if (alreadyExists) {
                      setCategoryModalError("La categoria ya existe.");
                      return;
                    }
                    const created = await api.createAdminCategory(token, { name });
                    setCategories((cur) => [...cur, created].sort((a, b) => a.name.localeCompare(b.name)));
                    setNewCategoryName("");
                    setCategoryModalError("");
                    setToast({ type: "success", message: "Categoria creada." });
                  }}
                >
                  Agregar
                </button>
              </div>
              {categoryModalError ? <p className="mt-2 text-xs text-rose-600">{categoryModalError}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span key={category.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {showGroupModal ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-2xl rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowGroupModal(false)}><FaTimes /></button><h3 className="font-bold">{editingGroupId ? "Editar grupo" : "Nuevo grupo"}</h3><div className="mt-3 space-y-2"><select className="w-full rounded border p-2" value={groupForm.courseId} onChange={(e) => rebuildGroupSessions(e.target.value, groupForm.sessions)}><option value="">Selecciona curso</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select><input className="w-full rounded border p-2" placeholder="Nombre grupo" value={groupForm.name} onChange={(e) => setGroupForm((c) => ({ ...c, name: e.target.value }))} /><div className="rounded-xl border p-3"><p className="text-sm font-semibold text-slate-700">Fechas y horas por sesion</p><div className="mt-2 space-y-2">{(groupForm.sessions || []).map((s, i) => <div key={i} className="grid gap-2 md:grid-cols-3"><input className="rounded border p-2" value={s.title || `Sesion ${i + 1}`} onChange={(e) => setGroupForm((c) => ({ ...c, sessions: c.sessions.map((x, j) => j === i ? { ...x, title: e.target.value } : x) }))} /><input className="rounded border p-2" type="datetime-local" value={toLocalInput(s.startAt)} onChange={(e) => setGroupForm((c) => ({ ...c, sessions: c.sessions.map((x, j) => j === i ? { ...x, startAt: new Date(e.target.value).toISOString() } : x) }))} /><input className="rounded border p-2" type="datetime-local" value={toLocalInput(s.endAt)} onChange={(e) => setGroupForm((c) => ({ ...c, sessions: c.sessions.map((x, j) => j === i ? { ...x, endAt: new Date(e.target.value).toISOString() } : x) }))} /></div>)}</div></div></div><div className="mt-3 flex justify-end gap-2"><button className="rounded border px-3 py-2" onClick={() => setShowGroupModal(false)}>Cancelar</button><button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => askConfirm(editingGroupId ? "Actualizar grupo" : "Crear grupo", "Se guardaran los cambios del grupo y sus sesiones.", createGroup)}>Guardar</button></div></div></div> : null}
        {showStudentModal ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowStudentModal(false)}><FaTimes /></button><h3 className="font-bold">{editingStudentId ? "Editar alumno" : "Nuevo alumno"}</h3><div className="mt-3 grid gap-2 md:grid-cols-2"><input className="rounded border p-2" placeholder="Nombres" value={studentForm.firstName} onChange={(e) => setStudentForm((c) => ({ ...c, firstName: e.target.value }))} /><input className="rounded border p-2" placeholder="Apellidos" value={studentForm.lastName} onChange={(e) => setStudentForm((c) => ({ ...c, lastName: e.target.value }))} /><input className="rounded border p-2" placeholder="Correo" value={studentForm.email} onChange={(e) => setStudentForm((c) => ({ ...c, email: e.target.value }))} /><input className="rounded border p-2" placeholder="Usuario" value={studentForm.username} onChange={(e) => setStudentForm((c) => ({ ...c, username: e.target.value }))} /><input className="rounded border p-2" placeholder="Telefono" value={studentForm.phone} onChange={(e) => setStudentForm((c) => ({ ...c, phone: e.target.value }))} /><input className="rounded border p-2" placeholder="Password (opcional en edición)" type="password" value={studentForm.password} onChange={(e) => setStudentForm((c) => ({ ...c, password: e.target.value }))} /></div><div className="mt-3 flex justify-end gap-2"><button className="rounded border px-3 py-2" onClick={() => setShowStudentModal(false)}>Cancelar</button><button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => askConfirm(editingStudentId ? "Actualizar alumno" : "Crear alumno", "Se guardaran los datos del alumno.", createStudent)}>Guardar</button></div></div></div> : null}
        {showTeacherModal ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowTeacherModal(false)}><FaTimes /></button><h3 className="font-bold">{editingTeacherId ? "Editar docente" : "Nuevo docente"}</h3><div className="mt-3 grid gap-2 md:grid-cols-2"><input className="rounded border p-2" placeholder="Nombres" value={teacherForm.firstName} onChange={(e) => setTeacherForm((c) => ({ ...c, firstName: e.target.value }))} /><input className="rounded border p-2" placeholder="Apellidos" value={teacherForm.lastName} onChange={(e) => setTeacherForm((c) => ({ ...c, lastName: e.target.value }))} /><input className="rounded border p-2 md:col-span-2" placeholder="Bio" value={teacherForm.bio} onChange={(e) => setTeacherForm((c) => ({ ...c, bio: e.target.value }))} /><input className="rounded border p-2" placeholder="Correo" value={teacherForm.email} onChange={(e) => setTeacherForm((c) => ({ ...c, email: e.target.value }))} /><input className="rounded border p-2" placeholder="Usuario" value={teacherForm.username} onChange={(e) => setTeacherForm((c) => ({ ...c, username: e.target.value }))} /><input className="rounded border p-2 md:col-span-2" placeholder="Password (opcional en edición)" type="password" value={teacherForm.password} onChange={(e) => setTeacherForm((c) => ({ ...c, password: e.target.value }))} /></div><div className="mt-3 flex justify-end gap-2"><button className="rounded border px-3 py-2" onClick={() => setShowTeacherModal(false)}>Cancelar</button><button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => askConfirm(editingTeacherId ? "Actualizar docente" : "Crear docente", "Se guardaran los datos del docente.", createTeacher)}>Guardar</button></div></div></div> : null}
        {showAssignTeacher && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowAssignTeacher(false)}><FaTimes /></button><h3 className="font-bold">Asignar docente: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{teachers.map((t) => <button key={t.id} className="w-full rounded border p-2 text-left" onClick={() => askConfirm("Asignar docente", `Se asignara ${t.firstName} ${t.lastName} a ${selectedGroup.name}.`, async () => { try { await api.assignTeacherToGroup(token, selectedGroup.id, t.id); await refreshGroups(); setShowAssignTeacher(false); setToast({ type: "success", message: "Docente asignado." }); } catch (e) { setToast({ type: "error", message: e.message }); } })}>{t.firstName} {t.lastName} - {t.email}</button>)}</div></div></div> : null}
        {showAssignTeacher && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowAssignTeacher(false)}><FaTimes /></button><h3 className="font-bold">Asignar docente: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{teachers.map((t) => { const alreadyAssigned = (selectedGroup.teachers || []).some((tg) => tg.teacherId === t.id || tg.teacher?.id === t.id); return <button key={t.id} className={`w-full rounded border p-2 text-left ${alreadyAssigned ? "cursor-not-allowed bg-slate-100 text-slate-400" : ""}`} disabled={alreadyAssigned} onClick={() => askConfirm("Asignar docente", `Se asignara ${t.firstName} ${t.lastName} a ${selectedGroup.name}.`, async () => { try { await api.assignTeacherToGroup(token, selectedGroup.id, t.id); await refreshGroups(); setShowAssignTeacher(false); setToast({ type: "success", message: "Docente asignado." }); } catch (e) { setToast({ type: "error", message: e.message }); } })}>{t.firstName} {t.lastName} - {t.email}{alreadyAssigned ? " (ya asignado)" : ""}</button>; })}</div></div></div> : null}
        {showAssignStudent && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-lg rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowAssignStudent(false)}><FaTimes /></button><h3 className="font-bold">Asignar alumno: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{students.map((s) => { const alreadyAssigned = (selectedGroup.enrollments || []).some((en) => en.studentId === s.id || en.student?.id === s.id); return <button key={s.id} className={`w-full rounded border p-2 text-left ${alreadyAssigned ? "cursor-not-allowed bg-slate-100 text-slate-400" : ""}`} disabled={alreadyAssigned} onClick={() => askConfirm("Asignar alumno", `Se asignara ${s.firstName} ${s.lastName} a ${selectedGroup.name}.`, async () => { try { await api.assignStudentToGroup(token, selectedGroup.id, s.id); await refreshGroups(); setShowAssignStudent(false); setToast({ type: "success", message: "Alumno asignado." }); } catch (e) { setToast({ type: "error", message: e.message }); } })}>{s.firstName} {s.lastName} - {s.email}{alreadyAssigned ? " (ya asignado)" : ""}</button>; })}</div></div></div> : null}
        {showStudentsModal && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-2xl rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowStudentsModal(false)}><FaTimes /></button><h3 className="font-bold">Alumnos asignados: {selectedGroup.name}</h3><div className="mt-3 space-y-3">{(selectedGroup.enrollments || []).map((en) => { const cert = (en.certificates || [])[0]; return <div key={en.id} className="rounded border p-3"><div className="flex items-center justify-between gap-3"><span>{en.student.firstName} {en.student.lastName} - {en.student.user?.email}</span><div className="flex items-center gap-3"><button className="text-xs font-semibold text-cyan-700" onClick={() => { setSelectedEnrollment(en); setShowCertificateModal(true); }}>Certificado</button><button className="text-rose-600" onClick={() => setConfirmAction({ title: "Quitar alumno", message: "Se quitara el alumno del grupo.", onConfirm: async () => { await api.removeStudentFromGroup(token, selectedGroup.id, en.studentId); await refreshGroups(); setSelectedGroup((await api.getAdminGroups(token)).find((g) => g.id === selectedGroup.id)); setToast({ type: "success", message: "Alumno quitado del grupo." }); } })}><FaTrashAlt /></button></div></div><div className="mt-1 text-xs text-slate-500">{cert?.certificateUrl ? "Certificado registrado" : "Sin certificado"}</div></div>; })}</div><div className="mt-3 text-right"><button className="rounded border px-3 py-2" onClick={() => setShowStudentsModal(false)}>Cerrar</button></div></div></div> : null}
        {showCertificateModal && selectedEnrollment ? <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/60 p-4"><div className="relative w-full max-w-xl rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowCertificateModal(false)}><FaTimes /></button><h3 className="font-bold">Certificado: {selectedEnrollment.student.firstName} {selectedEnrollment.student.lastName}</h3><p className="mt-1 text-sm text-slate-600">Grupo: {selectedGroup?.name}</p>{(selectedEnrollment.certificates || [])[0]?.certificateUrl ? <div className="mt-3"><img src={selectedEnrollment.certificates[0].certificateUrl} alt={`Certificado de ${selectedEnrollment.student.firstName}`} className="max-h-72 w-full rounded border object-contain" /><div className="mt-3"><button className="rounded bg-rose-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => deleteCertificateForStudent(selectedEnrollment.studentId)} disabled={Boolean(certificateBusyByStudent[selectedEnrollment.studentId])}>Eliminar certificado</button></div></div> : <div className="mt-3 space-y-3"><p className="text-sm text-slate-600">Sube el certificado en formato PNG o JPG, horizontal (16:9 aprox.) y con un tamaño máximo de 10MB.</p><label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 hover:border-cyan-400 hover:text-cyan-700" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); uploadCertificateForStudent(selectedEnrollment.studentId, e.dataTransfer.files?.[0]); }}><span className="font-semibold">Arrastra aquí el certificado</span><span className="block mt-1">o haz clic para seleccionarlo</span><input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={(ev) => uploadCertificateForStudent(selectedEnrollment.studentId, ev.target.files?.[0])} disabled={Boolean(certificateBusyByStudent[selectedEnrollment.studentId])} /></label>{certificateBusyByStudent[selectedEnrollment.studentId] ? <p className="text-xs text-slate-500">Subiendo certificado...</p> : null}</div>}</div></div> : null}
        {showSessionsModal && selectedGroup ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div className="relative w-full max-w-2xl rounded-2xl bg-white p-5"><button className="absolute right-3 top-3 text-slate-500" onClick={() => setShowSessionsModal(false)}><FaTimes /></button><h3 className="font-bold">Sesiones: {selectedGroup.name}</h3><div className="mt-3 space-y-2">{(selectedGroup.sessions || []).map((s) => <div key={s.id} className="rounded border p-2"><div className="flex items-center justify-between"><p className="font-semibold">{s.title}</p><button className="text-rose-600" onClick={() => setConfirmAction({ title: "Eliminar sesion", message: "Se eliminara la sesion y su contenido.", onConfirm: async () => { await api.deleteGroupSession(token, selectedGroup.id, s.id); await refreshGroups(); setSelectedGroup((await api.getAdminGroups(token)).find((g) => g.id === selectedGroup.id)); setToast({ type: "success", message: "Sesion eliminada." }); } })}><FaTrashAlt /></button></div><p className="text-sm text-slate-600">{s.description}</p><p className="text-xs text-slate-500">{new Date(s.startAt).toLocaleString()} - {new Date(s.endAt).toLocaleString()}</p></div>)}</div><div className="mt-3 text-right"><button className="rounded border px-3 py-2" onClick={() => setShowSessionsModal(false)}>Cerrar</button></div></div></div> : null}
        </div>
      </div>
      <FullScreenSpinner show={loading} label="Cargando panel admin..." />
      <ConfirmModal open={Boolean(confirmAction)} title={confirmAction?.title} message={confirmAction?.message} onCancel={() => setConfirmAction(null)} onConfirm={async () => { try { await confirmAction.onConfirm(); } catch (e) { setToast({ type: "error", message: e.message }); } finally { setConfirmAction(null); } }} />
      <Toast toast={toast} />
    </main>
  );
}
