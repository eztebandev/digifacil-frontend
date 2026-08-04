import { useEffect, useMemo, useRef, useState } from "react";
import { FaTimes, FaWhatsapp } from "react-icons/fa";
import { api } from "../lib/api";

function hasText(value) {
  return value != null && String(value).trim() !== "";
}

function TextBlock({ children }) {
  return (
    <div className="space-y-2 text-sm leading-6 text-slate-600">
      {String(children)
        .split("\n")
        .filter((line) => line.trim())
        .map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
    </div>
  );
}

export default function CoursesSection({ courses, loading }) {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [modalityFilter, setModalityFilter] = useState("");
  const [investmentFilter, setInvestmentFilter] = useState("");
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const coursesListRef = useRef(null);

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

  function hasCourseDetails(course) {
    return Boolean(
      course?.syllabusItems?.length ||
      course?.faqs?.length ||
      course?.testimonials?.length ||
      hasText(course?.detail?.studentProfile) ||
      hasText(course?.detail?.outcomes) ||
      hasText(course?.detail?.methodology) ||
      hasText(course?.detail?.instructorName) ||
      hasText(course?.detail?.instructorBio) ||
      hasText(course?.detail?.instructorPhotoUrl),
    );
  }

  async function openCourseDetail(course) {
    setSelectedCourse(course);
    setDetailLoading(true);
    setDetailError("");
    try {
      const detail = await api.getCourseDetail(course.id);
      setSelectedCourse(detail);
    } catch (error) {
      setDetailError(error.message);
    } finally {
      setDetailLoading(false);
    }
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

  const itemsPerPage = isMobile ? 3 : 6;
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage, itemsPerPage]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, levelFilter, modalityFilter, investmentFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    coursesListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

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
          <div ref={coursesListRef} className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paginatedCourses.map((course) => (
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
                <button
                  type="button"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                  onClick={() => openCourseDetail(course)}
                >
                  Ver detalles
                </button>
              </article>
            ))}
            {!filteredCourses.length ? <p className="text-sm text-slate-600">No hay cursos que coincidan con los filtros.</p> : null}
          </div>
          {filteredCourses.length > 0 ? (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Anterior
              </button>
              <p className="text-sm font-medium text-slate-700">
                Página {currentPage} de {totalPages}
              </p>
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Siguiente
              </button>
            </div>
          ) : null}
          <a
            href={`https://wa.me/51945299119?text=${encodeURIComponent("Quiero más información sobre las capacitaciones")}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp DigiFacil"
            className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition hover:scale-105 hover:bg-emerald-600"
          >
            <FaWhatsapp className="text-3xl" />
          </a>
          {selectedCourse ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
              <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <button
                  type="button"
                  className="absolute right-3 top-3 z-10 rounded-lg bg-white/90 p-2 text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => {
                    setSelectedCourse(null);
                    setDetailError("");
                  }}
                  aria-label="Cerrar detalles del curso"
                >
                  <FaTimes />
                </button>

                {selectedCourse.imageUrlHorizontal ? (
                  <div className="aspect-[16/7] max-h-80 overflow-hidden bg-slate-100">
                    <img
                      src={selectedCourse.imageUrlHorizontal}
                      alt={`Portada de ${selectedCourse.title}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="p-5 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      {selectedCourse.highlight ? <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">Destacado</span> : null}
                      <h3 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{selectedCourse.title}</h3>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{selectedCourse.description}</p>
                    </div>
                    <a
                      href={`https://wa.me/51945299119?text=${encodeURIComponent(`Quiero más información sobre el curso ${selectedCourse.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      <FaWhatsapp />
                      Quiero este curso
                    </a>
                  </div>

                  <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Nivel</dt>
                      <dd className="mt-1 font-semibold text-slate-800">{selectedCourse.level || "-"}</dd>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Duración</dt>
                      <dd className="mt-1 font-semibold text-slate-800">{formatDuration(selectedCourse)}</dd>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Modalidad</dt>
                      <dd className="mt-1 font-semibold text-slate-800">{selectedCourse.modality || "-"}</dd>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Inversión</dt>
                      <dd className="mt-1 font-semibold text-slate-800">{formatPrice(selectedCourse)}</dd>
                    </div>
                  </dl>

                  {detailLoading ? <p className="mt-6 rounded-xl bg-cyan-50 p-4 text-sm text-cyan-700">Cargando detalles...</p> : null}
                  {detailError ? <p className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{detailError}</p> : null}

                  {!detailLoading && !detailError && hasCourseDetails(selectedCourse) ? (
                    <div className="mt-7 grid gap-5 lg:grid-cols-2">
                      {selectedCourse.syllabusItems?.length ? (
                        <section className="rounded-2xl border border-slate-200 p-4">
                          <h4 className="text-lg font-extrabold text-slate-900">Temario por sesiones</h4>
                          <div className="mt-3 space-y-3">
                            {selectedCourse.syllabusItems.map((item) => (
                              <div className="rounded-xl bg-slate-50 p-3" key={item.id || item.session}>
                                <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">Sesión {item.session}</p>
                                <h5 className="mt-1 font-bold text-slate-900">{item.title}</h5>
                                {item.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p> : null}
                              </div>
                            ))}
                          </div>
                        </section>
                      ) : null}

                      {hasText(selectedCourse.detail?.studentProfile) ? (
                        <section className="rounded-2xl border border-slate-200 p-4">
                          <h4 className="text-lg font-extrabold text-slate-900">Perfil del estudiante</h4>
                          <div className="mt-3"><TextBlock>{selectedCourse.detail.studentProfile}</TextBlock></div>
                        </section>
                      ) : null}

                      {hasText(selectedCourse.detail?.outcomes) ? (
                        <section className="rounded-2xl border border-slate-200 p-4">
                          <h4 className="text-lg font-extrabold text-slate-900">Resultados que obtendrá</h4>
                          <div className="mt-3"><TextBlock>{selectedCourse.detail.outcomes}</TextBlock></div>
                        </section>
                      ) : null}

                      {hasText(selectedCourse.detail?.methodology) ? (
                        <section className="rounded-2xl border border-slate-200 p-4">
                          <h4 className="text-lg font-extrabold text-slate-900">Metodología de enseñanza</h4>
                          <div className="mt-3"><TextBlock>{selectedCourse.detail.methodology}</TextBlock></div>
                        </section>
                      ) : null}

                      {hasText(selectedCourse.detail?.instructorName) || hasText(selectedCourse.detail?.instructorBio) || hasText(selectedCourse.detail?.instructorPhotoUrl) ? (
                        <section className="rounded-2xl border border-slate-200 p-4">
                          <h4 className="text-lg font-extrabold text-slate-900">Datos del instructor</h4>
                          <div className="mt-3 flex gap-3">
                            {hasText(selectedCourse.detail?.instructorPhotoUrl) ? (
                            <img src={selectedCourse.detail.instructorPhotoUrl} alt={`Instructor de ${selectedCourse.title}`} className="h-16 w-16 rounded-xl object-cover" />
                          ) : null}
                            <div>
                              {hasText(selectedCourse.detail?.instructorName) ? <p className="font-bold text-slate-900">{selectedCourse.detail.instructorName}</p> : null}
                              {hasText(selectedCourse.detail?.instructorBio) ? <div className="mt-1"><TextBlock>{selectedCourse.detail.instructorBio}</TextBlock></div> : null}
                            </div>
                          </div>
                        </section>
                      ) : null}

                      {selectedCourse.faqs?.length ? (
                        <section className="rounded-2xl border border-slate-200 p-4">
                          <h4 className="text-lg font-extrabold text-slate-900">Preguntas frecuentes</h4>
                          <div className="mt-3 space-y-3">
                            {selectedCourse.faqs.map((item) => (
                              <div key={item.id || item.question}>
                                <h5 className="font-bold text-slate-900">{item.question}</h5>
                                <p className="mt-1 text-sm leading-6 text-slate-600">{item.answer}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      ) : null}

                      {selectedCourse.testimonials?.length ? (
                        <section className="rounded-2xl border border-slate-200 p-4 lg:col-span-2">
                          <h4 className="text-lg font-extrabold text-slate-900">Testimonios o trabajos de alumnos</h4>
                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            {selectedCourse.testimonials.map((item) => (
                              <article className="rounded-xl bg-slate-50 p-3" key={item.id || `${item.studentName}-${item.order}`}>
                                {item.imageUrl ? <img src={item.imageUrl} alt={`Trabajo de ${item.studentName}`} className="mb-3 aspect-video w-full rounded-lg object-cover" /> : null}
                                <h5 className="font-bold text-slate-900">{item.studentName}</h5>
                                <p className="mt-1 text-sm leading-6 text-slate-600">{item.content}</p>
                                {item.workUrl ? <a href={item.workUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-800">Ver trabajo</a> : null}
                              </article>
                            ))}
                          </div>
                        </section>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
