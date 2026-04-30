export default function AdminCourseList({ courses, onEdit, onDelete, busyId }) {
  return (
    <div className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Cursos</h2>
      {courses.map((course) => (
        <article key={course.id} className="rounded-xl border p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-slate-600">{course.description}</p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <button
                className="flex-1 rounded-lg border px-3 py-2 sm:flex-none"
                onClick={() => onEdit(course)}
              >
                Editar
              </button>
              <button
                className="flex-1 rounded-lg bg-rose-600 px-3 py-2 text-white sm:flex-none"
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
