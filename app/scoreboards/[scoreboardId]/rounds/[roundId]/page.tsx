import Link from "next/link";
import { deleteRound } from "@/actions/round.actions";
import { RoundForm } from "@/components/scoreboard/round-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { listPlayersForScoreboard } from "@/services/player.service";
import { getRoundDetails } from "@/services/round.service";

export default async function RoundDetailPage({ params }: { params: { scoreboardId: string; roundId: string } }) {
  const user = await requireUser();
  const [round, players] = await Promise.all([
    getRoundDetails(params.roundId, user.id),
    listPlayersForScoreboard(params.scoreboardId, user.id)
  ]);

  async function deleteAction() {
    "use server";
    await deleteRound(round.id);
  }

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button asChild variant="link" className="px-0">
            <Link href={`/scoreboards/${round.scoreboardId}`}>Back to scoreboard</Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-normal">Round #{round.roundNumber}</h1>
          {round.title ? <p className="text-muted-foreground">{round.title}</p> : null}
        </div>
        <form action={deleteAction}>
          <Button type="submit" variant="destructive">
            Delete round
          </Button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Scores</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {round.notes ? <p className="rounded-md bg-muted p-3 text-sm">{round.notes}</p> : null}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Placement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {round.players.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.scoreboardPlayer.nickname || entry.scoreboardPlayer.player.displayName}</TableCell>
                    <TableCell className="text-right font-semibold">{entry.score}</TableCell>
                    <TableCell className="text-right">{entry.placement ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <RoundForm
          scoreboardId={round.scoreboardId}
          players={players.map((player) => ({
            id: player.id,
            name: player.nickname || player.player.displayName,
            isActive: player.isActive
          }))}
          initialRound={{
            id: round.id,
            title: round.title,
            notes: round.notes,
            players: round.players.map((entry) => ({
              scoreboardPlayerId: entry.scoreboardPlayerId,
              score: entry.score,
              placement: entry.placement
            }))
          }}
        />
      </div>
    </div>
  );
}
