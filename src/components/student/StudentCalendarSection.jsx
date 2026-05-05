function keyOf(dateValue) {
  const d = new Date(dateValue);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function StudentCalendarSection({ monthCursor, setMonthCursor, monthMeta, byDay }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Mi calendario</h2>
        <div className="flex gap-2">
          <button className="rounded border px-3 py-1" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>Anterior</button>
          <p className="min-w-40 text-center text-sm font-semibold capitalize">{monthMeta.label}</p>
          <button className="rounded border px-3 py-1" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>Siguiente</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">{["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((d) => <div key={d}>{d}</div>)}</div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {monthMeta.cells.map((cell, idx) => {
          if (!cell) return <div key={`e-${idx}`} className="h-24 rounded border border-transparent" />;
          const k = keyOf(cell);
          const items = byDay[k] || [];
          return <div key={k} className="h-24 overflow-auto rounded border bg-slate-50 p-1"><p className="text-xs font-semibold">{cell.getDate()}</p>{items.map((it) => <div key={it.sessionId} className="mt-1 rounded bg-cyan-100 px-1 py-0.5 text-[10px] font-medium text-cyan-800"><p>{it.groupName}</p></div>)}</div>;
        })}
      </div>
    </div>
  );
}
