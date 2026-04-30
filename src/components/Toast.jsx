export default function Toast({ toast }) {
  if (!toast) return null;
  const styles = toast.type === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-rose-200 bg-rose-50 text-rose-800";
  return <div className={`fixed right-4 top-4 z-[80] rounded-xl border px-4 py-3 text-sm shadow-lg ${styles}`}>{toast.message}</div>;
}
