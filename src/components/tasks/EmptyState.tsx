import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
  illustration?: "tasks" | "search";
}

export function EmptyState({ title, description, action, illustration = "tasks" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-2xl bg-primary-tint">
        {illustration === "tasks" ? <TasksSvg /> : <SearchSvg />}
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function TasksSvg() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}>
      <rect x="10" y="14" width="44" height="38" rx="6" />
      <path d="M18 26h28M18 34h20M18 42h14" strokeLinecap="round" />
      <circle cx="48" cy="42" r="6" fill="currentColor" opacity="0.15" />
      <path d="M45 42l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchSvg() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}>
      <circle cx="28" cy="28" r="14" />
      <path d="M40 40l10 10" strokeLinecap="round" />
    </svg>
  );
}
