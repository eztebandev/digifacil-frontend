export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl">DigiFacil. Educacion digital practica, clara y cercana.</p>
        <a
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-center font-semibold text-slate-800 hover:text-cyan-700 md:w-auto md:border-0 md:p-0"
          href="/admin/login"
        >
          Acceso administrador
        </a>
      </div>
    </footer>
  );
}
