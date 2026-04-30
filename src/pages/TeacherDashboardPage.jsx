import { useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import FullScreenSpinner from "../components/FullScreenSpinner";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

const materialTypes = ["PDF", "WORD", "SLIDES", "PPT", "EXCEL", "TXT", "IMAGE", "YOUTUBE_LINK", "YOUTUBE_EMBED"];

function toLocalDateTimeInput(value) {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${hh}:${mm}`;
}

function toYouTubeEmbedUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return raw;
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    return "";
  } catch {
    return "";
  }
}

export default function TeacherDashboardPage() {
  const { token, logout, user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedGroup = useMemo(
    () => data?.groups?.find((g) => g.id === selectedGroupId) || null,
    [data, selectedGroupId],
  );

  function createEmptySession(index) {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() + index + 1);
    start.setHours(19, 0, 0, 0);
    const end = new Date(start);
    end.setHours(21, 0, 0, 0);
    return {
      title: `Sesion ${index + 1}`,
      description: "",
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      meetLink: "",
      youtubeUrl: "",
      embedUrl: "",
      materials: [],
    };
  }

  async function reload() {
    try {
      setLoading(true);
      const payload = await api.getTeacherDashboard(token);
      setData(payload);
      if (!selectedGroupId && payload.groups?.length) {
        setSelectedGroupId(payload.groups[0].id);
        setSessions(payload.groups[0].sessions || []);
        return;
      }
      if (selectedGroupId) {
        const current = payload.groups.find((g) => g.id === selectedGroupId);
        setSessions(current?.sessions || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload().catch((e) => setError(e.message));
  }, [token]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  function selectGroup(groupId) {
    setSelectedGroupId(groupId);
    const g = data?.groups?.find((x) => x.id === groupId);
    setSessions(g?.sessions || []);
  }

  function updateSession(index, field, value) {
    setSessions((current) =>
      current.map((s, i) => {
        if (i !== index) return s;
        if (field === "youtubeUrl") {
          const embed = toYouTubeEmbedUrl(value);
          return { ...s, youtubeUrl: value, embedUrl: embed || s.embedUrl || "" };
        }
        return { ...s, [field]: value };
      }),
    );
  }

  function addSession() {
    const limit = Number(selectedGroup?.course?.sessionCount || 1);
    if (sessions.length >= limit) {
      setToast({ type: "error", message: `Este curso permite maximo ${limit} sesiones.` });
      return;
    }
    setSessions((current) => [...current, createEmptySession(current.length)]);
  }

  function addMaterial(index) {
    setSessions((current) =>
      current.map((s, i) =>
        i === index
          ? { ...s, materials: [...(s.materials || []), { title: "", type: "PDF", url: "" }] }
          : s,
      ),
    );
  }

  function updateMaterial(sessionIndex, materialIndex, field, value) {
    setSessions((current) =>
      current.map((s, i) =>
        i !== sessionIndex
          ? s
          : {
              ...s,
              materials: (s.materials || []).map((m, j) =>
                j === materialIndex ? { ...m, [field]: value } : m,
              ),
            },
      ),
    );
  }

  async function deleteSession(session, index) {
    if (sessions.length <= 1) {
      setError("El grupo debe tener al menos 1 sesion.");
      return;
    }
    if (!session.id) {
      setSessions((current) => current.filter((_, i) => i !== index));
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api.deleteTeacherGroupSession(token, selectedGroupId, session.id);
      await reload();
      setMessage("Sesion eliminada correctamente.");
      setToast({ type: "success", message: "Sesion eliminada correctamente." });
    } catch (e) {
      setError(e.message);
      setToast({ type: "error", message: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payloadSessions = sessions.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        startAt: s.startAt,
        endAt: s.endAt,
        meetLink: s.meetLink,
        youtubeUrl: s.youtubeUrl,
        embedUrl: s.embedUrl,
        materials: s.materials || [],
      }));
      await api.updateTeacherGroupSessions(token, selectedGroupId, payloadSessions);
      await reload();
      setMessage("Sesiones y materiales actualizados.");
      setToast({ type: "success", message: "Sesiones y materiales actualizados." });
    } catch (e) {
      setError(e.message);
      setToast({ type: "error", message: e.message });
    } finally {
      setBusy(false);
    }
  }

  if (error) return <main className="p-6 text-red-600">{error}</main>;
  if (!data) return <main className="p-6">Cargando...</main>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
          <p className="text-xs uppercase text-slate-500">Docente</p>
          <h1 className="text-xl font-bold">{data.teacher.firstName} {data.teacher.lastName}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <button className="mt-4 rounded-lg bg-rose-600 px-3 py-2 text-white" onClick={logout}>Salir</button>
        </aside>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
            <h2 className="font-semibold">Mis grupos</h2>
            <select className="mt-2 w-full rounded-lg border p-2" value={selectedGroupId} onChange={(e) => selectGroup(e.target.value)}>
              {data.groups.map((g) => (
                <option key={g.id} value={g.id}>{g.course.title} - {g.name} ({g.schedule})</option>
              ))}
            </select>
            {selectedGroup && <p className="mt-2 text-sm text-slate-500">Alumnos en grupo: {selectedGroup.students.length}</p>}
            {selectedGroup && (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Nombres</th>
                      <th className="px-3 py-2 text-left">Apellidos</th>
                      <th className="px-3 py-2 text-left">Correo</th>
                      <th className="px-3 py-2 text-left">Contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedGroup.students || []).map((st) => (
                      <tr key={st.id} className="border-t">
                        <td className="px-3 py-2">{st.firstName}</td>
                        <td className="px-3 py-2">{st.lastName}</td>
                        <td className="px-3 py-2">{st.email || "-"}</td>
                        <td className="px-3 py-2">{st.phone || "-"}</td>
                      </tr>
                    ))}
                    {(selectedGroup.students || []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-3 text-slate-500">No hay alumnos asignados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedGroup && (
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Sesiones de {selectedGroup.name}</h3>
                <button className="rounded-lg bg-emerald-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={addSession} disabled={sessions.length >= Number(selectedGroup?.course?.sessionCount || 1)}>Anadir sesion</button>
              </div>
              <p className="mb-2 text-xs text-slate-500">Maximo permitido por curso: {Number(selectedGroup?.course?.sessionCount || 1)} sesiones.</p>

              {sessions.map((s, i) => (
                <div key={s.id || i} className="mb-3 rounded-lg border p-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input className="rounded border p-2" placeholder="Titulo" value={s.title || ""} onChange={(e) => updateSession(i, "title", e.target.value)} />
                    <input className="rounded border p-2" placeholder="Meet link" value={s.meetLink || ""} onChange={(e) => updateSession(i, "meetLink", e.target.value)} />
                    <input className="rounded border p-2" type="datetime-local" value={toLocalDateTimeInput(s.startAt)} onChange={(e) => updateSession(i, "startAt", new Date(e.target.value).toISOString())} />
                    <input className="rounded border p-2" type="datetime-local" value={toLocalDateTimeInput(s.endAt)} onChange={(e) => updateSession(i, "endAt", new Date(e.target.value).toISOString())} />
                    <input className="rounded border p-2" placeholder="YouTube link" value={s.youtubeUrl || ""} onChange={(e) => updateSession(i, "youtubeUrl", e.target.value)} />
                    <input className="rounded border p-2" placeholder="YouTube embed" value={s.embedUrl || ""} onChange={(e) => updateSession(i, "embedUrl", e.target.value)} />
                    <textarea className="rounded border p-2 md:col-span-2" rows="2" placeholder="Descripcion" value={s.description || ""} onChange={(e) => updateSession(i, "description", e.target.value)} />
                  </div>

                  <p className="mt-2 text-sm font-medium">Materiales</p>
                  {(s.materials || []).map((m, j) => (
                    <div key={m.id || j} className="mt-1 grid gap-2 md:grid-cols-3">
                      <input className="rounded border p-2" placeholder="Titulo" value={m.title || ""} onChange={(e) => updateMaterial(i, j, "title", e.target.value)} />
                      <select className="rounded border p-2" value={m.type || "PDF"} onChange={(e) => updateMaterial(i, j, "type", e.target.value)}>
                        {materialTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input className="rounded border p-2" placeholder="URL" value={m.url || ""} onChange={(e) => updateMaterial(i, j, "url", e.target.value)} />
                    </div>
                  ))}

                  <div className="mt-2 flex gap-2">
                    <button className="rounded-lg bg-slate-700 px-3 py-2 text-white" onClick={() => addMaterial(i)}>Agregar material</button>
                    <button className="rounded-lg bg-rose-600 px-3 py-2 text-white" onClick={() => setConfirmAction({ title: "Eliminar sesion", message: `Se eliminara ${s.title || "esta sesion"}.`, onConfirm: () => deleteSession(s, i) })} disabled={busy}><FaTrashAlt /></button>
                  </div>
                </div>
              ))}

              <button className="rounded-lg bg-slate-900 px-4 py-2 text-white" onClick={() => setConfirmAction({ title: "Guardar cambios", message: "Se actualizaran sesiones y materiales del grupo.", onConfirm: save })} disabled={busy || sessions.length < 1}>{busy ? "Guardando..." : "Guardar cambios"}</button>
              {message && <p className="mt-2 text-emerald-700">{message}</p>}
            </div>
          )}
        </section>
      </div>
      <ConfirmModal open={Boolean(confirmAction)} title={confirmAction?.title} message={confirmAction?.message} busy={busy} onCancel={() => setConfirmAction(null)} onConfirm={async () => { try { await confirmAction.onConfirm(); } finally { setConfirmAction(null); } }} />
      <Toast toast={toast} />
      <FullScreenSpinner show={loading || busy} label="Cargando panel docente..." />
    </main>
  );
}
