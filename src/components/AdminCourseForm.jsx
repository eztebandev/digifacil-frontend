import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTimes, FaTrashAlt } from "react-icons/fa";

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
  detail: {
    studentProfile: "",
    outcomes: "",
    methodology: "",
    instructorName: "",
    instructorBio: "",
    instructorPhotoUrl: "",
  },
  syllabusItems: [],
  faqs: [],
  testimonials: [],
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
  next.detail = { ...initialForm.detail, ...(course?.detail || {}) };
  next.sessionCount = Number(course?.sessionCount) || 1;
  next.hoursPerSession = Number(course?.hoursPerSession) || 1;
  next.currency = String(course?.currency || "PEN");
  next.priceAmount = course?.priceAmount != null ? String(course.priceAmount) : "";
  next.categoryIds = Array.isArray(course?.categories)
    ? course.categories.map((row) => row.categoryId || row.category?.id).filter(Boolean)
    : [];
  next.syllabusItems = Array.isArray(course?.syllabusItems)
    ? course.syllabusItems.map((item) => ({
        title: item.title || "",
        description: item.description || "",
      }))
    : [];
  next.faqs = Array.isArray(course?.faqs)
    ? course.faqs.map((item) => ({
        question: item.question || "",
        answer: item.answer || "",
      }))
    : [];
  next.testimonials = Array.isArray(course?.testimonials)
    ? course.testimonials.map((item) => ({
        studentName: item.studentName || "",
        content: item.content || "",
        imageUrl: item.imageUrl || "",
        workUrl: item.workUrl || "",
      }))
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

  function updateDetail(name, value) {
    setForm((current) => ({
      ...current,
      detail: {
        ...current.detail,
        [name]: value,
      },
    }));
  }

  function addListItem(key, item) {
    setForm((current) => ({ ...current, [key]: [...current[key], item] }));
  }

  function updateListItem(key, index, name, value) {
    setForm((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [name]: value } : item,
      ),
    }));
  }

  function removeListItem(key, index) {
    setForm((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
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
          detail: {
            studentProfile: form.detail.studentProfile,
            outcomes: form.detail.outcomes,
            methodology: form.detail.methodology,
            instructorName: form.detail.instructorName,
            instructorBio: form.detail.instructorBio,
            instructorPhotoUrl: form.detail.instructorPhotoUrl?.trim() || null,
          },
          syllabusItems: form.syllabusItems,
          faqs: form.faqs,
          testimonials: form.testimonials,
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

      <section className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div>
          <h3 className="font-semibold text-slate-900">Detalle para el modal</h3>
          <p className="text-xs text-slate-500">Esta informacion aparece solo cuando el visitante abre los detalles del curso.</p>
        </div>
        <textarea
          className="w-full rounded-lg border p-2"
          rows="3"
          placeholder="Perfil del estudiante"
          value={form.detail.studentProfile}
          onChange={(e) => updateDetail("studentProfile", e.target.value)}
        />
        <textarea
          className="w-full rounded-lg border p-2"
          rows="3"
          placeholder="Resultados que obtendra"
          value={form.detail.outcomes}
          onChange={(e) => updateDetail("outcomes", e.target.value)}
        />
        <textarea
          className="w-full rounded-lg border p-2"
          rows="3"
          placeholder="Metodologia de ensenanza"
          value={form.detail.methodology}
          onChange={(e) => updateDetail("methodology", e.target.value)}
        />
        <div className="grid gap-2 md:grid-cols-2">
          <input
            className="rounded-lg border p-2"
            placeholder="Nombre del instructor"
            value={form.detail.instructorName}
            onChange={(e) => updateDetail("instructorName", e.target.value)}
          />
          <input
            className="rounded-lg border p-2"
            type="url"
            placeholder="Foto del instructor (URL)"
            value={form.detail.instructorPhotoUrl}
            onChange={(e) => updateDetail("instructorPhotoUrl", e.target.value)}
          />
        </div>
        <textarea
          className="w-full rounded-lg border p-2"
          rows="3"
          placeholder="Bio o datos del instructor"
          value={form.detail.instructorBio}
          onChange={(e) => updateDetail("instructorBio", e.target.value)}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">Temario por sesiones</h3>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
            onClick={() => addListItem("syllabusItems", { title: "", description: "" })}
          >
            <FaPlus />
            Sesion
          </button>
        </div>
        {form.syllabusItems.map((item, index) => (
          <div className="grid gap-2 rounded-lg bg-slate-50 p-3" key={`syllabus-${index}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-700">Sesion {index + 1}</p>
              <button type="button" className="text-rose-600" onClick={() => removeListItem("syllabusItems", index)}>
                <FaTrashAlt />
              </button>
            </div>
            <input
              className="rounded-lg border p-2"
              placeholder="Titulo de la sesion"
              value={item.title}
              onChange={(e) => updateListItem("syllabusItems", index, "title", e.target.value)}
            />
            <textarea
              className="rounded-lg border p-2"
              rows="2"
              placeholder="Descripcion de la sesion"
              value={item.description}
              onChange={(e) => updateListItem("syllabusItems", index, "description", e.target.value)}
            />
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">Preguntas frecuentes</h3>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
            onClick={() => addListItem("faqs", { question: "", answer: "" })}
          >
            <FaPlus />
            FAQ
          </button>
        </div>
        {form.faqs.map((item, index) => (
          <div className="grid gap-2 rounded-lg bg-slate-50 p-3" key={`faq-${index}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-700">Pregunta {index + 1}</p>
              <button type="button" className="text-rose-600" onClick={() => removeListItem("faqs", index)}>
                <FaTrashAlt />
              </button>
            </div>
            <input
              className="rounded-lg border p-2"
              placeholder="Pregunta"
              value={item.question}
              onChange={(e) => updateListItem("faqs", index, "question", e.target.value)}
            />
            <textarea
              className="rounded-lg border p-2"
              rows="2"
              placeholder="Respuesta"
              value={item.answer}
              onChange={(e) => updateListItem("faqs", index, "answer", e.target.value)}
            />
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">Testimonios o trabajos</h3>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
            onClick={() => addListItem("testimonials", { studentName: "", content: "", imageUrl: "", workUrl: "" })}
          >
            <FaPlus />
            Testimonio
          </button>
        </div>
        {form.testimonials.map((item, index) => (
          <div className="grid gap-2 rounded-lg bg-slate-50 p-3" key={`testimonial-${index}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-700">Testimonio {index + 1}</p>
              <button type="button" className="text-rose-600" onClick={() => removeListItem("testimonials", index)}>
                <FaTrashAlt />
              </button>
            </div>
            <input
              className="rounded-lg border p-2"
              placeholder="Nombre del alumno"
              value={item.studentName}
              onChange={(e) => updateListItem("testimonials", index, "studentName", e.target.value)}
            />
            <textarea
              className="rounded-lg border p-2"
              rows="2"
              placeholder="Testimonio o descripcion del trabajo"
              value={item.content}
              onChange={(e) => updateListItem("testimonials", index, "content", e.target.value)}
            />
            <div className="grid gap-2 md:grid-cols-2">
              <input
                className="rounded-lg border p-2"
                type="url"
                placeholder="Imagen del trabajo (URL)"
                value={item.imageUrl}
                onChange={(e) => updateListItem("testimonials", index, "imageUrl", e.target.value)}
              />
              <input
                className="rounded-lg border p-2"
                type="url"
                placeholder="Link del trabajo (URL)"
                value={item.workUrl}
                onChange={(e) => updateListItem("testimonials", index, "workUrl", e.target.value)}
              />
            </div>
          </div>
        ))}
      </section>
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
