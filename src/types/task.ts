export type TaskStatus = "Open" | "In Progress" | "Completed";

export const TASK_STATUSES: TaskStatus[] = ["Open", "In Progress", "Completed"];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  owner: string;
  createdDate: string; // ISO
  updatedDate: string; // ISO
}

export type TaskDraft = Omit<Task, "id" | "createdDate" | "updatedDate">;

export type SortOrder = "newest" | "oldest";
export type StatusFilter = "All" | TaskStatus;
