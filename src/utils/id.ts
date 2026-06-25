import type { Task } from "@/types/task";

const PREFIX = "TA";
const START = 1001;

/**
 * Generate the next sequential task ID.
 * Scans existing IDs of the form "TA<number>", takes the max, and adds one.
 * Handles gaps (missing IDs) and starts fresh at TA1001 when empty.
 */
export function nextTaskId(tasks: Task[]): string {
  const max = tasks.reduce((acc, t) => {
    const m = /^TA(\d+)$/.exec(t.id);
    if (!m) return acc;
    const n = parseInt(m[1], 10);
    return n > acc ? n : acc;
  }, START - 1);
  return `${PREFIX}${max + 1}`;
}

export function previewNextId(tasks: Task[]): string {
  return nextTaskId(tasks);
}
