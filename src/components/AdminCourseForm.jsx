import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  level: "básico",
  modality: "En vivo por google meet",
  highlight: false,
  sessionCount: 1,
  hoursPerSession: 1,
  currency: "PEN",
  priceAmount: "",
  imageUrlSquare: "",
  imageUrlHorizontal: "",
};

const levelOptions = ["básico", "intermedio", "avanzado"];
const modalityOptions = [
  "En vivo por google meet",
  "En vivo por zoom",
  "En vivo por teams",
  "presencial",
  "a ritmo propio",
];
const currencyOptions = ["PEN", "USD", "EUR"];

function hydrateCourse(course) {
  const next = { ...initialForm, ...course };
  next.sessionCount = Number(course?.sessionCount) || 1;
  next.hoursPerSession = Number(course?.hoursPerSession) || 1;
  next.currency = String(course?.currency || "PEN");
  next.priceAmount = course?.priceAmount != null ? String(course.priceAmount) : "";
  return next;
}

export default function AdminCourseForm({
  selectedCourse,
  onSubmit,
  onCancel,
  busy,
}) {
  const [form, setForm] = useState(initialForm);
  useEffect(() => {
    setForm(selectedCourse ? hydrateCourse(selectedCourse) : { ...initialForm });
  }, [selectedCourse]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((c) => ({ ...c, [name]: type === "checkbox" ? checked : value }));
  }

  return (
    <form
      className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title: form.title,
          description: form.description,
          level: form.level,
          sessionCount: Number(form.sessionCount),
          hoursPerSession: Number(form.hoursPerSession),
          modality: form.modality,
          currency: form.currency,
          priceAmount: Number(form.priceAmount),
          imageUrlSquare: form.imageUrlSquare?.trim() || null,
          imageUrlHorizontal: form.imageUrlHorizontal?.trim() || null,
          highlight: Boolean(form.highlight),
        });
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {selectedCourse ? "Editar curso" : "Nuevo curso"}
        </h2>
      </div>
      <input
        className="w-full rounded-lg border p-2"
        name="title"
        placeholder="Titulo"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        className="w-full rounded-lg border p-2"
        name="description"
        rows="3"
        placeholder="Descripcion"
        value={form.description}
        onChange={handleChange}
        required
      />
      <div className="grid gap-2 md:grid-cols-2">
        <select
          className="rounded-lg border p-2"
          name="level"
          value={form.level}
          onChange={handleChange}
          required
        >
          {levelOptions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            className="rounded-lg border p-2"
            name="sessionCount"
            type="number"
            min="1"
            placeholder="Sesiones"
            value={form.sessionCount}
            onChange={handleChange}
            required
          />
          <input
            className="rounded-lg border p-2"
            name="hoursPerSession"
            type="number"
            min="1"
            placeholder="Horas/sesion"
            value={form.hoursPerSession}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <input
          className="rounded-lg border p-2"
          name="imageUrlSquare"
          type="url"
          placeholder="Imagen 1:1 (URL)"
          value={form.imageUrlSquare}
          onChange={handleChange}
        />
        <input
          className="rounded-lg border p-2"
          name="imageUrlHorizontal"
          type="url"
          placeholder="Imagen 16:9 (URL horizontal)"
          value={form.imageUrlHorizontal}
          onChange={handleChange}
        />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <select
          className="rounded-lg border p-2"
          name="modality"
          value={form.modality}
          onChange={handleChange}
          required
        >
          {modalityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            className="rounded-lg border p-2"
            name="priceAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Precio"
            value={form.priceAmount}
            onChange={handleChange}
            required
          />
          <select
            className="rounded-lg border p-2"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            required
          >
            {currencyOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input
          name="highlight"
          type="checkbox"
          checked={Boolean(form.highlight)}
          onChange={handleChange}
        />{" "}
        Destacado
      </label>
      <button
        className="w-full rounded-lg bg-slate-900 p-2 text-white"
        type="submit"
        disabled={busy}
      >
        {busy ? "Guardando..." : selectedCourse ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
