import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LeaderboardRow } from "@/services/leaderboard.service";

export function LeaderboardTable({ rows, limit }: { rows: LeaderboardRow[]; limit?: number }) {
  const visibleRows = typeof limit === "number" ? rows.slice(0, limit) : rows;

  if (visibleRows.length === 0) {
    return <p className="text-sm text-muted-foreground">No players yet.</p>;
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {visibleRows.map((row, index) => (
          <div key={row.scoreboardPlayerId} className="rounded-md border p-3">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-muted-foreground">Rank {index + 1}</p>
                <p className="truncate font-medium">{row.name}</p>
              </div>
              <p className="shrink-0 text-xl font-semibold">{row.totalScore}</p>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Rounds</dt>
                <dd className="font-medium">{row.roundsPlayed}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Avg</dt>
                <dd className="font-medium">
                  {row.roundsPlayed ? (row.totalScore / row.roundsPlayed).toFixed(1) : "0.0"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Wins</dt>
                <dd className="font-medium">{row.wins}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Total score</TableHead>
              <TableHead className="text-right">Rounds</TableHead>
              <TableHead className="text-right">Average</TableHead>
              <TableHead className="text-right">Wins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow key={row.scoreboardPlayerId}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="max-w-48 truncate">{row.name}</TableCell>
                <TableCell className="text-right font-semibold">{row.totalScore}</TableCell>
                <TableCell className="text-right">{row.roundsPlayed}</TableCell>
                <TableCell className="text-right">
                  {row.roundsPlayed ? (row.totalScore / row.roundsPlayed).toFixed(1) : "0.0"}
                </TableCell>
                <TableCell className="text-right">{row.wins}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
