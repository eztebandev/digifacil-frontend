export default function AdminCourseList({ courses, onEdit, onDelete, busyId }) {
  return (
    <div className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Cursos</h2>
      {courses.map((course) => (
        <article key={course.id} className="rounded-xl border p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-slate-600">{course.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-lg border px-3 py-1"
                onClick={() => onEdit(course)}
              >
                Editar
              </button>
              <button
                className="rounded-lg bg-rose-600 px-3 py-1 text-white"
                onClick={() => onDelete(course.id)}
                disabled={busyId === course.id}
              >
                {busyId === course.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
