import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

type RoundHistoryTableProps = {
  scoreboardId: string;
  rounds: Array<{
    id: string;
    roundNumber: number;
    title: string | null;
    createdAt: Date;
    players: Array<{
      score: number;
      scoreboardPlayer: {
        nickname: string | null;
        player: { displayName: string };
      };
    }>;
  }>;
  limit?: number;
};

export function RoundHistoryTable({ scoreboardId, rounds, limit }: RoundHistoryTableProps) {
  const visibleRounds = typeof limit === "number" ? rounds.slice(0, limit) : rounds;

  if (visibleRounds.length === 0) {
    return <p className="text-sm text-muted-foreground">No rounds recorded yet.</p>;
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {visibleRounds.map((round) => (
          <div key={round.id} className="grid gap-3 rounded-md border p-3">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">Round #{round.roundNumber}</p>
                {round.title ? <p className="truncate text-sm text-muted-foreground">{round.title}</p> : null}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDate(round.createdAt)}</span>
            </div>
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {round.players
                .map(
                  (entry) =>
                    `${entry.scoreboardPlayer.nickname || entry.scoreboardPlayer.player.displayName}: ${entry.score}`
                )
                .join(", ")}
            </p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/scoreboards/${scoreboardId}/rounds/${round.id}`}>Open</Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Round</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRounds.map((round) => (
              <TableRow key={round.id}>
                <TableCell className="font-medium">
                  #{round.roundNumber}
                  {round.title ? <span className="block text-muted-foreground">{round.title}</span> : null}
                </TableCell>
                <TableCell className="max-w-[28rem] truncate">
                  {round.players
                    .map(
                      (entry) =>
                        `${entry.scoreboardPlayer.nickname || entry.scoreboardPlayer.player.displayName}: ${entry.score}`
                    )
                    .join(", ")}
                </TableCell>
                <TableCell>{formatDate(round.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/scoreboards/${scoreboardId}/rounds/${round.id}`}>Open</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
