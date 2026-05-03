import { FaEnvelope, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section id="contacto" className="bg-slate-900 py-14 text-white md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">
            Acompañamiento
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
            className="flex items-center gap-3 break-all text-base font-semibold text-cyan-200 hover:text-cyan-100 sm:text-lg"
            href="https://www.facebook.com/profile.php?id=61577704357612"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebook className="shrink-0" />
            <span>Facebook</span>
          </a>
          <a
            className="mt-3 flex items-center gap-3 text-slate-200 hover:text-white"
            href="https://www.tiktok.com/@digifacilpe"
            target="_blank"
            rel="noreferrer"
          >
            <FaTiktok className="shrink-0" />
            <span>@digifacilpe</span>
          </a>
          <a
            className="mt-3 flex items-center gap-3 break-all text-slate-200 hover:text-white"
            href="mailto:digifaciltech@gmail.com"
          >
            <FaEnvelope className="shrink-0" />
            <span>digifaciltech@gmail.com</span>
          </a>
          <a
            className="mt-3 flex items-center gap-3 text-slate-200 hover:text-white"
            href="https://wa.me/51945299119"
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp className="shrink-0" />
            <span>+51 945 299 119</span>
          </a>
        </div>
      </div>
    </section>
  );
}
