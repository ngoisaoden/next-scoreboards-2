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
    <div className="page-shell overflow-x-clip">
      <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-semibold tracking-normal sm:text-3xl">Scoreboards</h1>
          <p className="max-w-2xl break-words text-muted-foreground">Manage card game tables and scoring history.</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/scoreboards/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New scoreboard
          </Link>
        </Button>
      </div>

      {scoreboards.length === 0 ? (
        <div className="min-w-0 rounded-lg border border-dashed bg-card p-5 text-center sm:p-8">
          <p className="text-lg font-medium">No scoreboards yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create one to start adding players and rounds.</p>
        </div>
      ) : (
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {scoreboards.map((scoreboard) => (
            <ScoreboardCard key={scoreboard.id} scoreboard={scoreboard} />
          ))}
        </div>
      )}
    </div>
  );
}
