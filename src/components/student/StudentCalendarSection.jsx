function keyOf(dateValue) {
  const d = new Date(dateValue);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function StudentCalendarSection({ monthCursor, setMonthCursor, monthMeta, byDay }) {
  const monthDays = monthMeta.cells.filter(Boolean);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm shadow-cyan-100/50">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="font-semibold">Mi calendario</h2>
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:w-auto">
          <button className="rounded border px-3 py-1 text-sm" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>Anterior</button>
          <p className="text-center text-sm font-semibold capitalize sm:min-w-40">{monthMeta.label}</p>
          <button className="rounded border px-3 py-1 text-sm" onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>Siguiente</button>
        </div>
      </div>
      <div className="space-y-2 md:hidden">
        {monthDays.map((day) => {
          const k = keyOf(day);
          const items = byDay[k] || [];
          return (
            <article key={k} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-800">
                {day.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
              </p>
              {items.length === 0 ? (
                <p className="mt-1 text-xs text-slate-500">Sin sesiones</p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {items.map((it) => (
                    <div key={it.sessionId} className="rounded bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-800">
                      <p className="break-words">{it.groupName}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
      <div className="-mx-1 hidden overflow-x-auto px-1 pb-1 md:block">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">{["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((d) => <div key={d}>{d}</div>)}</div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {monthMeta.cells.map((cell, idx) => {
              if (!cell) return <div key={`e-${idx}`} className="h-24 rounded border border-transparent" />;
              const k = keyOf(cell);
              const items = byDay[k] || [];
              return <div key={k} className="h-24 overflow-auto rounded border bg-slate-50 p-1"><p className="text-xs font-semibold">{cell.getDate()}</p>{items.map((it) => <div key={it.sessionId} className="mt-1 rounded bg-cyan-100 px-1 py-0.5 text-[10px] font-medium text-cyan-800"><p className="break-words">{it.groupName}</p></div>)}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
