export default function CoursesSection({ courses, loading }) {
  return (
    <section className="courses-section" id="cursos">
      <div className="container section-heading">
        <span className="eyebrow">Catalogo</span>
        <h2>Cursos pensados para aprender tecnologia sin abrumarse</h2>
        <p>
          Cada curso esta disenado para personas que quieren ganar confianza
          digital y resolver necesidades reales.
        </p>
      </div>

      <div className="container course-grid">
        {loading && <p className="status-card">Cargando cursos...</p>}

        {!loading &&
          courses.map((course) => (
            <article className="course-card" key={course.id}>
              {course.highlight && <span className="course-tag">Destacado</span>}
              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <dl className="course-meta">
                <div>
                  <dt>Nivel</dt>
                  <dd>{course.level}</dd>
                </div>
                <div>
                  <dt>Duracion</dt>
                  <dd>{course.duration}</dd>
                </div>
                <div>
                  <dt>Modalidad</dt>
                  <dd>{course.modality}</dd>
                </div>
                <div>
                  <dt>Inversion</dt>
                  <dd>{course.price}</dd>
                </div>
              </dl>
            </article>
          ))}
      </div>
    </section>
  );
}
