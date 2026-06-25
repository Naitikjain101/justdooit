# TaskFlow — Build Plan

A responsive task management app with a distinctive "Flow" visual identity, LocalStorage persistence, and production-quality code structure.

## Stack note
This project is on **TanStack Start** (file-based routing under `src/routes/`), not React Router DOM. I'll use TanStack Router's `<Link>` / `useNavigate` to satisfy the routing requirements — same UX, same routes, idiomatic to the template. All other tech (React, TS, Vite, Tailwind v4, LocalStorage) matches your spec.

## Design system (wired into `src/styles.css`)
- Tokens for **Ink** (`#11182E`, `#0D1226`, `#1A2240`, `#242D52`), **Paper** (`#F7F6F2`, `#F1EFE8`, `#E7E3D9`), **Flow Violet** (`#5B5FEF`, `#4A47D6`, `#E2E2FF`, `#F0F0FF`), and status pairs (Open/Progress/Completed, light + dark backgrounds).
- Fonts loaded via `<link>` in `__root.tsx`: **Sora** (display), **Inter** (body), **JetBrains Mono** (IDs/dates/numerics). Mapped via `@theme` to `font-display`, `font-sans`, `font-mono`.
- Radii 10–14px cards, 8px inputs; soft layered shadows; 200–250ms ease-out transitions; `prefers-reduced-motion` respected; focus rings in Flow Violet.
- Dark mode via `.dark` class on `<html>`, toggle persisted in LocalStorage.

## Signature element — FlowRail
Single `<FlowRail status={...} />` component: 3px vertical bar on the left edge, fills 33% / 66% / 100% in the matching status color. Used on every task card and table row. Nothing else competes with it visually.

## Routes (files under `src/routes/`)
- `index.tsx` → Dashboard `/`
- `tasks.tsx` → Task list `/tasks`
- `task.new.tsx` → Create `/task/new`
- `task.$id.tsx` → Details `/task/:id`
- `task.$id.edit.tsx` → Edit `/task/:id/edit`
- `settings.tsx` → "Coming soon"
- `__root.tsx` updated with shell (Sidebar + Header + Outlet), fonts, dark mode bootstrap, Sonner `<Toaster />`.

## Data model & service
```ts
type TaskStatus = "Open" | "In Progress" | "Completed";
interface Task { id; title; description; status; owner; createdDate; updatedDate; }
```
`services/taskService.ts` wraps LocalStorage (`taskflow.tasks` key) with `list/get/create/update/remove/exportCsv/importCsv`. ID generator scans existing IDs, finds max numeric suffix after `TA`, increments (handles gaps + empty state, starts at `TA1001`). Seeds the 3 sample tasks on first run via a `taskflow.seeded` flag.

## Components
- `layout/`: `Sidebar` (collapsible drawer on mobile), `Header` (date, global jump search, dark toggle, AS avatar), `AppShell`.
- `ui/`: `Button`, `Input`, `Textarea`, `Select`, `Badge` (status variants), `Card`, `Skeleton`, `EmptyState`, `Pagination`, `Tabs`/segmented control — built on existing shadcn primitives where possible, themed via tokens (no hard-coded colors in components).
- `tasks/`: `FlowRail`, `StatusBadge`, `StatCard`, `TaskCard`, `TaskTable` (collapses to stacked cards under `sm`), `TaskForm` (shared by Create + Edit), `RecentTasks`, `StatsProgressBar`.
- `modals/`: `ConfirmModal` (delete), `ShortcutsHint`.
- Toasts via `sonner`.

## Hooks
- `useLocalStorage<T>` — JSON-safe, SSR-guarded.
- `useTasks` — reads from service, exposes CRUD + memoized derived stats; uses `useSyncExternalStore` pattern so cross-component updates propagate without a global store.
- `useDarkMode` — toggles `.dark` on `documentElement`, persists.
- `useKeyboardShortcuts` — registers Ctrl/Cmd+N (→ `/task/new`) and Ctrl/Cmd+F (focus search on `/tasks`), ignored inside inputs except for the search-focus case.

## Page details
- **Dashboard**: 4 stat cards (Total = Flow Violet, others = status colors), segmented progress bar, Recent Tasks (5 most recent by `updatedDate`), header "+ Create New Task", skeletons on first paint, friendly SVG empty state.
- **Task List**: search (id/title/owner, live), status tabs (All/Open/In Progress/Completed), sort (Newest/Oldest), 10-per-page pagination, per-row actions (View/Edit/Delete), distinct "no matches" empty state with Clear filters.
- **Create / Edit**: shared `TaskForm`, read-only ID display ("Will be TA1004" on create, real ID on edit), inline validation under fields (title required, owner required, description ≥ 10 chars) using status colors not harsh red, Save / Reset / Cancel (Edit shows Save Changes / Cancel), toast + redirect on success.
- **Details**: full card with FlowRail, formatted dates ("Jun 20, 2026, 4:42 PM" via `Intl.DateTimeFormat`), Edit/Delete/Back, not-found state with link back to list.
- **Delete**: `ConfirmModal` from list or details, shows title, destructive button in a deliberate palette-consistent tone (deep clay, not raw red).

## Bonus
- **Export CSV**: serialize all tasks, trigger download (`Blob` + anchor).
- **Import CSV**: file input → parse → validate rows → merge into LocalStorage (skip dupes by ID, regenerate IDs for malformed) → toast summary (imported / skipped).
- **Shortcuts hint** footer/badge listing Ctrl/Cmd+N and Ctrl/Cmd+F.

## Accessibility & responsiveness
- Semantic HTML (`<nav>`, `<main>`, `<table>` on desktop), labels tied to inputs, ARIA on modal/drawer, visible focus rings.
- Mobile: sidebar becomes hamburger drawer, table collapses to stacked task cards, header condenses.

## Files to add (high level)
```
src/styles.css                              (theme tokens, fonts mapping)
src/routes/__root.tsx                       (shell, fonts, toaster, dark bootstrap)
src/routes/{index,tasks,settings}.tsx
src/routes/task.{new,$id,$id.edit}.tsx
src/types/task.ts
src/services/taskService.ts
src/hooks/{useTasks,useLocalStorage,useDarkMode,useKeyboardShortcuts}.ts
src/utils/{date,csv,id,filter}.ts
src/components/layout/{AppShell,Sidebar,Header}.tsx
src/components/tasks/{FlowRail,StatusBadge,StatCard,TaskCard,TaskTable,TaskForm,RecentTasks,StatsProgressBar,EmptyState}.tsx
src/components/modals/ConfirmModal.tsx
```

After approval I'll implement in one pass, verifying the build and a quick Playwright smoke (dashboard → create → list → edit → delete).
