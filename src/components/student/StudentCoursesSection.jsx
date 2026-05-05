import { FaFileAlt, FaPlayCircle, FaVideo, FaYoutube } from "react-icons/fa";

function toEmbedUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  const normalized = raw.replace("youtube-nocookie.com", "youtube.com");
  const matchers = [/(?:youtube\.com\/watch\?v=)([^&?/]+)/i,/(?:youtu\.be\/)([^&?/]+)/i,/(?:youtube\.com\/embed\/)([^&?/]+)/i,/(?:youtube\.com\/shorts\/)([^&?/]+)/i];
  for (const re of matchers) {
    const m = normalized.match(re);
    if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return normalized.includes("youtube.com/embed/") ? normalized : "";
}

export default function StudentCoursesSection({ data, selected, setSelectedEnrollmentId }) {
  return (
    <>
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
        <h2 className="font-semibold">Mis grupos</h2>
        {data.enrollments.map((e) => (
          <button key={e.id} className="mt-2 block w-full rounded border p-2 text-left text-sm sm:text-base" onClick={() => setSelectedEnrollmentId(e.id)}>
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
              <p className="mt-1 text-xs text-slate-500">{new Date(s.startAt).toLocaleString()} - {new Date(s.endAt).toLocaleString()}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Accesos de la sesión</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {s.meetLink && <a className="inline-flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-sm text-cyan-700" href={s.meetLink} target="_blank" rel="noreferrer"><FaVideo /><span>Meet</span></a>}
                {s.youtubeUrl && <a className="inline-flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-sm text-rose-700" href={s.youtubeUrl} target="_blank" rel="noreferrer"><FaYoutube /><span>YouTube</span></a>}
              </div>
              {toEmbedUrl(s.embedUrl || s.youtubeUrl) ? <div className="mt-2 overflow-hidden rounded-lg border bg-black"><div className="aspect-video"><iframe className="h-full w-full" src={toEmbedUrl(s.embedUrl || s.youtubeUrl)} title={`Video de ${s.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></div> : null}
              <div className="mt-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Materiales</p>
                {(s.materials || []).length === 0 ? <p className="text-sm text-slate-500">Sin materiales adjuntos.</p> : <div className="mt-1 flex flex-wrap gap-2">{(s.materials || []).map((m) => (<a key={m.id} className="inline-flex items-center gap-1 rounded border bg-slate-50 px-2 py-1 text-sm text-cyan-700" href={m.url} target="_blank" rel="noreferrer"><FaFileAlt /><span>{m.type}: {m.title}</span></a>))}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
