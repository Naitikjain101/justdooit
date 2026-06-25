import type { Task, TaskDraft } from "@/types/task";
import { nextTaskId } from "@/utils/id";

const STORAGE_KEY = "taskflow.tasks";
const SEEDED_KEY = "taskflow.seeded";

const SAMPLES: Task[] = [
  {
    id: "TA1001",
    title: "Login Page",
    description: "Create a login page for the application",
    status: "Open",
    owner: "Aayush Sharma",
    createdDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "TA1002",
    title: "Signup Page",
    description: "Create a signup page for the application",
    status: "In Progress",
    owner: "Diya Agarwal",
    createdDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "TA1003",
    title: "Forgot Password",
    description: "Create forgot password workflow",
    status: "Completed",
    owner: "Rahul Verma",
    createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

const isBrowser = () => typeof window !== "undefined";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

let cache: Task[] = [];
let cacheRaw: string | null = "__init__";

function read(): Task[] {
  if (!isBrowser()) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cacheRaw) return cache;
    cacheRaw = raw;
    if (!raw) {
      cache = [];
      return cache;
    }
    const parsed = JSON.parse(raw) as Task[];
    cache = Array.isArray(parsed) ? parsed : [];
    return cache;
  } catch {
    cache = [];
    return cache;
  }
}

function write(tasks: Task[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  emit();
}

export const taskService = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  ensureSeeded() {
    if (!isBrowser()) return;
    if (localStorage.getItem(SEEDED_KEY)) return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      write(SAMPLES);
    }
    localStorage.setItem(SEEDED_KEY, "1");
  },

  list(): Task[] {
    return read();
  },

  get(id: string): Task | undefined {
    return read().find((t) => t.id === id);
  },

  create(draft: TaskDraft): Task {
    const tasks = read();
    const now = new Date().toISOString();
    const task: Task = {
      ...draft,
      id: nextTaskId(tasks),
      createdDate: now,
      updatedDate: now,
    };
    write([task, ...tasks]);
    return task;
  },

  update(id: string, draft: TaskDraft): Task | undefined {
    const tasks = read();
    const i = tasks.findIndex((t) => t.id === id);
    if (i < 0) return undefined;
    const updated: Task = { ...tasks[i], ...draft, updatedDate: new Date().toISOString() };
    tasks[i] = updated;
    write(tasks);
    return updated;
  },

  remove(id: string) {
    write(read().filter((t) => t.id !== id));
  },

  replaceAll(tasks: Task[]) {
    write(tasks);
  },

  mergeImport(newTasks: Task[]) {
    write([...newTasks, ...read()]);
  },
};
