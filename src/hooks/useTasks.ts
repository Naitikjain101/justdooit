import { useSyncExternalStore } from "react";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types/task";

const EMPTY: Task[] = [];

export function useTasks(): Task[] {
  return useSyncExternalStore(
    (cb) => taskService.subscribe(cb),
    () => taskService.list(),
    () => EMPTY,
  );
}
