import type { Task, TaskStatus } from "@/types/task";
import { TASK_STATUSES } from "@/types/task";

const HEADERS = [
  "id",
  "title",
  "description",
  "status",
  "owner",
  "createdDate",
  "updatedDate",
] as const;

const escape = (v: string) => {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export function tasksToCsv(tasks: Task[]): string {
  const rows = [HEADERS.join(",")];
  for (const t of tasks) {
    rows.push(HEADERS.map((h) => escape(t[h] as string)).join(","));
  }
  return rows.join("\n");
}

/** Minimal RFC-4180-ish CSV parser supporting quoted fields with escaped quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(cur);
        cur = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      } else cur += c;
    }
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim().length));
}

export interface ImportResult {
  imported: number;
  skipped: number;
  tasks: Task[];
}

export function csvToTasks(text: string, existing: Task[]): ImportResult {
  const rows = parseCsv(text);
  if (!rows.length) return { imported: 0, skipped: 0, tasks: [] };
  const header = rows[0].map((h) => h.trim());
  const idx = (k: string) => header.indexOf(k);
  const seen = new Set(existing.map((t) => t.id));
  const out: Task[] = [];
  let skipped = 0;
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const get = (k: string) => (idx(k) >= 0 ? (row[idx(k)] ?? "").trim() : "");
    const id = get("id");
    const title = get("title");
    const description = get("description");
    const status = get("status") as TaskStatus;
    const owner = get("owner");
    if (
      !id ||
      !title ||
      !owner ||
      description.length < 10 ||
      !TASK_STATUSES.includes(status) ||
      seen.has(id)
    ) {
      skipped++;
      continue;
    }
    const now = new Date().toISOString();
    out.push({
      id,
      title,
      description,
      status,
      owner,
      createdDate: get("createdDate") || now,
      updatedDate: get("updatedDate") || now,
    });
    seen.add(id);
  }
  return { imported: out.length, skipped, tasks: out };
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
