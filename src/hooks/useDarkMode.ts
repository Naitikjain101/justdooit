import { useEffect, useState, useCallback } from "react";

const KEY = "taskflow.theme";

function getInitial(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(KEY);
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return true;
}

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = getInitial();
    setDark(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(KEY, dark ? "dark" : "light");
  }, [dark, ready]);

  const toggle = useCallback(() => setDark((v) => !v), []);
  return { dark, toggle };
}
