import Link from "next/link";
import { LeaderboardTable } from "@/components/scoreboard/leaderboard-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getLeaderboard } from "@/services/leaderboard.service";
import { getScoreboardForUser } from "@/services/scoreboard.service";

export default async function LeaderboardPage({ params }: { params: { scoreboardId: string } }) {
  const user = await requireUser();
  const [scoreboard, leaderboard] = await Promise.all([
    getScoreboardForUser(params.scoreboardId, user.id),
    getLeaderboard(params.scoreboardId, user.id)
  ]);

  return (
    <div className="page-shell">
      <div>
        <Button asChild variant="link" className="px-0">
          <Link href={`/scoreboards/${scoreboard.id}`}>Back to scoreboard</Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-normal">Leaderboard</h1>
        <p className="text-muted-foreground">{scoreboard.name}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardTable rows={leaderboard} />
        </CardContent>
      </Card>
    </div>
  );
}
