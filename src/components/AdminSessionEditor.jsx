import { useEffect, useState } from "react";
const materialTypes = [
  "PDF",
  "WORD",
  "SLIDES",
  "PPT",
  "EXCEL",
  "TXT",
  "IMAGE",
  "YOUTUBE_LINK",
  "YOUTUBE_EMBED",
];
export default function AdminSessionEditor({ course, onSave, busy }) {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    setSessions(course?.sessions || []);
  }, [course]);
  if (!course) return null;
  return (
    <section className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Sesiones: {course.title}</h2>
      {sessions.map((session, index) => (
        <div key={session.id || index} className="rounded-xl border p-3">
          <input
            className="mb-2 w-full rounded-lg border p-2"
            value={session.title || ""}
            onChange={(e) =>
              setSessions((c) =>
                c.map((s, i) =>
                  i === index ? { ...s, title: e.target.value } : s,
                ),
              )
            }
          />
          <input
            className="mb-2 w-full rounded-lg border p-2"
            placeholder="Meet URL"
            value={session.meetLink || ""}
            onChange={(e) =>
              setSessions((c) =>
                c.map((s, i) =>
                  i === index ? { ...s, meetLink: e.target.value } : s,
                ),
              )
            }
          />
          {(session.materials || []).map((m, j) => (
            <div key={m.id || j} className="mb-2 grid gap-2 md:grid-cols-3">
              <input
                className="rounded-lg border p-2"
                value={m.title || ""}
                onChange={(e) =>
                  setSessions((c) =>
                    c.map((s, i) =>
                      i !== index
                        ? s
                        : {
                            ...s,
                            materials: s.materials.map((x, k) =>
                              k === j ? { ...x, title: e.target.value } : x,
                            ),
                          },
                    ),
                  )
                }
              />
              <select
                className="rounded-lg border p-2"
                value={m.type || "PDF"}
                onChange={(e) =>
                  setSessions((c) =>
                    c.map((s, i) =>
                      i !== index
                        ? s
                        : {
                            ...s,
                            materials: s.materials.map((x, k) =>
                              k === j ? { ...x, type: e.target.value } : x,
                            ),
                          },
                    ),
                  )
                }
              >
                {materialTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                className="rounded-lg border p-2"
                value={m.url || ""}
                onChange={(e) =>
                  setSessions((c) =>
                    c.map((s, i) =>
                      i !== index
                        ? s
                        : {
                            ...s,
                            materials: s.materials.map((x, k) =>
                              k === j ? { ...x, url: e.target.value } : x,
                            ),
                          },
                    ),
                  )
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border px-3 py-1"
            onClick={() =>
              setSessions((c) =>
                c.map((s, i) =>
                  i === index
                    ? {
                        ...s,
                        materials: [
                          ...(s.materials || []),
                          { title: "", type: "PDF", url: "" },
                        ],
                      }
                    : s,
                ),
              )
            }
          >
            Agregar material
          </button>
        </div>
      ))}
      <button
        className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        disabled={busy || sessions.length < 1}
        onClick={() => onSave(sessions)}
      >
        {busy ? "Guardando..." : "Guardar sesiones"}
      </button>
    </section>
  );
}
