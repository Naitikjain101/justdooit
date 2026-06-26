import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Plus, Search, Upload, Download, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { useTasks } from "@/hooks/useTasks";
import { taskService } from "@/services/taskService";
import { TaskTable } from "@/components/tasks/TaskTable";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { EmptyState } from "@/components/tasks/EmptyState";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { PageHeader } from "./index";
import { csvToTasks, downloadCsv, tasksToCsv } from "@/utils/csv";
import type { Task } from "@/types/task";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task List — TaskFlow" },
      { name: "description", content: "Search, filter, sort, and manage all your tasks." },
      { property: "og:title", content: "Task List — TaskFlow" },
      { property: "og:description", content: "Manage every task in your flow." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
  }),
  component: TaskListPage,
});

const PAGE_SIZE = 10;

function TaskListPage() {
  const tasks = useTasks();
  const { q: initialQ } = Route.useSearch();
  const navigate = useNavigate();

type ViewMode = "board" | "list";

function TaskListPage() {
  const tasks = useTasks();
  const { q: initialQ } = Route.useSearch();
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQ ?? "");
  const [view, setView] = useState<ViewMode>("board");
  const [toDelete, setToDelete] = useState<Task | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.owner.toLowerCase().includes(q),
    );
  }, [tasks, query]);

  const resetFilters = () => {
    setQuery("");
    navigate({ to: "/tasks", search: {} });
  };

  const handleExport = () => {
    if (!tasks.length) {
      toast("Nothing to export");
      return;
    }
    downloadCsv(`taskflow-${new Date().toISOString().slice(0, 10)}.csv`, tasksToCsv(tasks));
    toast.success(`Exported ${tasks.length} task${tasks.length === 1 ? "" : "s"}`);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const result = csvToTasks(text, taskService.list());
    if (result.tasks.length) taskService.mergeImport(result.tasks);
    toast.success(
      `Imported ${result.imported} task${result.imported === 1 ? "" : "s"}${
        result.skipped ? ` · skipped ${result.skipped}` : ""
      }`,
    );
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} task${tasks.length === 1 ? "" : "s"} in your workspace`}
        action={
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleImport}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Upload className="h-4 w-4" /> <span className="hidden sm:inline">Import</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/task/new" })}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        }
      />

      {/* Controls */}
      <div className="rounded-xl border border-border bg-card p-3 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="tasks-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID, title, or owner…"
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="inline-flex rounded-md border border-border bg-background p-0.5">
            <button
              onClick={() => setView("board")}
              aria-pressed={view === "board"}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "board"
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Board
            </button>
            <button
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "list"
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to begin."
          action={
            <button
              onClick={() => navigate({ to: "/task/new" })}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" /> Create Task
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No tasks match your search"
          description="Try a different search term or clear it to see all tasks."
          illustration="search"
          action={
            <button
              onClick={resetFilters}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Clear search
            </button>
          }
        />
      ) : view === "board" ? (
        <KanbanBoard
          tasks={filtered}
          onDelete={setToDelete}
          onCreate={() => navigate({ to: "/task/new" })}
        />
      ) : (
        <TaskTable tasks={filtered} onDelete={setToDelete} />
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete this task?"
        description={toDelete ? `"${toDelete.title}" will be permanently removed.` : ""}
        confirmLabel="Delete"
        destructive
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            taskService.remove(toDelete.id);
            toast.success("Task deleted");
          }
          setToDelete(null);
        }}
      />
    </div>
  );
}
