export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-cyan-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <a
          href="#inicio"
          className="font-black tracking-tight text-slate-900 text-2xl"
        >
          Digi<span className="text-cyan-500">Facil</span>
        </a>

        <nav
          className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex"
          aria-label="Principal"
        >
          <a className="hover:text-cyan-600" href="#inicio">
            Inicio
          </a>
          <a className="hover:text-cyan-600" href="#cursos">
            Cursos
          </a>
          <a className="hover:text-cyan-600" href="#contacto">
            Contacto
          </a>
          <a
            className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
            href="/intranet/login"
          >
            Acceder
          </a>
        </nav>
      </div>
    </header>
  );
}
