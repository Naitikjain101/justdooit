import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent: "violet" | "open" | "progress" | "completed";
}

const ACCENT: Record<Props["accent"], { bar: string; iconBg: string; iconFg: string }> = {
  violet: {
    bar: "bg-primary",
    iconBg: "bg-primary-tint",
    iconFg: "text-primary",
  },
  open: {
    bar: "bg-status-open",
    iconBg: "bg-status-open-bg",
    iconFg: "text-status-open",
  },
  progress: {
    bar: "bg-status-progress",
    iconBg: "bg-status-progress-bg",
    iconFg: "text-status-progress",
  },
  completed: {
    bar: "bg-status-completed",
    iconBg: "bg-status-completed-bg",
    iconFg: "text-status-completed",
  },
};

export function StatCard({ label, value, icon: Icon, accent }: Props) {
  const a = ACCENT[accent];
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-card">
      <div className={`absolute left-0 top-0 h-full w-[3px] ${a.bar}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mono mt-2 text-3xl font-semibold text-foreground tabular-nums">{value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${a.iconBg}`}>
          <Icon className={`h-5 w-5 ${a.iconFg}`} />
        </div>
      </div>
    </div>
  );
}
