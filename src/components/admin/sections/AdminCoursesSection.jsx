import { FaPlus } from "react-icons/fa";
import AdminCourseList from "../../AdminCourseList";

export default function AdminCoursesSection({ loading, courses, busyId, onCreate, onOpenCategories, onEdit, onDelete }) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Cursos</h2>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onOpenCategories}>
            <FaPlus />
            Agregar categoria
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" onClick={onCreate}>
            <FaPlus />
            Añadir curso
          </button>
        </div>
      </div>

      {!loading ? (
        <AdminCourseList
          courses={courses}
          onEdit={onEdit}
          onDelete={onDelete}
          busyId={busyId}
        />
      ) : null}
    </section>
  );
}
