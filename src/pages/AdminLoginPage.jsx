import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../lib/api";
import FullScreenSpinner from "../components/FullScreenSpinner";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.loginAdmin(form);
      if ((data?.user?.role || "").toLowerCase() !== "admin") throw new Error("Solo admin.");
      login(data);
      navigate("/admin/dashboard");
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
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Acceso interno</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Panel administrativo</h1>
        <p className="mt-1 text-sm text-slate-600">Gestiona cursos, grupos y asignaciones</p>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input className="w-full rounded-xl border border-slate-200 p-2" type="email" name="email"placeholder="Correo o usuario" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <div className="relative">
            <input className="w-full rounded-xl border border-slate-200 p-2 pr-10" type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}
          <button className="w-full rounded-xl bg-slate-900 p-2 text-sm font-semibold text-white" disabled={loading}>{loading ? "Ingresando..." : "Entrar"}</button>
        </form>
      </section>
          <FullScreenSpinner show={loading} label="Ingresando..." />
    </main>
  );
}
