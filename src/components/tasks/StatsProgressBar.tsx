interface Props {
  open: number;
  inProgress: number;
  completed: number;
}

export function StatsProgressBar({ open, inProgress, completed }: Props) {
  const total = Math.max(open + inProgress + completed, 1);
  const o = (open / total) * 100;
  const p = (inProgress / total) * 100;
  const c = (completed / total) * 100;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-foreground">Status distribution</h3>
        <span className="mono text-xs text-muted-foreground">{open + inProgress + completed} total</span>
      </div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-status-open transition-[width] duration-500"
          style={{ width: `${o}%` }}
        />
        <div
          className="h-full bg-status-progress transition-[width] duration-500"
          style={{ width: `${p}%` }}
        />
        <div
          className="h-full bg-status-completed transition-[width] duration-500"
          style={{ width: `${c}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-open" /> Open
          <span className="mono">{open}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-progress" /> In Progress
          <span className="mono">{inProgress}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-completed" /> Completed
          <span className="mono">{completed}</span>
        </span>
      </div>
    </div>
  );
}
