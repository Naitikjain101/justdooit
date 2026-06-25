import type { TaskStatus } from "@/types/task";

const STYLES: Record<TaskStatus, { bg: string; fg: string; dot: string }> = {
  Open: {
    bg: "bg-status-open-bg",
    fg: "text-status-open",
    dot: "bg-status-open",
  },
  "In Progress": {
    bg: "bg-status-progress-bg",
    fg: "text-status-progress",
    dot: "bg-status-progress",
  },
  Completed: {
    bg: "bg-status-completed-bg",
    fg: "text-status-completed",
    dot: "bg-status-completed",
  },
};

export function StatusBadge({ status, size = "sm" }: { status: TaskStatus; size?: "sm" | "md" }) {
  const s = STYLES[status];
  const pad = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${pad} ${s.bg} ${s.fg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
