import { Link } from "@tanstack/react-router";
import { FlowRail } from "./FlowRail";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/utils/date";
import type { Task } from "@/types/task";

export function TaskCard({ task, compact = false }: { task: Task; compact?: boolean }) {
  return (
    <Link
      to="/task/$id"
      params={{ id: task.id }}
      className="group relative block overflow-hidden rounded-xl border border-border bg-card pl-4 pr-4 py-3 shadow-soft transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-card"
    >
      <FlowRail status={task.status} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="mono text-[11px] text-muted-foreground">{task.id}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="mono text-[11px] text-muted-foreground">
              {formatDate(task.updatedDate)}
            </span>
          </div>
          <h3 className="mt-1 truncate font-display text-[15px] font-semibold text-foreground">
            {task.title}
          </h3>
          {!compact && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{task.owner}</span>
          </div>
        </div>
        <StatusBadge status={task.status} />
      </div>
    </Link>
  );
}
