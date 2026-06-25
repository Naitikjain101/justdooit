import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, Moon, Sun, Search } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { formatToday } from "@/utils/date";

interface Props {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: Props) {
  const { dark, toggle } = useDarkMode();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/tasks", search: q ? { q } : undefined } as never);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden sm:block">
        <p className="mono text-xs text-muted-foreground">{formatToday()}</p>
      </div>

      <form onSubmit={submit} className="ml-auto flex flex-1 max-w-md items-center">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to a task…"
            className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </form>

      <button
        type="button"
        onClick={toggle}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Toggle dark mode"
      >
        {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
      </button>

      <div
        className="grid h-9 w-9 place-items-center rounded-full bg-primary-tint mono text-xs font-semibold text-primary"
        aria-label="Profile"
      >
        AS
      </div>
    </header>
  );
}
