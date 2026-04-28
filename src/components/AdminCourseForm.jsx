import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  level: "",
  duration: "",
  modality: "En vivo por Google Meet",
  price: "",
  highlight: false,
};

export default function AdminCourseForm({ selectedCourse, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(
      selectedCourse || {
        ...initialForm,
      }
    );
  }, [selectedCourse]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-header">
        <h2>{selectedCourse ? "Editar curso" : "Nuevo curso"}</h2>
        {selectedCourse && (
          <button className="ghost-button" type="button" onClick={onCancel}>
            Cancelar edicion
          </button>
        )}
      </div>

      <label>
        Titulo
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>

      <label>
        Descripcion
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          required
        />
      </label>

      <div className="admin-form-grid">
        <label>
          Nivel
          <input name="level" value={form.level} onChange={handleChange} required />
        </label>

        <label>
          Duracion
          <input name="duration" value={form.duration} onChange={handleChange} required />
        </label>
      </div>

      <div className="admin-form-grid">
        <label>
          Modalidad
          <input
            name="modality"
            value={form.modality}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Precio
          <input name="price" value={form.price} onChange={handleChange} required />
        </label>
      </div>

      <label className="checkbox-field">
        <input
          name="highlight"
          type="checkbox"
          checked={Boolean(form.highlight)}
          onChange={handleChange}
        />
        Mostrar como destacado
      </label>

      <button className="primary-button" type="submit" disabled={busy}>
        {busy ? "Guardando..." : selectedCourse ? "Actualizar curso" : "Crear curso"}
      </button>
    </form>
  );
}
