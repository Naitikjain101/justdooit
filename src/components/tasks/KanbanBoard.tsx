import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { taskService } from "@/services/taskService";
import { TASK_STATUSES, type Task, type TaskStatus } from "@/types/task";
import { FlowRail } from "./FlowRail";
import { formatDate } from "@/utils/date";

interface Props {
  tasks: Task[];
  onDelete: (task: Task) => void;
  onCreate: () => void;
}

const COLUMN_META: Record<
  TaskStatus,
  { dot: string; tint: string; chip: string; ring: string }
> = {
  Open: {
    dot: "bg-status-open",
    tint: "bg-status-open-bg/40",
    chip: "bg-status-open-bg text-status-open",
    ring: "ring-status-open/40",
  },
  "In Progress": {
    dot: "bg-status-progress",
    tint: "bg-status-progress-bg/40",
    chip: "bg-status-progress-bg text-status-progress",
    ring: "ring-status-progress/40",
  },
  Completed: {
    dot: "bg-status-completed",
    tint: "bg-status-completed-bg/40",
    chip: "bg-status-completed-bg text-status-completed",
    ring: "ring-status-completed/40",
  },
};

export function KanbanBoard({ tasks, onDelete, onCreate }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);

  const byStatus = (s: TaskStatus) => tasks.filter((t) => t.status === s);

  const handleDrop = (status: TaskStatus) => {
    if (!dragId) return;
    const task = taskService.get(dragId);
    setDragId(null);
    setOverCol(null);
    if (!task || task.status === status) return;
    taskService.update(task.id, { ...task, status });
    toast.success(`Moved to ${status}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const col = byStatus(status);
        const meta = COLUMN_META[status];
        const isOver = overCol === status;
        return (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              if (overCol !== status) setOverCol(status);
            }}
            onDragLeave={(e) => {
              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
              setOverCol((c) => (c === status ? null : c));
            }}
            onDrop={() => handleDrop(status)}
            className={`flex flex-col rounded-xl border bg-card/60 backdrop-blur-sm transition-all ${
              isOver
                ? `border-transparent ring-2 ${meta.ring} ${meta.tint}`
                : "border-border"
            }`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                  {status}
                </h3>
                <span
                  className={`mono rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${meta.chip}`}
                >
                  {col.length}
                </span>
              </div>
              {status === "Open" && (
                <button
                  type="button"
                  onClick={onCreate}
                  aria-label="New task"
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-primary-tint hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Column body */}
            <div className="flex min-h-[180px] flex-1 flex-col gap-2 p-3">
              {col.length === 0 ? (
                <div
                  className={`grid flex-1 place-items-center rounded-lg border border-dashed border-border/70 px-3 py-8 text-center text-xs text-muted-foreground ${
                    isOver ? "border-transparent" : ""
                  }`}
                >
                  {isOver ? "Release to move here" : "No tasks"}
                </div>
              ) : (
                col.map((t) => (
                  <KanbanCard
                    key={t.id}
                    task={t}
                    onDelete={() => onDelete(t)}
                    onDragStart={() => setDragId(t.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                    dragging={dragId === t.id}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({
  task,
  onDelete,
  onDragStart,
  onDragEnd,
  dragging,
}: {
  task: Task;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  dragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`group relative overflow-hidden rounded-lg border border-border bg-card p-3 pl-4 shadow-soft transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-card ${
        dragging ? "opacity-40" : ""
      }`}
    >
      <FlowRail status={task.status} />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {task.id}
          </div>
          <Link
            to="/task/$id"
            params={{ id: task.id }}
            className="mt-0.5 block truncate font-display text-[14px] font-semibold leading-snug text-foreground hover:text-primary"
          >
            {task.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {task.description}
          </p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Avatar name={task.owner} />
          <span className="truncate max-w-[110px]">{task.owner}</span>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Link
            to="/task/$id"
            params={{ id: task.id }}
            aria-label="View"
            className="rounded p-1 text-muted-foreground hover:bg-primary-tint hover:text-primary"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/task/$id/edit"
            params={{ id: task.id }}
            aria-label="Edit"
            className="rounded p-1 text-muted-foreground hover:bg-primary-tint hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete"
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mono mt-1 text-[10px] text-muted-foreground/70">
        {formatDate(task.updatedDate)}
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="mono grid h-5 w-5 place-items-center rounded-full bg-primary-tint text-[9px] font-semibold text-primary">
      {initials}
    </span>
  );
}
