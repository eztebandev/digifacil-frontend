export default function CoursesSection({ courses, loading }) {
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

  return (
    <section className="px-4 py-16 md:py-20" id="cursos">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-100/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700">
            Catalogo
          </span>
          <h2 className="mt-4 text-3xl font-black text-slate-900 md:text-4xl">Cursos pensados para aprender tecnologia sin abrumarse</h2>
          <p className="mt-3 text-slate-600">
          Cada curso esta disenado para personas que quieren ganar confianza
          digital y resolver necesidades reales.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
            Cargando cursos...
          </p>
        ) : null}

        {!loading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md" key={course.id}>
                {course.highlight ? <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">Destacado</span> : null}
                <h3 className="mt-3 text-lg font-extrabold text-slate-900">{course.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{course.description}</p>

                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-slate-50 p-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Nivel</dt>
                    <dd className="font-semibold text-slate-800">{course.level}</dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Duracion</dt>
                    <dd className="font-semibold text-slate-800">{formatDuration(course)}</dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Modalidad</dt>
                    <dd className="font-semibold text-slate-800">{course.modality}</dd>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Inversion</dt>
                    <dd className="font-semibold text-slate-800">{formatPrice(course)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
