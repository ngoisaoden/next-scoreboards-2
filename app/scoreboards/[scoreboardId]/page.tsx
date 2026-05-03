import Link from "next/link";
import { Plus, Settings, Trophy } from "lucide-react";
import { deleteScoreboard } from "@/actions/scoreboard.actions";
import { LeaderboardTable } from "@/components/scoreboard/leaderboard-table";
import { RoundHistoryTable } from "@/components/scoreboard/round-history-table";
import { ScoreboardForm } from "@/components/scoreboard/scoreboard-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getLeaderboard } from "@/services/leaderboard.service";
import { listRoundsForScoreboard } from "@/services/round.service";
import { getScoreboardForUser } from "@/services/scoreboard.service";

export default async function ScoreboardDetailPage({ params }: { params: { scoreboardId: string } }) {
  const user = await requireUser();
  const [scoreboard, leaderboard, rounds] = await Promise.all([
    getScoreboardForUser(params.scoreboardId, user.id),
    getLeaderboard(params.scoreboardId, user.id),
    listRoundsForScoreboard(params.scoreboardId, user.id)
  ]);

  async function deleteAction() {
    "use server";
    await deleteScoreboard(scoreboard.id);
  }

  return (
    <div className="page-shell">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <Button asChild variant="link" className="px-0">
            <Link href="/scoreboards">Back to scoreboards</Link>
          </Button>
          <h1 className="break-words text-2xl font-semibold tracking-normal sm:text-3xl">{scoreboard.name}</h1>
          {scoreboard.description ? (
            <p className="max-w-3xl break-words text-muted-foreground">{scoreboard.description}</p>
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:w-[460px]">
          <Button asChild className="w-full">
            <Link href={`/scoreboards/${scoreboard.id}/rounds/new`}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add round
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/scoreboards/${scoreboard.id}/players`}>
              <Settings className="h-4 w-4" aria-hidden="true" />
              Manage players
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/scoreboards/${scoreboard.id}/leaderboard`}>
              <Trophy className="h-4 w-4" aria-hidden="true" />
              Leaderboard
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
              <LeaderboardTable rows={leaderboard} limit={5} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent rounds</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
              <RoundHistoryTable scoreboardId={scoreboard.id} rounds={rounds} limit={8} />
            </CardContent>
          </Card>
        </div>

        <div className="grid min-w-0 content-start gap-6">
          <ScoreboardForm scoreboard={scoreboard} />
          <Card>
            <CardHeader>
              <CardTitle>Delete scoreboard</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={deleteAction} className="grid gap-3">
                <p className="text-sm text-muted-foreground">
                  This removes all players, rounds, and scores for this board.
                </p>
                <Button type="submit" variant="destructive" className="w-full">
                  Delete scoreboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
