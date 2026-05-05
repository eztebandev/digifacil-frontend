import { FaPlus } from "react-icons/fa";
import AdminCourseList from "../../AdminCourseList";

export default function AdminCoursesSection({ loading, courses, busyId, onCreate, onEdit, onDelete }) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Cursos</h2>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 sm:w-auto" onClick={onCreate}>
          <FaPlus />
          Añadir
        </button>
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
