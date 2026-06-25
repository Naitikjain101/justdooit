import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

/** Global keyboard shortcuts: Ctrl/Cmd+N → new task, Ctrl/Cmd+F → focus search on /tasks. */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "n") {
        e.preventDefault();
        navigate({ to: "/task/new" });
      } else if (key === "f") {
        if (pathname !== "/tasks") {
          e.preventDefault();
          navigate({ to: "/tasks" });
          setTimeout(() => {
            const el = document.getElementById("tasks-search") as HTMLInputElement | null;
            el?.focus();
          }, 50);
        } else {
          const el = document.getElementById("tasks-search") as HTMLInputElement | null;
          if (el) {
            e.preventDefault();
            el.focus();
            el.select();
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, pathname]);
}
