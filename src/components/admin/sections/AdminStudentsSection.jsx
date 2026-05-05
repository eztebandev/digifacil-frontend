import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";

export default function AdminStudentsSection({ students, onCreate, onEdit, onDelete }) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Alumnos</h2>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:w-auto" onClick={onCreate}><FaPlus />Crear alumno</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="px-3 py-2 text-left">Nombres</th><th className="px-3 py-2 text-left">Apellidos</th><th className="px-3 py-2 text-left">Correo</th><th className="px-3 py-2 text-left">Usuario</th><th className="px-3 py-2 text-left">Acciones</th></tr></thead>
          <tbody>{students.map((s) => <tr key={s.id} className="border-t"><td className="px-3 py-2 break-words">{s.firstName}</td><td className="px-3 py-2 break-words">{s.lastName}</td><td className="px-3 py-2 break-all">{s.email}</td><td className="px-3 py-2 break-all">{s.username}</td><td className="px-3 py-2"><div className="flex gap-2"><button onClick={() => onEdit(s)}><FaEdit /></button><button className="text-rose-600" onClick={() => onDelete(s)}><FaTrashAlt /></button></div></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
