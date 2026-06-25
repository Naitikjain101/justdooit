import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "./index";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TaskFlow" },
      { name: "description", content: "TaskFlow workspace settings." },
      { property: "og:title", content: "Settings — TaskFlow" },
      { property: "og:description", content: "Workspace settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" />
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary-tint">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="font-display text-xl font-semibold text-foreground">Coming soon</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Workspace preferences, integrations, and team management will live here.
        </p>
      </div>
    </div>
  );
}
