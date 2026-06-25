import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTasks } from "@/hooks/useTasks";
import { taskService } from "@/services/taskService";
import { FlowRail } from "@/components/tasks/FlowRail";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { formatDateTime } from "@/utils/date";

export const Route = createFileRoute("/task/$id")({
  head: () => ({
    meta: [
      { title: "Task — TaskFlow" },
      { name: "description", content: "Task details." },
      { property: "og:title", content: "Task — TaskFlow" },
      { property: "og:description", content: "Task details." },
    ],
  }),
  component: TaskDetailsPage,
});

function TaskDetailsPage() {
  const { id } = Route.useParams();
  const tasks = useTasks();
  const task = tasks.find((t) => t.id === id);
  const navigate = useNavigate();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  if (!task) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <h2 className="font-display text-xl font-semibold text-foreground">Task not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't find a task with the ID <span className="mono">{id}</span>.
          </p>
          <Link
            to="/tasks"
            className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Back to task list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.history.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card md:p-8">
        <FlowRail status={task.status} />

        <div className="grid gap-4 sm:flex sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mono text-xs text-muted-foreground">{task.id}</div>
            <h1 className="mt-1 font-display text-2xl font-bold text-foreground sm:text-3xl">
              {task.title}
            </h1>
            <div className="mt-3"><StatusBadge status={task.status} size="md" /></div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/task/$id/edit"
              params={{ id: task.id }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <button
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Description
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {task.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
          <Field label="Owner" value={task.owner} />
          <Field label="Created" value={formatDateTime(task.createdDate)} mono />
          <Field label="Updated" value={formatDateTime(task.updatedDate)} mono />
        </div>
      </div>

      <ConfirmModal
        open={confirming}
        title="Delete this task?"
        description={`"${task.title}" will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          taskService.remove(task.id);
          toast.success("Task deleted");
          navigate({ to: "/tasks" });
        }}
      />
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-sm text-foreground ${mono ? "mono" : ""}`}>{value}</p>
    </div>
  );
}
