import { useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";

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
  status: "PUBLIC",
  categoryIds: [],
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
const statusOptions = [
  { value: "PUBLIC", label: "Publico" },
  { value: "PRIVATE", label: "Privado" },
  { value: "DISABLED", label: "Inhabilitado" },
];

function hydrateCourse(course) {
  const next = { ...initialForm, ...course };
  next.sessionCount = Number(course?.sessionCount) || 1;
  next.hoursPerSession = Number(course?.hoursPerSession) || 1;
  next.currency = String(course?.currency || "PEN");
  next.priceAmount = course?.priceAmount != null ? String(course.priceAmount) : "";
  next.categoryIds = Array.isArray(course?.categories)
    ? course.categories.map((row) => row.categoryId || row.category?.id).filter(Boolean)
    : [];
  return next;
}

export default function AdminCourseForm({
  selectedCourse,
  onSubmit,
  categories = [],
  onCancel,
  busy,
}) {
  const [form, setForm] = useState(initialForm);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [categoryError, setCategoryError] = useState("");
  useEffect(() => {
    setForm(selectedCourse ? hydrateCourse(selectedCourse) : { ...initialForm });
  }, [selectedCourse]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((c) => ({ ...c, [name]: type === "checkbox" ? checked : value }));
  }

  const selectedCategories = useMemo(
    () => categories.filter((category) => form.categoryIds.includes(category.id)),
    [categories, form.categoryIds],
  );

  const filteredCategories = useMemo(() => {
    const query = categoryQuery.trim().toLowerCase();
    return categories
      .filter((category) => !form.categoryIds.includes(category.id))
      .filter((category) => !query || category.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [categories, form.categoryIds, categoryQuery]);

  function addCategory(categoryId) {
    setCategoryError("");
    setForm((current) => {
      if (current.categoryIds.includes(categoryId)) return current;
      if (current.categoryIds.length >= 3) {
        setCategoryError("Solo puedes seleccionar hasta 3 categorias.");
        return current;
      }
      return { ...current, categoryIds: [...current.categoryIds, categoryId] };
    });
    setCategoryQuery("");
  }

  function removeCategory(categoryId) {
    setCategoryError("");
    setForm((current) => ({ ...current, categoryIds: current.categoryIds.filter((id) => id !== categoryId) }));
  }

  return (
    <form
      className="space-y-3 rounded-2xl border bg-white p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (form.categoryIds.length < 1) {
          setCategoryError("Debes seleccionar al menos 1 categoria.");
          return;
        }
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
          status: form.status,
          categoryIds: form.categoryIds,
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
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Categorias (1 a 3)</p>
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <span key={category.id} className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
              {category.name}
              <button type="button" className="text-cyan-700" onClick={() => removeCategory(category.id)}>
                <FaTimes />
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            className="w-full rounded-lg border p-2"
            placeholder="Buscar categoria..."
            value={categoryQuery}
            onChange={(e) => setCategoryQuery(e.target.value)}
          />
          {categoryQuery.trim() ? (
            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
              {filteredCategories.length ? (
                filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className="block w-full border-b px-3 py-2 text-left text-sm hover:bg-slate-50 last:border-b-0"
                    onClick={() => addCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-slate-500">Sin resultados</p>
              )}
            </div>
          ) : null}
        </div>
        {categoryError ? <p className="text-xs text-rose-600">{categoryError}</p> : null}
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
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
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
