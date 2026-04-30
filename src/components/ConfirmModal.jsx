export default function ConfirmModal({ open, title, message, onConfirm, onCancel, busy = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="rounded-xl border px-3 py-2 text-sm" onClick={onCancel}>Cancelar</button>
          <button type="button" className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60" onClick={onConfirm} disabled={busy}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}
