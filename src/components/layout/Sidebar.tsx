import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Plus, ListChecks, Settings, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/task/new", label: "Create Task", icon: Plus },
  { to: "/tasks", label: "Task List", icon: ListChecks },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/"));

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-white transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight">TaskFlow</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white shadow-soft"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-[11px] text-white/40">
          <p className="mono">Shortcuts</p>
          <p className="mt-1">
            <span className="mono rounded bg-white/10 px-1.5 py-0.5 text-white/70">⌘N</span>{" "}
            New task
          </p>
          <p className="mt-1">
            <span className="mono rounded bg-white/10 px-1.5 py-0.5 text-white/70">⌘F</span>{" "}
            Search tasks
          </p>
        </div>
      </aside>
    </>
  );
}

function Logo() {
  return (
    <div className="grid h-8 w-8 place-items-center rounded-md bg-primary">
      <svg viewBox="0 0 20 20" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M3 6h10" />
        <path d="M3 10h14" />
        <path d="M3 14h7" />
      </svg>
    </div>
  );
}
