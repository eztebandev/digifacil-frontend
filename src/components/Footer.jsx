export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>DigiFacil. Educacion digital practica, clara y cercana.</p>
        <a
          className="font-semibold text-slate-800 hover:text-cyan-700"
          href="/admin/login"
        >
          Acceso administrador
        </a>
      </div>
    </footer>
  );
}
