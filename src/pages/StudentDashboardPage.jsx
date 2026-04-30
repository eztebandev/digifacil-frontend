import { useEffect, useMemo, useState } from "react";
import { FaFileAlt, FaPlayCircle, FaVideo, FaYoutube } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import FullScreenSpinner from "../components/FullScreenSpinner";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

function keyOf(dateValue) {
  const d = new Date(dateValue);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toEmbedUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  const normalized = raw.replace("youtube-nocookie.com", "youtube.com");
  const matchers = [
    /(?:youtube\.com\/watch\?v=)([^&?/]+)/i,
    /(?:youtu\.be\/)([^&?/]+)/i,
    /(?:youtube\.com\/embed\/)([^&?/]+)/i,
    /(?:youtube\.com\/shorts\/)([^&?/]+)/i,
  ];
  for (const re of matchers) {
    const m = normalized.match(re);
    if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return normalized.includes("youtube.com/embed/") ? normalized : "";
}

export default function StudentDashboardPage() {
  const { token, logout, user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("courses");
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [toast, setToast] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getStudentDashboard(token).then((payload) => {
      setData(payload);
      if (payload.enrollments?.length) setSelectedEnrollmentId(payload.enrollments[0].id);
    }).catch((e) => { setError(e.message); setToast({ type: "error", message: e.message }); }).finally(() => setLoading(false));
  }, [token]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const selected = useMemo(() => data?.enrollments?.find((e) => e.id === selectedEnrollmentId) || data?.enrollments?.[0] || null, [data, selectedEnrollmentId]);

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
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
          <p className="text-xs uppercase text-slate-500">Alumno</p>
          <h1 className="text-xl font-bold">{data.student.firstName} {data.student.lastName}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <nav className="mt-4 space-y-2">
            <button className={`w-full rounded-lg px-3 py-2 text-left ${activeNav === "courses" ? "bg-slate-900 text-white" : "bg-slate-100"}`} onClick={() => setActiveNav("courses")}>Mis cursos</button>
            <button className={`w-full rounded-lg px-3 py-2 text-left ${activeNav === "calendar" ? "bg-slate-900 text-white" : "bg-slate-100"}`} onClick={() => setActiveNav("calendar")}>Mi calendario</button>
          </nav>
          <button className="mt-4 rounded-lg bg-rose-600 px-3 py-2 text-white" onClick={() => setConfirmLogout(true)}>Salir</button>
        </aside>

        <section className="space-y-4">
          {activeNav === "courses" && (
            <>
              <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
                <h2 className="font-semibold">Mis grupos</h2>
                {data.enrollments.map((e) => (
                  <button key={e.id} className="mt-2 block w-full rounded border p-2 text-left" onClick={() => setSelectedEnrollmentId(e.id)}>
                    {e.group.course.title} - {e.group.name} ({e.group.schedule})
                  </button>
                ))}
              </div>

              {selected && (
                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
                  <h3 className="font-semibold">Contenido: {selected.group.course.title} / {selected.group.name}</h3>
                  <p className="text-sm text-slate-500">Horario: {selected.group.schedule}</p>
                  {selected.group.sessions.map((s) => (
                    <div key={s.id} className="mt-2 rounded-lg border p-2">
                      <p className="font-medium">{s.title}</p>
                      <p className="text-sm text-slate-600">{s.description}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(s.startAt).toLocaleString()} - {new Date(s.endAt).toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Accesos de la sesión</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {s.meetLink && <a className="inline-flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-sm text-cyan-700" href={s.meetLink} target="_blank" rel="noreferrer" title="Entrar a Meet"><FaVideo /><span>Meet</span></a>}
                        {s.youtubeUrl && <a className="inline-flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-sm text-rose-700" href={s.youtubeUrl} target="_blank" rel="noreferrer" title="Abrir YouTube"><FaYoutube /><span>YouTube</span></a>}
                      </div>
                      {toEmbedUrl(s.embedUrl || s.youtubeUrl) ? (
                        <div className="mt-2 overflow-hidden rounded-lg border bg-black">
                          <div className="aspect-video">
                            <iframe
                              className="h-full w-full"
                              src={toEmbedUrl(s.embedUrl || s.youtubeUrl)}
                              title={`Video de ${s.title}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      ) : (s.youtubeUrl || s.embedUrl) ? (
                        <a className="mt-1 inline-flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-sm text-cyan-700" href={s.youtubeUrl || s.embedUrl} target="_blank" rel="noreferrer"><FaPlayCircle /><span>Abrir video</span></a>
                      ) : null}
                      <div className="mt-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Materiales (presiona el icono para abrir)</p>
                        {(s.materials || []).length === 0 ? (
                          <p className="text-sm text-slate-500">Sin materiales adjuntos.</p>
                        ) : (
                          <div className="mt-1 space-y-1">
                            {(s.materials || []).map((m) => (
                              <a key={m.id} className="inline-flex items-center gap-1 rounded border bg-slate-50 px-2 py-1 text-sm text-cyan-700" href={m.url} target="_blank" rel="noreferrer" title={`Abrir ${m.title}`}>
                                <FaFileAlt />
                                <span>{m.type}: {m.title}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeNav === "calendar" && (
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Mi calendario</h2>
                <div className="flex gap-2">
                  <button className="rounded border px-3 py-1" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>Anterior</button>
                  <p className="min-w-40 text-center text-sm font-semibold capitalize">{monthMeta.label}</p>
                  <button className="rounded border px-3 py-1" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>Siguiente</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">{["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((d) => <div key={d}>{d}</div>)}</div>
              <div className="mt-2 grid grid-cols-7 gap-2">
                {monthMeta.cells.map((cell, idx) => {
                  if (!cell) return <div key={`e-${idx}`} className="h-24 rounded border border-transparent" />;
                  const k = keyOf(cell);
                  const items = byDay[k] || [];
                  return <div key={k} className="h-24 overflow-auto rounded border bg-slate-50 p-1"><p className="text-xs font-semibold">{cell.getDate()}</p>{items.map((it) => <div key={it.sessionId} className="mt-1 rounded bg-cyan-100 px-1 py-0.5 text-[10px] font-medium text-cyan-800"><p>{it.groupName}</p><div className="mt-0.5 flex items-center justify-between"><span>{new Date(it.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>{it.meetLink ? <a href={it.meetLink} target="_blank" rel="noreferrer" className="text-cyan-900" title="Ir a videollamada"><FaVideo /></a> : null}</div></div>)}</div>;
                })}
              </div>
            </div>
          )}
        </section>
      </div>
      <ConfirmModal open={confirmLogout} title="Cerrar sesion" message="Se cerrara tu sesion actual." onCancel={() => setConfirmLogout(false)} onConfirm={() => { logout(); }} />
      <Toast toast={toast} />
      <FullScreenSpinner show={loading} label="Cargando panel alumno..." />
    </main>
  );
}
