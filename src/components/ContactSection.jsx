export default function ContactSection() {
  return (
    <section id="contacto" className="bg-slate-900 py-14 text-white md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">
            Acompanamiento
          </span>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl md:text-4xl">
            Te orientamos para elegir el curso ideal para ti.
          </h2>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Cuéntanos tu objetivo y te recomendamos la mejor ruta de aprendizaje
            según tu nivel y disponibilidad.
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur sm:p-6">
          <a
            className="block break-all text-base font-semibold text-cyan-200 hover:text-cyan-100 sm:text-lg"
            href="mailto:hola@digifacil.lat"
          >
            hola@digifacil.lat
          </a>
          <a
            className="mt-3 block text-slate-200 hover:text-white"
            href="https://digifacil.lat/"
            target="_blank"
            rel="noreferrer"
          >
            digifacil.lat
          </a>
          <a
            className="mt-3 block text-slate-200 hover:text-white"
            href="https://wa.me/51999999999"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp de atencion
          </a>
        </div>
      </div>
    </section>
  );
}
