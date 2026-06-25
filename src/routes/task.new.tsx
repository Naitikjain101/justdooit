import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { TaskForm } from "@/components/tasks/TaskForm";
import { taskService } from "@/services/taskService";
import { useTasks } from "@/hooks/useTasks";
import { previewNextId } from "@/utils/id";
import { PageHeader } from "./index";

export const Route = createFileRoute("/task/new")({
  head: () => ({
    meta: [
      { title: "Create Task — TaskFlow" },
      { name: "description", content: "Add a new task to your TaskFlow workspace." },
      { property: "og:title", content: "Create Task — TaskFlow" },
      { property: "og:description", content: "Add a new task." },
    ],
  }),
  component: NewTaskPage,
});

function NewTaskPage() {
  const tasks = useTasks();
  const navigate = useNavigate();
  const router = useRouter();
  const nextId = useMemo(() => previewNextId(tasks), [tasks]);

  return (
    <div className="space-y-6">
      <PageHeader title="Create a task" subtitle="Capture the work; we'll route the flow." />
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft md:p-8">
        <TaskForm
          previewId={nextId}
          submitLabel="Save Task"
          showReset
          onSubmit={(draft) => {
            const created = taskService.create(draft);
            toast.success(`Task created · ${created.id}`);
            navigate({ to: "/tasks" });
          }}
          onCancel={() => router.history.back()}
        />
      </div>
    </div>
  );
}
