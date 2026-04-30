export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-emerald-50"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:py-14 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-100/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">
            Educacion digital en vivo
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-6xl">
            Aprende tecnologia paso a paso, con clases humanas y practicas.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-600 sm:text-base md:text-lg">
            Diseñamos experiencias de aprendizaje para personas que empiezan
            desde cero y quieren aplicar lo aprendido en su trabajo, negocio o
            vida diaria.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#cursos"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Explorar cursos
            </a>
            <a
              href="#contacto"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-cyan-300 hover:text-cyan-700"
            >
              Hablar con asesoria
            </a>
          </div>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Modalidad
              </p>
              <p className="mt-1 font-bold text-slate-900">En vivo por Meet</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Acompanamiento
              </p>
              <p className="mt-1 font-bold text-slate-900">Docente cercano</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3 sm:col-span-1 col-span-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Enfoque
              </p>
              <p className="mt-1 font-bold text-slate-900">Aplicacion real</p>
            </div>
          </div>
        </div>

        <div className="md:justify-self-end md:pr-2">
          <div className="md:animate-bounce [animation-duration:6s] [animation-timing-function:cubic-bezier(.28,.84,.42,1)]">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-cyan-200/60 sm:p-6 md:rotate-2">
              <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                Ruta educativa
              </p>
              <ol className="mt-5 space-y-4">
                <li className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    1. Entender
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Explicamos conceptos con ejemplos de la vida real, sin
                    tecnicismos innecesarios.
                  </p>
                </li>
                <li className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    2. Practicar
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Aplicas en clase con ejercicios guiados y retroalimentacion
                    inmediata.
                  </p>
                </li>
                <li className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-bold text-slate-900">
                    3. Implementar
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Te llevas recursos, plantillas y grabaciones para avanzar
                    con seguridad.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
