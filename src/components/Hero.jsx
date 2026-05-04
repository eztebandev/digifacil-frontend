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
            Educación digital en vivo
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-6xl">
            Aprende tecnología paso a paso, con clases humanas y prácticas.
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
              Hablar con asesoría
            </a>
          </div>

        </div>

        <div className="md:justify-self-end md:pr-2">
          <div className="md:animate-[bounce_15s_infinite]">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-transparent md:rotate-2">
              <div className="aspect-square">
                <img
                  src="https://cndvkqjqqoylacddhpgf.supabase.co/storage/v1/object/public/digifacil-web/digifacil-section-one.png"
                  alt="DigiFácil: acompañamiento en clases de tecnología"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 grid max-w-md gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Acompañamiento
              </p>
              <p className="mt-1 font-bold text-slate-900">Docente cercano</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3 sm:col-span-1 col-span-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Enfoque
              </p>
              <p className="mt-1 font-bold text-slate-900">Aplicación real</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
