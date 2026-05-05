import { useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function CoursesSection({ courses, loading }) {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [modalityFilter, setModalityFilter] = useState("");
  const [investmentFilter, setInvestmentFilter] = useState("");

  const currencySymbols = {
    PEN: "S/",
    USD: "$",
    EUR: "EUR",
  };

  function formatDuration(course) {
    if (course?.sessionCount && course?.hoursPerSession) {
      return `${course.sessionCount} sesiones x ${course.hoursPerSession}h`;
    }
    return course?.duration || "-";
  }

  function formatPrice(course) {
    if (course?.priceAmount != null && course?.currency) {
      const symbol = currencySymbols[course.currency] || course.currency;
      return `${symbol} ${course.priceAmount}`;
    }
    return course?.price || "-";
  }

  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((course) => {
      (course.categories || []).forEach((row) => {
        const name = row?.category?.name;
        if (name) set.add(name);
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [courses]);

  const levels = useMemo(
    () => Array.from(new Set(courses.map((course) => course.level).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [courses],
  );
  const modalities = useMemo(
    () => Array.from(new Set(courses.map((course) => course.modality).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [courses],
  );

  function matchesInvestment(course) {
    if (!investmentFilter) return true;
    const amount = Number(course.priceAmount ?? 0);
    if (investmentFilter === "lt50") return amount < 50;
    if (investmentFilter === "50to150") return amount >= 50 && amount <= 150;
    if (investmentFilter === "150to300") return amount > 150 && amount <= 300;
    if (investmentFilter === "300to500") return amount > 300 && amount <= 500;
    if (investmentFilter === "gt500") return amount > 500;
    return true;
  }

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const courseCategoryNames = (course.categories || []).map((row) => row?.category?.name).filter(Boolean);
        const categoryOk = !categoryFilter || courseCategoryNames.includes(categoryFilter);
        const levelOk = !levelFilter || course.level === levelFilter;
        const modalityOk = !modalityFilter || course.modality === modalityFilter;
        return categoryOk && levelOk && modalityOk && matchesInvestment(course);
      }),
    [courses, categoryFilter, levelFilter, modalityFilter, investmentFilter],
  );

  return (
    <section className="px-4 py-14 md:py-20" id="cursos">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-100/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">
            Catálogo
          </span>
          <h2 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl md:text-4xl">Cursos pensados para aprender tecnología sin abrumarse</h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Cada curso está diseñado para personas que quieren ganar confianza
          digital y resolver necesidades reales.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
            Cargando cursos...
          </p>
        ) : null}

        {!loading ? (
          <>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:mt-10 lg:grid-cols-5">
            <select aria-label="Filtrar por categoría" className="col-span-2 rounded-xl border border-slate-200 bg-white/90 p-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 lg:col-span-1" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Categoría</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <select aria-label="Filtrar por nivel" className="rounded-xl border border-slate-200 bg-white/90 p-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="">Nivel</option>
              {levels.map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
            <select aria-label="Filtrar por inversión" className="rounded-xl border border-slate-200 bg-white/90 p-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100" value={investmentFilter} onChange={(e) => setInvestmentFilter(e.target.value)}>
              <option value="">Inversión</option>
              <option value="lt50">Menor a 50</option>
              <option value="50to150">50 a 150</option>
              <option value="150to300">150 a 300</option>
              <option value="300to500">300 a 500</option>
              <option value="gt500">500 a más</option>
            </select>
            <select aria-label="Filtrar por modalidad" className="col-span-2 rounded-xl border border-slate-200 bg-white/90 p-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 lg:col-span-1" value={modalityFilter} onChange={(e) => setModalityFilter(e.target.value)}>
              <option value="">Modalidad</option>
              {modalities.map((modality) => <option key={modality} value={modality}>{modality}</option>)}
            </select>
            <button
              type="button"
              className="col-span-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 lg:col-span-1"
              onClick={() => {
                setCategoryFilter("");
                setLevelFilter("");
                setModalityFilter("");
                setInvestmentFilter("");
              }}
            >
              Limpiar filtros
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5" key={course.id}>
                {course.imageUrlHorizontal ? (
                  <div className="mb-3 aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={course.imageUrlHorizontal}
                      alt={`Portada de ${course.title}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                {course.highlight ? <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">Destacado</span> : null}
                <h3 className="mt-3 text-lg font-extrabold text-slate-900">{course.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{course.description}</p>

                <dl className="mt-4 flex flex-wrap gap-2 text-sm">
                  <div className="w-auto rounded-lg bg-slate-50 p-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Nivel</dt>
                    <dd className="font-semibold text-slate-800">{course.level}</dd>
                  </div>
                  <div className="w-auto rounded-lg bg-slate-50 p-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Duración</dt>
                    <dd className="font-semibold text-slate-800">{formatDuration(course)}</dd>
                  </div>
                  <div className="w-auto rounded-lg bg-slate-50 p-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Modalidad</dt>
                    <dd className="font-semibold text-slate-800">{course.modality}</dd>
                  </div>
                  <div className="w-auto rounded-lg bg-slate-50 p-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Inversión</dt>
                    <dd className="font-semibold text-slate-800">{formatPrice(course)}</dd>
                  </div>
                </dl>
                <a
                  href={`https://wa.me/51945299119?text=${encodeURIComponent(`Quiero más información sobre el curso ${course.title}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  <FaWhatsapp className="text-base" />
                  Quiero este curso
                </a>
              </article>
            ))}
            {!filteredCourses.length ? <p className="text-sm text-slate-600">No hay cursos que coincidan con los filtros.</p> : null}
          </div>
          <a
            href={`https://wa.me/51945299119?text=${encodeURIComponent("Quiero más información sobre las capacitaciones")}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp DigiFacil"
            className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition hover:scale-105 hover:bg-emerald-600"
          >
            <FaWhatsapp className="text-3xl" />
          </a>
          </>
        ) : null}
      </div>
    </section>
  );
}
