import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ListChecks, Circle, Clock, CheckCircle2, Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { StatCard } from "@/components/tasks/StatCard";
import { StatsProgressBar } from "@/components/tasks/StatsProgressBar";
import { TaskCard } from "@/components/tasks/TaskCard";
import { EmptyState } from "@/components/tasks/EmptyState";
import { LoadingSkeleton } from "@/components/tasks/LoadingSkeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TaskFlow" },
      { name: "description", content: "Your task overview: open, in progress, and completed work." },
      { property: "og:title", content: "Dashboard — TaskFlow" },
      { property: "og:description", content: "Your task overview at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const tasks = useTasks();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => {
    const open = tasks.filter((t) => t.status === "Open").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    return { total: tasks.length, open, inProgress, completed };
  }, [tasks]);

  const recent = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => +new Date(b.updatedDate) - +new Date(a.updatedDate))
        .slice(0, 5),
    [tasks],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="A calm overview of work moving through your flow."
        action={
          <Link
            to="/task/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" /> Create New Task
          </Link>
        }
      />

      {!ready ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-[110px]" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Get the flow started by creating your first task. It'll appear here and on the task list."
          action={
            <Link
              to="/task/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" /> Create First Task
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Tasks" value={stats.total} icon={ListChecks} accent="violet" />
            <StatCard label="Open" value={stats.open} icon={Circle} accent="open" />
            <StatCard label="In Progress" value={stats.inProgress} icon={Clock} accent="progress" />
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              accent="completed"
            />
          </div>

          <StatsProgressBar
            open={stats.open}
            inProgress={stats.inProgress}
            completed={stats.completed}
          />

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Recent tasks</h2>
              <Link
                to="/tasks"
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-2.5">
              {recent.map((t) => (
                <TaskCard key={t.id} task={t} compact />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="min-w-0">
        <h1 className="truncate font-display text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
