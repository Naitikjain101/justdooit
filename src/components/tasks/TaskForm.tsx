import { useState, type FormEvent } from "react";
import type { Task, TaskDraft, TaskStatus } from "@/types/task";
import { TASK_STATUSES } from "@/types/task";

interface Props {
  initial?: Task;
  previewId?: string;
  submitLabel: string;
  onSubmit: (draft: TaskDraft) => void;
  onCancel: () => void;
  showReset?: boolean;
}

interface Errors {
  title?: string;
  description?: string;
  owner?: string;
}

const empty: TaskDraft = { title: "", description: "", status: "Open", owner: "" };

export function TaskForm({
  initial,
  previewId,
  submitLabel,
  onSubmit,
  onCancel,
  showReset = false,
}: Props) {
  const initialDraft: TaskDraft = initial
    ? {
        title: initial.title,
        description: initial.description,
        status: initial.status,
        owner: initial.owner,
      }
    : empty;

  const [draft, setDraft] = useState<TaskDraft>(initialDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (d: TaskDraft): Errors => {
    const e: Errors = {};
    if (!d.title.trim()) e.title = "Title is required";
    if (!d.owner.trim()) e.owner = "Owner is required";
    if (d.description.trim().length < 10)
      e.description = "Description must be at least 10 characters";
    return e;
  };

  const update = <K extends keyof TaskDraft>(k: K, v: TaskDraft[K]) => {
    const next = { ...draft, [k]: v };
    setDraft(next);
    if (touched[k]) setErrors(validate(next));
  };

  const handleBlur = (k: keyof TaskDraft) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(draft));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = validate(draft);
    setErrors(v);
    setTouched({ title: true, description: true, owner: true });
    if (Object.keys(v).length) return;
    onSubmit({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      owner: draft.owner.trim(),
    });
  };

  const handleReset = () => {
    setDraft(initialDraft);
    setErrors({});
    setTouched({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Task ID" hint="Auto-generated, cannot be changed">
        <div className="mono flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
          {initial ? initial.id : previewId ? `Will be ${previewId}` : "—"}
        </div>
      </Field>

      <Field label="Title" required error={errors.title}>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => update("title", e.target.value)}
          onBlur={() => handleBlur("title")}
          placeholder="e.g. Build onboarding checklist"
          className={inputCls(!!errors.title)}
          aria-invalid={!!errors.title}
        />
      </Field>

      <Field
        label="Description"
        required
        error={errors.description}
        hint={`${draft.description.trim().length}/10 minimum`}
      >
        <textarea
          value={draft.description}
          onChange={(e) => update("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          rows={5}
          placeholder="Describe the task in detail…"
          className={`${inputCls(!!errors.description)} resize-y py-2 leading-relaxed`}
          aria-invalid={!!errors.description}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Status" required>
          <select
            value={draft.status}
            onChange={(e) => update("status", e.target.value as TaskStatus)}
            className={inputCls(false)}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Owner" required error={errors.owner}>
          <input
            type="text"
            value={draft.owner}
            onChange={(e) => update("owner", e.target.value)}
            onBlur={() => handleBlur("owner")}
            placeholder="e.g. Aayush Sharma"
            className={inputCls(!!errors.owner)}
            aria-invalid={!!errors.owner}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Cancel
        </button>
        {showReset && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Reset
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function inputCls(invalid: boolean) {
  return `block w-full rounded-md border bg-card px-3 h-10 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 ${
    invalid ? "border-status-progress" : "border-border"
  }`;
}

function Field({
  label,
  children,
  required,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-status-progress">*</span>}
        </span>
        {hint && !error && <span className="mono text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-status-progress">{error}</p>}
    </label>
  );
}
