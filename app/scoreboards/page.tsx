import Link from "next/link";
import { Plus } from "lucide-react";
import { ScoreboardCard } from "@/components/scoreboard/scoreboard-card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { listScoreboardsForUser } from "@/services/scoreboard.service";

export default async function ScoreboardsPage() {
  const user = await requireUser();
  const scoreboards = await listScoreboardsForUser(user.id);

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Scoreboards</h1>
          <p className="text-muted-foreground">Manage card game tables and scoring history.</p>
        </div>
        <Button asChild>
          <Link href="/scoreboards/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New scoreboard
          </Link>
        </Button>
      </div>

      {scoreboards.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-8 text-center">
          <p className="text-lg font-medium">No scoreboards yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create one to start adding players and rounds.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {scoreboards.map((scoreboard) => (
            <ScoreboardCard key={scoreboard.id} scoreboard={scoreboard} />
          ))}
        </div>
      )}
    </div>
  );
}
