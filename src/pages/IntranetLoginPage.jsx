import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { api } from "../lib/api";
import FullScreenSpinner from "../components/FullScreenSpinner";
import { useAuth } from "../context/AuthContext";

export default function IntranetLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.login(form);
      if (!["TEACHER", "STUDENT"].includes(data?.user?.role)) throw new Error("Acceso solo para docente/alumno.");
      login(data);
      navigate(data.user.role === "TEACHER" ? "/docente/dashboard" : "/alumno/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-cyan-100/60 backdrop-blur">
        <a href="/" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-700">
          <FaArrowLeft />
          Volver al inicio
        </a>
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Intranet</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Acceso estudiantes y docentes</h1>
        <p className="mt-1 text-sm text-slate-600">Tus cursos, sesiones y calendario en un solo lugar</p>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input className="w-full rounded-xl border border-slate-200 p-2" name="identifier" placeholder="Correo o usuario" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} required />
          <input className="w-full rounded-xl border border-slate-200 p-2" type="password" name="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}
          <button className="w-full rounded-xl bg-slate-900 p-2 text-sm font-semibold text-white" disabled={loading}>{loading ? "Ingresando..." : "Entrar"}</button>
        </form>
      </section>
          <FullScreenSpinner show={loading} label="Ingresando..." />
    </main>
  );
}
