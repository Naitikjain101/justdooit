import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";
import { FlowRail } from "./FlowRail";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/utils/date";

interface Props {
  tasks: Task[];
  onDelete: (task: Task) => void;
}

export function TaskTable({ tasks, onDelete }: Props) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-soft md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr
                key={t.id}
                className="relative border-b border-border last:border-0 transition-colors hover:bg-muted/30"
              >
                <td className="relative px-4 py-3.5">
                  <FlowRail status={t.status} className="!rounded-none" />
                  <span className="mono text-xs text-muted-foreground">{t.id}</span>
                </td>
                <td className="px-4 py-3.5">
                  <Link
                    to="/task/$id"
                    params={{ id: t.id }}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {t.title}
                  </Link>
                </td>
                <td className="px-4 py-3.5 max-w-[280px]">
                  <p
                    className="truncate text-muted-foreground"
                    title={t.description}
                  >
                    {t.description}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{t.owner}</td>
                <td className="mono px-4 py-3.5 text-xs text-muted-foreground">
                  {formatDate(t.createdDate)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1">
                    <IconAction to={`/task/${t.id}`} label="View" icon={Eye} />
                    <IconAction to={`/task/${t.id}/edit`} label="Edit" icon={Pencil} />
                    <button
                      type="button"
                      onClick={() => onDelete(t)}
                      aria-label="Delete"
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-4 pl-5 shadow-soft"
          >
            <FlowRail status={t.status} />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="mono text-[11px] text-muted-foreground">{t.id}</div>
                <Link
                  to="/task/$id"
                  params={{ id: t.id }}
                  className="block truncate font-display font-semibold text-foreground"
                >
                  {t.title}
                </Link>
              </div>
              <StatusBadge status={t.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {t.owner} · <span className="mono">{formatDate(t.createdDate)}</span>
              </div>
              <div className="flex gap-1">
                <IconAction to={`/task/${t.id}`} label="View" icon={Eye} />
                <IconAction to={`/task/${t.id}/edit`} label="Edit" icon={Pencil} />
                <button
                  type="button"
                  onClick={() => onDelete(t)}
                  aria-label="Delete"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function IconAction({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: typeof Eye;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary-tint hover:text-primary"
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}
