export default function AdminCourseList({ courses, onEdit, onDelete, busyId }) {
  const statusLabel = {
    PUBLIC: "Publico",
    PRIVATE: "Privado",
    DISABLED: "Inhabilitado",
  };

  return (
    <div className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Cursos</h2>
      {courses.map((course) => (
        (() => {
          const isDeleteDisabled = busyId === course.id || course.status !== "DISABLED";
          return (
        <article key={course.id} className="rounded-xl border p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-slate-600">{course.description}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Estado: {statusLabel[course.status] || "Publico"}
              </p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <button
                className="flex-1 rounded-lg border px-3 py-2 sm:flex-none"
                onClick={() => onEdit(course)}
              >
                Editar
              </button>
              <button
                className={`flex-1 rounded-lg px-3 py-2 text-white sm:flex-none ${
                  isDeleteDisabled
                    ? "cursor-not-allowed bg-slate-300 text-slate-500"
                    : "bg-rose-600"
                }`}
                onClick={() => onDelete(course.id)}
                disabled={isDeleteDisabled}
              >
                {busyId === course.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </article>
          );
        })()
      ))}
    </div>
  );
}
