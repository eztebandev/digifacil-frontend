import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <a
          href="#inicio"
          className="text-2xl font-black tracking-tight text-slate-900"
          onClick={closeMenu}
        >
          Digi<span className="text-cyan-500">Fácil</span>
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

        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Abrir menu"
        >
          Menu
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden"
          aria-label="Principal movil"
        >
          <div className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            <a className="rounded-lg px-3 py-2 hover:bg-cyan-50" href="#inicio" onClick={closeMenu}>
              Inicio
            </a>
            <a className="rounded-lg px-3 py-2 hover:bg-cyan-50" href="#cursos" onClick={closeMenu}>
              Cursos
            </a>
            <a className="rounded-lg px-3 py-2 hover:bg-cyan-50" href="#contacto" onClick={closeMenu}>
              Contacto
            </a>
            <a
              className="mt-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-white"
              href="/intranet/login"
              onClick={closeMenu}
            >
              Acceder
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
