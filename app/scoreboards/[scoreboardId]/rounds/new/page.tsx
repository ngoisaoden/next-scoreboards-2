import Link from "next/link";
import { RoundForm } from "@/components/scoreboard/round-form";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { listPlayersForScoreboard } from "@/services/player.service";
import { getScoreboardForUser } from "@/services/scoreboard.service";

export default async function NewRoundPage({ params }: { params: { scoreboardId: string } }) {
  const user = await requireUser();
  const [scoreboard, players] = await Promise.all([
    getScoreboardForUser(params.scoreboardId, user.id),
    listPlayersForScoreboard(params.scoreboardId, user.id)
  ]);

  return (
    <div className="page-shell max-w-4xl">
      <div>
        <Button asChild variant="link" className="px-0">
          <Link href={`/scoreboards/${scoreboard.id}`}>Back to scoreboard</Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-normal">Add round</h1>
        <p className="text-muted-foreground">{scoreboard.name}</p>
      </div>
      <RoundForm
        scoreboardId={scoreboard.id}
        players={players
          .filter((player) => player.isActive)
          .map((player) => ({
            id: player.id,
            name: player.nickname || player.player.displayName,
            isActive: player.isActive
          }))}
      />
    </div>
  );
}
