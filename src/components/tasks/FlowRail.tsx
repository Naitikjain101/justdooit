import type { TaskStatus } from "@/types/task";

const FILL: Record<TaskStatus, number> = {
  Open: 1 / 3,
  "In Progress": 2 / 3,
  Completed: 1,
};

const COLOR: Record<TaskStatus, string> = {
  Open: "var(--status-open)",
  "In Progress": "var(--status-progress)",
  Completed: "var(--status-completed)",
};

/**
 * Signature element — the "Flow Rail".
 * A thin vertical bar on the left edge of cards/rows that fills
 * 1/3 (Open), 2/3 (In Progress), or 100% (Completed) in the matching status color.
 */
export function FlowRail({ status, className = "" }: { status: TaskStatus; className?: string }) {
  const pct = Math.round(FILL[status] * 100);
  return (
    <div
      aria-hidden
      className={`absolute left-0 top-0 bottom-0 w-[3px] overflow-hidden rounded-l-[inherit] bg-border/40 ${className}`}
    >
      <div
        className="absolute left-0 top-0 w-full transition-[height] duration-300 ease-out"
        style={{ height: `${pct}%`, backgroundColor: COLOR[status] }}
      />
    </div>
  );
}
