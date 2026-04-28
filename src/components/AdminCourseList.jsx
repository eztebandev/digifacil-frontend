export default function AdminCourseList({ courses, onEdit, onDelete, busyId }) {
  return (
    <div className="admin-list">
      <div className="admin-list-header">
        <h2>Cursos registrados</h2>
        <p>{courses.length} cursos en el catalogo</p>
      </div>

      {courses.map((course) => (
        <article className="admin-course-card" key={course.id}>
          <div>
            <div className="admin-course-topline">
              <h3>{course.title}</h3>
              {course.highlight && <span>Destacado</span>}
            </div>
            <p>{course.description}</p>
            <small>
              {course.level} | {course.duration} | {course.price}
            </small>
          </div>

          <div className="admin-actions">
            <button className="ghost-button" onClick={() => onEdit(course)}>
              Editar
            </button>
            <button
              className="danger-button"
              onClick={() => onDelete(course.id)}
              disabled={busyId === course.id}
            >
              {busyId === course.id ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
