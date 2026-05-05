import { FaChalkboardTeacher, FaEdit, FaEye, FaPlus, FaTrashAlt, FaUserGraduate, FaUsers } from "react-icons/fa";

export default function AdminGroupsSection({ groups, onCreate, onAssignTeacher, onAssignStudent, onShowStudents, onShowSessions, onEdit, onDelete }) {
  return (
    <section className="w-full min-w-0 max-w-full rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Grupos</h2>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:w-auto" onClick={onCreate}><FaPlus />Crear grupo</button>
      </div>
      <div className="w-full min-w-0 max-w-full overflow-x-auto">
        <table className="w-max min-w-[760px] text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2 text-left">Curso</th><th className="px-3 py-2 text-left">Nombre</th><th className="px-3 py-2 text-left">Acciones</th></tr></thead>
          <tbody>{groups.map((g) => <tr key={g.id} className="border-t"><td className="px-3 py-2 break-words">{g.course?.title || "-"}</td><td className="px-3 py-2 break-words">{g.name}</td><td className="px-3 py-2"><div className="flex flex-nowrap gap-2 text-slate-700">
            <button title="Asignar docente" onClick={() => onAssignTeacher(g)}><FaChalkboardTeacher /></button>
            <button title="Asignar alumno" onClick={() => onAssignStudent(g)}><FaUserGraduate /></button>
            <button title="Ver alumnos" onClick={() => onShowStudents(g)}><FaUsers /></button>
            <button title="Ver sesiones" onClick={() => onShowSessions(g)}><FaEye /></button>
            <button title="Editar grupo" onClick={() => onEdit(g)}><FaEdit /></button>
            <button title="Eliminar grupo" className="text-rose-600" onClick={() => onDelete(g)}><FaTrashAlt /></button>
          </div></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
