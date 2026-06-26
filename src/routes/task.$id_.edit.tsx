import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTasks } from "@/hooks/useTasks";
import { taskService } from "@/services/taskService";
import { TaskForm } from "@/components/tasks/TaskForm";
import { PageHeader } from "./index";

export const Route = createFileRoute("/task/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit Task — TaskFlow" },
      { name: "description", content: "Edit task details." },
      { property: "og:title", content: "Edit Task — TaskFlow" },
      { property: "og:description", content: "Edit task details." },
    ],
  }),
  component: EditTaskPage,
});

function EditTaskPage() {
  const { id } = Route.useParams();
  const tasks = useTasks();
  const task = tasks.find((t) => t.id === id);
  const navigate = useNavigate();

  if (!task) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
        <h2 className="font-display text-xl font-semibold text-foreground">Task not found</h2>
        <Link
          to="/tasks"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
        >
          Back to task list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit task" subtitle={`Updating ${task.id}`} />
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft md:p-8">
        <TaskForm
          initial={task}
          submitLabel="Save Changes"
          onSubmit={(draft) => {
            const updated = taskService.update(task.id, draft);
            if (updated) {
              toast.success("Task updated");
              navigate({ to: "/task/$id", params: { id: task.id } });
            }
          }}
          onCancel={() => navigate({ to: "/task/$id", params: { id: task.id } })}
        />
      </div>
    </div>
  );
}
